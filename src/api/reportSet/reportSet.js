import request from '@/utils/request'

// 查询自动审核设置列表
export function listSet(query) {
  return request({
    url: '/ur/v2/set/list',
    method: 'get',
    params: query
  })
}

// 查询自动审核设置详细
export function getSet(id) {
  return request({
    url: '/ur/v2/set/' + id,
    method: 'get'
  })
}

// 新增自动审核设置
export function addSet(data) {
  return request({
    url: '/ur/v2/set',
    method: 'post',
    data: data
  })
}

// 修改自动审核设置
export function updateSet(data) {
  return request({
    url: '/ur/v2/set',
    method: 'put',
    data: data
  })
}

// 删除自动审核设置
export function delSet(id) {
  return request({
    url: '/ur/v2/set/' + id,
    method: 'delete'
  })
}
