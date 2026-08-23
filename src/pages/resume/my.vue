<template>
  <view class="page">
    <nav-bar :title="title" :back="true" />

    <view class="content">
      <view class="form-card card">
        <view class="form-title">基本信息</view>

        <view class="form-item">
          <text class="label">姓名</text>
          <input v-model="form.name" class="input" placeholder="你的称呼" placeholder-class="ph" />
        </view>

        <view class="form-item">
          <text class="label">性别</text>
          <view class="chips">
            <view
              v-for="g in genderOptions"
              :key="g.value"
              class="chip"
              :class="{ active: form.gender === g.value }"
              @click="form.gender = g.value"
            >
              {{ g.label }}
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="label">联系电话</text>
          <input v-model="form.phone" class="input" type="number" maxlength="11" placeholder="方便店主联系你" placeholder-class="ph" />
        </view>

        <view class="form-item">
          <text class="label">邮箱</text>
          <input v-model="form.email" class="input" type="text" placeholder="选填" placeholder-class="ph" />
        </view>

        <view class="form-item">
          <text class="label">生日</text>
          <input v-model="form.birthday" class="input" type="text" placeholder="如：1995-06-18（选填）" placeholder-class="ph" />
        </view>

        <view class="form-item">
          <text class="label">求职意向</text>
          <input v-model="form.jobWant" class="input" placeholder="如：炒锅师傅 / 主厨" placeholder-class="ph" />
        </view>

        <view class="form-item">
          <text class="label">从业经验</text>
          <view class="row">
            <input v-model="form.years" class="input half" type="number" placeholder="年限" placeholder-class="ph" />
            <text class="unit">年</text>
          </view>
        </view>

        <view class="form-item">
          <text class="label">学历</text>
          <view class="chips">
            <view
              v-for="e in educationOptions"
              :key="e"
              class="chip"
              :class="{ active: form.education === e }"
              @click="form.education = e"
            >
              {{ e }}
            </view>
          </view>
        </view>

        <view class="form-item">
          <text class="label">毕业院校</text>
          <input v-model="form.school" class="input" placeholder="选填" placeholder-class="ph" />
        </view>

        <view class="form-item">
          <text class="label">所学专业</text>
          <input v-model="form.major" class="input" placeholder="选填" placeholder-class="ph" />
        </view>

        <view class="form-item">
          <text class="label">擅长菜系</text>
          <input v-model="form.cuisine" class="input" placeholder="如：川湘菜" placeholder-class="ph" />
        </view>

        <view class="form-item">
          <text class="label">期望薪资</text>
          <view class="salary-row">
            <input v-model="form.salary" class="input" placeholder="如：8-12K" placeholder-class="ph" />
          </view>
        </view>

        <view class="form-item">
          <text class="label">所在区域</text>
          <input v-model="form.location" class="input" placeholder="如：广州 · 海珠区" placeholder-class="ph" />
        </view>
      </view>

      <!-- 技能标签 -->
      <view class="form-card card">
        <view class="form-title">技能标签</view>
        <view class="chips wrap">
          <view
            v-for="t in skillOptions"
            :key="t"
            class="chip"
            :class="{ active: form.tags.includes(t) }"
            @click="toggleTag(t)"
          >
            {{ t }}
          </view>
        </view>
      </view>

      <!-- 工作经历 -->
      <view class="form-card card">
        <view class="form-title">工作经历</view>
        <textarea
          v-model="form.experience"
          class="textarea"
          maxlength="500"
          placeholder="简单写写你的工作经历，如：曾在连锁湘菜馆任炒锅 3 年..."
          placeholder-class="ph"
        />
      </view>

      <!-- 自我介绍 -->
      <view class="form-card card">
        <view class="form-title">自我介绍</view>
        <textarea
          v-model="form.intro"
          class="textarea"
          maxlength="300"
          placeholder="简单介绍下你的经验和优势..."
          placeholder-class="ph"
        />
      </view>

      <view class="bottom-space" />
    </view>

    <view class="submit-bar">
      <view class="submit-btn" @click="onSave">保存简历</view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getMyResume, updateMyResume, createResume } from '@/api/resume'
import { toast, success } from '@/utils/feedback'

const skillOptions = ['川菜', '湘菜', '粤菜', '面点', '烧烤', '连锁后厨', '带团队', '颠锅爆炒', '摆盘', '成本控制']
const genderOptions = [
  { label: '男', value: 1 },
  { label: '女', value: 2 },
]
const educationOptions = ['初中及以下', '高中/中专', '大专', '本科', '硕士及以上']

const title = ref('我的简历')

const form = reactive({
  name: '',
  gender: '',
  phone: '',
  email: '',
  birthday: '',
  jobWant: '',
  years: '',
  education: '',
  school: '',
  major: '',
  cuisine: '',
  salary: '',
  location: '',
  tags: [],
  experience: '',
  intro: '',
})

let hasResume = false
let resumeId = null

function toggleTag(t) {
  const idx = form.tags.indexOf(t)
  if (idx >= 0) {
    form.tags.splice(idx, 1)
  } else if (form.tags.length < 5) {
    form.tags.push(t)
  } else {
    toast('最多选择 5 个标签')
  }
}

async function onSave() {
  if (!form.name.trim()) return toast('请填写姓名')
  if (!form.jobWant.trim()) return toast('请填写求职意向')
  if (form.phone && !/^1\d{10}$/.test(form.phone)) return toast('请输入正确的手机号')

  try {
    if (hasResume) {
      await updateMyResume(resumeId, { ...form })
    } else {
      await createResume({ ...form })
    }
    success('已保存')
    setTimeout(() => uni.navigateBack(), 800)
  } catch (e) {}
}

onLoad(async (options) => {
  if (options && options.from === 'jobseek') {
    title.value = '发布求职'
  }
  try {
    const resume = await getMyResume()
    if (resume && resume.id) {
      hasResume = true
      resumeId = resume.id
      Object.assign(form, {
        name: resume.name || '',
        gender: resume.gender ?? '',
        phone: resume.phone || '',
        email: resume.email || '',
        birthday: resume.birthday || '',
        jobWant: resume.jobWant || '',
        years: resume.years || '',
        education: resume.education || '',
        school: resume.school || '',
        major: resume.major || '',
        cuisine: resume.cuisine || '',
        salary: resume.salary || '',
        location: resume.location || '',
        tags: resume.tags || [],
        experience: resume.experience || '',
        intro: resume.intro || '',
      })
    }
  } catch (e) {}
})
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
    margin-bottom: 16rpx;
  }
}

.form-item {
  padding: 16rpx 0;

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
      width: 200rpx;
    }
  }

  .row {
    display: flex;
    align-items: center;
    gap: 14rpx;

    .unit {
      color: $muted;
      font-size: 24rpx;
    }
  }

  .salary-row {
    display: flex;
  }
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 14rpx;

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
  height: 200rpx;
  background: #f3f2ec;
  border-radius: 18rpx;
  padding: 20rpx;
  font-size: 26rpx;
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
