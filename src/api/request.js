/**
 * axios 封装（跨端：H5 / 小程序）
 *
 * 后端统一响应结构约定：
 *   { code: 0, data: T, message: 'ok' }
 *   code === 0 视为成功；401 未登录跳转登录页
 *
 * 用法：
 *   http.get('/jobs', { params, silent: true })
 *   http.post('/jobs', { ... })
 */
import axios from 'axios'
import { config } from '@/config'
import { getToken, clearToken } from '@/utils/storage'
import { toast } from '@/utils/feedback'
import { mockRequest } from '@/mock'

function buildQuery(params) {
  if (!params) return ''
  const qs = Object.keys(params)
    .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== '')
    .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&')
  return qs ? `?${qs}` : ''
}

/* uni.request 适配器：让 axios 同时跑在 H5 与小程序 */
function uniAdapter(reqConfig) {
  return new Promise((resolve, reject) => {
    let fullUrl = reqConfig.url
    if (reqConfig.baseURL && !/^https?:\/\//.test(reqConfig.url)) {
      fullUrl = `${reqConfig.baseURL.replace(/\/$/, '')}${reqConfig.url}`
    }
    fullUrl += buildQuery(reqConfig.params)

    uni.request({
      url: fullUrl,
      method: (reqConfig.method || 'get').toUpperCase(),
      data: reqConfig.data,
      header: reqConfig.headers || {},
      timeout: reqConfig.timeout,
      success: (res) => {
        const response = {
          data: res.data,
          status: res.statusCode,
          statusText: res.errMsg || '',
          headers: res.header || {},
          config: reqConfig,
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(response)
        } else {
          const err = new Error(`Request failed with status code ${res.statusCode}`)
          err.response = response
          err.config = reqConfig
          reject(err)
        }
      },
      fail: (err) => {
        const error = new Error(err.errMsg || '网络异常，请稍后重试')
        error.config = reqConfig
        error.isNetwork = true
        reject(error)
      },
    })
  })
}

/* 自定义适配器：优先走 Mock，否则走 uni.request */
function customAdapter(reqConfig) {
  if (config.useMock) {
    return mockRequest(reqConfig).then((data) => ({
      data: { code: 0, data, message: 'ok' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: reqConfig,
    }))
  }
  return uniAdapter(reqConfig)
}

const http = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  adapter: customAdapter,
})

/* 请求拦截：携带 token（后端约定自定义 header `token`） */
http.interceptors.request.use((reqConfig) => {
  const token = getToken()
  reqConfig.headers = reqConfig.headers || {}
  if (token) {
    reqConfig.headers.token = token
  }
  return reqConfig
})

let redirecting = false

/* 响应拦截：解包统一响应体 */
http.interceptors.response.use(
  (response) => {
    const body = response.data
    // 后端直接返回了业务错误结构
    if (body && typeof body === 'object' && 'code' in body) {
      const { code, data, message } = body
      if (code === 0 || code === 200) return data
      if (code === 401 || code === 40001) {
        handleUnauthorized()
        return Promise.reject(new Error(message || '登录已过期'))
      }
      if (!response.config.silent) {
        toast(message || '请求失败')
      }
      const err = new Error(message || '请求失败')
      err.code = code
      return Promise.reject(err)
    }
    return body
  },
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      handleUnauthorized()
      return Promise.reject(error)
    }
    if (error.config && !error.config.silent) {
      toast(status ? `请求失败(${status})` : error.message || '网络异常，请稍后重试')
    }
    return Promise.reject(error)
  },
)

function handleUnauthorized() {
  if (redirecting) return
  redirecting = true
  clearToken()
  toast('请先登录')
  setTimeout(() => {
    redirecting = false
    uni.reLaunch({ url: '/pages/login/index' })
  }, 800)
}

/**
 * 便捷方法
 * 额外支持 silent: true 关闭错误 toast
 */
export function get(url, params, opts = {}) {
  return http.get(url, { params, ...opts })
}

export function post(url, data, opts = {}) {
  return http.post(url, data, opts)
}

export function put(url, data, opts = {}) {
  return http.put(url, data, opts)
}

export function del(url, params, opts = {}) {
  return http.delete(url, { params, ...opts })
}

export default http
