<template>
  <view class="page">
    <!-- 导航栏 -->
    <nav-bar :title="'厨神帮'">
      <template #right>
        <view class="round-btn" @click="toast('消息中心暂未开启')">
          <z-icon name="bell" :size="18" color="#17292c" />
        </view>
      </template>
    </nav-bar>

    <view class="content">
      <!-- 搜索条 -->
      <view class="search" @click="goSearch">
        <z-icon name="search" :size="17" color="#8a9492" />
        <text>搜岗位、人才或餐厅</text>
      </view>

      <!-- 品牌 hero -->
      <view class="hero-card">
        <view class="eyebrow">TODAY'S HIRING NOTE</view>
        <text class="hero-title">招对一个人，\n后厨就顺一整天。</text>
        <view class="go" @click="goPostJob">
          <text>发布招聘</text>
          <z-icon name="arrow-right" :size="13" color="#ffd35c" />
        </view>
      </view>

      <!-- 今日统计 -->
      <view class="stats-row">
        <view class="stat">
          <text class="num">{{ stats.jobs }}</text>
          <text class="lab">今日在招</text>
        </view>
        <view class="stat">
          <text class="num">{{ stats.companies }}</text>
          <text class="lab">附近门店</text>
        </view>
        <view class="stat">
          <text class="num">{{ stats.hiredToday }}</text>
          <text class="lab">今日招到</text>
        </view>
        <view class="stat">
          <text class="num">{{ stats.trialsToday }}</text>
          <text class="lab">今日试工</text>
        </view>
      </view>

      <!-- 功能入口 -->
      <view class="section-title">
        <text class="title">招聘管理</text>
        <text class="sub">把招人这件事理清楚</text>
      </view>
      <view class="tool-grid">
        <view class="tool" @click="goPostJob">
          <view class="tool-icon t1"><z-icon name="briefcase" :size="24" color="#d94b23" /></view>
          <text>发布岗位</text>
        </view>
        <view class="tool" @click="goPostResume">
          <view class="tool-icon t2"><z-icon name="document-text" :size="24" color="#bf8714" /></view>
          <text>发求职卡</text>
        </view>
        <view class="tool" @click="goSearch">
          <view class="tool-icon t3"><z-icon name="search" :size="24" color="#268577" /></view>
          <text>找工作</text>
        </view>
        <view class="tool" @click="goResumeList">
          <view class="tool-icon t4"><z-icon name="user" :size="24" color="#506fb5" /></view>
          <text>找人才</text>
        </view>
      </view>

      <!-- 在招岗位（我发布的岗位） -->
      <view class="section-title">
        <text class="title">在招岗位</text>
        <text class="more" @click="goPostJob">发布新岗位 ›</text>
      </view>

      <view v-if="myJobs.length" class="job-list">
        <view v-for="j in myJobs" :key="j.id" class="job-row" @click="goJobDetail(j)">
          <view class="job-top">
            <view class="logo" :class="(j.logoColor || '#e65a37') === '#e65a37' ? 'red' : (j.logoColor || '') === '#329987' ? 'green' : ''" :style="j.logoColor && j.logoColor !== '#e65a37' && j.logoColor !== '#329987' ? { background: j.logoColor } : {}">
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
/* ===== 厨神帮 · 招聘首页(视觉对齐 2026-08 原型 HTML) ===== */
.page {
  min-height: 100vh;
  background: #fffdf7;
  color: #17292c;
}
.content {
  padding: 0 0 24rpx;
}

/* 顶部圆形按钮 */
.round-btn {
  width: 70rpx;
  height: 70rpx;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: $wash;
}

/* 搜索条 */
.search {
  margin: 20rpx 40rpx 0;
  height: 84rpx;
  border-radius: 28rpx;
  background: $wash;
  display: flex;
  align-items: center;
  gap: 18rpx;
  color: #8a9492;
  font-size: 24rpx;
  padding: 0 26rpx;
  box-sizing: border-box;
}

/* hero 卡(深绿 + 黄圆 + 橙色装饰) */
.hero-card {
  position: relative;
  margin: 26rpx 40rpx 0;
  min-height: 320rpx;
  border-radius: 44rpx;
  padding: 36rpx 36rpx 40rpx;
  overflow: hidden;
  color: #fffdf7;
  background: #263f42;
  box-sizing: border-box;
}
.hero-card::before {
  content: '';
  position: absolute;
  right: -60rpx;
  bottom: -90rpx;
  width: 330rpx;
  height: 330rpx;
  border: 34rpx solid #ffd35c;
  border-radius: 50%;
  opacity: 0.95;
}
.hero-card::after {
  content: '';
  position: absolute;
  right: 66rpx;
  top: 40rpx;
  width: 130rpx;
  height: 130rpx;
  background: #ef5a2a;
  border-radius: 48% 52% 48% 55%;
  transform: rotate(25deg);
  box-shadow: -36rpx 60rpx 0 -8rpx #41a899;
}
.eyebrow {
  font-size: 20rpx;
  color: #c8d4c7;
  letter-spacing: 0.1em;
  position: relative;
  z-index: 1;
}
.hero-title {
  display: block;
  font-size: 48rpx;
  font-weight: 800;
  letter-spacing: -0.08em;
  line-height: 1.28;
  margin: 18rpx 0 26rpx;
  max-width: 420rpx;
  position: relative;
  z-index: 1;
}
.hero-card .go {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #ffd35c;
  font-size: 24rpx;
  font-weight: 700;
  position: relative;
  z-index: 1;
}

