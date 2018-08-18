/**
 * 项目入口, 一般只是用来挂载一堆prefab, 并添加各种逻辑组建
 */
import SocketPlugin from "./plugins/SocketPlugin";
const { ccclass, property } = cc._decorator
@ccclass
export default class ComplexLoader extends cc.Component {
    @property([cc.Prefab])
    private prefabs: cc.Prefab[] = []
    onLoad() {
        this.prefabs.forEach(x => this.node.addChild(cc.instantiate(x)))
        this.node.addComponent(SocketPlugin)
    }
}