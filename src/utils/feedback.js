/**
 * 轻量反馈工具：toast / loading / modal 封装
 */
export function toast(title, icon = 'none', duration = 2000) {
  uni.showToast({ title, icon, duration })
}

export function success(title = '操作成功') {
  uni.showToast({ title, icon: 'success' })
}

export function loading(title = '加载中...', mask = true) {
  uni.showLoading({ title, mask })
}

export function hideLoading() {
  uni.hideLoading()
}

export function confirm(content, title = '提示', options = {}) {
  return new Promise((resolve) => {
    uni.showModal({
      title,
      content,
      confirmColor: '#ef5a2a',
      ...options,
      success: (res) => resolve(!!res.confirm),
      fail: () => resolve(false),
    })
  })
}
