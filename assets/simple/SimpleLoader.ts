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