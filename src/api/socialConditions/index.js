// 社情民意 接口文件

import request from '@/utils/request'

// 社情民意查询接口
export function getSqmyLists(params, data) {
  return request({
    url: 'sqmy/list',
    method: 'post',
    params,
    data
  })
}

// 社情民意 删除
export function deleteSqmy(ids) {
  return request({
    url: `sqmy/${ids}`,
    method: 'get',
  })
}

// 社情民意 回复
export function commentreplySqmy(data) {
  return request({
    url: 'commentreply',
    method: 'post',
    data
  })
}
