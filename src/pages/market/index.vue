<template>
  <view class="page">
    <nav-bar title="餐饮跳蚤">
      <template #right>
        <view class="round-btn" @click="onFilter">
          <z-icon name="settings" :size="18" color="#17292c" />
        </view>
      </template>
    </nav-bar>

    <view class="content">
      <!-- 市场横幅 -->
      <view class="market-hero">
        <view class="hero-text">
          <text class="p">给好设备，再找一个灶台</text>
          <text class="strong">餐饮好物 · 轻松流转</text>
        </view>
        <text class="deco">二手 重启</text>
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
        <empty icon="bag" text="这个分类暂时还没有宝贝" />
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
import { toast } from '@/utils/feedback'

const tabs = ['精选', '厨房设备', '桌椅餐具', '急转']
const currentTab = ref('精选')

const products = ref([])
const loading = ref(false)

function onFilter() {
  toast('筛选器已打开')
}

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

.round-btn {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  background: #eef0e9;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 横幅 */
.market-hero {
  position: relative;
  margin-top: 28rpx;
  background: #feeccf;
  height: 208rpx;
  border-radius: 36rpx;
  padding: 30rpx 32rpx;
  overflow: hidden;

  .hero-text {
    position: relative;
    z-index: 1;

    .p {
      display: block;
      font-size: 22rpx;
      color: #895b2c;
    }

    .strong {
      display: block;
      font-size: 36rpx;
      font-weight: 800;
      letter-spacing: -1rpx;
      margin-top: 10rpx;
    }
  }

  .deco {
    position: absolute;
    right: 16rpx;
    bottom: -6rpx;
    font-size: 86rpx;
    font-weight: 800;
    color: #e95b32;
    opacity: 0.9;
    transform: rotate(-7deg);
    white-space: pre-line;
    line-height: 0.82;
    letter-spacing: -4rpx;
  }
}

/* tabs */
.market-tabs {
  display: flex;
  gap: 34rpx;
  margin: 34rpx 4rpx 8rpx;
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

.empty-wrap {
  padding: 60rpx 0;
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
