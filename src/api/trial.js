import { get, post, put } from './request'
import API from './urls'

/** 试工单列表: 我作为求职者 */
export function getMyTrials() {
  return get(API.trialsMine)
}

/** 试工单列表: 我作为招聘方收到的 */
export function getReceivedTrials() {
  return get(API.trialsReceived)
}

/** 某岗位的试工单 */
export function getJobTrials(jobId) {
  return get(`/trials/job/${jobId}`)
}

/** 创建试工单 */
export function createTrial(data) {
  return post(API.trials, data)
}

/** 试工单状态流转: PENDING/CONFIRMED/ARRIVED/COMPLETED/HIRED/REJECTED/CANCELLED */
export function updateTrialStatus(id, status, resultRemark) {
  return put(API.trialStatus(id), { status, resultRemark })
}

/** 发起联系方式申请 */
export function createContactApply(data) {
  return post(API.contactApplies, data)
}

/** 处理联系方式申请: AGREED/REJECTED */
export function updateContactApply(id, status) {
  return put(API.contactApplyStatus(id), { status })
}

/** 我发出的申请 */
export function getMyContactApplies() {
  return get(API.contactAppliesMine)
}

/** 我收到的申请 */
export function getReceivedContactApplies() {
  return get(API.contactAppliesReceived)
}
