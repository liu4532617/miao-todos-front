<template>
  <view class="page" v-if="product">
    <nav-bar title="商品详情" :back="true" />

    <view class="content">
      <!-- 商品图 -->
      <view class="product-art" :class="product.art" :style="{ background: product.bg || '#d7ebe4' }" />

      <!-- 价格 -->
      <view class="price-card card">
        <view class="price-row">
          <text class="price">¥ {{ product.price }}</text>
          <text class="origin">¥ {{ product.originPrice }}</text>
        </view>
        <text class="name">{{ product.name }}</text>
        <view class="meta-row">
          <text class="tag">{{ product.category }}</text>
          <text class="time">发布于 {{ product.createdAt }}</text>
        </view>
      </view>

      <!-- 描述 -->
      <view class="section-title">
        <text class="title">宝贝描述</text>
      </view>
      <view class="card">
        <text class="desc-text">{{ product.description }}</text>
      </view>

      <!-- 卖家 -->
      <view class="section-title">
        <text class="title">卖家信息</text>
      </view>
      <view class="card seller-card">
        <view class="seller-avatar">
          <z-icon name="store" :size="20" color="#fff" />
        </view>
        <view class="seller-info">
          <text class="seller-name">阿新 · 同城卖家</text>
          <text class="seller-sub">距你 {{ product.distance }} km · 支持自提</text>
        </view>
        <view class="chat-btn" @click="goChat">
          <z-icon name="chat" :size="16" color="#ef5a2a" />
          <text>联系</text>
        </view>
      </view>

      <view class="bottom-space" />
    </view>

    <!-- 底部操作 -->
    <view class="action-bar">
      <view class="action-btn primary" @click="goChat">联系卖家</view>
      <view class="action-btn" @click="onLike">
        <z-icon name="star" :size="18" :color="liked ? '#ef5a2a' : '#fff'" />
        <text>{{ liked ? '已关注' : '关注' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getProductDetail } from '@/api/market'
import { toast } from '@/utils/feedback'

const product = ref(null)
const liked = ref(false)

function goChat() {
  toast('已进入与卖家的沟通')
}

function onLike() {
  liked.value = !liked.value
  toast(liked.value ? '已关注该宝贝' : '已取消关注')
}

onLoad(async (options) => {
  try {
    product.value = await getProductDetail(options.id)
  } catch (e) {
    product.value = null
  }
})
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $paper;
  padding-bottom: calc(140rpx + env(safe-area-inset-bottom));
}

.content {
  padding: 0 32rpx;
}

.product-art {
  margin-top: 16rpx;
  height: 420rpx;
  border-radius: 36rpx;
  overflow: hidden;
  position: relative;

  &.pot::before,
  &.pot::after {
    content: '';
    position: absolute;
  }

  &.pot::before {
    width: 260rpx;
    height: 160rpx;
    border-radius: 28rpx 28rpx 88rpx 88rpx;
    background: #3b6865;
    left: 50%;
    top: 120rpx;
    transform: translateX(-50%);
    box-shadow: -36rpx -24rpx 0 -20rpx #3b6865, 244rpx -24rpx 0 -20rpx #3b6865;
  }

  &.pot::after {
    width: 280rpx;
    height: 32rpx;
    border-radius: 32rpx;
    background: #244c4d;
    left: 50%;
    top: 96rpx;
    transform: translateX(-50%);
  }

  &.mixer::before,
  &.mixer::after {
    content: '';
    position: absolute;
  }

  &.mixer::before {
    width: 116rpx;
    height: 232rpx;
    border-radius: 16rpx 16rpx 60rpx 60rpx;
    background: #e55e39;
    left: 50%;
    top: 100rpx;
    transform: translateX(-50%);
    box-shadow: 0 -60rpx 0 8rpx #ed7250;
  }

  &.mixer::after {
    width: 220rpx;
    height: 100rpx;
    border-radius: 12rpx;
    background: #fff2e3;
    left: 50%;
    bottom: 40rpx;
    transform: translateX(-50%);
    border: 16rpx solid #e55e39;
  }

  &.fridge::before,
  &.fridge::after {
    content: '';
    position: absolute;
  }

  &.fridge::before {
    width: 188rpx;
    height: 292rpx;
    border-radius: 24rpx;
    background: #7890ca;
    left: 50%;
    top: 50rpx;
    transform: translateX(-50%);
    box-shadow: inset 0 -8rpx #536fa9;
  }

  &.fridge::after {
    width: 8rpx;
    height: 264rpx;
    background: #506aa1;
    left: 50%;
    top: 70rpx;
  }
}

.price-card {
  margin-top: 28rpx;

  .price-row {
    display: flex;
    align-items: baseline;

    .price {
      font-size: 52rpx;
      font-weight: 800;
      color: $orange;
    }

    .origin {
      margin-left: 16rpx;
      font-size: 26rpx;
      color: $muted;
      text-decoration: line-through;
    }
  }

  .name {
    display: block;
    margin-top: 14rpx;
    font-size: 32rpx;
    font-weight: 700;
  }

  .meta-row {
    margin-top: 18rpx;
    display: flex;
    align-items: center;
    gap: 16rpx;

    .time {
      font-size: 22rpx;
      color: $muted;
    }
  }
}

.desc-text {
  font-size: 26rpx;
  line-height: 1.8;
  color: #3c4c4e;
}

.seller-card {
  display: flex;
  align-items: center;
  gap: 20rpx;

  .seller-avatar {
    width: 84rpx;
    height: 84rpx;
    border-radius: 26rpx;
    background: $jade;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
  }

  .seller-info {
    flex: 1;
    min-width: 0;

    .seller-name {
      display: block;
      font-size: 28rpx;
      font-weight: 700;
    }

    .seller-sub {
      display: block;
      font-size: 22rpx;
      color: $muted;
      margin-top: 4rpx;
    }
  }

  .chat-btn {
    display: flex;
    align-items: center;
    gap: 6rpx;
    padding: 14rpx 28rpx;
    border: 1rpx solid $orange;
    color: $orange;
    border-radius: 999rpx;
    font-size: 24rpx;
  }
}

.action-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  display: flex;
  gap: 20rpx;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: rgba(255, 253, 247, 0.97);
  border-top: 1rpx solid $line;

  .action-btn {
    flex: 1;
    height: 92rpx;
    border-radius: 999rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    font-size: 30rpx;
    font-weight: 700;
    color: #fff;
    background: $ink;

    &.primary {
      background: $orange;
      box-shadow: 0 12rpx 28rpx rgba(239, 90, 42, 0.3);
      flex: 2;
    }
  }
}
</style>