/* 今日统计条 */
.stats-row {
  margin: 24rpx 40rpx 0;
  display: flex;
  background: $wash;
  border-radius: 26rpx;
  padding: 22rpx 0;
}
.stats-row .stat {
  flex: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}
.stats-row .num {
  font-size: 34rpx;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: #17292c;
}
.stats-row .lab {
  font-size: 20rpx;
  color: #718083;
}

/* 区块标题 */
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 40rpx 40rpx 22rpx;
}
.section-title .title {
  font-size: 30rpx;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #17292c;
}
.section-title .sub {
  font-size: 22rpx;
  color: #718083;
}
.section-title .more {
  font-size: 22rpx;
  color: #718083;
}

/* 功能入口 4 宫格 */
.tool-grid {
  padding: 0 40rpx;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}
.tool {
  text-align: center;
  color: #17292c;
  font-size: 20rpx;
  white-space: nowrap;
}
.tool .tool-icon {
  margin: 0 auto 12rpx;
  display: grid;
  place-items: center;
  width: 108rpx;
  height: 108rpx;
  border-radius: 36rpx;
}
.tool .t1 { background: $orange-wash; }
.tool .t2 { background: $yellow-wash; }
.tool .t3 { background: $jade-wash; }
.tool .t4 { background: $blue-wash; }

/* 在招岗位卡片 */
.job-list {
  margin: 0 40rpx;
}
.job-row {
  background: #fff;
  border: 1px solid #e7e5dc;
  border-radius: 32rpx;
  padding: 28rpx;
  margin-bottom: 24rpx;
}
.job-top {
  display: flex;
  gap: 20rpx;
  align-items: flex-start;
}
.logo {
  width: 76rpx;
  height: 76rpx;
  border-radius: 22rpx;
  display: grid;
  place-items: center;
  font-size: 36rpx;
  font-weight: 700;
  color: #fff;
  flex: none;
}
.logo.red { background: #e65a37; }
.logo.green { background: #329987; }
.info { flex: 1; min-width: 0; }
.info .title {
  display: block;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1.2;
}
.info .company {
  display: block;
  font-size: 20rpx;
  color: #718083;
  margin-top: 8rpx;
}
.tag-row {
  display: flex;
  gap: 10rpx;
  margin-top: 14rpx;
  flex-wrap: wrap;
}
.tag {
  font-size: 18rpx;
  background: $wash;
  color: #6b7878;
  padding: 6rpx 12rpx;
  border-radius: 10rpx;
}
.tag.blue { color: #3d62b0; }
.tag.lock { color: #a05e2c; }
.salary {
  font-size: 26rpx;
  font-weight: 700;
  color: #ef5a2a;
  white-space: nowrap;
  font-family: 'Courier New', monospace;
}
.job-foot {
  border-top: 1px solid #e7e5dc;
  margin-top: 18rpx;
  padding-top: 18rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #718083;
  font-size: 20rpx;
}
.status-chip {
  font-size: 20rpx;
  padding: 6rpx 18rpx;
  border-radius: 999rpx;
  background: $wash;
  color: #6b7878;
}
.status-chip.on { background: $jade-wash; color: #268577; }
.status-chip.hired { background: $orange-wash; color: #d94b23; }
.status-chip.off { background: $wash; color: #9aa3a1; }

/* 招聘动态 */
.mini-list {
  margin: 0 40rpx;
  border-top: 1px solid #e7e5dc;
}
.mini-row {
  display: flex;
  align-items: center;
  gap: 22rpx;
  padding: 24rpx 0;
  border-bottom: 1px solid #e7e5dc;
}
.mini-date {
  border-radius: 18rpx;
  min-width: 74rpx;
  height: 74rpx;
  background: #f5dcd1;
  color: #ce421d;
  display: grid;
  place-items: center;
  font-size: 22rpx;
  font-weight: 500;
  font-family: 'Courier New', monospace;
  text-align: center;
  line-height: 1.15;
  padding: 6rpx 0;
  box-sizing: border-box;
  flex: none;
}
.mini-date.hot { background: #263f42; color: #ffd35c; }
.mini-info { flex: 1; min-width: 0; }
.mini-title {
  display: block;
  font-size: 24rpx;
  font-weight: 700;
}
.mini-desc {
  display: block;
  font-size: 20rpx;
  color: #718083;
  margin-top: 4rpx;
}

.empty-wrap { padding: 40rpx 0; }
.loading-wrap { padding: 40rpx 0; text-align: center; }
.loading-text { font-size: 22rpx; color: #8a9492; }
.bottom-space { height: 30rpx; }
</style>
