import request from '@/utils/request'

// 查询网格花名册列表
export function listHsMemberImportCache(query) {
  return request({
    url: '/hs/cache/list',
    method: 'get',
    params: query
  })
}

// 查询网格花名册详细
export function getHsMemberImportCache(id) {
  return request({
    url: '/hs/cache/' + id,
    method: 'get'
  })
}

// 新增网格花名册
export function addHsMemberImportCache(data) {
  return request({
    url: '/hs/cache',
    method: 'post',
    data: data
  })
}

// 修改网格花名册
export function updateHsMemberImportCache(data) {
  return request({
    url: '/hs/cache',
    method: 'put',
    data: data
  })
}

// 删除网格花名册
export function delHsMemberImportCache(id) {
  return request({
    url: '/hs/cache/' + id,
    method: 'delete'
  })
}



// 删除网格花名册
export function delHsMemberImportCacheByUserid() {
  return request({
    url: '/hs/cache/delAll',
    method: 'delete'
  })
}



// 对比数据提交,并删除提交成功记录
export function commit(data) {
  return request({
    url: '/hs/cache/commit',
    method: 'post',
    data: data,
    config:{
      custom: {
        toast: false,
        catch: true
      }
    }
  })
}



// 对比数据提交,并删除提交成功记录
export function commitAll(data) {
  return request({
    url: '/hs/cache/commit/all',
    method: 'post',
    data: data,
    config:{
      custom: {
        toast: false,
        catch: true
      }
    }
  })
}

// 指定用户已比对的某种状态的数据重新比对
export function comparison(data) {
  return request({
    url: '/hs/cache/comparison?state='+data.state,
    method: 'put',
    data: data,
    config:{
      custom: {
        toast: false,
        catch: true
      }
    }
  })
}

// 指定用户已比对的某种状态的数据重新比对
export function comparisonsome(data) {
  return request({
    url: '/hs/cache/comparison/some',
    method: 'put',
    data: data,
    config:{
      custom: {
        toast: false,
        catch: true
      }
    }
  })
}



// 获取用户导入的数据各状态下数量
export function cnt() {
  return request({
    url: '/hs/cache/state/cnt',
    method: 'get'
  })
}



// 导入数据
export function importData(data) {
  return request({
    url: '/hs/cache/import',
    method: 'post',
    data: data,
    config:{
      custom: {
        toast: false,
        catch: true
      }
    }
  })
}

