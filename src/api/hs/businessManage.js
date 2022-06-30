import request from '@/utils/request'

// 查询商区申请记录
export function getBusinessList(query) {
  return request({
    url:'/up/api/v2/sp/manager/request',
    method: 'get',
    params: query
  })
}
// 查询商区申请记录
export function getBusinessListV3(data) {
  return request({
    url:'/up/api/v3/sp/manager/request',
    method: 'post',
    data
  })
}

//查询商区申请记录的明细信息
export function getBusinessDetail(query) {
  return request({
    url:'/up/api/v2/sp/manager/request/info',
    method: 'get',
    params: query
  })
}

//商户记录编辑
export function editDetail(data) {
  return request({
    url: '/up/api/v2/sp/info',
    method: 'put',
    data: data
  })
}

//申请通过
export function agreeApply (data) {
  return request ({
    url: '/up/api/v2/sp/agree?spId='+data.spId,
    method: 'post',
    data: data
  })
}

//申请驳回
export function rejectApply(data) {
  return request({
    url: '/up/api/v2/sp/reject',
    method: 'post',
    data: data
  })
}

// 商户出入码申请
export function applicationCode(data) {
  return request({
    url: '/up/api/v2/sp/request',
    method: 'post',
    data: data
  })
}

// 删除
export function delBusinessList(data) {
  return request({
    url: '/up/api/v2/sp/list',
    method: 'delete',
    data
  })
}

// 获取商区流量设置
export function getBusinessFlow(query) {
  return request({
    url:'/up/api/v2/sp/stream/info',
    method: 'get',
    params: query
  })
}

// 设置商区流量设置
export function setBusinessFlow(data) {
  return request({
    url: '/up/api/v2/sp/stream',
    method: 'post',
    data: data
  })
}

// 获取商区流量设置
export function deriveBusiness(params) {
  return request({
    url:'/up/api/v2/sp/manager/request/export',
    method: 'get',
    params
  })
}


// 获取商区流量设置
export function auditsShop(id) {
  return request({
    url: '/up/api/v2/sp/auditsShop/' + id,
    method: 'put',
  })
}
