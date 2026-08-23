<template>
  <view class="page">
    <!-- 我的发布列表 -->
    <template v-if="mode === 'mine'">
      <nav-bar title="我的发布" :back="true" />

      <view class="content">
        <view v-for="p in products" :key="p.id" class="product-row card">
          <view class="product-art" :class="p.art" :style="{ background: p.bg || '#d7ebe4' }" />
          <view class="info">
            <text class="name ellipsis-2">{{ p.name }}</text>
            <view class="price-row">
              <text class="price">¥ {{ p.price }}</text>
              <text class="views">{{ p.views }} 次浏览</text>
            </view>
          </view>
          <view
            class="status-chip"
            :class="p.status === 'on' ? 'on' : 'off'"
            @click="toggle(p)"
          >
            {{ p.status === 'on' ? '在售' : '已下架' }}
          </view>
        </view>

        <view v-if="!products.length">
          <empty icon="box" text="还没有发布过闲置" action-text="去发布" @action="switchPost" />
        </view>

        <view class="bottom-space" />
      </view>

      <view class="add-bar">
        <view class="add-btn" @click="switchPost">
          <z-icon name="plus" :size="20" color="#fff" weight="2.4" />
          <text>发布闲置</text>
        </view>
      </view>
    </template>

    <!-- 发布表单 -->
    <template v-else>
      <nav-bar title="发布闲置" :back="true" />

      <view class="content">
        <view class="form-card card">
          <view class="form-title">商品信息</view>

          <view class="form-item">
            <text class="label">商品名称</text>
            <input v-model="form.name" class="input" placeholder="如：九阳商用煲汤炉 60L" placeholder-class="ph" />
          </view>

          <view class="form-item">
            <text class="label">商品分类</text>
            <view class="chips">
              <view
                v-for="c in categories"
                :key="c"
                class="chip"
                :class="{ active: form.category === c }"
                @click="form.category = c"
              >
                {{ c }}
              </view>
            </view>
          </view>

          <view class="form-item">
            <text class="label">价格</text>
            <view class="price-row">
              <input v-model="form.price" class="input half" type="number" placeholder="售价" placeholder-class="ph" />
              <text class="sep">/</text>
              <input v-model="form.originPrice" class="input half" type="number" placeholder="原价(选填)" placeholder-class="ph" />
            </view>
          </view>

          <view class="form-item">
            <text class="label">商品描述</text>
            <textarea
              v-model="form.description"
              class="textarea"
              maxlength="300"
              placeholder="成色、尺寸、自提或配送..."
              placeholder-class="ph"
            />
          </view>
        </view>

        <view class="bottom-space" />
      </view>

      <view class="add-bar">
        <view class="add-btn" @click="onSubmit">
          <text>立即发布</text>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getMyProducts, createProduct, updateProductStatus } from '@/api/market'
import { toast, success } from '@/utils/feedback'

const mode = ref('post')
const categories = ['厨房设备', '桌椅餐具', '急转']

const products = ref([])
const form = reactive({
  name: '',
  category: '厨房设备',
  price: '',
  originPrice: '',
  description: '',
})

async function toggle(p) {
  const next = p.status === 'on' ? 'off' : 'on'
  try {
    await updateProductStatus(p.id, next)
    p.status = next
    toast(next === 'on' ? '已上架' : '已下架')
  } catch (e) {}
}

function switchPost() {
  mode.value = 'post'
}

async function onSubmit() {
  if (!form.name.trim()) return toast('请填写商品名称')
  if (!form.price) return toast('请填写售价')

  try {
    await createProduct({
      ...form,
      price: Number(form.price),
      originPrice: form.originPrice ? Number(form.originPrice) : 0,
      art: 'pot',
      bg: '#d7ebe4',
    })
    success('发布成功')
    setTimeout(() => uni.navigateBack(), 800)
  } catch (e) {}
}

onLoad(async (options) => {
  mode.value = options.mode === 'mine' ? 'mine' : 'post'
  if (mode.value === 'mine') {
    try {
      const res = await getMyProducts({ page: 1, pageSize: 50 })
      products.value = res.list || []
    } catch (e) {
      products.value = []
    }
  }
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

.product-row {
  margin-top: 24rpx;
  display: flex;
  gap: 20rpx;
  align-items: center;

  .product-art {
    width: 140rpx;
    height: 140rpx;
    border-radius: 24rpx;
    overflow: hidden;
    flex: none;
    position: relative;

    &.pot::before {
      content: '';
      position: absolute;
      width: 84rpx;
      height: 54rpx;
      border-radius: 10rpx 10rpx 30rpx 30rpx;
      background: #3b6865;
      left: 50%;
      top: 42rpx;
      transform: translateX(-50%);
    }

    &.mixer::before {
      content: '';
      position: absolute;
      width: 40rpx;
      height: 78rpx;
      border-radius: 6rpx 6rpx 20rpx 20rpx;
      background: #e55e39;
      left: 50%;
      top: 30rpx;
      transform: translateX(-50%);
      box-shadow: 0 -20rpx 0 3rpx #ed7250;
    }

    &.fridge::before {
      content: '';
      position: absolute;
      width: 62rpx;
      height: 96rpx;
      border-radius: 8rpx;
      background: #7890ca;
      left: 50%;
      top: 22rpx;
      transform: translateX(-50%);
    }
  }

  .info {
    flex: 1;
    min-width: 0;

    .name {
      font-size: 26rpx;
      font-weight: 600;
    }

    .price-row {
      margin-top: 12rpx;
      display: flex;
      align-items: baseline;
      gap: 12rpx;

      .price {
        font-size: 28rpx;
        font-weight: 700;
        color: $orange;
      }

      .views {
        font-size: 20rpx;
        color: $muted;
      }
    }
  }

  .status-chip {
    padding: 10rpx 22rpx;
    border-radius: 999rpx;
    font-size: 22rpx;
    flex: none;

    &.on {
      background: #dceee7;
      color: #268577;
    }

    &.off {
      background: #f0f0ea;
      color: $muted;
    }
  }
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
      flex: 1;
    }
  }

  .price-row {
    display: flex;
    align-items: center;
    gap: 16rpx;

    .sep {
      color: $muted;
    }
  }

  .chips {
    display: flex;
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
    height: 180rpx;
    background: #f3f2ec;
    border-radius: 18rpx;
    padding: 20rpx;
    font-size: 26rpx;
  }
}

.add-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 900;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background: rgba(255, 253, 247, 0.97);
  border-top: 1rpx solid $line;

  .add-btn {
    height: 96rpx;
    border-radius: 999rpx;
    background: $orange;
    color: #fff;
    font-size: 30rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
  }
}

.bottom-space {
  height: 40rpx;
}

.ph {
  color: #b3bcba;
}
</style>
