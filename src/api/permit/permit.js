import request from '@/utils/request'

// 查询家人通行记录 列表
export function listPermit(query) {
  return request({
    url: '/permit/permit/list',
    method: 'get',
    params: query
  })
}

// 查询家人通行记录 详细
export function getPermit(id) {
  return request({
    url: '/permit/permit/' + id,
    method: 'get'
  })
}

// 新增家人通行记录 
export function addPermit(data) {
  return request({
    url: '/permit/permit',
    method: 'post',
    data: data
  })
}

// 修改家人通行记录 
export function updatePermit(data) {
  return request({
    url: '/permit/permit',
    method: 'put',
    data: data
  })
}

// 删除家人通行记录 
export function delPermit(id) {
  return request({
    url: '/permit/permit/' + id,
    method: 'delete'
  })
}
