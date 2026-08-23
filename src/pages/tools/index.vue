<template>
  <view class="page">
    <!-- 导航栏 -->
    <nav-bar title="招聘">
      <template #right>
        <view class="round-btn" @click="onBell">
          <z-icon name="bell" :size="18" color="#17292c" />
        </view>
      </template>
    </nav-bar>

    <view class="content">
      <search-bar placeholder="搜岗位、人才或餐厅" @click="goSearch" />

      <!-- Hero 卡片 -->
      <view class="hero-card">
        <view class="hero-deco" />
        <text class="eyebrow">TODAY'S HIRING NOTE</text>
        <text class="hero-title">招对一个人，\n后厨就顺一整天。</text>
        <view class="go" @click="goPostJob">
          <text>发布招聘</text>
          <z-icon name="arrow-right" :size="14" color="#ffd35c" />
        </view>
      </view>

      <!-- 招聘管理 -->
      <view class="section-title">
        <text class="title">招聘管理</text>
        <text class="more">把招人这件事理清楚</text>
      </view>
      <view class="tool-grid">
        <view class="tool" v-for="t in tools" :key="t.name" @click="onTool(t)">
          <view class="tool-icon" :style="{ background: t.bg, color: t.color }">
            <z-icon :name="t.icon" :size="26" :color="t.color" />
          </view>
          <text class="tool-name">{{ t.name }}</text>
        </view>
      </view>

      <!-- 在招岗位（我发布的岗位，按发布日期排序） -->
      <view class="section-title">
        <text class="title">在招岗位</text>
        <text class="more">按发布日期排序</text>
      </view>

      <view v-if="myJobs.length" class="job-list">
        <view v-for="j in myJobs" :key="j.id" class="job-row card" @click="goJobDetail(j)">
          <view class="job-top">
            <view class="logo" :style="{ background: j.logoColor || '#e65a37' }">
              <text>{{ j.logoText || j.title[0] }}</text>
            </view>
            <view class="info">
              <text class="title ellipsis">{{ j.title }}</text>
              <text class="company ellipsis">{{ j.restaurant }}</text>
            </view>
            <text class="salary">{{ j.salary }}</text>
          </view>
          <view class="job-foot">
            <text class="time">发布于 {{ j.createdAt }}</text>
            <view
              class="status-chip"
              :class="j.status === 'open' ? 'on' : 'off'"
              @click.stop="toggleJob(j)"
            >
              {{ j.status === 'open' ? '招聘中' : '已下架' }}
            </view>
          </view>
        </view>
      </view>
      <view v-else-if="!loading" class="empty-wrap">
        <empty
          icon="briefcase"
          text="还没有发布过岗位"
          subText="发布岗位，招到合适的后厨伙伴"
          action-text="去发布"
          @action="goPostJob"
        />
      </view>
      <view v-if="loading" class="loading-wrap">
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 招聘动态 -->
      <view class="section-title">
        <text class="title">招聘动态</text>
        <text class="more" @click="goResumeList">查看全部</text>
      </view>
      <view class="mini-list">
        <view v-for="d in dynamics" :key="d.id" class="mini-row" @click="onDynamic(d)">
          <view class="mini-date" :class="{ hot: d.unread }">
            <text>{{ d.dateLabel }}</text>
          </view>
          <view class="mini-info">
            <text class="mini-title">{{ d.title }}</text>
            <text class="mini-desc">{{ d.desc }}</text>
          </view>
          <z-icon name="chevron-right" :size="16" color="#a7b1b0" />
        </view>
        <view v-if="!dynamics.length">
          <empty icon="bell" text="暂无动态" />
        </view>
      </view>

      <view class="bottom-space" />
    </view>

    <tab-bar :current="0" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getDynamics } from '@/api/message'
import { getMyJobs, updateJobStatus } from '@/api/job'
import { toast } from '@/utils/feedback'

const tools = [
  { name: '发布岗位', icon: 'briefcase', bg: '#ffe4d7', color: '#d94b23', url: '/pages/job/post' },
  { name: '人才简历', icon: 'document-text', bg: '#dcefe9', color: '#268577', url: '/pages/resume/list' },
  { name: '面试安排', icon: 'calendar', bg: '#e1eafa', color: '#506fb5', url: '/pages/interview/index' },
]

const dynamics = ref([])
const myJobs = ref([])
const loading = ref(false)

function sortByDate(list) {
  return (list || []).slice().sort((a, b) => String(b.createTime || '').localeCompare(String(a.createTime || '')))
}

function goSearch() {
  uni.navigateTo({ url: '/pages/search/index' })
}

function goPostJob() {
  uni.navigateTo({ url: '/pages/job/post' })
}

function goResumeList() {
  uni.navigateTo({ url: '/pages/resume/list' })
}

function onBell() {
  toast('消息中心暂未开启')
}

function onTool(t) {
  uni.navigateTo({ url: t.url })
}

