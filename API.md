# 灶台招工 · 后台接口清单

前端项目：`E:\vueproject\miao-todos-front`（vue3 + uni-app + axios）

> 当前前端已内置 Mock（`src/mock/`），后端未就绪时可直接预览 UI。
> 后端就绪后，把 `.env.development` 里 `VITE_USE_MOCK` 改为 `false`、`VITE_API_BASE_URL` 指向真实地址即可切换。

## 一、通用约定

### 基础地址
- 开发环境 H5：`/api`（vite 代理到 `http://localhost:8080`，见 `vite.config.js`）
- 小程序端：请在 `.env.development` 里改为完整地址，如 `http://192.168.x.x:8080/api`

### 统一响应结构
```json
{
  "code": 0,          // 0 = 成功；401 = 未登录
  "data": { ... },    // 业务数据
  "message": "ok"
}
```

### 鉴权
请求头携带：`Authorization: Bearer <token>`

### 分页参数
列表接口统一支持 `page`（默认 1）、`pageSize`（默认 10），返回：
```json
{ "list": [...], "total": 10, "page": 1, "pageSize": 10 }
```

---

## 二、接口列表

### 1. 认证
| 方法 | 路径 | 说明 | 请求体 |
|---|---|---|---|
| POST | `/auth/login` | 登录（手机号验证码 / 微信 code） | `{ phone?, code?, wxCode? }` |

返回：`{ token, user }`

### 2. 用户
| 方法 | 路径 | 说明 | 请求体 |
|---|---|---|---|
| GET | `/user/profile` | 获取当前用户信息 | - |
| PUT | `/user/profile` | 更新用户信息 | `{ name?, avatar?, city?, district? }` |
| PUT | `/user/role` | 切换身份（求职者/经营者） | `{ role: 'candidate' \| 'boss' }` |
| GET | `/statistics` | 我的页统计（投递/收藏/发布数） | - |

返回 `statistics`：`{ applications, favorites, products }`

### 3. 求职 · 职位
| 方法 | 路径 | 说明 | 参数 |
|---|---|---|---|
| GET | `/jobs` | 职位列表 | `keyword?` `type?`（厨师/服务员等）`fulltime?` `page` `pageSize` |
| GET | `/jobs/{id}` | 职位详情 | - |
| POST | `/jobs` | 发布岗位（经营者） | 见下方「岗位字段」 |
| GET | `/jobs/mine` | 我的在招职位 | - |
| PUT | `/jobs/{id}/status` | 上架/下架 | `{ status: 'open' \| 'closed' }` |
| POST | `/jobs/{id}/apply` | 投递简历 / 立即沟通 | - |
| POST | `/jobs/{id}/favorite` | 收藏 / 取消收藏 | `{ favorited: true }` |
| GET | `/favorites` | 我的收藏职位 | `page` `pageSize` |

**岗位字段（job）：**
```json
{
  "id": 101,
  "title": "炒锅师傅",
  "restaurant": "湘里湘亲 · 江南西店",
  "logoText": "湘",
  "logoColor": "#e65a37",
  "salary": "8–12K",
  "salaryMin": 8000,
  "salaryMax": 12000,
  "distance": 1.2,
  "district": "海珠区",
  "tags": ["包吃住", "月休4天", "连锁餐饮"],
  "headcount": 2,
  "experience": "3-5年",
  "workTime": "9:00-21:00",
  "fulltime": true,
  "description": "岗位描述...",
  "status": "open",
  "createdAt": "2026-08-16 09:30",
  "candidates": 12,
  "viewed": 86
}
```

### 4. 简历
| 方法 | 路径 | 说明 | 参数 |
|---|---|---|---|
| GET | `/resumes` | 收到的简历列表（经营者） | `status?`（new/interview）`page` `pageSize` |
| GET | `/resumes/{id}` | 简历详情 | - |
| GET | `/resumes/mine` | 我的简历（求职者） | - |
| PUT | `/resumes/mine` | 更新我的简历 | 见下方「简历字段」 |
| POST | `/resumes` | 创建我的简历 | 见下方「简历字段」 |

