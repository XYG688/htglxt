// 党建引领 接口文件

import request from '@/utils/request'

// 党建引领 列表 查询 接口
export function getDjylLists(params, data) {
  return request({
    url: 'djyl/list',
    method: 'post',
    params,
    data
  })
}

// 党建引领 删除
export function deleteDjyl(ids) {
    return request({
      url: `djyl/${ids}`,
      method: 'get',
    })
}
  
  // 党建引领 回复
export function commentreplyDjyl(data) {
    return request({
        url: 'commentreply',
        method: 'post',
        data
    })
}