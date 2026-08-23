<template>
  <view class="product" hover-class="product-hover" @click="$emit('click', product)">
    <view class="product-art" :class="product.art" :style="{ background: product.bg || '#d7ebe4' }">
      <!-- 简易装饰图形，模拟商品图 -->
    </view>
    <view class="product-info">
      <text class="name ellipsis-2">{{ product.name }}</text>
      <view class="price-row">
        <text class="price">¥ {{ product.price }}</text>
        <text v-if="product.originPrice" class="origin">¥ {{ product.originPrice }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
defineProps({
  product: { type: Object, required: true },
})

defineEmits(['click'])
</script>

<style lang="scss" scoped>
.product {
  background: #fff;
  border: 1rpx solid $line;
  border-radius: 24rpx;
  overflow: hidden;
}

.product-hover {
  opacity: 0.95;
  transform: scale(0.99);
}

.product-art {
  height: 210rpx;
  position: relative;
  overflow: hidden;

  &.pot::before,
  &.pot::after {
    content: '';
    position: absolute;
  }

  &.pot::before {
    width: 124rpx;
    height: 80rpx;
    border-radius: 14rpx 14rpx 44rpx 44rpx;
    background: #3b6865;
    left: 50%;
    top: 60rpx;
    transform: translateX(-50%);
    box-shadow: -18rpx -12rpx 0 -10rpx #3b6865, 122rpx -12rpx 0 -10rpx #3b6865;
  }

  &.pot::after {
    width: 136rpx;
    height: 16rpx;
    border-radius: 16rpx;
    background: #244c4d;
    left: 50%;
    top: 50rpx;
    transform: translateX(-50%);
  }

  &.mixer::before,
  &.mixer::after {
    content: '';
    position: absolute;
  }

  &.mixer::before {
    width: 58rpx;
    height: 116rpx;
    border-radius: 8rpx 8rpx 30rpx 30rpx;
    background: #e55e39;
    left: 50%;
    top: 48rpx;
    transform: translateX(-50%);
    box-shadow: 0 -30rpx 0 4rpx #ed7250;
  }

  &.mixer::after {
    width: 110rpx;
    height: 50rpx;
    border-radius: 6rpx;
    background: #fff2e3;
    left: 50%;
    bottom: 26rpx;
    transform: translateX(-50%);
    border: 8rpx solid #e55e39;
  }

  &.fridge::before,
  &.fridge::after {
    content: '';
    position: absolute;
  }

  &.fridge::before {
    width: 94rpx;
    height: 146rpx;
    border-radius: 12rpx;
    background: #7890ca;
    left: 50%;
    top: 28rpx;
    transform: translateX(-50%);
    box-shadow: inset 0 -4rpx #536fa9;
  }

  &.fridge::after {
    width: 4rpx;
    height: 132rpx;
    background: #506aa1;
    left: 50%;
    top: 36rpx;
  }
}

.product-info {
  padding: 18rpx 20rpx 22rpx;

  .name {
    font-size: 24rpx;
    font-weight: 600;
    line-height: 1.4;
    display: -webkit-box;
  }

  .price-row {
    margin-top: 12rpx;
    display: flex;
    align-items: baseline;

    .price {
      font-size: 28rpx;
      font-weight: 700;
      color: $orange;
    }

    .origin {
      font-size: 20rpx;
      color: $muted;
      margin-left: 10rpx;
      text-decoration: line-through;
    }
  }
}
</style>
