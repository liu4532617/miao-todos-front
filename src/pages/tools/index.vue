<template>
  <view class="page">
    <nav-bar :title="'招聘广场'">
      <template #right>
        <view class="round-btn" @click="goSearch">
          <z-icon name="search" :size="18" color="#17292c" />
        </view>
      </template>
    </nav-bar>

    <view class="content">
      <!-- 广场头部 -->
      <view class="feed-head">
        <text class="feed-title">餐厅正在招人</text>
        <text class="feed-sub">在招岗位 · 最新</text>
      </view>

      <!-- 我发布的(置顶) -->
      <template v-if="myJobs.length">
        <view class="mini-head">
          <text class="mini-title">我发布的</text>
          <text class="mini-more" @click="goMine">管理 ›</text>
        </view>
        <job-card
          v-for="j in myJobs"
          :key="j.id"
          :job="j"
          @click="goDetail(j)"
          @action="goDetail(j)"
        />
      </template>

      <!-- 全部在招 -->
      <view class="mini-head">
        <text class="mini-title">全部在招</text>
        <text v-if="!myJobs.length && others.length" class="mini-more">共 {{ others.length }} 个</text>
      </view>
      <job-card
        v-for="j in others"
        :key="j.id"
        :job="j"
        @click="goDetail(j)"
        @action="goDetail(j)"
      />

      <view v-if="!loading && !myJobs.length && !others.length" class="empty-wrap">
        <empty
          icon="briefcase"
          text="暂时没有在招岗位"
          subText="发布第一个岗位，招到合适的后厨伙伴"
          action-text="去发布"
          @action="goPostJob"
        />
      </view>

      <view v-if="loading" class="loading-wrap">
        <text class="loading-text">加载中...</text>
      </view>
      <view class="bottom-space" />
    </view>

    <!-- 悬浮发布:发岗位 -->
    <view class="float-add" @click="goPostJob">
      <z-icon name="plus" :size="24" color="#fff" weight="2.4" />
    </view>

    <tab-bar :current="0" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getJobs, getMyJobs } from '@/api/job'

const myJobs = ref([])
const others = ref([])
const loading = ref(false)

function goSearch() {
  uni.navigateTo({ url: '/pages/search/index' })
}

function goPostJob() {
  uni.navigateTo({ url: '/pages/job/post' })
}

function goMine() {
  uni.navigateTo({ url: '/pages/job/mine' })
}

function goDetail(j) {
  uni.navigateTo({ url: `/pages/jobs/detail?id=${j.id}` })
}

async function load() {
  loading.value = true
  try {
    const [allRes, mineRes] = await Promise.all([
      getJobs({ page: 1, pageSize: 200 }).catch(() => ({ list: [] })),
      getMyJobs({ page: 1, pageSize: 200 }).catch(() => ({ list: [] })),
    ])
    const all = allRes.list || []
    const mineList = mineRes.list || []
    const myIds = new Set(mineList.map((j) => j.id))
    myJobs.value = all.filter((j) => myIds.has(j.id))
    others.value = all.filter((j) => !myIds.has(j.id))
  } catch (e) {
    myJobs.value = []
    others.value = []
  }
  loading.value = false
}

onShow(load)
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background: $paper;
  padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
}

.round-btn {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  background: $wash;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  padding: 0;
}

/* 广场头部 */
.feed-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 32rpx 32rpx 0;

  .feed-title {
    font-size: 34rpx;
    font-weight: 800;
    letter-spacing: -1rpx;
    color: $ink;
  }

  .feed-sub {
    font-size: 22rpx;
    color: $muted;
  }
}

/* 分组小标题 */
.mini-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 36rpx 8rpx 0;
  padding: 0 24rpx;

  .mini-title {
    font-size: 26rpx;
    font-weight: 700;
    color: $muted;
    letter-spacing: 1rpx;
  }

  .mini-more {
    font-size: 22rpx;
    color: $orange;
    font-weight: 600;
  }
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
