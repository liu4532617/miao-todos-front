<template>
  <view class="page">
    <nav-bar :title="'灶台帮'">
      <template #right>
        <view class="round-btn" @click="onBell">
          <z-icon name="bell" :size="18" color="#17292c" />
        </view>
      </template>
    </nav-bar>

    <view class="content">
      <!-- 品牌区 -->
      <view class="hero-card">
        <view class="bh-post" @click="goPostResume">🙋 发求职卡</view>
        <text class="hero-title">把求职卡发出去，\n让老板直接找你。</text>
        <view class="bh-stats">
          <view class="bh-stat">
            <text class="num">{{ stats.resumes }}</text>
            <text class="lab">附近求职者</text>
          </view>
          <view class="bh-stat">
            <text class="num">{{ stats.hiredToday }}</text>
            <text class="lab">今日上工</text>
          </view>
        </view>
      </view>

      <!-- 功能入口 -->
      <view class="act-grid">
        <view class="act" @click="goPostResume">
          <text class="ai">🙋</text>
          <text class="at">发求职卡</text>
          <text class="as">让老板找你</text>
        </view>
        <view class="act primary" @click="goJobList">
          <text class="ai">🔍</text>
          <text class="at">找工作</text>
          <text class="as">附近岗位</text>
        </view>
        <view class="act" @click="goPostJob">
          <text class="ai">📢</text>
          <text class="at">发岗位</text>
          <text class="as">老板</text>
        </view>
        <view class="act" @click="goSeekList">
          <text class="ai">🧑‍🍳</text>
          <text class="at">找人才</text>
          <text class="as">求职卡</text>
        </view>
      </view>

      <search-bar placeholder="搜工种、技能或区域" @click="goSearch" />

      <!-- 我的求职卡 -->
      <view class="section-title">
        <text class="title">我的求职卡</text>
        <text class="more" @click="goPostResume">编辑 ›</text>
      </view>

      <view v-if="resume" class="seek-card mine card" @click="goPostResume">
        <view class="sk-avatar" :style="{ background: resume.avatar ? 'transparent' : '#ef5a2a' }">
          <image v-if="resume.avatar" class="sk-avatar-img" :src="resume.avatar" mode="aspectFill" />
          <text v-else>{{ (resume.name || '我')[0] }}</text>
        </view>
        <view class="sk-body">
          <view class="sk-top">
            <text class="sk-name">{{ resume.name || '我' }} · {{ resume.jobWant || '求职中' }}</text>
            <view class="status-chip">发布中</view>
          </view>
          <text class="sk-line">{{ resume.salary || '薪资面议' }} · {{ resume.location || '' }} · {{ resume.availableTime || '随时到岗' }}</text>
          <view class="sk-tags">
            <text v-if="resume.needAccommodation" class="tag">需包吃住</text>
            <text v-if="resume.contactVisibility === 'PUBLIC'" class="tag blue">📞 电话公开</text>
            <text v-else-if="resume.contactVisibility === 'PRIVATE'" class="tag lock">🔒 私密</text>
            <text v-else class="tag">💬 聊后解锁</text>
          </view>
        </view>
      </view>
      <view v-if="!loading && !resume" class="empty-wrap">
        <empty
          icon="compass"
          text="还没有发布求职卡"
          subText="发布后，老板能在列表里直接找到你"
          action-text="去发布"
          @action="goPostResume"
        />
      </view>

      <!-- 求职卡片广场 -->
      <view class="section-title">
        <text class="title">求职卡片广场</text>
        <text class="more">附近 · 最新 ›</text>
      </view>
      <view v-if="seekCards.length" class="seek-list">
        <view v-for="s in seekCards" :key="s.id" class="seek-card card" @click="goSeekDetail(s)">
          <view class="sk-avatar" :style="{ background: s.avatar ? 'transparent' : '#f3eee2' }">
            <image v-if="s.avatar" class="sk-avatar-img" :src="s.avatar" mode="aspectFill" />
            <text v-else>{{ (s.name || 'TA')[0] }}</text>
          </view>
          <view class="sk-body">
            <view class="sk-top">
              <text class="sk-name">{{ s.name || '匿名' }} · {{ s.jobWant || s.title || '求职中' }}</text>
              <text class="sk-go">聊 ›</text>
            </view>
            <text class="sk-line">{{ s.workYears || '' }} {{ s.salary || '' }} · {{ s.availableTime || '随时到岗' }}</text>
            <view class="sk-tags">
              <text v-if="s.needAccommodation" class="tag">需包吃住</text>
              <text v-if="s.contactVisibility === 'PUBLIC'" class="tag blue">📞 电话公开</text>
              <text v-else-if="s.contactVisibility === 'PRIVATE'" class="tag lock">🔒 私密</text>
              <text v-else class="tag">💬 聊后解锁</text>
            </view>
          </view>
        </view>
      </view>
      <view v-else-if="!loading" class="empty-wrap">
        <empty icon="compass" text="还没有求职卡" subText="发布第一张求职卡，让老板找到你" />
      </view>

      <view v-if="loading" class="loading-wrap">
        <text class="loading-text">加载中...</text>
      </view>
      <view class="bottom-space" />
    </view>

    <!-- 悬浮发布 -->
    <view class="float-add" @click="goPostResume">
      <z-icon name="plus" :size="24" color="#fff" weight="2.4" />
    </view>

    <tab-bar :current="1" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getMyResume } from '@/api/resume'
