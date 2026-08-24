import { get, post, put } from './request'
import API from './urls'

/** 登录（用户名 + 密码） */
export function login(data) {
  return post(API.login, data)
}

/** 微信小程序登录（code 换 token，自动注册） */
export function wxLogin(data) {
  return post(API.wxLogin, data)
}

/** 获取登录用户信息 */
export function getProfile() {
  return get(API.profile)
}

/** 更新用户信息 */
export function updateProfile(data) {
  return put(API.profile, data)
}
