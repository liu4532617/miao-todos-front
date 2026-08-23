import { get, post, put } from './request'
import API from './urls'
import { mapInterview, mapPage } from './adapters'

/* ================= 面试 ================= */

/** 面试安排列表 */
export function getInterviews(params) {
  return get(API.interviews, params).then((res) => mapPage(res, mapInterview))
}

/** 新建面试安排 */
export function createInterview(data) {
  return post(API.interviews, data)
}

/** 更新面试状态（已完成/已取消） */
export function updateInterview(id, data) {
  return put(API.interviewDetail(id), data)
}
