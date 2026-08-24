/**
 * 接口地址统一管理
 * ------------------------------------------------------------------
 * 所有需要请求后端的 URL 都集中定义在这里，业务 API 模块与 Mock
 * 模块统一从这里引用，改一处即可全局生效。
 *
 * 两种导出：
 *   1. API   —— 实际请求用，带路径参数的为函数：API.jobDetail(id)
 *   2. patterns —— Mock 匹配用，带 {id} 占位符的 pattern 字符串
 * ------------------------------------------------------------------
 */

export const API = {
  /* ===== 认证 ===== */
  login: '/auth/login',
  wxLogin: '/auth/wx-login',

  /* ===== 用户 ===== */
  profile: '/user/profile',
  role: '/user/role',
  statistics: '/statistics',

  /* ===== 职位 ===== */
  jobs: '/jobs',
  jobsMine: '/jobs/mine',
  jobDetail: (id) => `/jobs/${id}`,
  jobStatus: (id) => `/jobs/${id}/status`,
  jobHired: (id) => `/jobs/${id}/hired`,
  jobApply: (id) => `/jobs/${id}/apply`,
  jobFavorite: (id) => `/jobs/${id}/favorite`,
  favorites: '/favorites',

  /* ===== 简历 ===== */
  resumes: '/resumes',
  resumeDetail: (id) => `/resumes/${id}`,
  resumeMine: '/resumes/mine',
  seekCards: '/resumes/seek-cards',

  /* ===== 面试 ===== */
  interviews: '/interviews',
  interviewDetail: (id) => `/interviews/${id}`,

  /* ===== 二手市场 ===== */
  products: '/market/products',
  productsMine: '/market/products/mine',
  productDetail: (id) => `/market/products/${id}`,
  productStatus: (id) => `/market/products/${id}/status`,

  /* ===== 沟通 ===== */
  chats: '/chats',
  chatMessages: (id) => `/chats/${id}/messages`,

  /* ===== 试工单 ===== */
  trials: '/trials',
  trialsMine: '/trials/mine',
  trialsReceived: '/trials/received',
  trialStatus: (id) => `/trials/${id}/status`,

  /* ===== 联系方式申请 ===== */
  contactApplies: '/contact-applies',
  contactApplyStatus: (id) => `/contact-applies/${id}/status`,
  contactAppliesMine: '/contact-applies/mine',
  contactAppliesReceived: '/contact-applies/received',

  /* ===== 动态 / 投递记录 ===== */
  dynamics: '/dynamics',
  applications: '/applications',
}

/**
 * Mock 路由匹配用的 pattern 表（与 API 一一对应，{id} 为路径参数占位符）
 * 保证 Mock 与真实接口地址永远同步
 */
export const patterns = {
  login: '/auth/login',
  profile: '/user/profile',
  role: '/user/role',
  statistics: '/statistics',

  jobs: '/jobs',
  jobsMine: '/jobs/mine',
  jobDetail: '/jobs/{id}',
  jobStatus: '/jobs/{id}/status',
  jobApply: '/jobs/{id}/apply',
  jobFavorite: '/jobs/{id}/favorite',
  favorites: '/favorites',

  resumes: '/resumes',
  resumeDetail: '/resumes/{id}',
  resumeMine: '/resumes/mine',

  interviews: '/interviews',
  interviewDetail: '/interviews/{id}',

  products: '/market/products',
  productsMine: '/market/products/mine',
  productDetail: '/market/products/{id}',
  productStatus: '/market/products/{id}/status',

  chats: '/chats',
  chatMessages: '/chats/{id}/messages',

  dynamics: '/dynamics',
  applications: '/applications',
}

export default API
