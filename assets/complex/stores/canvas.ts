import { observable, computed, action } from "mobx";

/** 布局 */
class CanvasStore {
    @observable base = { x: 0, y: 0 }
    @computed get socketLabel() {
        return { x: this.base.x, y: this.base.y + 100 }
    }
    @computed public get logoutButton() {
        let { x, y } = this.socketLabel
        y -= 100
        x -= 80
        return { x, y }
    }
    @computed public get loginButton() {
        let { x, y } = this.logoutButton
        x += 200
        return { x, y }
    }
    @action
    move(x: number, y: number) {
        this.base.x += x
        this.base.y += y
    }
}
export const canvas = new CanvasStore