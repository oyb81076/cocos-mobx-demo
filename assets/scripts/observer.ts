import {
    configure,
    autorun,
    reaction,
    IReactionDisposer,
    IReactionPublic
} from 'mobx'
export * from "mobx"

configure({ enforceActions: true });

export const observer = <T extends { new(...args: any[]): cc.Component }>(constructor: T) => {
    return class extends constructor {
        _disposer: IReactionDisposer[] = []
        _reaction?: {
            key: string,
            expression: (r: IReactionPublic) => T
        }[]
        _autorun?: string[]
        onLoad() {
            super.onLoad && super.onLoad()
            if (this._autorun) {
                this._disposer.push(...this._autorun.map((x) => autorun((this as any)[x].bind(this))))
            }
            if (this._reaction) {
                this._disposer.push(...this._reaction.map((x) => reaction(x.expression, (this as any)[x.key].bind(this), { fireImmediately: true })))
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

export const reactor = <T>(expression: (r: IReactionPublic) => T) => {
    return (target: any, key: string, descriptor: TypedPropertyDescriptor<(arg: T) => void>) => {
        let obs: {
            key: string,
            expression: (r: IReactionPublic) => T
        }[] = target['_reaction'];
        if (!obs) { obs = target['_reaction'] = [] }
        obs.push({
            key: key,
            expression: expression
        });
    }
}