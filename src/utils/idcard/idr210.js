//创建读卡控件
const CertCtl = new IDCertCtl();
const Url = "http://127.0.0.1:18889"
//身份证读卡控件创建
function IDCertCtl() {
  //创建用于与服务交换数据的对象
  this.xhr = createXmlHttp();
  this.type = "CertCtl";
  this.height = 0;
  this.width = 0;
  this.readyState = undefined;
  //连接
  this.connect = CertCtl_connect;
  //断开
  this.disconnect = CertCtl_disconnect;
  //获取状态
  this.getStatus = CertCtl_getStatus;
  //读卡
  this.readCert = CertCtl_readCert;
  //读IC卡序列号
  this.readICCardSN = CertCtl_readICCardSN;
  //读身份证物理卡号
  this.readIDCardSN = CertCtl_readIDCardSN;
  //读安全模块接口
  this.getSAMID = CertCtl_getSAMID;
}

//创建XMLHttpRequest 对象，用于在后台与服务器交换数据
function createXmlHttp() {
  var xmlHttp = null;
  //根据window.XMLHttpRequest对象是否存在使用不同的创建方式
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();                  //FireFox、Opera等浏览器支持的创建方式
  } else {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");//IE浏览器支持的创建方式
  }
  return xmlHttp;
}

//连接方法
function CertCtl_connect() {
  var result = undefined;
  //创建请求 第一个参数是代表以post方式发送；第二个是请求端口和地址；第三个表示是否异步
  CertCtl.xhr.open("POST", Url + "/api/connect", false);
  // CertCtl.xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  // CertCtl.xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
  // CertCtl.xhr.setRequestHeader('Access-Control-Allow-Credentials', 'true');
  // CertCtl.xhr.setRequestHeader('Access-Control-Allow-Private-Network', 'true');
  // CertCtl.xhr.setRequestHeader('Content-Type', 'application/json');
  console.log(Url + "/api/connect")
  //发送请求
  try {
    CertCtl.xhr.send();
  } catch (e) {
    console.log(e);
    return "未知错误";
  }
  //返回值readyState   0: 请求未初始化
  //				    1: 服务器连接已建立
  //				    2：请求已接收
  //				    3: 请求处理中
  //				    4: 请求已完成，且响应已就绪
  //返回值status      200: "OK"
  //					404: 未找到页面
  //当返回值readyState为4且status为200时,为查询成功
  if (CertCtl.xhr.readyState === 4 && CertCtl.xhr.status === 200) {
    result = CertCtl.xhr.responseText;
    CertCtl.readyState = 1;
    return undefined;
  }

  switch (CertCtl.xhr.readyState) {
    case 0:
      result = "请求未初始化"
      break
    case 1:
      result = undefined
      break
    case 2:
      result = "请求已接收"
      break
    case 3:
      result = "请求处理中"
      break
  }
  if (CertCtl.xhr.status !== 200) {
    result = "页面错误"
  }
  return result;
}

//断开方法
function CertCtl_disconnect() {
  var result = "";
  //创建请求 第一个参数是代表以post方式发送；第二个是请求端口和地址；第三个表示是否异步
  CertCtl.xhr.open("POST", Url + "/api/disconnect", false);
  //发送请求
  try {
    CertCtl.xhr.send();
  } catch (e) {
  }
  if (CertCtl.xhr.readyState == 4 && CertCtl.xhr.status == 200) {
    result = CertCtl.xhr.responseText;
    CertCtl.readyState = 1;
  }
  return result;
}
//获取状态方法
// 0 正常连接， -1 未连接或打开端口失败， -2 未知，需要重试
function CertCtl_getStatus() {
  var result = 0;
  //创建请求 第一个参数是代表以post方式发送；第二个是请求端口和地址；第三个表示是否异步
  CertCtl.xhr.open("POST", Url + "/api/getStatus", false);
  //发送请求
  try {
    CertCtl.xhr.send();
  } catch (e) {
    console.log(e)
    return -2
  }
  if (CertCtl.xhr.readyState === 4 && CertCtl.xhr.status === 200) {
    CertCtl.readyState = 1;
    const ret = JSON.parse(CertCtl.xhr.responseText)
    if (ret.resultFlag === -1) {
      return -2
    }
    if (ret.status === 0) {
      return 0;
    }
    return -1;
  } else {
    result = -2
  }
  return result;
}