import { getSeekCards } from '@/api/resume'
import { getStatistics } from '@/api/message'
import { toast } from '@/utils/feedback'

const resume = ref(null)
const seekCards = ref([])
const stats = ref({ resumes: 0, hiredToday: 0 })
const loading = ref(false)

function onBell() {
  toast('求职订阅已开启')
}

function goPostResume() {
  uni.navigateTo({ url: '/pages/resume/my?from=jobseek' })
}

function goPostJob() {
  uni.navigateTo({ url: '/pages/job/post' })
}

function goJobList() {
  uni.navigateTo({ url: '/pages/search/index' })
}

function goSeekList() {
  uni.navigateTo({ url: '/pages/resume/list' })
}

function goSearch() {
  uni.navigateTo({ url: '/pages/search/index' })
}

function goSeekDetail(s) {
  uni.navigateTo({ url: `/pages/resume/detail?id=${s.id}` })
}

async function load() {
  loading.value = true
  try {
    resume.value = await getMyResume()
  } catch (e) {
    resume.value = null
  }
  try {
    seekCards.value = await getSeekCards()
  } catch (e) {
    seekCards.value = []
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

/* 品牌区 */
.hero-card {
  position: relative;
  margin-top: 28rpx;
  border-radius: 40rpx;
  padding: 36rpx 34rpx 28rpx;
  overflow: hidden;
  color: #fffdf7;
  background: linear-gradient(135deg, #2e6fb7, #5a9ce8);

  .bh-post {
    position: absolute;
    right: 28rpx;
    top: 28rpx;
    background: #fff;
    color: #2e6fb7;
    font-size: 22rpx;
    font-weight: 800;
    border-radius: 999rpx;
    padding: 10rpx 24rpx;
  }

  .hero-title {
    display: block;
    font-size: 44rpx;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: -2rpx;
    white-space: pre-line;
    max-width: 480rpx;
  }

  .bh-stats {
    display: flex;
    gap: 48rpx;
    margin-top: 26rpx;

    .bh-stat {
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
      background: #2e6fb7;
      border-color: #2e6fb7;

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

/* 求职卡 */
.seek-card {
  display: flex;
  gap: 20rpx;
  align-items: center;
  margin-top: 20rpx;
  padding: 24rpx;

  &.mine {
    border-style: dashed;
  }

  .sk-avatar {
    width: 88rpx;
    height: 88rpx;
    border-radius: 26rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    font-weight: 700;
    color: #fff;
    flex: none;
    overflow: hidden;

    .sk-avatar-img {
      width: 100%;
      height: 100%;
    }
  }

  .sk-body {
    flex: 1;
    min-width: 0;

    .sk-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12rpx;

      .sk-name {
        font-size: 28rpx;
        font-weight: 700;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .sk-go {
        font-size: 22rpx;
        font-weight: 700;
        color: $orange;
        flex: none;
      }
    }

    .sk-line {
      display: block;
      font-size: 22rpx;
      color: $muted;
      margin-top: 6rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .sk-tags {
      display: flex;
      gap: 8rpx;
      margin-top: 10rpx;
      flex-wrap: wrap;

      .tag {
        font-size: 18rpx;
        font-weight: 600;
        border-radius: 8rpx;
        padding: 4rpx 12rpx;
        background: #fff4ec;
        color: #c0561e;

        &.blue {
          background: #eaf2fb;
          color: #2c6cb0;
        }

        &.lock {
          background: #f3f0e8;
          color: #7d776a;
        }
      }
    }
  }
}

.status-chip {
  font-size: 20rpx;
  color: #268577;
  background: #dcefe9;
  padding: 4rpx 14rpx;
  border-radius: 999rpx;
  flex: none;
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
