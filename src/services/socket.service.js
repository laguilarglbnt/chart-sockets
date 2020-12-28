import { io } from 'socket.io-client'

export const SOCKET_URL = 'ws://localhost:3000'

export const SOCKET_EVENT = Object.freeze({
    TIME_TYPE_CHANGE: 'timeTypeChange'
})

export class SocketService {
    constructor(url) {
        this.socket = io(url, {
            transports: ['websocket']
        })
    }

    on(eventName, callback) {
        this.socket.on(eventName, callback)
    }

    emit(eventName, data) {
        this.socket.emit(eventName, data)
    }

    close() {
        this.socket.close()
    }
}