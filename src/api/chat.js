import { get, post } from './request'
import API from './urls'
import { mapChat, mapMessage } from './adapters'
import { getStoredUser } from '@/utils/storage'

/* ================= 沟通 ================= */

/** 沟通会话列表 */
export function getChats() {
  return get(API.chats).then((list) => (Array.isArray(list) ? list.map(mapChat) : list))
}

/** 某会话消息记录（后端分页返回 {list,...}，这里直接给数组） */
export function getMessages(chatId) {
  return get(API.chatMessages(chatId)).then((res) => {
    const list = Array.isArray(res) ? res : res?.list || []
    const meId = getStoredUser()?.id ?? getStoredUser()?.userId
    return list.map((m) => mapMessage(m, meId))
  })
}

/** 发送消息 */
export function sendMessage(chatId, content) {
  return post(API.chatMessages(chatId), { content })
}
