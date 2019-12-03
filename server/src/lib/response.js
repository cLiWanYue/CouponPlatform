'use strict'

const emptyResponse = Symbol('empty')
const { logger } = require('./logger')

// 这个middleware用于将ctx.result中的内容最终回传给客户端
// 回传的格式遵循这样的格式：{ success: true, data: any }
function responseHandler (ctx) {
  if (ctx.result !== undefined) {
    ctx.type = 'json'
    ctx.body = ctx.result === emptyResponse ? { errMsg: '' } : ctx.result
  }
}

// 这个middleware处理在其它middleware中出现的异常
// 并将异常消息回传给客户端：{ success: false, message: '错误消息' }
function errorHandler (ctx, next) {
  return next().catch(err => {
    err = err.error || err
    if (process.env.NODE_ENV !== 'test') logger.error(err.message.trim())

    ctx.body = {
      code: err.code || -1,
      errMsg: err.message.trim()
    }

    // ctx.status = 200      // 保证返回状态是 200, 这样前端不会抛出异常
    ctx.response.status = err.code || 400
    return Promise.resolve()
  })
}

module.exports = {
  /**
   * 表示一个空的响应值
   */
  emptyResponse,
  responseHandler,
  errorHandler
}
