import request from '@/utils/request'

// 添加核酸检测详情
export function insertHsDetail(data) {
  return request({
    url: '/hs/detail',
    method: 'post',
    data: data
  })
}

