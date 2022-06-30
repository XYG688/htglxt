import request from '@/utils/request'

// 查询用户列表
export function getList(data) {
  return request({
    url: '/up/api/v2/sp/manager/stream',
    method: 'post',
    data
  })
}

// 查询用户列表
export function setStream(data) {
  return request({
    url: '/up/api/v2/sp/stream',
    method: 'post',
    data
  })
}

// 查询用户列表
export function getStream(params) {
  return request({
    url: '/up/api/v2/sp/stream/info',
    method: 'get',
    params
  })
}
