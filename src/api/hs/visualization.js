import request from '@/utils/request'

// 查询用户列表
export function getTotalCnt(params) {
  return request({
    url: '/up/api/v2/home/data/total/cnt',
    method: 'get'
  })
}

// 查询用户列表
export function getUserInfo(params) {
  return request({
    url: '/up/api/v2/home/data/user',
    method: 'get',
    params
  })
}

// 查询用户列表
export function getStreamInfo(params) {
  return request({
    url: '/up/api/v2/home/data/sp/stream',
    method: 'get'
  })
}

// 查询用户列表
export function getStreamCnt(params) {
  return request({
    url: '/up/api/v2/home/data/stream/cnt',
    method: 'get'
  })
}