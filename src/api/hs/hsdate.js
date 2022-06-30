import request from '@/utils/request'

// 查询测量日期列表
export function listHsDate(query) {
  return request({
    url: '/hs/date/list',
    method: 'get',
    params: query
  })
}

