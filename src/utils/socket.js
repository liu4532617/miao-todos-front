/**
 * WebSocket 实时聊天工具(单例)
 * - 连接管理 / 心跳 / 断线指数退避重连
 * - 协议: 发送 {"action":"send","chatId":1,"content":"...","contentType":"TEXT"}
 *         接收 {"type":"message","data":{...}} | {"type":"pong"} | {"type":"error",...}
 */
import { getToken } from '@/utils/storage'

let socket = null
let connected = false
let heartbeatTimer = null
let reconnectTimer = null
let reconnectAttempts = 0
let manualClose = false
const listeners = new Set()

/** 拼接 ws 地址: H5 用当前域名;小程序用配置的 wss 域名 */
function buildUrl() {
  const token = getToken()
  // #ifdef H5
  const proto = location.protocol === 'https:' ? 'wss' : 'ws'
  return `${proto}://${location.host}/ws?token=${encodeURIComponent(token)}`
  // #endif
  // #ifndef H5
  // 小程序端: 使用线上 wss 域名(备案+HTTPS 后生效);本地预览可改成本机地址
  const wsBase = 'wss://fastfoodhut.com'
  return `${wsBase}/ws?token=${encodeURIComponent(token)}`
  // #endif
}

function onOpen() {
  connected = true
  reconnectAttempts = 0
  startHeartbeat()
  emit({ type: 'connected' })
}

function onWsMessage(e) {
  let data = e.data
  try {
    data = JSON.parse(e.data)
  } catch (err) {}
  emit(data)
}

function onClose() {
  connected = false
  stopHeartbeat()
  emit({ type: 'disconnected' })
  if (!manualClose) scheduleReconnect()
}

function onError() {
  // 交给 onClose 统一处理重连
}

function startHeartbeat() {
  stopHeartbeat()
  heartbeatTimer = setInterval(() => {
    if (socket && connected) {
      socket.send({ data: JSON.stringify({ action: 'ping' }) })
    }
  }, 30000)
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer)
    heartbeatTimer = null
  }
}

function scheduleReconnect() {
  if (reconnectTimer) return
  const delay = Math.min(30000, 1000 * Math.pow(2, reconnectAttempts))
  reconnectAttempts += 1
  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    if (!manualClose) connect()
  }, delay)
}

function emit(data) {
  listeners.forEach((fn) => {
    try {
      fn(data)
    } catch (e) {}
  })
}

/** 建立连接(幂等) */
export function connect() {
  if (socket && connected) return
  manualClose = false
  socket = uni.connectSocket({
    url: buildUrl(),
    complete: () => {},
  })
  socket.onOpen(onOpen)
  socket.onMessage(onWsMessage)
  socket.onClose(onClose)
  socket.onError(onError)
}

/** 订阅消息,返回取消订阅函数 */
export function onMessage(cb) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

/** 发送聊天消息 */
export function sendChatMessage(chatId, content, contentType = 'TEXT') {
  if (!socket || !connected) {
    connect()
    return false
  }
  socket.send({
    data: JSON.stringify({ action: 'send', chatId, content, contentType }),
  })
  return true
}

/** 手动关闭(退出登录时调用) */
export function closeChat() {
  manualClose = true
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  stopHeartbeat()
  if (socket) {
    try {
      socket.close({})
    } catch (e) {}
  }
  socket = null
  connected = false
}

export function isConnected() {
  return connected
}
