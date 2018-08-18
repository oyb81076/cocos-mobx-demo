/**
 * 单纯的label渲染
 */
import { observer, render } from "../scripts/observer";
import { store } from "./store";

@cc._decorator.ccclass
@observer
export default class TotalLabel extends cc.Component {
    @render protected render() {
        if (!store.total) {
            this.node.getComponent(cc.Label).string = "请点击按钮"
        } else {
            this.node.getComponent(cc.Label).string = `点击按钮${store.total}次`
        }
    }
}