import { get, post, put } from './request'

/* ================= 公司认证 ================= */

/** 我的公司信息(含认证状态) */
export function getMyCompany() {
  return get('/company/mine')
}

/** 创建/提交公司认证 */
export function createCompany(data) {
  return post('/company', data)
}

/** 更新公司资料(重新提交审核) */
export function updateCompany(data) {
  return put('/company', data)
}
