import { get, post, put } from './request'
import API from './urls'
import { mapJob, mapPage, mapFavorite, toJobPayload } from './adapters'

/* ================= 职位 ================= */

/** 职位列表（搜索/筛选/分页） */
export function getJobs(params) {
  return get(API.jobs, params).then((res) => mapPage(res, mapJob))
}

/** 职位详情 */
export function getJobDetail(id) {
  return get(API.jobDetail(id)).then(mapJob)
}

/** 发布岗位 */
export function createJob(data) {
  return post(API.jobs, toJobPayload(data))
}

/** 我的在招职位 */
export function getMyJobs(params) {
  return get(API.jobsMine, params).then((res) => mapPage(res, mapJob))
}

/** 上下架岗位（前端传 'open'/'closed'，后端接收 1/0） */
export function updateJobStatus(id, status) {
  return put(API.jobStatus(id), { status: status === 'closed' ? 0 : 1 })
}

/** 投递/立即沟通 */
export function applyJob(id) {
  return post(API.jobApply(id))
}

/** 收藏 / 取消收藏职位（后端为切换接口，忽略 favorited 参数） */
export function favoriteJob(id) {
  return post(API.jobFavorite(id))
}

/** 收藏列表 */
export function getFavorites(params) {
  return get(API.favorites, params).then((res) => mapPage(res, mapFavorite))
}
