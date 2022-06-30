import request from '@/utils/request'

// 查询用户列表
export function listMember(data) {
  return request({
    url: '/hs/member/list?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
    method: 'post',
    data: data
  })
}

// 查询用户列表
export function listMember1(data) {
  return request({
    url: '/hs/member/v2/list?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
    method: 'post',
    data: data
  })
}

// 查询用户详细
export function getMember(id) {
  return request({
    url: '/hs/member/' + id,
    method: 'get'
  })
}

// 新增用户
export function addMember(data) {
  return request({
    url: '/hs/member',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateMember(data) {
  return request({
    url: '/hs/member',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delMember(id) {
  return request({
    url: '/hs/member/' + id,
    method: 'delete'
  })
}

// 解绑微信
export function untieWx(id) {
  return request({
    url: '/up/mp/v2/untieWx/' + id,
    method: 'delete'
  })
}


// 删除用户头像
export function delHeadUrl(id) {
  return request({
    url: '/hs/member/delHeadUrl/' + id,
    method: 'put'
  })
}
// 导出
export function exportMember(query) {
  return request({
    url: '/hs/member/export',
    method: 'get',
    params: query
  })
}

// 导入
export function importMember(data) {
  return request({
    url: '/hs/member/import',
    method: 'post',
    data: data,
    config:{
      custom: {
        toast: false,
        catch: true
      }
    }
  })
}

// 模板文件
export function importTemplate() {
  return request({
    url: '/hs/member/importTemplate',
    method: 'get'
  })
}

// 用户数量
export function count() {
  return request({
    url: '/hs/member/count',
    method: 'get'
  })
}

// 村社区下拉列表
export function getCompanyList() {
  return request({
    url: '/company/list',
    method: 'get'
  })
}

// 获取token
export function getImageToken() {
  return request({
    url: '/pcqiniu/token',
    method: 'get'
  })
}
// 查询用户列表
export function updateUserCompany(data) {
  return request({
    url: '/hs/member/company/update/'+data.ids+'?toCompanyId='+data.toCompanyId+'&toCompanyName='+data.toCompanyName,
    method: 'put',
    data: data
  })
}

// 查询用户列表
export function listMember2(data) {
  return request({
    url: '/up/v2/userinfo/list?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
    method: 'post',
    data: data
  })
}
// 查询用户列表
export function updateUserCompany1(data) {
  return request({
    url: '/up/v2/userinfo/company/update?toCompanyId='+data.toCompanyId+'&toCompanyName='+data.toCompanyName,
    method: 'post',
    data: data
  })
}

export function delMember1(id) {
  return request({
    url: '/up/v2/userinfo/' + id,
    method: 'delete'
  })
}

// 查询用户详细
export function getMember1(params) {
  return request({
    url: '/up/v2/back/userinfo',
    method: 'get',
    params
  })
}

// 修改用户
export function updateMember1(data) {
  return request({
    url: '/up/v2/back/userinfo',
    method: 'put',
    data: data
  })
}
// 新增
export function addMember1(data) {
  return request({
    url: '/up/v2/back/userinfo',
    method: 'post',
    data: data
  })
}

// 修改用户头像
export function updateMemberAvater(data) {
  return request({
    url: '/up/v2/back/userinfo/avatar',
    method: 'put',
    data: data
  })
}
// 新增
export function updateCompany(ids,params) {
  return request({
    url: '/up/v2/userinfo/company/update/'+ids,
    method: 'put',
    params
  })
}

// 导入
export function importPassState(data) {
  return request({
    url: '/up/v2/userpassrecord/import',
    method: 'post',
    data: data,
    config:{
      custom: {
        toast: false,
        catch: true
      }
    }
  })
}
