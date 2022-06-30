import request from '@/utils/request'

// 密接查询列表
export function getContiguityList (query) {
  return request({
    url: '',
    method: 'get',
    params: query
  })
}

// 查看
export function checkContiguityData (query) {
  return request({
    url: '',
    method: 'get',
    params: query
  })
}

// 删除
export function delContiguityData(id) {
  return request({
    url: '' + id,
    method: 'delete'
  })
}