import { observable, action, computed } from "mobx";
export enum EventType {
    NONE = 0,
    LOGIN = 1,
    LOGOUT = 2
}
export interface EventLike {
    type: EventType,
    timestamp: number
}
class SocketStore {
    public readonly Type = EventType
    @observable
    public readonly loading = new Map<number, EventType>()
    private id = 0
    @action
    public createLoading(type: EventType) {
        const id = this.id++
        this.loading.set(id, type)
        return id
    }
    @action
    public removeLoading(id: number) {
        this.loading.delete(id)
    }
    /** 将正在请求的内容输出 */
    @computed
    public get values() {
        return Array
            .from(this.loading.entries())
            .sort(([a], [b]) => a - b)
    }
    @observable
    public readonly event: EventLike = { type: EventType.NONE, timestamp: 0 }
    @action
    public act(type: EventType) {
        this.event.timestamp = Date.now()
        this.event.type = type
    }
    @action
    public clear() {
        this.loading.clear()
        this.event.type = EventType.NONE
        this.event.timestamp = 0
    }
}
export const socket = new SocketStore