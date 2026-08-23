<script>
export default {
  onLaunch() {
    console.log('[miao-todos-front] App Launch')
  },
  onShow() {
    console.log('[miao-todos-front] App Show')
  },
  onHide() {
    console.log('[miao-todos-front] App Hide')
  },
}
</script>

<style lang="scss">
/* 每个页面公共 css */
page {
  background-color: $paper;
  color: $ink;
  font-family: 'Noto Sans SC', 'PingFang SC', 'Helvetica Neue', system-ui, sans-serif;
  font-size: 28rpx;
  line-height: 1.6;
}

view,
text,
image,
button,
input,
textarea,
scroll-view {
  box-sizing: border-box;
}

button {
  padding: 0;
  margin: 0;
  line-height: inherit;
  background: transparent;

  &::after {
    border: none;
  }
}

/* 通用工具类 */
.flex {
  display: flex;
  align-items: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.card {
  background: #fff;
  border: 1rpx solid $line;
  border-radius: $radius-lg;
  padding: 24rpx;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 32rpx 32rpx 20rpx;

  .title {
    font-size: 32rpx;
    font-weight: 700;
    letter-spacing: -0.5rpx;
  }

  .more {
    font-size: 24rpx;
    color: $muted;
  }
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 6rpx 14rpx;
  font-size: 22rpx;
  color: #6b7878;
  background: #f2f2ec;
  border-radius: 10rpx;
}
</style>
