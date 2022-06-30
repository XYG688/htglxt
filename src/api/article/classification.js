import request from '@/utils/request'

// 查询文章分类 列表
export function listClassification(query) {
  return request({
    url: '/article/classification/list',
    method: 'get',
    params: query
  })
}

// 查询文章分类 详细
export function getClassification(id) {
  return request({
    url: '/article/classification/' + id,
    method: 'get'
  })
}

// 新增文章分类 
export function addClassification(data) {
  return request({
    url: '/article/classification',
    method: 'post',
    data: data
  })
}

// 修改文章分类 
export function updateClassification(data) {
  return request({
    url: '/article/classification',
    method: 'put',
    data: data
  })
}

// 删除文章分类 
export function delClassification(id) {
  return request({
    url: '/article/classification/' + id,
    method: 'delete'
  })
}
