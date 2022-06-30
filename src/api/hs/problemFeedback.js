import request from '@/utils/request'

// 查询反馈列表
export function problemFeedbackList(data) {
  return request({
    url: '/up/v2/back/question/list?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
    method: 'post',
    data: data
  })
}

// 一键反馈
export function callbackAllProblemFeedback(data) {
  return request({
    url: '/up/v2/user/question/answer/list',
    method: 'post',
    data: data
  })
}

// 回复用户反馈
export function callbackProblemFeedback(data) {
  return request({
    url: '/up/v2/user/question/answer',
    method: 'post',
    data: data
  })
}

// 获取用户信息
export function getUserInfo(query) {
  return request({
    url: '/up/v2/back/userinfo',
    method: 'get',
    params: query
  })
}






