import { observer, render } from "../../scripts/observer";
import { socket, canvas } from "../stores";
import { computed } from "mobx";
const { ccclass, property } = cc._decorator
@ccclass
@observer
export default class LogoutButton extends cc.Component {
    @property(cc.Label) private label: cc.Label = null as any
    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, () => socket.act(socket.Type.LOGOUT))
    }
    @computed get loadingCount() {
        return Array.from(socket.loading.values()).filter(x => x === socket.Type.LOGOUT).length
    }
    @render protected renderLabel() {
        this.label.string = `Logout ( ${this.loadingCount} )`
    }
    @render protected renderPos() {
        this.node.position = cc.p(canvas.logoutButton)
    }
}