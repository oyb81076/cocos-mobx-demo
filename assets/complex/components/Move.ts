import { canvas } from "../stores";
const { ccclass, property } = cc._decorator
@ccclass
export default class LoadingLayout extends cc.Component {
    @property(cc.Node) up: cc.Node = null as any
    @property(cc.Node) down: cc.Node = null as any
    @property(cc.Node) left: cc.Node = null as any
    @property(cc.Node) right: cc.Node = null as any
    onLoad() {
        const { width, height } = cc.director.getWinSize()
        this.node.position = cc.p(width / 2, -height / 2)
        this.up.on(cc.Node.EventType.TOUCH_END, () => { canvas.move(0, 10) })
        this.down.on(cc.Node.EventType.TOUCH_END, () => { canvas.move(0, -10) })
        this.left.on(cc.Node.EventType.TOUCH_END, () => { canvas.move(-10, 0) })
        this.right.on(cc.Node.EventType.TOUCH_END, () => { canvas.move(10, 0) })
    }
}