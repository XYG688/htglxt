import request from '@/utils/request'

// 查询用户列表
export function listMemberWithDetail(data) {
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


