/**
 * Mock 请求路由器：在 config.useMock 开启时替代真实后端
 * 返回与后端约定一致的 data 部分（外层由 request.js 包 { code:0, data, message }）
 */
import {
  mockUser,
  mockJobs,
  mockMyJobs,
  mockResumes,
  mockInterviews,
  mockProducts,
  mockDynamics,
  mockChats,
  mockMessages,
  mockMyProducts,
  mockApplications,
} from './data'
import { patterns } from '@/api/urls'

const ok = (data) => Promise.resolve(data)

function paginate(list, query) {
  const page = Number(query.page || 1)
  const pageSize = Number(query.pageSize || 10)
  const total = list.length
  const items = list.slice((page - 1) * pageSize, page * pageSize)
  return { list: items, total, page, pageSize }
}

function matchUrl(path, pattern) {
  const regex = new RegExp(`^${pattern.replace(/\{id\}/g, '([0-9]+)')}$`)
  const m = path.match(regex)
  return m ? { id: m[1] } : null
}

/* url 匹配表：越靠前优先级越高 */
const routes = [
  /* ===== 登录 ===== */
  { method: 'POST', pattern: patterns.login, handler: () => ok({ token: 'mock-token-20260817', user: mockUser }) },

  /* ===== 用户 ===== */
  { method: 'GET', pattern: patterns.profile, handler: () => ok(mockUser) },
  { method: 'PUT', pattern: patterns.profile, handler: (p, q, body) => ok({ ...mockUser, ...body }) },
  { method: 'PUT', pattern: patterns.role, handler: (p, q, body) => ok({ role: body.role }) },
  { method: 'GET', pattern: '/user/stats', handler: () => ok(mockUser.stats) },

  /* ===== 求职：职位列表 / 详情 / 我的发布 / 收藏 ===== */
  { method: 'GET', pattern: patterns.jobsMine, handler: () => ok(mockMyJobs) },
  {
    method: 'GET',
    pattern: patterns.jobs,
    handler: (p, query) => {
      let list = [...mockJobs]
      if (query.keyword) {
        const kw = query.keyword.toLowerCase()
        list = list.filter(
          (j) => j.title.toLowerCase().includes(kw) || j.restaurant.toLowerCase().includes(kw),
        )
      }
      if (query.type) list = list.filter((j) => j.title.includes(query.type))
      if (query.fulltime !== undefined && query.fulltime !== '') {
        list = list.filter((j) => String(j.fulltime) === query.fulltime)
      }
      return ok(paginate(list, query))
    },
  },
  { method: 'GET', pattern: patterns.jobDetail, handler: (p) => ok(mockJobs.find((j) => String(j.id) === p.id) || mockJobs[0]) },
  { method: 'POST', pattern: patterns.jobs, handler: (p, q, body) => ok({ id: Date.now(), ...body, status: 'open' }) },
  {
    method: 'PUT',
    pattern: patterns.jobStatus,
    handler: (p, q, body) => ok({ id: Number(p.id), status: body.status }),
  },
  {
    method: 'POST',
    pattern: patterns.jobApply,
    handler: (p) => ok({ applied: true, jobId: Number(p.id), message: '沟通成功' }),
  },
  {
    method: 'POST',
    pattern: patterns.jobFavorite,
    handler: (p, q, body) => ok({ favorited: body.favorited, jobId: Number(p.id) }),
  },
  { method: 'GET', pattern: patterns.favorites, handler: () => ok(paginate(mockJobs.slice(0, 2), { page: 1, pageSize: 10 })) },

  /* ===== 简历 ===== */
  { method: 'GET', pattern: patterns.resumeMine, handler: () => ok(mockUser.resume) },
  { method: 'POST', pattern: patterns.resumes, handler: (p, q, body) => ok({ id: 11, ...body }) },
  { method: 'PUT', pattern: patterns.resumeMine, handler: (p, q, body) => ok({ ...mockUser.resume, ...body }) },
  { method: 'GET', pattern: patterns.resumes, handler: () => ok(paginate(mockResumes, { page: 1, pageSize: 10 })) },
  { method: 'GET', pattern: patterns.resumeDetail, handler: (p) => ok(mockResumes.find((r) => String(r.id) === p.id) || mockResumes[0]) },

  /* ===== 面试 ===== */
  { method: 'GET', pattern: patterns.interviews, handler: () => ok(paginate(mockInterviews, { page: 1, pageSize: 10 })) },
  { method: 'POST', pattern: patterns.interviews, handler: (p, q, body) => ok({ id: Date.now(), ...body, status: 'upcoming' }) },
  {
    method: 'PUT',
    pattern: patterns.interviewDetail,
    handler: (p, q, body) => ok({ id: Number(p.id), ...body }),
  },

  /* ===== 二手市场 ===== */
  { method: 'GET', pattern: patterns.productsMine, handler: () => ok(mockMyProducts) },
  {
    method: 'GET',
    pattern: patterns.products,
    handler: (p, query) => {
      let list = [...mockProducts]
      if (query.category && query.category !== '精选') {
        list = list.filter((x) => x.category === query.category || (query.category === '急转' && x.status === 'on'))
      }
      if (query.keyword) {
        const kw = query.keyword.toLowerCase()
        list = list.filter((x) => x.name.toLowerCase().includes(kw))
      }
      return ok(paginate(list, query))
    },
  },
  {
    method: 'GET',
    pattern: patterns.productDetail,
    handler: (p) => ok(mockProducts.find((x) => String(x.id) === p.id) || mockProducts[0]),
  },
  { method: 'POST', pattern: patterns.products, handler: (p, q, body) => ok({ id: Date.now(), ...body, status: 'on' }) },
  {
    method: 'PUT',
    pattern: patterns.productStatus,
    handler: (p, q, body) => ok({ id: Number(p.id), status: body.status }),
  },

  /* ===== 沟通 ===== */
  { method: 'GET', pattern: patterns.chats, handler: () => ok(mockChats) },
  {
    method: 'GET',
    pattern: patterns.chatMessages,
    handler: (p) => ok(mockMessages[p.id] || []),
  },
  {
    method: 'POST',
    pattern: patterns.chatMessages,
    handler: (p, q, body) => ok({ id: Date.now(), from: 'me', content: body.content, time: '刚刚' }),
  },

  /* ===== 招聘动态 ===== */
  { method: 'GET', pattern: patterns.dynamics, handler: () => ok(mockDynamics) },

  /* ===== 投递记录 ===== */
  { method: 'GET', pattern: patterns.applications, handler: () => ok(paginate(mockApplications, { page: 1, pageSize: 10 })) },

  /* ===== 统计（我的页顶部数字） ===== */
  { method: 'GET', pattern: patterns.statistics, handler: () => ok(mockUser.stats) },
]

export function mockRequest(reqConfig) {
  const method = (reqConfig.method || 'get').toUpperCase()
  const rawUrl = reqConfig.url || ''
  const query = reqConfig.params || {}
  const body = reqConfig.data || {}
  const path = rawUrl.split('?')[0].replace(/\/+$/, '')

  const route = routes.find((r) => {
    if (r.method !== method) return false
    const regex = new RegExp(`^${r.pattern.replace(/\{id\}/g, '([0-9]+)')}$`)
    return regex.test(path)
  })

  if (!route) {
    // 未匹配的接口：模拟延迟后返回空，避免阻塞预览
    return new Promise((resolve) => setTimeout(() => resolve({ list: [], total: 0 }), 200))
  }

  const params = matchUrl(path, route.pattern) || {}
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(route.handler(params, query, body))
      } catch (e) {
        reject(e)
      }
    }, 250)
  })
}
