#!/usr/bin/env node
/**
 * 小程序代码上传脚本(miniprogram-ci)
 * 用法: node scripts/upload-mp.js [版本号] [描述]
 * 默认版本号: 1.0.0, 描述: 自动上传
 */
const ci = require('miniprogram-ci')

const APPID = 'wx3bca015654e525f8'
const KEY_PATH = '/home/ubuntu/keys/wxgitsubmit.key'
const PROJECT_PATH = __dirname + '/../dist/build/mp-weixin'

const version = process.argv[2] || '1.0.0'
const desc = process.argv[3] || '自动上传'

async function main() {
  const project = new ci.Project({
    appid: APPID,
    type: 'miniProgram',
    projectPath: PROJECT_PATH,
    privateKeyPath: KEY_PATH,
    ignores: ['node_modules/**/*'],
  })

  const uploadResult = await ci.upload({
    project,
    version,
    desc,
    setting: {
      es6: true,
      minify: true,
      // 兼容旧版开发者工具编译器
      es7: false,
    },
    onProgressUpdate: (task) => {
      console.log(`[进度] ${task.status} ${task.message || ''}`)
    },
  })
  console.log('✅ 上传成功! version =', version)
  console.log('   微信后台 → 管理 → 版本管理 → 开发版本 可见')
}

main().catch((e) => {
  console.error('❌ 上传失败:', e.message || e)
  process.exit(1)
})
