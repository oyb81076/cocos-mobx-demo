import { observer, reactor } from "../../scripts/observer";
import { socket, EventLike } from "../stores";
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

    @reactor(() => {
        if (!socket.event.type || !socket.event.timestamp) return null
        return { ...socket.event }
    })
    eventReactor(evt: EventLike | null) {
        if (!evt) return;
        switch (evt.type) {
            case socket.Type.LOGIN: this.reqLogin()
            case socket.Type.LOGOUT: this.reqLogout()
        }
    }

    onDestroy() {
        socket.clear()
    }
}