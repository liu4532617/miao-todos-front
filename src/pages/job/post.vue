<template>
  <view class="page">
    <nav-bar title="发布岗位" :back="true" />

    <view class="content">
      <!-- 基础信息 -->
      <view class="form-card card">
        <view class="form-title">基础信息</view>

        <view class="form-item">
          <text class="label">岗位名称</text>
          <input v-model="form.title" class="input" placeholder="如：炒锅师傅" placeholder-class="ph" />
        </view>

        <view class="form-item">
          <text class="label">所在门店</text>
          <input v-model="form.restaurant" class="input" placeholder="如：湘里湘亲 · 江南西店" placeholder-class="ph" />
        </view>

        <view class="form-item">
          <text class="label">月薪范围</text>
          <view class="salary-row">
            <input v-model="form.salaryMin" class="input half" type="number" placeholder="最低" placeholder-class="ph" />
            <text class="sep">—</text>
            <input v-model="form.salaryMax" class="input half" type="number" placeholder="最高" placeholder-class="ph" />
            <text class="unit">元</text>
          </view>
        </view>

        <view class="form-item">
          <text class="label">工作性质</text>
          <view class="chips">
            <view
              v-for="t in ['全职', '兼职/钟点']"
              :key="t"
              class="chip"
              :class="{ active: form.type === t }"
              @click="form.type = t"
            >
              {{ t }}
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="label">经验要求</text>
          <view class="chips">
            <view
              v-for="t in ['经验不限', '1-3年', '3-5年', '5-10年']"
              :key="t"
              class="chip"
              :class="{ active: form.experience === t }"
              @click="form.experience = t"
            >
              {{ t }}
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="label">招聘人数</text>
          <view class="stepper">
            <view class="step-btn" @click="changeCount(-1)">−</view>
            <text class="count">{{ form.headcount }}</text>
            <view class="step-btn" @click="changeCount(1)">+</view>
          </view>
        </view>
      </view>

      <!-- 福利标签 -->
      <view class="form-card card">
        <view class="form-title">福利标签（选填，最多 4 个）</view>
        <view class="chips wrap">
          <view
            v-for="t in welfareOptions"
            :key="t"
            class="chip"
            :class="{ active: form.tags.includes(t) }"
            @click="toggleTag(t)"
          >
            {{ t }}
          </view>
        </view>
      </view>

      <!-- 描述 -->
      <view class="form-card card">
        <view class="form-title">岗位描述</view>
        <textarea
          v-model="form.description"
          class="textarea"
          maxlength="500"
          placeholder="介绍一下岗位职责、要求、福利待遇..."
          placeholder-class="ph"
        />
        <text class="count-tip">{{ form.description.length }}/500</text>
      </view>

      <view class="bottom-space" />
    </view>

    <view class="submit-bar">
      <view class="submit-btn" @click="onSubmit">发布岗位</view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { createJob } from '@/api/job'
import { toast, success } from '@/utils/feedback'

const welfareOptions = ['包吃', '包住', '包吃住', '月休4天', '五险', '绩效奖金', '带团队', '晋升快', '夜班补贴', '提成']

const form = reactive({
  title: '',
  restaurant: '',
  salaryMin: '',
  salaryMax: '',
  type: '全职',
  experience: '经验不限',
  headcount: 1,
  tags: [],
  description: '',
})

function changeCount(delta) {
  form.headcount = Math.max(1, Math.min(50, form.headcount + delta))
}

function toggleTag(t) {
  const idx = form.tags.indexOf(t)
  if (idx >= 0) {
    form.tags.splice(idx, 1)
  } else if (form.tags.length < 4) {
    form.tags.push(t)
  } else {
    toast('最多选择 4 个标签')
  }
}

async function onSubmit() {
  if (!form.title.trim()) return toast('请填写岗位名称')
  if (!form.restaurant.trim()) return toast('请填写所在门店')
  if (!form.salaryMin || !form.salaryMax) return toast('请填写薪资范围')

  try {
    await createJob({
      ...form,
      salary: `${form.salaryMin}–${form.salaryMax}K`,
      salaryMin: Number(form.salaryMin) * 1000,
      salaryMax: Number(form.salaryMax) * 1000,
    })
    success('发布成功')
    setTimeout(() => uni.navigateBack(), 800)
  } catch (e) {}
}
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

.form-card {
  margin-top: 24rpx;
  padding: 28rpx;

  .form-title {
    font-size: 28rpx;
    font-weight: 700;
    margin-bottom: 20rpx;
  }
}

.form-item {
  padding: 18rpx 0;

  .label {
    display: block;
    font-size: 24rpx;
    color: $muted;
    margin-bottom: 12rpx;
  }

  .input {
    height: 76rpx;
    background: #f3f2ec;
    border-radius: 18rpx;
    padding: 0 24rpx;
    font-size: 26rpx;

    &.half {
      flex: 1;
      width: auto;
    }
  }

  .salary-row {
    display: flex;
    align-items: center;
    gap: 16rpx;

    .sep {
      color: $muted;
    }

    .unit {
      color: $muted;
      font-size: 24rpx;
    }
  }

  .stepper {
    display: flex;
    align-items: center;
    gap: 28rpx;

    .step-btn {
      width: 64rpx;
      height: 64rpx;
      border-radius: 18rpx;
      background: #f3f2ec;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36rpx;
      color: $ink;
    }

    .count {
      font-size: 30rpx;
      font-weight: 700;
      min-width: 48rpx;
      text-align: center;
    }
  }
}

.chips {
  display: flex;
  gap: 14rpx;

  &.wrap {
    flex-wrap: wrap;
  }

  .chip {
    padding: 12rpx 24rpx;
    border-radius: 999rpx;
    background: #f3f2ec;
    color: #5c6c6e;
    font-size: 24rpx;

    &.active {
      background: $ink;
      color: #fff;
    }
  }
}

.textarea {
  width: 100%;
  height: 220rpx;
  background: #f3f2ec;
  border-radius: 18rpx;
  padding: 20rpx;
  font-size: 26rpx;
}

.count-tip {
  display: block;
  text-align: right;
  font-size: 20rpx;
  color: #a7b1b0;
  margin-top: 8rpx;
}

.submit-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: rgba(255, 253, 247, 0.97);
  border-top: 1rpx solid $line;

  .submit-btn {
    height: 96rpx;
    border-radius: 999rpx;
    background: $orange;
    color: #fff;
    font-size: 32rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 12rpx 28rpx rgba(239, 90, 42, 0.3);
  }
}

.ph {
  color: #b3bcba;
}
</style>
