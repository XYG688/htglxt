import request from '@/utils/request'

// 查询数据同步列表
export function listMemberComparisonCache(query) {
  return request({
    url: '/hs/memberComparisonCache/list',
    method: 'get',
    params: query
  })
}

// 查询数据同步详细
export function getMemberComparisonCache(id) {
  return request({
    url: '/hs/memberComparisonCache/' + id,
    method: 'get'
  })
}

// 新增数据同步
export function addMemberComparisonCache(data) {
  return request({
    url: '/hs/memberComparisonCache',
    method: 'post',
    data: data
  })
}

// 修改数据同步
export function updateMemberComparisonCache(data) {
  return request({
    url: '/hs/memberComparisonCache',
    method: 'put',
    data: data
  })
}

// 删除数据同步
export function delMemberComparisonCache(id) {
  return request({
    url: '/hs/memberComparisonCache/' + id,
    method: 'delete'
  })
}
