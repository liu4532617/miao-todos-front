/**
 * 全局配置
 */
const env = import.meta.env || {}

export const config = {
  // 接口基础地址: H5 走同源相对路径; 小程序走完整域名(备案+HTTPS 后生效)
  // #ifdef H5
  baseURL: env.VITE_API_BASE_URL || '/api',
  // #endif
  // #ifndef H5
  baseURL: env.VITE_API_BASE_URL || 'https://fastfoodhut.com/api',
  // #endif
  // 是否启用前端 Mock（后端未就绪时用于预览 UI）
  useMock: (env.VITE_USE_MOCK || 'true') === 'true',
  // 请求超时（毫秒）
  timeout: 15000,
  // 分页默认大小
  pageSize: 10,
}

export const APP_NAME = '灶台招工'
