/**
 * 用来处理一些逻辑事物的节点, 本身不具备什么渲染功能
 */
import { observer, react, reactor } from "../scripts/observer";
import { action } from "mobx";
import { store } from "./store";
@cc._decorator.ccclass
@observer
export default class TimePlugin extends cc.Component {
    public onLoad() {
        this.schedule(this.updateCurrentTime, 1)
    }

    // 定时修改 store.currentTime 数据
    @action updateCurrentTime() {
        store.currentTime = Date.now()
    }

    /**
     * 观测 store.timestamp, 当timestamp发生改变的时候, 对total进行++操作
     */
    @reactor
    protected reactorTimestamp() {
        return react(() => store.timestamp, timestamp => {
            if (timestamp) {//如果不是初始状态, 则total++
                store.total++
            }
        })
    }
    @reactor(() => store.timestamp)
    protected reactorTimestamp2(timestamp: number) {
        if (timestamp) {
            store.total++
        }
    }
}