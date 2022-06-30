import request from '@/utils/request'

// 扫码登记列表
export function getCodeScannerList (data) {
  return request({
    url: '/up/v2/back/scan/list?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
    method: 'post',
    data
  })
}

// 详情
export function checkCodeScannerData (query) {
  return request({
    url: '',
    method: 'get',
    params: query
  })
}

// 修改
export function modCodeScannerData (data) {
  return request({
    url: '',
    method: 'put',
    data: data
  })
}


// 删除
export function delCodeScannerData(data) {
  return request({
    url: '/up/v2/back/scan',
    method: 'delete',
    data
  })
}