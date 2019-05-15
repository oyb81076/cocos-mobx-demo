/**
 * 程序状态机
 */
import { observable, computed } from "mobx";
class SimpleStore {
    // 总共点击次数
    @observable public total = 0 
    // 按下按钮的时间
    @observable public timestamp = 0 
    // 当前的时间
    @observable public currentTime = Date.now()
    // 计算值
    @computed get timeStr() {
        return `当前时间${new Date(this.currentTime).toISOString()}累计点击次数${this.total}次`
    }
}
export const store = new SimpleStore