//执行读卡操作
function CertCtl_readCert() {
  var result = "";
  try {
    //创建请求 第一个参数是代表以post方式发送；第二个是请求端口和地址；第三个表示是否异步
    CertCtl.xhr.open("POST", Url + "/api/readCard", false); //readCard读卡，不生成正反面仿复印件
    // CertCtl.xhr.open("POST", Url + "/api/readCert", false);	  //readCert读卡，生成正反面仿复印件
    //发送请求
    CertCtl.xhr.send();
    if (CertCtl.xhr.readyState == 4 && CertCtl.xhr.status == 200) {
      result = CertCtl.xhr.responseText;
      CertCtl.readyState = 1;
    }
  } catch (e) {
  }
  return result;
}

//获取IC卡序列号
function CertCtl_readICCardSN() {
  var result = "";
  //创建请求 第一个参数是代表以post方式发送；第二个是请求端口和地址；第三个表示是否异步
  CertCtl.xhr.open("POST", Url + "/api/readICCardSN", false);
  //发送请求
  try {
    CertCtl.xhr.send();
  } catch (e) {
  }
  if (CertCtl.xhr.readyState == 4 && CertCtl.xhr.status == 200) {
    result = CertCtl.xhr.responseText;
    CertCtl.xhr.readyState = 1;
  }
  return result;
}

//获取身份证物理卡号
function CertCtl_readIDCardSN() {
  var result = "";
  //创建请求 第一个参数是代表以post方式发送；第二个是请求端口和地址；第三个表示是否异步
  CertCtl.xhr.open("POST", Url + "/api/readIDCardSN", false);
  //发送请求
  try {
    CertCtl.xhr.send();
  } catch (e) {
  }
  if (CertCtl.xhr.readyState == 4 && CertCtl.xhr.status == 200) {
    result = CertCtl.xhr.responseText;
    CertCtl.xhr.readyState = 1;
  }
  return result;
}

//获取身份证物理卡号
function CertCtl_getSAMID() {
  var result = "";
  //创建请求 第一个参数是代表以post方式发送；第二个是请求端口和地址；第三个表示是否异步
  CertCtl.xhr.open("POST", Url + "/api/getSAMID", false);
  //发送请求
  try {
    CertCtl.xhr.send();
  } catch (e) {
  }
  if (CertCtl.xhr.readyState == 4 && CertCtl.xhr.status == 200) {
    result = CertCtl.xhr.responseText;
    CertCtl.xhr.readyState = 1;
  }
  return result;
}
//转为Json格式
function toJson(str) {
  //var obj = JSON.parse(str);
  //return obj;
  return eval('(' + str + ')');
}

//连接方法
export function idCertConnect() {
  try {
    //调用对应的连接方法,并赋值给result
    var result = CertCtl.connect();
    //如果result为空,代表读卡插件未启动
    if (result === "") {
      return "未启动读卡插件!"
    } else {
      //result页面回显
      // document.getElementById("result").value = result;
      return result
    }
  } catch (e) {
    console.log(e)
    return "未知错误"
  }
}

//断开连接方法
export function idCertDisconnect() {
  try {
    //调用对应的断开连接方法,并赋值给result
    var result = CertCtl.disconnect();
    //如果result为空,代表读卡插件未启动
    if (result == "") {
      return "未启动读卡插件!"
    } else {
      //result页面回显
      // document.getElementById("result").value = result;
      return result
    }
  } catch (e) {
    console.log(e)
    return "未知错误"
  }
}

