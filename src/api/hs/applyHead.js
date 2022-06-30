import request from '@/utils/request'

// 头像申请列表
export function listApplyHead(data) {
  return request({
    url:'/up/v2/user/avatar/list?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
    method: 'post',
    data
  })
}

// 驳回
export function verify(data) {
  return request({
    url:'/up/v2/user/avatar/verify',
    method: 'post',
    data
  })
}

export function delApply(id) {
  return request({
    url: '/up/v2/user/avatar/request/' + id,
    method: 'delete'
  })
}
export function verifys(data) {
  return request({
    url: '/up/v2/back/user/avatar/verify',
    method: 'put',
    data
  })
}