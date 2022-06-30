import request from '@/utils/request'

// 查询 疫情区域列表
export function listArea(query) {
  return request({
    url: '/permit/area/list',
    method: 'get',
    params: query
  })
}

// 查询 疫情区域详细
export function getArea(id) {
  return request({
    url: '/permit/area/' + id,
    method: 'get'
  })
}

// 新增 疫情区域
export function addArea(data) {
  return request({
    url: '/permit/area',
    method: 'post',
    config:{
      custom: {
        toast: false,
        catch: true
      }
    },
    data: data
  })
}

// 修改 疫情区域
export function updateArea(data) {
  return request({
    url: '/permit/area',
    method: 'put',
    config:{
      custom: {
        toast: false,
        catch: true
      }
    },
    data: data
  })
}

// 删除 疫情区域
export function delArea(id) {
  return request({
    url: '/permit/area/' + id,
    method: 'delete'
  })
}
