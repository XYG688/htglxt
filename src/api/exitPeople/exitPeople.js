import request from '@/utils/request'

// 报备管理-出东兴列表查询
export function getMasses(data) {
  return request({
    url: '/ur/v2/back/out/report/list?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
    method: 'post',
    data
  })
}


// 报备管理-出东兴列表查询
export function getMassesDriver(data) {
  return request({
    url: '/ur/v2/back/out/reportDriver/list?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
    method: 'post',
    data
  })
}
  //报备管理-社区/网格
  export function getGrid(data) {
    return request({
      url: '/sys/v2/company/tree',
      method: 'get',
      params:data
    })
  }

//获取用户出东兴报备
export function getOutReportInfo(data) {
  return request({
    url: '/ur/v2/user/out/report',
    method: 'get',
    params:data
  })
}


//报备管理-出东兴修改
export function saveMasses(data) {
    return request({
      url: '/ur/v2/user/out/report',
      method: 'put',
      data
    })
  }
  //报备管理-出东兴批量删除
  export function massesDel(data) {
    return request({
      url: '/ur/v2/user/out/reports',
      method: 'delete',
      data:data
    })
  }
   //报备批量审核
   export function batchAuditl(data) {
    return request({
      url: '/ur/v2/back/out/report/verify',
      method: 'put',
      data:data
    })
  }




