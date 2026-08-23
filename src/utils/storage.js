const TOKEN_KEY = 'MIAO_TOKEN'
const USER_KEY = 'MIAO_USER'

export function getToken() {
  return uni.getStorageSync(TOKEN_KEY) || ''
}

export function setToken(token) {
  uni.setStorageSync(TOKEN_KEY, token)
}

export function clearToken() {
  uni.removeStorageSync(TOKEN_KEY)
  uni.removeStorageSync(USER_KEY)
}

export function getStoredUser() {
  const raw = uni.getStorageSync(USER_KEY)
  return raw || null
}

export function setStoredUser(user) {
  uni.setStorageSync(USER_KEY, user)
}
