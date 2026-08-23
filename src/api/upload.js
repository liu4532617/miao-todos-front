import { post } from './request'

/** 上传图片,返回可访问 URL */
export async function uploadImage(filePath) {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: '/api/uni/upload',
      filePath,
      name: 'file',
      success: (res) => {
        try {
          const body = JSON.parse(res.data)
          if (body.code === 200 && body.data && body.data.url) {
            resolve(body.data.url)
          } else {
            reject(new Error(body.message || '上传失败'))
          }
        } catch (e) {
          reject(new Error('上传响应解析失败'))
        }
      },
      fail: (err) => reject(new Error(err.errMsg || '上传失败')),
    })
  })
}
