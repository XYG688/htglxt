import request from '@/utils/request'

// 查询原始数据列表
export function listHsMemberBaseData(query) {
  return request({
    url: '/hs/hsMemberBaseData/list',
    method: 'get',
    params: query
  })
}

// 查询原始数据详细
export function getHsMemberBaseData(id) {
  return request({
    url: '/hs/hsMemberBaseData/' + id,
    method: 'get'
  })
}

// 新增原始数据
export function addHsMemberBaseData(data) {
  return request({
    url: '/hs/hsMemberBaseData',
    method: 'post',
    data: data
  })
}

// 修改原始数据
export function updateHsMemberBaseData(data) {
  return request({
    url: '/hs/hsMemberBaseData',
    method: 'put',
    data: data
  })
}

// 删除原始数据
export function delHsMemberBaseData(id) {
  return request({
    url: '/hs/hsMemberBaseData/' + id,
    method: 'delete'
  })
}



// 导入数据
export function importData(data) {
  return request({
    url: '/hs/hsMemberBaseData/import',
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



