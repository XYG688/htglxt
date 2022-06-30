import request from '@/utils/request'

// 查询小程序openid关联用户 列表
export function listUser(query) {
  return request({
    url: '/permit/user/list',
    method: 'get',
    params: query
  })
}

// 查询小程序openid关联用户 详细
export function getUser(id) {
  return request({
    url: '/permit/user/' + id,
    method: 'get'
  })
}

// 新增小程序openid关联用户 
export function addUser(data) {
  return request({
    url: '/permit/user',
    method: 'post',
    data: data
  })
}

// 修改小程序openid关联用户 
export function updateUser(data) {
  return request({
    url: '/permit/user',
    method: 'put',
    data: data
  })
}

// 删除小程序openid关联用户 
export function delUser(id) {
  return request({
    url: '/permit/user/' + id,
    method: 'delete'
  })
}
