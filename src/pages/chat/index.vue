<template>
  <view class="page">
    <!-- 会话列表 -->
    <template v-if="!activeChat">
      <nav-bar title="沟通记录" :back="true" />

      <view class="content">
        <view v-for="c in chats" :key="c.id" class="chat-row" @click="openChat(c)">
          <view class="avatar">
            <image v-if="c.peerAvatar" class="avatar-img" :src="c.peerAvatar" mode="aspectFill" />
            <text v-else>{{ c.avatarText }}</text>
          </view>
          <view class="info">
            <view class="top">
              <text class="name">{{ c.name }}</text>
              <text class="time">{{ c.time }}</text>
            </view>
            <view class="bottom">
              <text class="last ellipsis">{{ c.lastMessage }}</text>
              <view v-if="c.unread" class="badge">{{ c.unread }}</view>
            </view>
          </view>
        </view>

        <view v-if="!chats.length">
          <empty icon="chat" text="暂无沟通记录" />
        </view>

        <view class="bottom-space" />
      </view>
    </template>

    <!-- 聊天线程 -->
    <template v-else>
      <nav-bar :title="activeChat.name" :back="true" @back="closeThread" />

      <scroll-view scroll-y class="thread" :scroll-into-view="scrollInto">
        <view class="tip-line" v-if="activeChat.jobTitle">
          <text class="tip">正在沟通岗位：{{ activeChat.jobTitle }}</text>
        </view>
        <view
          v-for="m in messages"
          :key="m.id"
          :id="'msg-' + m.id"
          class="msg-row"
          :class="m.from === 'me' ? 'me' : 'them'"
        >
          <view class="bubble">{{ m.content }}</view>
          <text class="time">{{ m.time }}</text>
        </view>
      </scroll-view>

      <view class="input-bar">
        <input
          v-model="inputText"
          class="input"
          confirm-type="send"
          placeholder="输入消息..."
          placeholder-class="ph"
          @confirm="send"
        />
        <view class="send-btn" @click="send">
          <z-icon name="send" :size="18" color="#fff" />
        </view>
      </view>
    </template>
  </view>
</template>

<script setup>
import { nextTick, ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { getChats, getMessages, sendMessage } from '@/api/chat'
import { connect, onMessage, sendChatMessage } from '@/utils/socket'
import { getStoredUser } from '@/utils/storage'

const chats = ref([])
const activeChat = ref(null)
const messages = ref([])
const inputText = ref('')
const scrollInto = ref('')

let unsubscribe = null
let meId = getStoredUser()?.id ?? getStoredUser()?.userId

function fmtTime(t) {
  if (!t) return ''
  return String(t).replace('T', ' ').slice(5, 16)
}

function handleWsMessage(msg) {
  if (!msg || msg.type !== 'message') return
  const d = msg.data || {}
  // 更新会话列表
  const c = chats.value.find((x) => x.id === d.chatId)
  if (c) {
    c.lastMessage = d.content
    c.time = '刚刚'
    const inThread = activeChat.value && activeChat.value.id === d.chatId
    if (!inThread && d.senderId !== meId) {
      c.unread = (c.unread || 0) + 1
    }
  }
  // 当前会话直接渲染
  if (activeChat.value && activeChat.value.id === d.chatId) {
    messages.value.push({
      id: d.id || Date.now(),
      from: d.senderId === meId ? 'me' : 'them',
      content: d.content,
      time: fmtTime(d.createTime),
    })
    scrollToBottom()
  }
}

function closeThread() {
  if (activeChat.value) {
    activeChat.value = null
    messages.value = []
    return true
  }
  return false
}

async function openChat(c) {
  activeChat.value = c
  c.unread = 0
  try {
    messages.value = await getMessages(c.id)
  } catch (e) {
    messages.value = []
  }
  scrollToBottom()
}

function send() {
  const content = inputText.value.trim()
  if (!content) return
  inputText.value = ''
  // 走 WebSocket 实时发送(服务端回执推送,无需本地渲染)
  const ok = sendChatMessage(activeChat.value.id, content)
  if (!ok) {
    // WebSocket 未就绪时降级 HTTP,本地渲染
    sendMessage(activeChat.value.id, content)
      .then(() => {
        messages.value.push({ id: Date.now(), from: 'me', content, time: '刚刚' })
        scrollToBottom()
      })
      .catch(() => {
        inputText.value = content
        uni.showToast({ title: '发送失败,请重试', icon: 'none' })
      })
  }
}

function scrollToBottom() {
  nextTick(() => {
    const last = messages.value[messages.value.length - 1]
    if (last) scrollInto.value = 'msg-' + last.id
  })
}

onLoad(async () => {
  connect()
  unsubscribe = onMessage(handleWsMessage)
  try {
    chats.value = await getChats()
  } catch (e) {
    chats.value = []
  }
})

onUnload(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $paper;
}

.content {
  padding: 0 32rpx;
}

.chat-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 26rpx 0;
  border-bottom: 1rpx solid $line;

  .avatar {
    width: 88rpx;
    height: 88rpx;
    border-radius: 28rpx;
    background: $jade;
    color: #fff;
    font-size: 34rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    overflow: hidden;

    .avatar-img {
      width: 100%;
      height: 100%;
    }
  }

  .info {
    flex: 1;
    min-width: 0;

    .top {
      display: flex;
      justify-content: space-between;

      .name {
        font-size: 28rpx;
        font-weight: 600;
      }

      .time {
        font-size: 20rpx;
        color: $muted;
      }
    }

    .bottom {
      display: flex;
      align-items: center;
      gap: 12rpx;
      margin-top: 8rpx;

      .last {
        flex: 1;
        font-size: 24rpx;
        color: $muted;
      }

      .badge {
        min-width: 34rpx;
        height: 34rpx;
        border-radius: 999rpx;
        background: $orange;
        color: #fff;
        font-size: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 8rpx;
      }
    }
  }
}

.thread {
  height: calc(100vh - 170rpx - env(safe-area-inset-bottom));
  background: #f6f6f0;
  padding: 24rpx 32rpx;
  box-sizing: border-box;

  .tip-line {
    text-align: center;
    margin-bottom: 20rpx;

    .tip {
      font-size: 22rpx;
      color: #8a9492;
      background: #ecece4;
      padding: 8rpx 20rpx;
      border-radius: 999rpx;
    }
  }

  .msg-row {
    margin-bottom: 24rpx;
    display: flex;
    flex-direction: column;

    &.me {
      align-items: flex-end;

      .bubble {
        background: $orange;
        color: #fff;
        border-bottom-right-radius: 8rpx;
      }
    }

    &.them {
      align-items: flex-start;

      .bubble {
        background: #fff;
        color: $ink;
        border-bottom-left-radius: 8rpx;
        border: 1rpx solid $line;
      }
    }

    .bubble {
      max-width: 70%;
      padding: 18rpx 24rpx;
      border-radius: 24rpx;
      font-size: 26rpx;
      line-height: 1.5;
    }

    .time {
      font-size: 20rpx;
      color: #a7b1b0;
      margin-top: 8rpx;
    }
  }
}

.input-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 24rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background: #fff;
  border-top: 1rpx solid $line;

  .input {
    flex: 1;
    height: 80rpx;
    background: #f3f2ec;
    border-radius: 999rpx;
    padding: 0 28rpx;
    font-size: 26rpx;
  }

  .send-btn {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background: $orange;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.bottom-space {
  height: 40rpx;
}

.ph {
  color: #b3bcba;
}
</style>
