export default class Heartbeat {
	constructor({
		url = '',
		pingData, // 心跳包
		time = 1000 * 60, // 心跳时间，如果为0则没有心跳
		timeOut = 1000 * 30, // 连接超时
		repeatLimit = 10, // 重连次数，为空则不限制次数
		reconnectTimeout = 1000 * 2 // 重连间隔
	} = {}) {
		this.url = url
		this.pingData = pingData
		this.time = time
		this.timeOut = timeOut
		this.repeatLimit = repeatLimit
		this.reconnectTimeout = reconnectTimeout
		// 内部参数
		this._socket = null
		this._close = false // 是否手动关闭心跳
		this._repeatLimit = 0 // 内部重连计时器
		this.intTime = null // setTime定时器
		// 监听回调
		this.onopen = () => {} // 消息返回监听回调
		this.onmessage = () => {} // 消息返回监听回调
		this.onclose = () => {};
		this.onerror = () => {};
	}
	// 心跳启动
	start() {
		const SocketTask = uni.connectSocket({
			url: this.url,
			complete: () => {}
		})
		// 当前socket任务
		this._socket = SocketTask
		// 启动监听事件
		this._monitor()
		this._close = false
	}
	// 手动关闭socket连接
	colse() {
		clearTimeout(this.time)

		const SocketTask = this._socket

		this._socket = null
		this._close = true
		this._repeatLimit = 0
		this.intTime = null

		SocketTask.close({
			code: 1000,
			reason: '前端手动关闭'
		})
	}
	// 监听事件
	async _monitor() {
		const SocketTask = this._socket
		SocketTask.onOpen((e) => {
			this.onopen()
			// 启动心跳
			this.time !== 0 && this._restHeartbeat()

			SocketTask.onMessage((e) => {
				// console.log(e)
				this.onmessage(e.data && JSON.parse(e.data))
				// 消息返回了代表连接正常，重置心跳
				this.time !== 0 && this._restHeartbeat()
			})
		})
		// 发生错误和关闭就需要重连
		SocketTask.onClose(() => {
			this.onclose()
			this._reconnect()
		})
		SocketTask.onError(() => {
			this.onerror()
			this._reconnect()
		})
	}
	// 重连事件
	_reconnect() {
		this._repeatLimit++
		// 连接超过数量不再重连
		if (this.repeatLimit && this._repeatLimit >= this.repeatLimit) return false
		// 手动关闭不再重连
		if (this._close) return false
		// 定时重连
		setTimeout(() => {
			this.start()
		}, this.reconnectTimeout)
	}
	// 心跳
	_heartbeat() {
		// 手动关闭不再心跳
		if (this._close) return false
		// 如果数据包为空则不心跳
		if (!this.pingData) return false

		const time = setTimeout(() => {
			// 心跳发送消息
			this.send(this.pingData)
		}, this.time)

		this.intTime = time
	}
	// 重置心跳
	_restHeartbeat() {
		clearTimeout(this.time)
		this._heartbeat()
	}
	// 发送消息
	send(data) {
		const SocketTask = this._socket
		return new Promise((resolve, reject) => {
			SocketTask.send({
				data: JSON.stringify(data),
				success: (e) => {
					resolve(e)
				},
				fail: (e) => {
					reject(e)
				}
			})
		})
	}
}
