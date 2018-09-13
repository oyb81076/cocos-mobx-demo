import { observer, react, reactor } from "../../scripts/observer";
import { socket } from "../stores";
const sleep = (ms: number) => new Promise(x => setTimeout(x, ms))

const { ccclass } = cc._decorator
@ccclass
@observer
export default class SocketPlugin extends cc.Component {
    onLoad() {
    }

    async reqLogin() {
        const id = socket.createLoading(socket.Type.LOGIN)
        await sleep(3000)
        socket.removeLoading(id)
    }

    async reqLogout() {
        const id = socket.createLoading(socket.Type.LOGOUT)
        await sleep(3000)
        socket.removeLoading(id)
    }

    @reactor eventReactor() {
        return react(() => {
            if (!socket.event.type || !socket.event.timestamp) return null
            return { ...socket.event }
        }, (evt) => {
            if (!evt) return
            switch (evt.type) {
                case socket.Type.LOGIN: return this.reqLogin()
                case socket.Type.LOGOUT: return this.reqLogout()
            }
        })
    }

    onDestroy() {
        socket.clear()
    }
}