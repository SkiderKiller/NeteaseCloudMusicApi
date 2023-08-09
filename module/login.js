// 邮箱登录

const crypto = require('crypto')

module.exports = async (query, request) => {
  query.cookie.os = 'Windows'
  query.cookie.appver = 'empty'
  const data = {
    username: query.email,
    password:
      query.md5_password ||
      crypto.createHash('md5').update(query.password).digest('hex'),
    rememberLogin: 'true',
  }
  let result = await request('POST', `
https://music.163.com/weapi/middle/account/sns/weblogin?csrf_token=8f78bc7ff4f911799f3b05ec89cd15fa`, data, {
    crypto: 'weapi',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    cookie: query.cookie,
    proxy: query.proxy,
    realIP: query.realIP,
  })
  if (result.body.code === 502) {
    return {
      status: 200,
      body: {
        msg: '账号或密码错误',
        code: 502,
        message: '账号或密码错误',
      },
    }
  }
  if (result.body.code === 200) {
    result = {
      status: 200,
      body: {
        ...result.body,
        cookie: result.cookie.join(';'),
      },
      cookie: result.cookie,
    }
  }
  return result
}
