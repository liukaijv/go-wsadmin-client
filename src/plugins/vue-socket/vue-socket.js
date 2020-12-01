import Emitter from './emitter';

export default class VueSocket {

    constructor(connectionUrl, opts) {

        if (connectionUrl.startsWith('//')) {
            const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws'
            connectionUrl = `${scheme}:${connectionUrl}`
        }

        this.pending = new Map();
        this.seq = 0;
        this.requestTimeout = 5000;

        this.emitter = new Emitter();

        this.connectionUrl = connectionUrl;
        this.opts = opts;

        this.reconnection = this.opts.reconnection || false
        this.reconnectionAttempts = this.opts.reconnectionAttempts || Infinity
        this.reconnectionDelay = this.opts.reconnectionDelay || 1000
        this.reconnectTimeoutId = 0
        this.reconnectionCount = 0

        this.connect(connectionUrl, opts)

    }

    connect(connectionUrl, opts) {
        let protocol = opts.protocol || ''
        this.websocket = protocol === '' ? new WebSocket(connectionUrl) : new WebSocket(connectionUrl, protocol);
        return this.websocket;
    }

    reconnect() {
        if (this.reconnectionCount < this.reconnectionAttempts) {
            this.reconnectionCount++;
            clearTimeout(this.reconnectTimeoutId);
            this.reconnectTimeoutId = setTimeout(() => {
                this.emitter.emit('SOCKET_RECONNECT')
                this.connect(this.connectionUrl, this.opts);
                this.onEvent();
            }, this.reconnectionDelay)
        } else {
            this.emitter.emit('SOCKET_RECONNECT_ERROR')
        }
    }

    onEvent() {
        ['onmessage', 'onclose', 'onerror', 'onopen'].forEach((eventType) => {
            this.websocket[eventType] = (event) => {
                this.emitter.emit("SOCKET_" + eventType.toUpperCase(), event);
                if (this.reconnection && eventType == "onopen") {
                    this.reconnectionCount = 0;
                }
                if (this.reconnection && eventType == 'onclose') {
                    this.reconnect();
                }
                if (eventType == 'onmessage') {
                    this.processMessage(event.data)
                }
            }
        })
    }

    sendMessage(data) {
        let msg = JSON.stringify(data)
        this.sendText(msg);
    }

    sendText(text) {
        this.websocket.send(text);
    }

    processMessage(data) {
        let resp = JSON.parse(data);
        let seq = resp.id;
        if (seq && seq > 0) {
            let pendingCall = this.pending[seq];
            if (pendingCall) {
                pendingCall.resolve(resp)
            }
        } else {
            this.emitter.emit(resp.method,)
        }
    }

    async Call(msgName, data, opt) {
        let seq = ++this.seq;
        let req = {
            method: msgName,
            params: JSON.stringify(data),
            headers: Object.assign({}, opt.headers || {}),
            id: seq,
        }
        let promise = new Promise((resolve, reject) => {

            this.pending[seq] = {
                resolve,
                reject,
            }

            let timer = setTimeout(() => {
                reject(new Error(`call: ${msgName}, seq: ${seq} timeout`));
                delete this.pending[seq];
                clearTimeout(timer)
            }, opt.timeout || this.requestTimeout)

        });
        this.sendMessage(req)
        return promise;
    }

    Notify(msgName, data, opt) {
        let req = {
            method: msgName,
            params: JSON.stringify(data),
            headers: Object.assign({}, opt.headers || {}),
            id: 0,
        }
        this.sendMessage(req);
    }

}