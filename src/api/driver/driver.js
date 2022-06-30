import request from '@/utils/request'

// 报备管理-货车司机列表查询
export function getTruckDriver(data) {
  return request({
    url: '/ur/v2/back/driver/report/list?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
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
  //报备管理-社区/网格
  export function getArea(data) {
    return request({
      url: '/sys/v2/getArea',
      method: 'get',
      params:data
    })
  }
//报备管理-货车司机修改
export function saveTruckDriver(data) {
    return request({
      url: '/ur/v2/driver/report',
      method: 'put',
      data
    })
  }
  //报备管理-货车司机详情
export function truckDriverDetail(data) {
  return request({
    url: '/ur/v2/driver/report/detail',
    method: 'get',
    params:data
  })
}
  //报备管理-货车司机批量删除
  export function truckDriverDel(data) {
    return request({
      url: '/ur/v2/driver/report',
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
  //报备流转
  export function saveGoodstype(data) {
    return request({
      url: '/ur/v2/sp/user/driver/report/goodstype',
      method: 'put',
      data
    })
  }
      //省市区级联
export function cascadeQuery(data) {
  return request({
    transformRequest: (data, headers) => {
      delete headers.Authorization
      return data
  },
    url: '/sys/v2/getAreaSimple',
    method: 'get',
    params:data
  })
}


  
