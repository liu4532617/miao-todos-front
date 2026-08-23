import { get, post, put } from './request'
import API from './urls'
import { mapProduct, mapPage, toProductPayload } from './adapters'

/* ================= 二手市场 ================= */

/** 商品列表（分类/搜索/分页） */
export function getProducts(params) {
  return get(API.products, params).then((res) => mapPage(res, mapProduct))
}

/** 商品详情 */
export function getProductDetail(id) {
  return get(API.productDetail(id)).then(mapProduct)
}

/** 发布闲置 */
export function createProduct(data) {
  return post(API.products, toProductPayload(data))
}

/** 我的发布 */
export function getMyProducts(params) {
  return get(API.productsMine, params).then((res) => mapPage(res, mapProduct))
}

/** 上架/下架商品（前端传 'on'/'off'，后端接收 1/0/2） */
export function updateProductStatus(id, status) {
  return put(API.productStatus(id), { status: status === 'off' ? 0 : 1 })
}
