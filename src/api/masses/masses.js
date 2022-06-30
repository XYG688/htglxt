import request from '@/utils/request'

// 报备管理-货车司机列表查询
export function getMasses(data) {
  return request({
    url: '/ur/v2/back/domestic/report/list?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
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
//报备管理-货车司机修改
export function saveMasses(data) {
    return request({
      url: '/ur/v2/domestic/report',
      method: 'put',
      data
    })
  }
  //报备管理-货车司机详情
export function massesDetail(data) {
  return request({
    url: '/ur/v2/domestic/report/detail',
    method: 'get',
    params:data
  })
}
  //报备管理-货车司机批量删除
  export function massesDel(data) {
    return request({
      url: '/ur/v2/domestic/report',
      method: 'delete',
      data:data
    })
  }
   //报备批量审核
   export function batchAuditl(data) {
    return request({
      url: '/ur/v2/back/report/verify',
      method: 'put',
      data:data
    })
  }
  


  
