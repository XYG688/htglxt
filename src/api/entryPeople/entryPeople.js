import request from '@/utils/request'

// 报备管理-入境列表查询
export function getMasses(data) {
  return request({
    url: '/ur/v2/back/global/report/list?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
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
//报备管理-入境修改
export function saveMasses(data) {
    return request({
      url: '/ur/v2/global/report',
      method: 'put',
      data
    })
  }
  //报备管理-入境详情
export function massesDetail(data) {
  return request({
    url: '/ur/v2/global/report/detail',
    method: 'get',
    params:data
  })
}
  //报备管理-入境批量删除
  export function massesDel(data) {
    return request({
      url: '/ur/v2/global/report',
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
  


  
