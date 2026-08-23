/**
 * 后端数据 → 前端展示字段 适配器
 * ------------------------------------------------------------------
 * 后端实体（UniJob / UniProduct / ...）与前端页面消费的字段命名不同，
 * 这里统一做映射，页面无需改动即可消费真实接口数据。
 * 同时兼容 Mock 格式（若字段已存在则沿用），便于随时切回预览模式。
 */

/** LocalDateTime "2026-08-18T10:00:00" → "2026-08-18 10:00" */
export function fmtTime(t) {
  if (!t) return ''
  return String(t).replace('T', ' ').slice(0, 16)
}

/** 薪资（元/月）→ 展示字符串 "8–12K" */
export function fmtSalary(min, max) {
  if (min == null && max == null) return ''
  const k = (v) => {
    if (v == null) return ''
    const n = Number(v) / 1000
    return (Math.round(n * 10) / 10).toString()
  }
  const a = k(min)
  const b = k(max)
  if (a && b) return `${a}–${b}K`
  if (a) return `${a}K`
  if (b) return `${b}K`
  return ''
}

/** 逗号分隔标签 → 数组 */
function splitTags(tags) {
  if (!tags) return []
  if (Array.isArray(tags)) return tags
  return String(tags).split(/[,，]/).map((s) => s.trim()).filter(Boolean)
}

/** 从工作地点提取区域，如 "广州市海珠区" → "海珠区" */
function pickDistrict(location) {
  if (!location) return ''
  const s = String(location).replace(/市$/, '')
  const m = /(.+?[区县市])$/.exec(s)
  return m ? m[1] : s
}

/** 分页响应：只映射 list，保留 total/page/pageSize */
export function mapPage(res, mapper) {
  if (!res || !Array.isArray(res.list)) return res
  return { ...res, list: res.list.map(mapper) }
}

/* ================= 职位 ================= */

/** 后端 UniJob → 前端 job 卡片字段 */
export function mapJob(j) {
  if (!j) return j
  const status = j.status === 0 || j.status === 'closed' ? 'closed' : 'open'
  return {
    ...j,
    restaurant: j.company || j.restaurant,
    salary: fmtSalary(j.salaryMin, j.salaryMax),
    district: j.district || pickDistrict(j.location),
    distance: Number(j.distance) || 0,
    tags: splitTags(j.tags),
    fulltime: j.fulltime ?? (j.type ? j.type === 'FULL_TIME' : true),
    status,
    createdAt: fmtTime(j.createTime) || j.createdAt,
    viewed: j.viewed ?? j.viewCount ?? 0,
    candidates: j.candidates ?? j.applyCount ?? 0,
    headcount: j.headcount ?? j.headCount ?? 1,
    workTime: j.workTime || '面议',
  }
}

/** 前端 job 表单 → 后端 UniJob 提交字段 */
export function toJobPayload(j) {
  const typeMap = { 全职: 'FULL_TIME', '兼职/钟点': 'PART_TIME', 兼职: 'PART_TIME', 实习: 'INTERNSHIP' }
  const fulltime = j.fulltime === false ? false : j.type === '全职' || j.fulltime
  return {
    title: j.title,
    company: j.restaurant,
    companyLogo: j.companyLogo || '',
    location: j.location || '广州·海珠区',
    salaryMin: Number(j.salaryMin) || 0,
    salaryMax: Number(j.salaryMax) || 0,
    type: typeMap[j.type] || (fulltime ? 'FULL_TIME' : 'PART_TIME'),
    education: j.education || '',
    experience: j.experience || '',
    tags: Array.isArray(j.tags) ? j.tags.join(',') : j.tags || '',
    description: j.description || '',
    requirement: j.requirement || '',
    headCount: Number(j.headcount) || 1,
    workTime: j.workTime || '',
    status: 1,
  }
}

/** 后端 UniFavorite → 前端 job 卡片字段（收藏列表展示用） */
export function mapFavorite(f) {
  if (!f) return f
  return {
    id: f.jobId ?? f.id,
    title: f.jobTitle,
    restaurant: f.company,
    location: f.jobLocation,
    district: pickDistrict(f.jobLocation),
    distance: 0,
    salary: '',
    tags: [],
    status: f.jobStatus === 0 ? 'closed' : 'open',
  }
}

/* ================= 二手商品 ================= */

/** 后端 UniProduct → 前端 product 卡片字段 */
export function mapProduct(p) {
  if (!p) return p
  return {
    ...p,
    name: p.title || p.name,
    itemType: p.itemType || 'EQUIPMENT',
    originPrice: p.originalPrice ?? p.originPrice,
    status: p.status === 0 || p.status === 2 || p.status === 'off' ? 'off' : 'on',
    createdAt: fmtTime(p.createTime) || p.createdAt,
    views: p.views ?? p.viewCount ?? 0,
  }
}

/** 前端 product 表单 → 后端 UniProduct 提交字段 */
export function toProductPayload(p) {
  return {
    title: p.name,
    itemType: p.itemType || 'EQUIPMENT',
    description: p.description || '',
    category: p.category || '其他',
    price: Number(p.price) || 0,
    originalPrice: Number(p.originalPrice) || 0,
    image: p.image || '',
    condition: p.condition || '',
    status: 1,
  }
}

/* ================= 用户 ================= */

const ROLE_MAP = { SEEKER: 'candidate', SELLER: 'boss', candidate: 'candidate', boss: 'boss' }

