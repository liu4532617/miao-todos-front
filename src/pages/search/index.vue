<template>
  <view class="page">
    <nav-bar title="搜索" :back="true">
      <template #default>
        <view class="search-box">
          <z-icon name="search" :size="16" color="#8a9492" />
          <input
            v-model="keyword"
            class="search-input"
            confirm-type="search"
            placeholder="搜岗位、餐厅、宝贝"
            placeholder-class="ph"
            focus
            @confirm="doSearch"
          />
          <text class="search-btn" @click="doSearch">搜索</text>
        </view>
      </template>
    </nav-bar>

    <view class="content">
      <!-- 搜索历史 -->
      <view v-if="!searched" class="history">
        <view class="section-title">
          <text class="title">搜索历史</text>
          <text class="more" @click="clearHistory">清空</text>
        </view>
        <view class="history-tags">
          <view v-for="h in history" :key="h" class="h-tag" @click="onHistory(h)">{{ h }}</view>
        </view>
        <view v-if="!history.length" class="hint">输入关键词搜索岗位、餐厅或二手宝贝</view>
      </view>

      <!-- 搜索结果 -->
      <template v-else>
        <view class="result-tabs">
          <view
            v-for="t in ['职位', '宝贝']"
            :key="t"
            class="rtab"
            :class="{ active: resultTab === t }"
            @click="resultTab = t"
          >
            {{ t }}
          </view>
        </view>

        <template v-if="resultTab === '职位'">
          <job-card
            v-for="j in jobResults"
            :key="j.id"
            :job="j"
            @click="goJob(j)"
          />
          <view v-if="!jobResults.length" class="empty-wrap">
            <empty icon="search" :text="`没有找到「${keyword}」相关职位`" />
          </view>
        </template>

        <template v-else>
          <view class="product-grid">
            <product-card
              v-for="p in productResults"
              :key="p.id"
              :product="p"
              @click="goProduct(p)"
            />
          </view>
          <view v-if="!productResults.length" class="empty-wrap">
            <empty icon="search" :text="`没有找到「${keyword}」相关宝贝`" />
          </view>
        </template>
      </template>

      <view class="bottom-space" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { getJobs } from '@/api/job'
import { getProducts } from '@/api/market'

const HISTORY_KEY = 'MIAO_SEARCH_HISTORY'

const keyword = ref('')
const searched = ref(false)
const resultTab = ref('职位')
const jobResults = ref([])
const productResults = ref([])
const history = ref(uni.getStorageSync(HISTORY_KEY) || [])

async function doSearch() {
  const kw = keyword.value.trim()
  if (!kw) return
  searched.value = true
  saveHistory(kw)

  if (resultTab.value === '职位') {
    try {
      const res = await getJobs({ keyword: kw, page: 1 })
      jobResults.value = res.list || []
    } catch (e) {
      jobResults.value = []
    }
  } else {
    try {
      const res = await getProducts({ keyword: kw, page: 1 })
      productResults.value = res.list || []
    } catch (e) {
      productResults.value = []
    }
  }
}

function onHistory(h) {
  keyword.value = h
  doSearch()
}

function saveHistory(kw) {
  const list = history.value.filter((x) => x !== kw)
  list.unshift(kw)
  history.value = list.slice(0, 10)
  uni.setStorageSync(HISTORY_KEY, history.value)
}

function clearHistory() {
  history.value = []
  uni.removeStorageSync(HISTORY_KEY)
}

function goJob(j) {
  uni.navigateTo({ url: `/pages/jobs/detail?id=${j.id}` })
}

function goProduct(p) {
  uni.navigateTo({ url: `/pages/market/detail?id=${p.id}` })
}
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $paper;
  padding-bottom: calc(60rpx + env(safe-area-inset-bottom));
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12rpx;
  width: 100%;
  height: 72rpx;
  background: #f1f1eb;
  border-radius: 999rpx;
  padding: 0 10rpx 0 24rpx;

  .search-input {
    flex: 1;
    font-size: 26rpx;
    height: 100%;
  }

  .search-btn {
    font-size: 24rpx;
    color: $orange;
    font-weight: 600;
    padding: 0 18rpx;
  }
}

.content {
  padding: 0 32rpx;
}

.history {
  margin-top: 10rpx;

  .history-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 16rpx;

    .h-tag {
      padding: 12rpx 26rpx;
      background: #f1f1eb;
      border-radius: 999rpx;
      font-size: 24rpx;
      color: #5c6c6e;
    }
  }

  .hint {
    margin-top: 80rpx;
    text-align: center;
    color: #a7b1b0;
    font-size: 24rpx;
  }
}

.result-tabs {
  display: flex;
  gap: 34rpx;
  margin-top: 10rpx;
  border-bottom: 1rpx solid $line;

  .rtab {
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

.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22rpx;
  margin-top: 22rpx;
}

.empty-wrap {
  padding: 40rpx 0;
}

.bottom-space {
  height: 40rpx;
}

.ph {
  color: #b3bcba;
}
</style>
