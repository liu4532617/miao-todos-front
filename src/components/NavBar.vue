<template>
  <view class="navbar" :style="{ background: bg }">
    <view class="status-spacer" :style="{ height: statusBarHeight + 'px' }" />
    <view class="navbar-row" :style="{ height: height + 'px' }">
      <view class="side left">
      <view v-if="back" class="btn" hover-class="btn-hover" @click="onBack">
        <z-icon name="chevron-right" :size="22" color="#17292c" weight="2.4" />
      </view>
      </view>
      <view class="center">
        <slot>
          <text class="title" :style="{ color: ink ? '#17292c' : '#fff' }">{{ title }}</text>
        </slot>
      </view>
      <view class="side right">
        <slot name="right" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  back: { type: Boolean, default: false },
  bg: { type: String, default: '#fffdf7' },
  height: { type: Number, default: 44 },
  ink: { type: Boolean, default: true },
})

const emit = defineEmits(['back'])

const statusBarHeight = ref(20)
try {
  const info = uni.getSystemInfoSync()
  statusBarHeight.value = info.statusBarHeight || 20
} catch (e) {}

function onBack() {
  if (emit('back')) return
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.reLaunch({ url: '/pages/tools/index' })
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  position: relative;
  z-index: 100;
}

.navbar-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24rpx;
}

.side {
  width: 130rpx;
  display: flex;
  align-items: center;

  &.left {
    justify-content: flex-start;
  }

  &.right {
    justify-content: flex-end;
  }
}

.center {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 0;

  .title {
    font-size: 34rpx;
    font-weight: 700;
    letter-spacing: -1rpx;
  }
}

.btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background: #eef0e9;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scaleX(-1);
}

.btn-hover {
  opacity: 0.7;
}
</style>
