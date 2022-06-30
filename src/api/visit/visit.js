import request from '@/utils/request'

// 查询指定用户出入商区列表
export function getUsersSpVisitRecord(data) {
  return request({
    url: '/up/v2/spvisit/user?userId='+data.userId+'&startTime='+data.startTime+'&endTime='+data.endTime,
    method: 'post',
    data
  })
}
//新增确诊用户
export function diagnosisUserSpVisit(data) {
  return request({
    url: '/up/v2/spvisit/diagnosis',
    method: 'post',
    data
  })
}
//获取确诊用户列表
export function getDiagnosisUserInfoList(data) {
  return request({
    url: '/up/v2/spvisit/user/diagnosis/list',
    method: 'post',
    data
  })
}

//获取指定用户确诊时间列表
export function getDiagnosisUserTimeList(userId) {
  return request({
    url: '/up/v2/spvisit/user/diagnosis/time?userId='+userId,
    method: 'post',
    data:null
  })
}




//获取确诊列表
export function getDiagnosisUserInfoByPage(data) {
  return request({
    url: '/up/v2/spvisit/user/diagnosis',
    method: 'post',
    data
  })
}

//获取密接列表
export function getContactsUserInfoByPage(data) {
  return request({
    url: '/up/v2/spvisit/user/contacts',
    method: 'post',
    data
  })
}



//批量解除用户密接、确诊状态
export function removeUserDiagnosisState(data) {
  return request({
    url: '/up/v2/spvisit/userstate/remove?udrId='+data.udrId+'&isDiagnosis='+data.isDiagnosis,
    method: 'post',
    data:data.userIds
  })
}


//批量解除用户密接、确诊状态
export function removeAllUserDiagnosisState(data) {
  return request({
    url: '/up/v2/spvisit/userstate/diagnosis/remove/list',
    method: 'post',
    data
  })
}

