import request from '@/utils/request'

// 查询用户列表
export function listInform(params) {
  return request({
    url: '/up/v2/back/notice/list',
    method: 'get',
    params
  })
}

// 查询用户详情
export function getInform(params) {
  return request({
    url: '/up/v2/user/notice/detail',
    method: 'get',
    params
  })
}

// 查询用户详情
export function addInform(data) {
  return request({
    url: '/up/v2/back/notice',
    method: 'post',
    data
  })
}

// 查询用户详情
export function updateInform(data) {
  return request({
    url: '/up/v2/back/notice',
    method: 'put',
    data
  })
}

// 查询用户详情
export function delInform(params) {
  return request({
    url: '/up/v2/back/notice',
    method: 'delete',
    params
  })
}
