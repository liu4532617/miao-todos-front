<template>
  <view class="tabbar">
    <view
      v-for="(tab, idx) in tabs"
      :key="tab.path"
      class="tab-item"
      :class="{ active: idx === current }"
      @click="onSwitch(idx)"
    >
      <z-icon
        :name="tab.icon"
        :size="22"
        :color="idx === current ? '#ef5a2a' : '#84908e'"
        :weight="idx === current ? 2.2 : 1.8"
      />
      <text class="label">{{ tab.label }}</text>
    </view>
  </view>
</template>

<script setup>
const props = defineProps({
  current: { type: Number, default: 0 },
})

const tabs = [
  { label: '招聘', icon: 'briefcase', path: '/pages/tools/index' },
  { label: '求职', icon: 'compass', path: '/pages/jobs/index' },
  { label: '餐饮跳蚤', icon: 'bag', path: '/pages/market/index' },
  { label: '我的', icon: 'user', path: '/pages/mine/index' },
]

function onSwitch(idx) {
  if (idx === props.current) return
  uni.reLaunch({ url: tabs[idx].path })
}
</script>

<style lang="scss" scoped>
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  display: flex;
  background: rgba(255, 253, 247, 0.96);
  backdrop-filter: blur(16px);
  border-top: 1rpx solid $line;
  padding: 12rpx 10rpx 10rpx;
  padding-bottom: calc(10rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(10rpx + env(safe-area-inset-bottom));
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
  border-radius: 20rpx;
  padding: 8rpx 0;

  .label {
    font-size: 20rpx;
    color: #84908e;
  }

  &.active {
    .label {
      color: $orange;
      font-weight: 700;
    }
  }
}
</style>
