import { get, post, put } from './request'
import API from './urls'
import { mapResume, mapPage, toResumePayload } from './adapters'

/* ================= 简历 ================= */

/** 收到的简历列表（人才简历） */
export function getResumes(params) {
  return get(API.resumes, params).then((res) => mapPage(res, mapResume))
}

/** 简历详情 */
export function getResumeDetail(id) {
  return get(API.resumeDetail(id)).then(mapResume)
}

/** 我的简历（后端 /resumes/mine 返回数组，取第一条） */
export function getMyResume() {
  return get(API.resumeMine).then((res) => {
    const list = Array.isArray(res) ? res : []
    return list.length ? mapResume(list[0]) : null
  })
}

/** 创建我的简历 */
export function createResume(data) {
  return post(API.resumes, toResumePayload(data))
}

/** 更新我的简历（后端为 PUT /resumes/{id}） */
export function updateMyResume(id, data) {
  return put(API.resumeDetail(id), toResumePayload(data))
}
