import { autorun, IReactionDisposer } from 'mobx'
import * as mobx from 'mobx'
if (cc.sys.isBrowser) { (window as any).mobx = mobx }
mobx.configure({ enforceActions: "always" })

export const observer = <T extends { new(...args: any[]): cc.Component }>(constructor: T) => {
    return class extends constructor {
        _disposer: IReactionDisposer[] = []
        _reaction?: string[]
        _autorun?: string[]
        onLoad() {
            super.onLoad && super.onLoad()
            if (this._autorun) {
                this._disposer.push(...this._autorun.map((x) => autorun((this as any)[x].bind(this))))
            }
            if (this._reaction) {
                this._disposer.push(...this._reaction.map((x) => { 
                    return (this as any)[x]()
                }))
            }
        }
        onDestroy() {
            super.onDestroy && super.onDestroy()
            if (this._disposer) this._disposer.forEach(x => x())
            this._disposer.length = 0
        }
    }
}

export const render = (target: any, key: string, descriptor: TypedPropertyDescriptor<() => void>) => {
    let obs: string[] = target['_autorun']
    if (!obs) { obs = target['_autorun'] = [] }
    obs.push(key)
}
interface Reactor {
    (target: any, key: string, descriptor: TypedPropertyDescriptor<() => IReactionDisposer>): void
    <T>(expression: (r: mobx.IReactionPublic) => T): (target: any, key: string, descriptor: TypedPropertyDescriptor<(arg: T) => void>) => void
}
export const reactor: Reactor = function () {
    if (arguments.length === 3) {
        return reactor1(arguments[0], arguments[1], arguments[2])
    } else {
        return reactor2(arguments[0])
    }
} as any

const reactor1 = (target: any, key: string, descriptor: TypedPropertyDescriptor<() => IReactionDisposer>) => {
    let obs: string[] = target['_reaction']
    if (!obs) { obs = target['_reaction'] = [] }
    obs.push(key)
}
const reactor2 = <T, O extends cc.Component & { _reaction?: string[] }>(expression: (r: mobx.IReactionPublic) => T) => {
    return (target: O, key: string, descriptor: TypedPropertyDescriptor<(arg: T) => void>) => {
        let obs = target['_reaction']
        if (!obs) { obs = target['_reaction'] = [] }
        obs.push(key)
        const _value = descriptor.value as (arg: T) => void
        descriptor.value = function (this: O) {
            return mobx.reaction(expression.bind(this), _value.bind(this))
        }
    }
} 

/**
 * 和reactor搭配进行副作用操作
 */
export const react = <T>(expression: (r: mobx.IReactionPublic) => T, effect: (arg: T, r: mobx.IReactionPublic) => void) => {
    return mobx.reaction(expression, effect, { fireImmediately: true })
}

