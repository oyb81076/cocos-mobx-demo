import { observer, render } from "../../scripts/observer";
import { computed } from "mobx";
import { socket, canvas } from "../stores";
const { ccclass } = cc._decorator
@ccclass
@observer
export default class SocketLabel extends cc.Component {
    onLoad() { }
    /** 根据当前的请求数量 */
    @render protected renderLabelString() {
        this.node.getComponent(cc.Label).string = `目前正有${socket.loading.size}请求正在处理中`
    }
    @computed private get opacity() {
        return socket.loading.size === 0 ? 100 : 255
    }
    /** 当没有请求的时候, 设置为半透明状态 */
    @render protected renderLabelOpacity() {
        this.node.opacity = this.opacity
    }

    @render protected renderPos() {
        this.node.position = cc.p(canvas.socketLabel)
    }
}