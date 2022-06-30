import request from '@/utils/request'

// 查询用户点赞 列表
export function listLikePost(query) {
  return request({
    url: '/likePost/likePost/list',
    method: 'get',
    params: query
  })
}

// 查询用户点赞 详细
export function getLikePost(id) {
  return request({
    url: '/likePost/likePost/' + id,
    method: 'get'
  })
}

// 新增用户点赞 
export function addLikePost(data) {
  return request({
    url: '/likePost/likePost',
    method: 'post',
    data: data
  })
}

// 修改用户点赞 
export function updateLikePost(data) {
  return request({
    url: '/likePost/likePost',
    method: 'put',
    data: data
  })
}

// 删除用户点赞 
export function delLikePost(id) {
  return request({
    url: '/likePost/likePost/' + id,
    method: 'delete'
  })
}
