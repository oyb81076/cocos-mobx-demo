/**
 * 程序入口, 加载各种prefab
 */
import TimePlugin from "./TimePlugin";

const { ccclass, property } = cc._decorator

@ccclass
export default class Loader extends cc.Component {
    @property([cc.Prefab]) prefab: cc.Prefab[] = []
    public onLoad() {
        this.prefab.forEach(x => this.node.addChild(cc.instantiate(x)))
        this.node.addComponent(TimePlugin)
    }
}