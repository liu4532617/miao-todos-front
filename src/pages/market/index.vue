<template>
  <view class="page">
    <nav-bar title="餐饮跳蚤" />

    <view class="content">
      <!-- 品牌 hero -->
      <view class="hero-card">
        <text class="eyebrow">餐饮好物 · 轻松流转</text>
        <text class="hero-title">给好设备，\n再找一个灶台。</text>
        <view class="go" @click="goPost">
          <text>发布闲置</text>
          <z-icon name="arrow-right" :size="13" color="#ffd35c" />
        </view>
      </view>

      <!-- 分类 tabs -->
      <view class="market-tabs">
        <view
          v-for="t in tabs"
          :key="t"
          class="tab"
          :class="{ active: currentTab === t }"
          @click="onTab(t)"
        >
          {{ t }}
        </view>
      </view>

      <!-- 商品网格 -->
      <view class="product-grid">
        <product-card
          v-for="p in products"
          :key="p.id"
          :product="p"
          @click="goDetail(p)"
        />
      </view>

      <view v-if="!loading && !products.length" class="empty-wrap">
        <empty
          icon="bag"
          text="这个分类暂时还没有宝贝"
          subText="发布第一件闲置，让好设备继续发光"
          action-text="去发布"
          @action="goPost"
        />
      </view>

      <view v-if="loading" class="loading-wrap">
        <text class="loading-text">加载中...</text>
      </view>
      <view class="bottom-space" />
    </view>

    <!-- 悬浮发布按钮 -->
    <view class="float-add" @click="goPost">
      <z-icon name="plus" :size="24" color="#fff" weight="2.4" />
    </view>

    <tab-bar :current="2" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getProducts } from '@/api/market'

const tabs = ['精选', '厨房设备', '桌椅餐具', '急转']
const currentTab = ref('精选')

const products = ref([])
const loading = ref(false)

function onTab(t) {
  currentTab.value = t
  load()
}

function goDetail(p) {
  uni.navigateTo({ url: `/pages/market/detail?id=${p.id}` })
}

function goPost() {
  uni.navigateTo({ url: '/pages/market/post' })
}

async function load() {
  loading.value = true
  try {
    const res = await getProducts({
      page: 1,
      category: currentTab.value,
    })
    products.value = res.list || []
  } catch (e) {
    products.value = []
  } finally {
    loading.value = false
  }
}

onLoad(load)
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $paper;
  padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
}

.content {
  padding: 0 32rpx;
}

/* 品牌 hero(深绿 + 黄圆 + 橙装饰,与招聘/求职广场同语言) */
.hero-card {
  position: relative;
  margin-top: 28rpx;
  border-radius: $radius-xl;
  padding: 40rpx 36rpx 36rpx;
  overflow: hidden;
  color: $paper;
  background: #263f42;

  &::before {
    content: '';
    position: absolute;
    right: -60rpx;
    bottom: -90rpx;
    width: 330rpx;
    height: 330rpx;
    border: 34rpx solid $yellow;
    border-radius: 50%;
    opacity: 0.95;
  }

  &::after {
    content: '';
    position: absolute;
    right: 66rpx;
    top: 40rpx;
    width: 130rpx;
    height: 130rpx;
    background: $orange;
    border-radius: 48% 52% 48% 55%;
    transform: rotate(25deg);
    box-shadow: -36rpx 60rpx 0 -8rpx $jade;
  }

  .eyebrow {
    position: relative;
    z-index: 1;
    display: block;
    font-size: 20rpx;
    color: #c8d4c7;
    letter-spacing: 0.1em;
  }

  .hero-title {
    display: block;
    position: relative;
    z-index: 1;
    margin: 16rpx 0 28rpx;
    font-size: 44rpx;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: -2rpx;
    white-space: pre-line;
    max-width: 440rpx;
  }

  .go {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 8rpx;
    color: $yellow;
    font-size: 24rpx;
    font-weight: 700;
  }
}

/* 分类 tabs */
.market-tabs {
  display: flex;
  gap: 34rpx;
  margin: 32rpx 4rpx 8rpx;
  border-bottom: 1rpx solid $line;

  .tab {
    padding: 0 0 20rpx;
    color: $muted;
    font-size: 26rpx;

    &.active {
      color: $ink;
      font-weight: 700;
      border-bottom: 4rpx solid $orange;
    }
  }
}

/* 商品网格 */
.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22rpx;
  margin-top: 22rpx;
}

.empty-wrap,
.loading-wrap {
  padding: 60rpx 0;
}

.loading-text {
  display: block;
  text-align: center;
  color: $muted;
  font-size: 24rpx;
}

.float-add {
  position: fixed;
  right: 40rpx;
  bottom: calc(180rpx + env(safe-area-inset-bottom));
  z-index: 800;
  width: 92rpx;
  height: 92rpx;
  border-radius: 30rpx;
  background: $orange;
  box-shadow: 0 14rpx 32rpx rgba(239, 90, 42, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-space {
  height: 40rpx;
}
</style>