/** 后端 UniUser → 前端 user 字段 */
export function mapUser(u) {
  if (!u) return u
  return {
    ...u,
    name: u.nickname || u.username || u.name,
    role: ROLE_MAP[u.role] || u.role || 'candidate',
  }
}

/* ================= 简历 ================= */

/** 后端 UniResume → 前端 resume 字段 */
export function mapResume(r) {
  if (!r) return r
  const years = Number.parseInt(String(r.workYears || '').replace(/[^0-9]/g, ''), 10)
  return {
    ...r,
    jobWant: r.title || r.jobWant,
    years: Number.isNaN(years) ? r.years || 0 : years,
    cuisine: r.skills || r.cuisine || '',
    salary: r.salary || '',
    tags: splitTags(r.skills),
    location: r.location || (r.city ? `广州 · ${r.city}` : ''),
    intro: r.selfEvaluation || r.intro || '',
    status: r.status === 'interview' || r.status === 1 ? 'interview' : 'new',
    appliedAt: fmtTime(r.createTime) || r.appliedAt,
    distance: Number(r.distance) || 0,
  }
}

/** 前端 resume 表单 → 后端 UniResume 提交字段 */
export function toResumePayload(r) {
  const skillParts = []
  if (r.cuisine) skillParts.push(r.cuisine)
  if (Array.isArray(r.tags)) skillParts.push(...r.tags)
  else if (r.tags) skillParts.push(r.tags)
  return {
    title: r.jobWant || r.title,
    name: r.name,
    gender: r.gender == null || r.gender === '' ? 0 : Number(r.gender),
    phone: r.phone || '',
    email: r.email || '',
    birthday: r.birthday || '',
    education: r.education || '',
    school: r.school || '',
    major: r.major || '',
    salary: r.salary || '',
    location: r.location || '',
    workYears: r.years ? `${r.years}年` : '',
    skills: skillParts.filter((v, i, a) => a.indexOf(v) === i).join(','),
    experience: r.experience || '',
    selfEvaluation: r.intro || '',
    status: 1,
  }
}

/* ================= 面试 ================= */

const INTERVIEW_STATUS = { PENDING: 'upcoming', CONFIRMED: 'upcoming', COMPLETED: 'done', CANCELLED: 'cancelled' }

/** 后端 UniInterview → 前端 interview 字段 */
export function mapInterview(i) {
  if (!i) return i
  return {
    ...i,
    jobTitle: i.jobTitle || i.company || '',
    candidateName: i.userName || i.candidateName || '',
    time: fmtTime(i.interviewTime) || i.time,
    location: i.location || '',
    status: INTERVIEW_STATUS[i.status] || i.status || 'upcoming',
  }
}

/* ================= 沟通 ================= */

/** 后端 UniChat → 前端 chat 会话字段 */
export function mapChat(c) {
  if (!c) return c
  return {
    ...c,
    name: c.peerName || c.name || '对方',
    avatarText: (c.peerName || c.name || '?')[0],
    lastMessage: c.lastMessage || '',
    time: fmtTime(c.lastTime) || c.time || '',
    unread: c.unreadCount ?? c.unread ?? 0,
  }
}

/** 后端 UniChatMessage → 前端 message 字段（meId 为当前用户 id，用于判断左右气泡） */
export function mapMessage(m, meId) {
  if (!m) return m
  const mine = meId != null && m.senderId != null && String(m.senderId) === String(meId)
  return {
    ...m,
    from: mine ? 'me' : 'them',
    time: fmtTime(m.createTime) || m.time || '',
  }
}

/* ================= 动态 / 投递记录 / 统计 ================= */

const DYNAMIC_TYPE = { APPLICATION: 'resume', INTERVIEW: 'interview', FAVORITE: 'favorite', PRODUCT: 'product', NOTE: 'note' }

/** 后端 UniDynamic → 前端 dynamic 字段 */
export function mapDynamic(d) {
  if (!d) return d
  const t = String(d.createTime || '')
  const dateLabel = t.length >= 10 ? t.slice(8, 10) : ''
  return {
    ...d,
    type: DYNAMIC_TYPE[d.type] || d.type || 'note',
    title: d.title || '',
    desc: d.content || '',
    time: fmtTime(d.createTime) || d.time || '',
    dateLabel,
    unread: false,
  }
}

/** 后端 UniApplication → 前端 application 字段 */
export function mapApplication(a) {
  if (!a) return a
  const statusMap = { PENDING: 'applied', REVIEWING: 'viewed', ACCEPTED: 'interview', REJECTED: 'done' }
  return {
    ...a,
    jobTitle: a.jobTitle || '',
    restaurant: a.company || '',
    status: statusMap[a.status] || a.status || 'applied',
    appliedAt: fmtTime(a.createTime) || a.appliedAt,
    salary: fmtSalary(a.salaryMin, a.salaryMax),
  }
}

/** 后端 statistics → 前端 stats 字段 */
export function mapStatistics(s) {
  if (!s) return s
  return {
    applications: s.applicationCount ?? s.applications ?? 0,
    favorites: s.favoriteCount ?? s.favorites ?? 0,
    products: s.productCount ?? s.products ?? 0,
    views: s.jobCount ?? s.views ?? 0,
    resumeCount: s.resumeCount ?? 0,
    interviewCount: s.interviewCount ?? 0,
  }
}
