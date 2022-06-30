import request from '@/utils/request'

// 获取左侧不同人群的列表
export function getUserListByType(params) {
  return request({
    url:'/up/v2/back/userpass/list/byuserstate',
    method: 'get',
    params
  })
}

// 点击个人获取活定位数据
export function getTrackDataByUser (data) {
  if(data.pageNum){
    return request ({
      url: '/up/v2/back/user/track/list?pageNum='+data.pageNum+'&pageSize='+data.pageSize,
      method: 'post',
      data: data
    }) 
  }
  return request ({
    url: '/up/v2/back/user/track/list',
    method: 'post',
    data: data
  })
}

// 点击个人获取活动轨迹
export function getAbnormalstate (data) {
  return request ({
    url: '/back/userpass/list/abnormalstate',
    method: 'post'
  })
}