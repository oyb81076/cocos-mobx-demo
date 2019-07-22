# 将 mobx 作为 cocos creator 项目状态管理的demo

## 运行
npm install
## 说明
mobx 本来是 react 的一个状态管理工具, 其实也可以用来作为cocos的状态管理工具

使用 mobx 作为状态管理, 可以实现组件之间完全的解耦


#### 使用前
```ts
@ccclass
class ComponentA extends cc.Component {
    @property(ComponentB) componentB: ComponentB
    onClick1(){
        this.componentB.do()
    }
    onClick2(){
        this.componentB.undo()
    }
}

@ccclass
class ComponentB extends cc.Component {
    _doing = false
    do(){
        if (!this._doing) { //为了防止重复调用可能引发副作用, 这里要做一次检查
            this._doing = true
            // do it
        }
    }
    undo(){
        if (this._doing) {
            this._doing = true
            // undo it
        }
    }
}
```
#### 使用前状态工具后
```ts
class Store {
    @observable doing = false
}
const store = new Store

@ccclass
class ComponentA extends cc.Component {
    @action
    onClick1(){
        store.doing = true
    }
    @action
    onClick2(){
        store.doing = false
    }
}

@ccclass
@observer
class ComponentB extends cc.Component {
    @render
    renderDoing(){
        if (store.doing) {
            // do it
        } else {
            // undo it
        }
    }
}
```
整个程序的逻辑转化为
组件A <--> 数据 <--> 组件B
* 解耦之后, 组件之间不再需要互相引用, 几乎不存在组件之间进行互相操作
* 组件只需要根据数据直接进行渲染, 而不需要关心上下文状态以及其他组件的状态
* 用户操作或者服务器推送的时候, 直接修改数据即可, 组件会在观测数据发生改变的时候自动重新渲染
* 在组件树变得庞大的时候, 如果使用状态工具, 由于不存在组件间的调用问题, 结构相对简单
* 因为组件自身完全独立, 所以方便制作成prefab进行加载, 将prefab直接挂在到节点上即可, 而不需要进行多余的操作

## 简单例子
```ts
import { observer, render, react, reactor } from "../scripts/observer";
import { observable, computed, action } from "mobx";

const { ccclass, property } = cc._decorator

// 状态
class Store {
    /** 定义一个可观测状态数据 */
    @observable public total = 0 // 总共点击次数
    /** 定义一个可观测状态数据 */
    @observable public timestamp = 0 // 按下按钮的时间
    @observable public currentTime = Date.now()
    /** 根据 @observable 注解的数据, 计算一个值 */
    @computed get timeStr() {
        return `当前时间${new Date(this.currentTime).toISOString()}累计点击次数${this.total}次`
    }
}
const store = new Store

@ccclass
/**
 * @observer 注解说明: 将类中 @render 和 @reactor方法加入到生命周期管理
 */
@observer 
export default class SimpleLoader extends cc.Component {
    @property(cc.Label) private label1: cc.Label = null as any
    @property(cc.Label) private label2: cc.Label = null as any
    public onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClick)
        this.schedule(this.updateCurrentTime, 1)
    }

    /**
     * @action 注解说明
     * 直接修改 @observable 注解的数据, 需要用@action进行注解
     * 
     */
    @action
    private onClick() {
        store.timestamp = Date.now()
    }
    @action updateCurrentTime() {
        store.currentTime = Date.now()
    }

    /**
     * 渲染 根据store.total 渲染 label
     * @render 所注解的方法, 会在onLoad之后自动执行一遍
     * 如果函数执行期间所调用的 被 @observable 或 @computed 注解的数据发生了任何改变, 函数就会被重新执行
     */
    @render protected renderTotal() {
        if (!store.total) {
            this.label1.string = "请点击背景"
        } else {
            this.label1.string = `点击背景${store.total}次`
        }
    }
    @render protected renderTimeStr(){
        this.label2.string = store.timeStr
    }

    /**
     * 观测 store.timestamp, 当timestamp发生改变的时候, 对total进行++操作
     * @reactor 注解说明
     * @reactor func(){ return react(expression, reaction) }
     * 观察 expression的返回值, 如果expression返回值发生任何变化, 就执行reaction
     * 在onLoad的时候会执行自动执行第一次
     */
    @reactor
    protected reactorTimestamp() {
        return react(() => store.timestamp, (timestamp) => {
            if (timestamp) {//如果不是初始状态, 则total++
                store.total++
            }
        })
    }
}
```
## mobx版本选择
v5.x版本mobx使用Proxy模式，在ios9.x版本的操作系统上无法运行，v4.x版本不存在这个问题

## 关于 observer.ts 文件
我单独将 observer.ts 打包到 npm (mobx-cocos)[https://github.com/oyb81076/mobx-cocos]
使用的方式如下
```ts
// cfg.ts
import {configure} from "mobx";
configure({ enforceActions: "observed" });
```
```ts
// Comp.ts
import { observer, render, reactor, react } from "mobx-cocos";
@ccclass
@observer
export default class Comp extends cc.Component {
   @render render(){
      // xxxxxx
   }
}



```