//获取状态方法
export function idCertGetStatus() {
  try {
    //调用对应的获取状态方法,并赋值给result
    return CertCtl.getStatus();
  } catch (e) {
    return -2
  }
}

//读卡方法
export function idCertReadCert() {
  //开始时间
  var startDt = new Date();
  //调用对应的读卡方法
  var result = CertCtl.readCert();

  let code = 0;
  let errMsg = undefined;
  let body = undefined;
  //如果result为空,代表读卡插件未启动
  if (result === "") {
    // alert("未启动读卡插件!")
    code = -1;
    errMsg = "未启动读卡插件";
  } else {
    //结束时间
    // var endDt = new Date();
    //读卡时间回显
    // document.getElementById("timeElapsed").value = (endDt.getTime() - startDt.getTime()) + "毫秒";
    // document.getElementById("result").value = result;
    //var resultObj = toJson(result);
    //result = result.replace("\"resultFlag\":","\"resultFlag\":\"true\"");
    //格式化result
    //var resultObj = $.parseJSON(result);//windows10上面无法解析
    var resultObj = eval('(' +result+')');
    // console.log(resultObj);
    //resultFlag为0代表读卡成功
    if (resultObj.resultFlag === "0" || resultObj.resultFlag === 0) {
      //回显相关数据
      const resultContent = resultObj.resultContent;
      const bornDay = resultContent.bornDay
      body = {
        // 中国居民身份证：1；外国永久居留身份证：50; 台湾居住证：54；港澳居住证：55；
        certType: resultContent.certType,
        // 姓名
        name: resultContent.partyName,
        // 性别
        sex: resultContent.gender === 0 ? 1 : 0,
        // 民族
        nation: resultContent.nation,
        // 生日 19860911
        birthday: bornDay.substring(0, 4) + "-" + bornDay.substring(4, 6) + "-" + bornDay.substring(6, 8),
        // 住址
        addr1: resultContent.certAddress,
        // 身份证号
        idNumber: resultContent.certNumber,
        // 身份证照片
        headUrl: "data:image/jpeg;base64," + resultContent.identityPic,
        // 签发机关
        certOrg: resultContent.certOrg,
        // 开始期限
        effDate: resultContent.effDate,
        // 结束期限
        expDate: resultContent.expDate
      }
    } else if (resultObj.resultFlag === "-1" || resultObj.resultFlag === -1) {
      code = -1;
      if (resultObj.errorMsg === "端口打开失败") {
        // alert("读卡器未连接");
        errMsg = "读卡器未连接";
      } else {
        // alert(resultObj.errorMsg);
        errMsg = resultObj.errorMsg;
      }
    } else if (resultObj.resultFlag === "-2" || resultObj.resultFlag === -2) {
      code = -1;
      errMsg = resultObj.errorMsg;
    } else {
      code = -1;
      errMsg = "未知错误";
    }

    return { code: code, errMsg: errMsg, body: body };
  }
}

function readICCardSN() {
  try {
    //调用对应的获取状态方法,并赋值给result
    var result = CertCtl.readICCardSN();
    //如果result为空,代表读卡插件未启动
    if (result == "") {
      alert("未启动读卡插件!")
    } else {
      //result页面回显
      document.getElementById("result").value = result;
    }
  } catch (e) {
  }
}

function readIDCardSN() {
  try {
    //调用对应的获取状态方法,并赋值给result
    var result = CertCtl.readIDCardSN();
    //如果result为空,代表读卡插件未启动
    if (result == "") {
      alert("未启动读卡插件!")
    } else {
      //result页面回显
      document.getElementById("result").value = result;
    }
  } catch (e) {
  }
}

function getSAMID() {
  try {
    //调用对应的获取状态方法,并赋值给result
    var result = CertCtl.getSAMID();
    //如果result为空,代表读卡插件未启动
    if (result == "") {
      alert("未启动读卡插件!")
    } else {
      //result页面回显
      document.getElementById("result").value = result;
    }
  } catch (e) {
  }
}
