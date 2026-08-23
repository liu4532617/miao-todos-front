/**
 * 全局配置
 */
const env = import.meta.env || {}

export const config = {
  // 接口基础地址
  baseURL: env.VITE_API_BASE_URL || '/api',
  // 是否启用前端 Mock（后端未就绪时用于预览 UI）
  useMock: (env.VITE_USE_MOCK || 'true') === 'true',
  // 请求超时（毫秒）
  timeout: 15000,
  // 分页默认大小
  pageSize: 10,
}

export const APP_NAME = '灶台招工'