**简历字段（resume）：**
```json
{
  "id": 301,
  "name": "王师傅",
  "jobWant": "炒锅师傅",
  "years": 8,
  "cuisine": "川湘菜",
  "salary": "8–10K",
  "location": "广州 · 海珠区",
  "distance": 2.3,
  "tags": ["8年经验", "川湘菜"],
  "intro": "个人介绍...",
  "phone": "136****2211",
  "status": "new",          // new 新简历 / interview 已约面试
  "appliedAt": "2026-08-17 10:12"
}
```

### 5. 面试
| 方法 | 路径 | 说明 | 请求体 |
|---|---|---|---|
| GET | `/interviews` | 面试安排列表 | `page` `pageSize` |
| POST | `/interviews` | 新建面试 | `{ candidateName, jobTitle, time, location, status }` |
| PUT | `/interviews/{id}` | 更新面试 | `{ status?: 'done'\|'cancelled', time?, remark? }` |

### 6. 餐饮跳蚤（二手市场）
| 方法 | 路径 | 说明 | 参数 |
|---|---|---|---|
| GET | `/market/products` | 商品列表 | `category?`（厨房设备/桌椅餐具/急转）`keyword?` `page` `pageSize` |
| GET | `/market/products/{id}` | 商品详情 | - |
| POST | `/market/products` | 发布闲置 | 见下方「商品字段」 |
| GET | `/market/products/mine` | 我的发布 | - |
| PUT | `/market/products/{id}/status` | 上架/下架 | `{ status: 'on' \| 'off' }` |

**商品字段（product）：**
```json
{
  "id": 501,
  "name": "九阳商用煲汤炉 60L",
  "category": "厨房设备",
  "price": 680,
  "originPrice": 1280,
  "description": "九成新...",
  "status": "on",
  "createdAt": "2026-08-15 11:00",
  "distance": 1.5,
  "views": 46
}
```

### 7. 沟通
| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/chats` | 会话列表 |
| GET | `/chats/{id}/messages` | 某会话消息记录 |
| POST | `/chats/{id}/messages` | 发送消息 `{ content }` |

**消息字段（message）：** `{ id, from: 'me'|'them', content, time }`

### 8. 动态 / 记录
| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/dynamics` | 招聘动态（新简历、面试提醒） |
| GET | `/applications` | 我的投递记录 |

**动态字段（dynamic）：**
```json
{
  "id": 601,
  "type": "resume",          // resume 新简历 / interview 面试
  "title": "炒锅师傅 · 新简历待查看",
  "desc": "王师傅 · 8年川湘菜经验 · 距店 2.3 km",
  "dateLabel": "02",
  "time": "10:12",
  "unread": true
}
```

---

## 三、前端请求封装说明

所有接口统一走 `src/api/request.js`：

```js
import { get, post, put } from '@/api/request'

// GET
const list = await get('/jobs', { page: 1, type: '厨师' })
// POST（自动携带 token，自动解包 code/data）
const res = await post('/auth/login', { phone, code })
```

- 401 自动清除登录态并跳转登录页
- 业务错误（code ≠ 0）自动 toast `message`；传 `{ silent: true }` 可关闭

## 四、数据库表建议

- `users`：用户（角色 candidate/boss、城市、头像）
- `jobs`：岗位（发布者 user_id、上下架、浏览量、投递数）
- `job_applications`：投递记录（job_id、user_id、状态）
- `resumes`：简历（user_id 一对一）
- `interviews`：面试（候选人、岗位、时间地点、状态）
- `products`：闲置商品（发布者 user_id、价格、分类、上下架）
- `favorites`：收藏（user_id、job_id）
- `chats` / `chat_messages`：会话与消息
