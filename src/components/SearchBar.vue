<template>
  <view class="search-bar" :class="{ active }" @click="$emit('click')">
    <z-icon name="search" :size="16" :color="active ? '#17292c' : '#8a9492'" />
    <text class="placeholder">{{ placeholder }}</text>
    <slot />
  </view>
</template>

<script setup>
defineProps({
  placeholder: { type: String, default: '搜索' },
  active: { type: Boolean, default: false },
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
.search-bar {
  height: 84rpx;
  border-radius: 26rpx;
  background: #f1f1eb;
  display: flex;
  align-items: center;
  gap: 14rpx;
  color: #8a9492;
  font-size: 24rpx;
  padding: 0 26rpx;

  &.active {
    background: #e9e9e0;
  }

  .placeholder {
    flex: 1;
  }
}
</style>
