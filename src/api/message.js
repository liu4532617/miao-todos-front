import { get } from './request'
import API from './urls'
import { mapDynamic, mapApplication, mapStatistics } from './adapters'

/* ================= 消息/动态/统计 ================= */

/** 招聘动态（新简历、面试提醒等） */
export function getDynamics() {
  return get(API.dynamics).then((res) => {
    const list = Array.isArray(res) ? res : res?.list || []
    return list.map(mapDynamic)
  })
}

/** 投递记录 */
export function getApplications(params) {
  return get(API.applications, params).then((res) => ({
    ...res,
    list: (res?.list || []).map(mapApplication),
  }))
}

/** 用户统计（投递/收藏/发布数） */
export function getStatistics() {
  return get(API.statistics).then(mapStatistics)
}
