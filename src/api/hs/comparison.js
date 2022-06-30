import request from '@/utils/request'

// 查询用户列表
export function getList(query) {
  return request({
    url: '/hs/member/v2/list',
    method: 'get',
    params: query
  })
}


// 查询用户列表
export function getDetailList(data) {
  return request({
    url: '/hs/member/detail/list?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
    method: 'post',
    data: data
  })
}

// 导出
export function exportMemberWithDetail(query) {
  return request({
    url: '/hs/member/detail/export',
    method: 'get',
    params: query
  })
}

// 机构树
export function getTree() {
  return request({
    url: '/system/dept/treeselect',
    method: 'get'
  })
}

// 机构树
export function getUserTreeV2() {
  return request({
    url: '/company/tree',
    method: 'get'
  })
}

// 机构树
export function getUserTree() {
  return request({
    url: '/sys/v2/company/tree',
    method: 'get'
  })
}

