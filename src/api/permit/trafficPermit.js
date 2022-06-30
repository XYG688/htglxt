import request from '@/utils/request'

// 查询申请记录 列表
export function listApply(data) {
  return request({
    url: '/up/v2/back/userpass/list?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
    method: 'post',
    data
  })
}

// 查询申请记录 详细
export function getApply(params) {
  return request({
    url: '/up/v2/userpassrecord/info',
    method: 'post',
    params
  })
}

// 新增申请记录
export function addApply(data) {
  return request({
    url: '/permit/apply',
    method: 'post',
    data: data
  })
}

// 修改申请记录
export function audit(data) {
  return request({
    url: '/permit/apply/audit',
    method: 'put',
    data: data
  })
}

// 修改申请记录
export function updateaudit(data) {
  return request({
    url: '/up/v2/userpassrecord/verify',
    method: 'put',
    data
  })
}

// 修改申请记录
export function audits(id) {
  return request({
    url: '/permit/apply/audit/' + id,
    method: 'put',
  })
}

// 修改申请记录
export function rejecteds(params) {
  return request({
    url: '/permit/apply/rejected/' + params.ids,
    method: 'put',
    data: {
      reject: params.reject
    }
  })
}

// 删除申请记录
export function delApply(data) {
  return request({
    url: '/up/v2/back/userpass',
    method: 'delete',
    data
  })
}

// 修改申请记录
export function auditRejectes(data) {
  return request({
    url: '/up/v2/userpassrecord/verify/list',
    method: 'put',
    data
  })
}

// 删除申请记录
export function updateApply(data) {
  return request({
    url: '/up/v2/back/userpass',
    method: 'put',
    data
  })
}