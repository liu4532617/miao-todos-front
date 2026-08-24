<template>
  <view class="page">
    <!-- 导航栏 -->
    <nav-bar :title="'灶台招工'">
      <template #right>
        <view class="loc-chip" @click="toast('区域切换开发中')">📍 城东 ▾</view>
      </template>
    </nav-bar>

    <view class="content">
      <!-- 品牌区:slogan + 实时数字 -->
      <view class="brand-hero">
        <view class="bh-post" @click="goPostJob">📢 发岗位</view>
        <text class="bh-slogan">招对一个人，\n后厨就顺一整天。</text>
        <view class="bh-stats">
          <view class="bh-stat">
            <text class="num">{{ stats.jobs }}</text>
            <text class="lab">今日在招</text>
          </view>
          <view class="bh-stat">
            <text class="num">{{ stats.companies }}</text>
            <text class="lab">附近门店</text>
          </view>
          <view class="bh-stat">
            <text class="num">{{ stats.hiredToday }}</text>
            <text class="lab">今日招到</text>
          </view>
          <view class="bh-stat">
            <text class="num">{{ stats.trialsToday }}</text>
            <text class="lab">今日试工</text>
          </view>
        </view>
      </view>

      <!-- 功能入口(不再二选一身份,四个动作随时用) -->
      <view class="act-grid">
        <view class="act primary" @click="goPostJob">
          <text class="ai">📢</text>
          <text class="at">发岗位</text>
          <text class="as">老板</text>
        </view>
        <view class="act" @click="goPostResume">
          <text class="ai">🙋</text>
          <text class="at">发求职卡</text>
          <text class="as">找活</text>
        </view>
        <view class="act" @click="goSearch">
          <text class="ai">🔍</text>
          <text class="at">找工作</text>
          <text class="as">岗位</text>
        </view>
        <view class="act" @click="goResumeList">
          <text class="ai">🧑‍🍳</text>
          <text class="at">找人才</text>
          <text class="as">求职卡</text>
        </view>
      </view>

      <search-bar placeholder="搜岗位、人才或餐厅" @click="goSearch" />

      <!-- 在招岗位（我发布的岗位） -->
      <view class="section-title">
        <text class="title">在招岗位</text>
        <text class="more" @click="goPostJob">发布新岗位 ›</text>
      </view>

      <view v-if="myJobs.length" class="job-list">
        <view v-for="j in myJobs" :key="j.id" class="job-row card" @click="goJobDetail(j)">
          <view class="job-top">
            <view class="logo" :style="{ background: j.logoColor || '#e65a37' }">
              <text>{{ j.logoText || (j.title || '岗')[0] }}</text>
            </view>
            <view class="info">
              <text class="title ellipsis">{{ j.title }}</text>
              <text class="company ellipsis">{{ j.restaurant }}</text>
              <view class="tag-row">
                <text v-if="j.contactVisibility === 'PUBLIC'" class="tag blue">📞 电话公开</text>
                <text v-else-if="j.contactVisibility === 'PRIVATE'" class="tag lock">🔒 私密</text>
                <text v-else class="tag">💬 聊后解锁</text>
              </view>
            </view>
            <text class="salary">{{ j.salary }}</text>
          </view>
          <view class="job-foot">
            <text class="time">发布于 {{ j.createdAt }}</text>
            <view
              class="status-chip"
              :class="j.status === 'open' ? 'on' : j.status === 'hired' ? 'hired' : 'off'"
              @click.stop="toggleJob(j)"
            >
              {{ j.status === 'open' ? '招聘中' : j.status === 'hired' ? '已招到 ✓' : '已下架' }}
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
import { getDynamics, getStatistics } from '@/api/message'
import { getMyJobs, updateJobStatus } from '@/api/job'
import { toast } from '@/utils/feedback'

const stats = ref({ jobs: 0, companies: 0, hiredToday: 0, trialsToday: 0 })
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

function goPostResume() {
  uni.navigateTo({ url: '/pages/resume/my' })
}

function goResumeList() {
  uni.navigateTo({ url: '/pages/resume/list' })
}

function goJobDetail(j) {
  uni.navigateTo({ url: `/pages/jobs/detail?id=${j.id}` })
}

async function toggleJob(j) {
  // 已招到 → 重新招聘(上架);招聘中 → 标记已招到;已下架 → 上架
  let next
  if (j.status === 'hired') {
    next = 'open'
  } else if (j.status === 'open') {
    next = 'hired'
  } else {
    next = 'open'
  }
  try {
    await updateJobStatus(j.id, next === 'hired' ? 2 : next === 'open' ? 1 : 0)
    j.status = next
    toast(next === 'hired' ? '已标记招到 ✓' : next === 'open' ? '已上架' : '已下架')
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
  try {
    stats.value = await getStatistics()
  } catch (e) {}
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

.loc-chip {
  font-size: 22rpx;
  color: $muted;
  background: #eef0e9;
  border-radius: 999rpx;
  padding: 8rpx 20rpx;
}

/* 品牌区 */
.brand-hero {
  position: relative;
  margin-top: 28rpx;
  border-radius: 40rpx;
  padding: 36rpx 34rpx 30rpx;
  overflow: hidden;
  color: #fffdf7;
  background: linear-gradient(135deg, #e65a2a, #f0863f);

  .bh-post {
    position: absolute;
    right: 28rpx;
    top: 28rpx;
    background: #fff;
    color: $orange;
    font-size: 22rpx;
    font-weight: 800;
    border-radius: 999rpx;
    padding: 10rpx 24rpx;
  }

  .bh-slogan {
    display: block;
    font-size: 44rpx;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: -2rpx;
    white-space: pre-line;
  }

  .bh-stats {
    display: flex;
    gap: 0;
    margin-top: 28rpx;

    .bh-stat {
      flex: 1;
      display: flex;
      flex-direction: column;

      .num {
        font-size: 36rpx;
        font-weight: 800;
      }

      .lab {
        font-size: 20rpx;
        opacity: 0.85;
        margin-top: 2rpx;
      }
    }
  }
}

/* 功能入口 */
.act-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
  margin-top: 24rpx;

  .act {
    background: #fff;
    border: 1rpx solid $line;
    border-radius: 24rpx;
    padding: 20rpx 0 16rpx;
    display: flex;
    flex-direction: column;
    align-items: center;

    .ai {
      font-size: 36rpx;
    }

    .at {
      font-size: 24rpx;
      font-weight: 700;
      color: $ink;
      margin-top: 6rpx;
    }

    .as {
      font-size: 18rpx;
      color: $muted;
      margin-top: 2rpx;
    }

    &.primary {
      background: $orange;
      border-color: $orange;

      .at,
      .as {
        color: #fff;
      }
    }
  }
}

/* 区块标题 */
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 36rpx 0 16rpx;

  .title {
    font-size: 32rpx;
    font-weight: 800;
  }

  .more {
    font-size: 22rpx;
    color: $muted;
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

      .tag-row {
        display: flex;
        gap: 8rpx;
        margin-top: 8rpx;

        .tag {
          font-size: 18rpx;
          font-weight: 600;
          border-radius: 8rpx;
          padding: 4rpx 12rpx;

          &.blue {
            background: #eaf2fb;
            color: #2c6cb0;
          }

          &.lock {
            background: #f3f0e8;
            color: #7d776a;
          }

          &:not(.blue):not(.lock) {
            background: #fff4ec;
            color: #c0561e;
          }
        }
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

      &.hired {
        color: #fff;
        background: $orange;
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
