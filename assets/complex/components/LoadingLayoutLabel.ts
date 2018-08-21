import { observer, render } from "../../scripts/observer";
import { observable, action, computed } from "mobx";
import { socket } from "../stores";

/**
 * 项目入口, 一般只是用来挂载一堆prefab, 并添加各种逻辑组建
 */
const { ccclass, property } = cc._decorator
@ccclass
@observer
export default class LoadingLayoutLabel extends cc.Component {
    @property(cc.Label) label: cc.Label = null as any
    @observable id: number = 0
    private index: number = 0
    public init(index: number) {
        this.index = index
    }
    @computed get active() {
        return socket.loading.size > this.index
    }
    @render reactActive() {
        this.node.active = this.active
    }
    @render protected render() {
        if (!this.active) return
        const [key, type] = socket.values[this.index]
        this.label.string = `第${key}次请求${socket.Type[type]}`
    }
}