function goJobDetail(j) {
  uni.navigateTo({ url: `/pages/jobs/detail?id=${j.id}` })
}

async function toggleJob(j) {
  const next = j.status === 'open' ? 'closed' : 'open'
  try {
    await updateJobStatus(j.id, next)
    j.status = next
    toast(next === 'open' ? '已上架' : '已下架')
  } catch (e) {}
}

function onDynamic(d) {
  if (d.type === 'interview') {
    uni.navigateTo({ url: '/pages/interview/index' })
  } else {
    uni.navigateTo({ url: '/pages/resume/list' })
  }
}

async function load() {
  loading.value = true
  try {
    const res = await getMyJobs({ page: 1, pageSize: 50 })
    myJobs.value = sortByDate(res.list || [])
  } catch (e) {
    myJobs.value = []
  }
  try {
    dynamics.value = await getDynamics()
  } catch (e) {
    dynamics.value = []
  }
  loading.value = false
}

onShow(load)
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

.round-btn {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  background: #eef0e9;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Hero */
.hero-card {
  position: relative;
  margin-top: 28rpx;
  min-height: 330rpx;
  border-radius: 40rpx;
  padding: 34rpx;
  overflow: hidden;
  color: #fffdf7;
  background: #263f42;

  .hero-deco {
    position: absolute;
    right: -44rpx;
    bottom: -88rpx;
    width: 346rpx;
    height: 346rpx;
    border: 36rpx solid $yellow;
    border-radius: 50%;
    opacity: 0.95;

    &::after {
      content: '';
      position: absolute;
      right: 110rpx;
      top: -70rpx;
      width: 140rpx;
      height: 140rpx;
      background: $orange;
      border-radius: 48% 52% 48% 55%;
      transform: rotate(25deg);
      box-shadow: -38rpx 64rpx 0 -8rpx $jade;
    }
  }

  .eyebrow {
    display: block;
    font-size: 18rpx;
    letter-spacing: 2rpx;
    color: #c8d4c7;
    position: relative;
    z-index: 1;
  }

  .hero-title {
    display: block;
    margin-top: 16rpx;
    font-size: 46rpx;
    font-weight: 700;
    letter-spacing: -2rpx;
    line-height: 1.3;
    max-width: 430rpx;
    position: relative;
    z-index: 1;
    white-space: pre-line;
  }

  .go {
    margin-top: 26rpx;
    display: inline-flex;
    align-items: center;
    gap: 8rpx;
    color: $yellow;
    font-size: 24rpx;
    font-weight: 700;
    position: relative;
    z-index: 1;
    padding: 8rpx 0;
  }
}

/* 工具宫格 */
.tool-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  margin-top: 8rpx;
}

.tool {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 12rpx 0;

  .tool-icon {
    width: 108rpx;
    height: 108rpx;
    border-radius: 36rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .tool-name {
    font-size: 22rpx;
    color: $ink;
    white-space: nowrap;
  }
}

/* 在招岗位列表 */
.job-list {
  margin-top: 8rpx;
}

.job-row {
  margin-top: 20rpx;

  .job-top {
    display: flex;
    align-items: center;
    gap: 20rpx;

    .logo {
      width: 76rpx;
      height: 76rpx;
      border-radius: 22rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40rpx;
      font-weight: 700;
      color: #fff;
      flex: none;
    }

    .info {
      flex: 1;
      min-width: 0;

      .title {
        display: block;
        font-size: 30rpx;
        font-weight: 700;
        line-height: 1.3;
      }

      .company {
        display: block;
        font-size: 22rpx;
        color: $muted;
        margin-top: 6rpx;
      }
    }

    .salary {
      font-size: 28rpx;
      font-weight: 700;
      color: $orange;
      white-space: nowrap;
    }
  }

  .job-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1rpx solid $line;
    margin-top: 20rpx;
    padding-top: 18rpx;

    .time {
      font-size: 22rpx;
      color: $muted;
    }

    .status-chip {
      font-size: 22rpx;
      font-weight: 600;
      padding: 8rpx 20rpx;
      border-radius: 999rpx;

      &.on {
        color: #268577;
        background: #dcefe9;
      }

      &.off {
        color: #84908e;
        background: #eff0ea;
      }
    }
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

/* 动态列表 */
.mini-list {
  border-top: 1rpx solid $line;
}

.mini-row {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 24rpx 0;
  border-bottom: 1rpx solid $line;
}

.mini-date {
  width: 74rpx;
  height: 74rpx;
  border-radius: 18rpx;
  background: #f5dcd1;
  color: $orange-dark;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 600;
  flex: none;

  &.hot {
    background: $orange;
    color: #fff;
  }
}

.mini-info {
  flex: 1;
  min-width: 0;

  .mini-title {
    display: block;
    font-size: 26rpx;
    font-weight: 600;
  }

  .mini-desc {
    display: block;
    font-size: 22rpx;
    color: $muted;
    margin-top: 4rpx;
  }
}

.bottom-space {
  height: 40rpx;
}
</style>
