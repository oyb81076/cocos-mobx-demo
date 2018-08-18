import { observer, reactor, react } from "../../scripts/observer";
import { socket } from "../stores";
import LoadingLayoutLabel from "./LoadingLayoutLabel";
const { ccclass, property } = cc._decorator
@ccclass
@observer
export default class LoadingLayout extends cc.Component {
    @property(cc.Layout) private layout: cc.Layout = null as any
    @property(cc.Prefab) private labelPrefab: cc.Prefab = null as any
    onLoad() {
        const { width, height } = cc.director.getWinSize()
        this.node.position = cc.p(-width / 2, height / 2)
        // 绑定点击之后
        this.node.on(cc.Node.EventType.TOUCH_END, () => socket.act(socket.Type.LOGIN))
    }

    /** 动态添加节点 */
    @reactor reactor() {
        return react(() => {
            return socket.loading.size
        }, (size: number) => {
            const children = this.layout.node.children
            let i = 0
            for (i = 0; i < size; i++) {
                if (!children[i]) {
                    const node = cc.instantiate(this.labelPrefab)
                    node.getComponent(LoadingLayoutLabel).init(i)
                    this.layout.node.addChild(node)
                }
            }
            let node: cc.Node
            while (node = children[i++]) node.active = false
        })
    }
}