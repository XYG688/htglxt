import request from '@/utils/request'

// 查询用户列表
export function listCompany(query) {
  return request({
    url: '/company/list/page',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getCompany(id) {
  return request({
    url: '/company/' + id,
    method: 'get'
  })
}

// 新增用户
export function addCompany(data) {
  return request({
    url: '/company/save',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateCompany(data) {
  return request({
    url: '/company/put',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delCompany(params) {
  return request({
    url: '/company/del',
    method: 'delete',
    params
  })
}
