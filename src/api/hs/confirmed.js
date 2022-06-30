import request from '@/utils/request'

// 查询确诊病例列表
export function getConfirmedList(query) {
  return request({
    url: '',
    method: 'get',
    params: query
  })
}

// 新增
export function addConfirmed(query) {
  return request({
    url: '',
    method: 'get',
    params: query
  })
}

// 导出
export function exportConfirmedData(query) {
  return request({
    url: '',
    method: 'get',
    params: query
  })
}

// 删除
export function delConfirmed(id) {
  return request({
    url: '' + id,
    method: 'delete',
    params: query
  })
}

// 查看
export function checkConfirmed(query) {
  return request({
    url: '',
    method: 'get',
    params: query
  })
}

// 设置
export function setConfirmed(data) {
  return request({
    url: '',
    method: 'post',
    data: data
  })
}
