<template>
  <view class="empty">
    <z-icon :name="icon" :size="64" color="#cdd5d2" />
    <text class="empty-text">{{ text }}</text>
    <text v-if="subText" class="empty-sub">{{ subText }}</text>
    <view v-if="actionText" class="empty-btn" @click="$emit('action')">{{ actionText }}</view>
  </view>
</template>

<script setup>
defineProps({
  icon: { type: String, default: 'box' },
  text: { type: String, default: '暂无数据' },
  subText: { type: String, default: '' },
  actionText: { type: String, default: '' },
})

defineEmits(['action'])
</script>

<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;

  .empty-text {
    margin-top: 24rpx;
    font-size: 28rpx;
    color: $muted;
  }

  .empty-sub {
    margin-top: 10rpx;
    font-size: 24rpx;
    color: #a7b1b0;
  }

  .empty-btn {
    margin-top: 32rpx;
    padding: 16rpx 48rpx;
    border-radius: 999rpx;
    background: $orange;
    color: #fff;
    font-size: 26rpx;
    font-weight: 600;
  }
}
</style>
