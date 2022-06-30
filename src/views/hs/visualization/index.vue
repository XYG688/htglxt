<template>
  <div class="warpper-main">
    <header class="header">
      <el-row>
        <el-col :span="7">
          <section class="announcement-box" :style="{'background': 'url('+bgImgList.head_letf+') 100% 100% no-repeat ', 'background-size': '100% 100%'} ">
            <!-- <span>紧急通知: </span>
            <section class="msg-box" ref="msgBox" :style="msgBoxStyle">
              <span class="msg" ref="scrollMsg">{{msgInfo}}</span>
            </section> -->
          </section>
        </el-col>
        <el-col :span="10">
          <section class="title" :style="{'background': 'url('+bgImgList.head_center+') 100% 100% no-repeat ', 'background-size': '100% 100%'} ">
            <img :src="bgImgList.logo">
            <img :src="bgImgList.words">
          </section>
        </el-col>
        <el-col :span="1" style="width: 5.3333333333%">
          <section @click="getRouter" class="close-box" :style="{'background': 'url('+bgImgList.head_right1+') 100% 100% no-repeat ', 'background-size': '100% 100%', 'cursor':'pointer'} "></section>
        </el-col>
        <el-col :span="5" style="width: 23.8333333333%">
          <section class="time-box" :style="{'background': 'url('+bgImgList.head_right2+') 100% 100% no-repeat ', 'background-size': '100% 100%'}">
            {{timeInfo}}
          </section>
        </el-col>
      </el-row>
    </header>
    <main class="main">
      <el-row>
        <el-col :span="6" style="width:calc(25% - 40px);margin:0 20px;">
          <section class="left-header" :style="{'background': 'url('+bgImgList.bg_left1+') 100% 100% no-repeat ', 'background-size': '100% 100%'} ">
            <h3 :style="{'background': 'url('+bgImgList.bg_title+') left 100% no-repeat '} ">今日商区人流量统计</h3>
            <section id='visitorsFlowRate' style="width: 100%;height: 320px"></section>
          </section>
          <section class="left-main" :style="{'background': 'url('+bgImgList.bg_left1+') 100% 100% no-repeat ', 'background-size': '100% 100%'} ">
            <h3 :style="{'background': 'url('+bgImgList.bg_title+') left 100% no-repeat '} ">今日出入城人流统计</h3>
            <ul>
              <li>
                <h4>出城区扫码人数</h4>
                <p>{{infoCnt.cpTotalStream.outStreanCnt}}</p>
              </li>
              <li>
                <h4>入城区扫码人数</h4>
                <p>{{infoCnt.cpTotalStream.inStreamCnt}}</p>
              </li>
              <li>
                <h4>净流入人数</h4>
                <p>{{infoCnt.cpTotalStream.inStreamCnt-infoCnt.cpTotalStream.outStreanCnt}}</p>
              </li>
            </ul>
            <el-table :data="inAndOutOfTheCityList" height="122px" ref="table">
              <el-table-column label="检查站名称" align="center" prop="spName" />
              <el-table-column label="出城区扫码" align="center" prop="streamOutCnt" />
              <el-table-column label="入城区扫码" align="center" prop="streamInCnt" />
              <el-table-column label="净流入" align="center">
                <template slot-scope="scope">
                  {{scope.row.streamInCnt-scope.row.streamOutCnt}}
                </template>
              </el-table-column>
            </el-table>
          </section>
          <section class="left-footer" :style="{'background': 'url('+bgImgList.bg_left1+') 100% 100% no-repeat ', 'background-size': '100% 100%'} ">
            <h3 :style="{'background': 'url('+bgImgList.bg_title+') left 100% no-repeat '} ">按户籍类型统计</h3>
            <section id='censusRegister' style="width: 100%;height: 240px"></section>
          </section>
        </el-col>
        <el-col :span="12">
          <section class="center-header" :style="{'background': 'url('+bgImgList.bg_center1+') 100% 100% no-repeat ', 'background-size': '100% 100%'} ">
            <ul>
              <li>
                <h5>用户注册数</h5>
                <section class="item">
                  <img :src="bgImgList.center_icon1">
                  <span class="num">{{dataCnt.userCnt}}</span>
                  <!-- <span class="unit">万</span> -->
                </section>
              </li>
              <li>
                <h5>今日扫码次数</h5>
                <section class="item">
                  <img :src="bgImgList.center_icon2">
                  <span class="num">{{dataCnt.streamCnt}}</span>
                </section>
              </li>
              <li>
                <h5>通行证异常人数</h5>
                <section class="item">
                  <img :src="bgImgList.center_icon3">
                  <span class="num">{{dataCnt.abnormalPassCnt}}</span>
                </section>
              </li>
              <li>
                <h5>登记场所数</h5>
                <section class="item">
                  <img :src="bgImgList.center_icon4">
                  <span class="num">{{dataCnt.spCnt}}</span>
                </section>
              </li>
            </ul>
          </section>
          <section class="center-main">
            <!-- <baidu-map class="bm-view" ref="map" id="map" :zoom="mapInfo.zoom" :center="mapInfo.center" :scroll-wheel-zoom="true">
              <bm-marker v-if="bmInfoWindow.show" :position="bmInfoWindow.position" :dragging="true" :icon="{url: bgImgList.icon_center_circle, size: {width: 30, height: 30}}"></bm-marker>
              <bm-info-window :position="bmInfoWindow.position" :show="bmInfoWindow.show">
                <section class="map-item-box">
                  <section class="map-header">
                    <el-image>
                      <div slot="error" class="image-slot" src="val.headUrl">
                        <img :src="bmInfoWindowUserInfo.avatar"/>
                      </div>
                    </el-image>
                    <p>{{ bmInfoWindowUserInfo.name }}</p>
                  </section>
                  <section class="map-main">
                    <ul>
                      <li>
                        <span class="label">联系电话：</span>
                        <span>{{ bmInfoWindowUserInfo.phone }}</span>
                      </li>
                      <li>
                        <span class="label">定位地址：</span>
                        <span>{{ bmInfoWindowUserInfo.spAddr }}</span>
                      </li>
                      <li>
                        <span class="label">所属网格：</span>
                        <span>{{ bmInfoWindowUserInfo.companyName }}</span>
                      </li>
                      <li>
                        <span class="label">异常原因：</span>
                        <span style="color: red;font-weight: 600;">{{ getStateTxt(bmInfoWindowUserInfo.state) }}</span>
                      </li>
                    </ul>
                  </section>
                </section>
              </bm-info-window>
            </baidu-map> -->
              <TrackEvents :userId = 'userId1'></TrackEvents>
          </section>
          <section class="center-footer" :style="{'background': 'url('+bgImgList.bg_center2+') 100% 100% no-repeat ', 'background-size': '100% 100%'} ">
            <h3 :style="{'background': 'url('+bgImgList.bg_title+') left 100% no-repeat '} ">今日重点场所监测</h3>
            <section class="slideshow">
              <section class="btn left">
                <!-- <img :src="bgImgList.left" ref="leftBtn"> -->
              </section>
              <el-table-column label="检查站名称" align="center" prop="spName" />
              <el-table-column label="出城区扫码" align="center" prop="streamOutCnt" />
              <el-table-column label="入城区扫码" align="center" prop="streamInCnt" />
              <el-table-column label="净流入" align="center">
                <template slot-scope="scope">
                  {{(scope.row.streamInCnt-scope.row.streamOutCnt)>=0?(scope.row.streamInCnt-scope.row.streamOutCnt):0}}
                </template>
              </el-table-column>
              <section class="slideshow-main" ref="slideshowBox" :style="slideshowStyle">
                <el-carousel height="150px" interval="9000">
                  <el-carousel-item v-for="(list, index) in dataList" :key="index" class="el-car-item">
                    <section v-for="(item, index1) in list" :key="index1" class="monitor-item">
                        <h5>{{ item.spName }}</h5>
                        <section class="list-data">
                          <section class="list-data-item">
                            <h6>进场</h6>
                            <section class="hint"></section>
                            <p>{{ item.streamInCnt }}</p>
                          </section>
                          <section class="list-data-item">
                            <h6>出场</h6>
                            <section class="hint"></section>
                            <p>{{ item.streamOutCnt }}</p>
                          </section>
                          <section class="list-data-item">
                            <h6>在场人流</h6>
                            <section class="hint"></section>
                            <p>{{item.streamInCnt-item.streamOutCnt}}</p>
                          </section>
                          <section class="list-data-item">
                            <h6>超出人数</h6>
                            <section class="hint">上限<={{item.warnStreamMax}}</section>
                            <p>{{ (item.streamInCnt-item.streamOutCnt) <= item.warnStreamMax?0:(item.streamInCnt-item.streamOutCnt-item.warnStreamMax) }}</p>
                          </section>
                        </section>
                      </section>
                  </el-carousel-item>
                </el-carousel>
                <!-- <el-carousel :loop="false" :autoplay="false" height="204px" v-if="dataList.length > 0">
                    <el-carousel-item class="el-car-item" v-for="(list, index) in dataList" :key="index">
                      1
                      <section v-for="(item, index1) in list" :key="index1" class="monitor-item">
                        <h5>{{ item.spName }}</h5>
                        <section class="list-data">
                          <section class="list-data-item">
                            <h6>进场</h6>
                            <section class="hint"></section>
                            <p>{{ item.streamInCnt }}</p>
                          </section>
                          <section class="list-data-item">
                            <h6>出场</h6>
                            <section class="hint"></section>
                            <p>{{ item.streamOutCnt }}</p>
                          </section>
                          <section class="list-data-item">
                            <h6>在场人流</h6>
                            <section class="hint"></section>
                            <p>{{(item.streamInCnt-item.streamOutCnt)>=0?(item.streamInCnt-item.streamOutCnt):0}}</p>
                          </section>
                          <section class="list-data-item">
                            <h6>超出人数</h6>
                            <section class="hint">上限<={{item.warnStreamMax}}</section>
                            <p>{{ (item.streamInCnt-item.streamOutCnt) <= item.warnStreamMax?0:(item.streamInCnt-item.streamOutCnt-item.warnStreamMax) }}</p>
                          </section>
                        </section>
                      </section>
                    </el-carousel-item>
                </el-carousel> -->
                <!-- <ul ref="slideshow" v-if="monitorList.length > 0">
                  <li v-for="(item, index) in monitorList" :key="index" :style="slideshowItemStyle">
                    <h5>{{ item.spName }}</h5>
                    <section class="list-data">
                      <section class="list-data-item">
                        <h6>进场</h6>
                        <section class="hint"></section>
                        <p>{{ item.streamInCnt }}</p>
                      </section>
                      <section class="list-data-item">
                        <h6>出场</h6>
                        <section class="hint"></section>
                        <p>{{ item.streamOutCnt }}</p>
                      </section>
                      <section class="list-data-item">
                        <h6>在场人流</h6>
                        <section class="hint"></section>
                        <p>{{(item.streamInCnt-item.streamOutCnt)>=0?(item.streamInCnt-item.streamOutCnt):0}}</p>
                      </section>
                      <section class="list-data-item">
                        <h6>超出人数</h6>
                        <section class="hint">上限<={{item.warnStreamMax}}</section>
                        <p>{{ (item.streamInCnt-item.streamOutCnt) <= item.warnStreamMax?0:(item.streamInCnt-item.streamOutCnt-item.warnStreamMax) }}</p>
                      </section>
                    </section>
                  </li>
                </ul> -->
              </section>

              <section class="btn right">
                <!-- <img :src="bgImgList.right" ref="rightBtn"> -->
              </section>
            </section>
          </section>
        </el-col>
        <el-col :span="6" style="width:calc(25% - 40px);margin:0 20px;">
          <section class="right-header" :style="{'background': 'url('+bgImgList.bg_left1+') 100% 100% no-repeat ', 'background-size': '100% 100%'} ">
            <h3 :style="{'background': 'url('+bgImgList.bg_title+') left 100% no-repeat '} ">今日居民扫码出入场登记</h3>
            <h5><span>{{dataCnt.userQrCnt}}</span>人</h5>
            <el-table :data="abnormalist" :row-class-name="tableRowClassName" height="212px" ref="abnorma" @row-click="rowClick">
              <el-table-column label="姓名" align="center" prop="name" />
              <el-table-column label="商区名称" align="center" prop="spName" />
              <el-table-column label="登记时间" align="center" prop="createTime" >
                <template slot-scope="scope">
                  {{parseTime(scope.row.createTime, '{h}:{i}')}}
                </template>
              </el-table-column>
            </el-table>
          </section>
          <section class="right-main" :style="{'background': 'url('+bgImgList.bg_left1+') 100% 100% no-repeat ', 'background-size': '100% 100%'} ">
            <h3 :style="{'background': 'url('+bgImgList.bg_title+') left 100% no-repeat '} ">今日通行证异常外出扫码预警</h3>
            <h5><span>{{sweepCodeWarninglist.length}}</span>人</h5>
            <el-table :data="sweepCodeWarninglist" height="212px" ref="sweepCodeWarning" @row-click="rowClick">
              <el-table-column label="姓名" align="center" prop="name" />
              <el-table-column label="联系电话" align="center" prop="phone" />
              <el-table-column label="登记时间" align="center" prop="createTime" >
                <template slot-scope="scope">
                  {{parseTime(scope.row.createTime, '{h}:{i}')}}
                </template>
              </el-table-column>
            </el-table>
          </section>
          <section class="right-footer" :style="{'background': 'url('+bgImgList.bg_right+') 100% 100% no-repeat ', 'background-size': '100% 100%'} ">
            <h3 :style="{'background': 'url('+bgImgList.bg_title+') left 100% no-repeat '} ">疑似风险人员总数</h3>
            <section class="risk">
              <section class="riskSumNum">
                <h6>总人数</h6>
                <p>{{dataCnt.userStateCnt && dataCnt.userStateCnt.length>0?(dataCnt.userStateCnt[2]+dataCnt.userStateCnt[3]+dataCnt.userStateCnt[4]+dataCnt.userStateCnt[5]):0}}</p>
              </section>
              <section class="riskEchart" id="riskEchart" style="height: 140px;"></section>
            </section>
          </section>
        </el-col>
      </el-row>
    </main>
  </div>
</template>

<script>

import echarts from 'echarts'
import { getTotalCnt, getUserInfo, getStreamInfo, getStreamCnt } from '@/api/hs/visualization'
import TrackEvents from './components/trackEvents/index.vue'
export default {
  name: "",
  dicts: ['business_type'],
  components: {TrackEvents},
  data() {
    return {
      msgInfo: '“健康上海12320”微信公众号消息，2022年4月29日0—24时，新增本土新冠肺炎确诊病例1249和无症状感染者8932例，其中985例确诊病例为既往无症状感染者转归，264例确诊病例和8932例无症状感染者在隔离管控中发现。新增境外输入性新冠肺炎确诊病例1例，在闭环管控中发现。',
      msgBoxStyle: {
        width: (Math.floor(document.documentElement.clientWidth * 0.25)) - 80 + 'px'
      },
      slideshowStyle: {
        width: (Math.floor(document.documentElement.clientWidth * 0.5)) - 80 + 'px'
      },
      slideshowItemStyle: {
        width: Math.floor(((document.documentElement.clientWidth * 0.5) - 80)/3 - 9) + 'px'
      },
      bgImgList: {
        head_letf: require("@/assets/visualization/head_letf.png"),
        logo: require("@/assets/visualization/logo.png"),
        words: require("@/assets/visualization/words.png"),
        head_center: require("@/assets/visualization/head_center.png"),
        head_right1: require("@/assets/visualization/head_right1.png"),
        head_right2: require("@/assets/visualization/head_right2.png"),
        bg_left1: require("@/assets/visualization/bg_left1.png"),
        bg_title: require("@/assets/visualization/bg_title.png"),
        bg_center1: require("@/assets/visualization/bg_center1.png"),
        center_icon1: require("@/assets/visualization/center_icon1.png"),
        center_icon2: require("@/assets/visualization/center_icon2.png"),
        center_icon3: require("@/assets/visualization/center_icon3.png"),
        center_icon4: require("@/assets/visualization/center_icon4.png"),
        bg_center2: require("@/assets/visualization/bg_center2.png"),
        left: require("@/assets/visualization/left.png"),
        right: require("@/assets/visualization/right.png"),
        bg_right: require("@/assets/visualization/bg_right.png"),
        icon_chuli: require("@/assets/visualization/icon_chuli.png"),
        icon_xiangqing: require("@/assets/visualization/icon_xiangqing.png"),
        icon_center_circle: require("@/assets/visualization/icon_center_circle.png"),
      },
      timeInfo: '',
      inAndOutOfTheCityList: [],
      monitorList: [],
      mapInfo: {
        zoom: 20,
        center: {
          'lat': 21.54792,
          'lng': 107.97188
        }
      },
      bmInfoWindow: {
        position: {
          'lat': 21.54792,
          'lng': 107.97188
        },
        show: false
      },
      bmInfoWindowUserInfo: {},
      defaultUserImg: require("@/assets/visualization/ptd.jpg"),
      dataCnt: {},
      userId: null,
      userId1: null,
      state: 1,
      infoCnt: {
        cpTotalStream: {
          outStreanCnt: 0,
          inStreamCnt: 0
        }
      },
      timer1: null,
      timer2: null,
      timer3: null,
      timer4: null,
      timer5: null,
      timer6: null,
      timer7: null,
      timer8: null,
      timer: null,
      sweepCodeWarninglist: [],
      abnormalist: [],
      msg: null,
      dataList: []
    };
  },
  created() {
    let that = this;
    this.init(1);
    this.timer = window.setInterval(function(){
      window.clearInterval(that.timer2);
      window.clearInterval(that.timer3);
      window.clearInterval(that.timer4);
      window.clearInterval(that.timer1);
      window.clearTimeout(that.timer5);
      window.clearTimeout(that.timer6);
      window.clearTimeout(that.timer7);
      that.timer = null;
      that.timer1 = null;
      that.timer2 = null;
      that.timer3 = null;
      that.timer4 = null;
      that.timer5 = null;
      that.timer6 = null;
      that.timer7 = null;
      that.init()
    }, 1000 * 60 * 10);
  },
  beforeDestroy() {
    clearInterval(this.tableInterval);
    window.clearInterval(this.timer2);
    window.clearInterval(this.timer3);
    window.clearInterval(this.timer4);
    window.clearInterval(this.timer1);
    window.clearTimeout(this.timer5);
    window.clearTimeout(this.timer6);
    window.clearTimeout(this.timer7);
    this.timer = null;
    this.timer1 = null;
    this.timer2 = null;
    this.timer3 = null;
    this.timer4 = null;
    this.timer5 = null;
    this.timer6 = null;
    this.timer7 = null;
  },
  destroyed() {
    clearInterval(this.tableInterval);
    window.clearInterval(this.timer2);
    window.clearInterval(this.timer3);
    window.clearInterval(this.timer4);
    window.clearInterval(this.timer1);
    window.clearTimeout(this.timer5);
    window.clearTimeout(this.timer6);
    window.clearTimeout(this.timer7);
    this.timer = null;
    this.timer1 = null;
    this.timer2 = null;
    this.timer3 = null;
    this.timer4 = null;
    this.timer5 = null;
    this.timer6 = null;
    this.timer7 = null;
  },
  mounted() {
  },
  methods: {
    async init(num=false) {
      await getTotalCnt().then(res =>{
        this.dataCnt = res.data;
        this.abnormalist = res.data.userQrList;
        this.sweepCodeWarninglist = res.data.abnormalUserQrList ? res.data.abnormalUserQrList:[];
      })

      await getStreamInfo().then(res =>{
        this.monitorList = res.data;
      })

      await getStreamCnt().then(res =>{
        this.infoCnt = res.data;
        this.inAndOutOfTheCityList = res.data.cpTotalStreamList;
      })

      let that = this;
      //公告滚动
      //this.handleScrollMsg();

      //获取当前系统时间
      that.getWindowTime();
      window.setInterval(function(){that.getWindowTime()}, 1000);

      //今日商区人流量统计
      this.visitorsFlowRate();

      //今日出入城人流统计
      setTimeout(function(){
        that.inAndOutOfTheCity(num);
      },1000)

      //按户籍类型统计
      this.censusRegister();

      //地图初始化
      // if(this.abnormalist.length>1){

      // }
      if(this.abnormalist && this.abnormalist.length>1){
        this.rowClick(this.abnormalist[0])
      }else if(this.sweepCodeWarninglist && this.sweepCodeWarninglist.length>1){
        this.rowClick(this.sweepCodeWarninglist[0])
      }
      //this.initMap(this.abnormalist.length>1?this.abnormalist[0].userId:false);

      //重点场所监测
      this.monitor(num);

      //今日通行证异常人数
      setTimeout(function(){
        that.abnorma(num);
      },1000)

      //通行证异常外出扫码预警
      setTimeout(function(){
        that.sweepCodeWarning(num);
      },1000)

      //疑似风险人员总数
      this.risk();
    },
    //公告滚动
    handleScrollMsg() {
      let speed = 30//字体的整体滚动速度
      let box = this.$refs.msgBox
      let msg = this.$refs.scrollMsg

      let scroll = ()=>{
        if (msg.offsetLeft <= (- msg.offsetWidth)) {
          msg.style.left = box.offsetWidth + 'px'
        }else{
          msg.style.left = msg.offsetLeft - 1 + 'px'
        }
      }

      let timer = window.setInterval(scroll,speed)
      //鼠标移动到通知内容上暂停
      msg.onmouseover = ()=>{
        window.clearInterval(timer);
      }
      //移开继续滚动
      msg.onmouseout = ()=>{
        timer = window.setInterval(scroll,speed)
      }
    },
    //获取当前系统时间
    getWindowTime() {
      var date = new Date();

      this.timeInfo = date.getFullYear()+'-'+this.numZero(date.getMonth()+1)+'-'+this.numZero(date.getDate())+" "+this.numZero(date.getHours())+":"+this.numZero(date.getMinutes())+":"+this.numZero(date.getSeconds())+" "+this.weekInfo(date.getDay());
    },
    //今日商区人流量统计
    visitorsFlowRate() {
      let data = []
      this.dict.type.business_type.forEach(item=>{
        if(item.value != '-1'){
          data.push({
            value: this.infoCnt.spTypeStream[item.value],
            name: item.label
          })
        }
      })
      const getchart = echarts.init(document.getElementById('visitorsFlowRate'))
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color:['#489FFD','#ED7573','#A6EA89','#E7A974','#808AE0','#842182','#E4D365','#562085','#9F887A'],
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: "10%",
          top: 40,
          icon: 'rect',
          itemWidth:10,
          itemHeight:10,
          textStyle:{
            color:'#ffffff',
          },
          formatter:  function(name){
            var total = 0;
            var target;
            for (var i = 0, l = data.length; i < l; i++) {
              total += data[i].value;
              if (data[i].name == name) {
                target = data[i].value;
              }
            }
            var arr = [
               '{a|'+ name+'}    {b|'+target+'}'

            ]
            return arr.join('\n')
            //return name + ' ' + target;
          },
          textStyle:{
            rich:{
              a:{
                color: '#fff',
                width: 50,
              },
              b:{
                color: '#489FFD',
              }
            }
          }
        },
        series: [
          {
            name: 'Radius Mode',
            type: 'pie',
            radius: ['25%', '40%'],
            center: ['40%', '50%'],
            roseType: 'radius',
            itemStyle:{
              normal:{
                label:{
                    show: true,
                    formatter: '{d}%'//显示格式
                },
                labelLine:{
                  show:true,
                  length: 10,
                  length2: 10
                }
              }
            },
            startAngle: 120,
            label: {
              show: true
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: data.sort(function (a, b) {
              return b.value - a.value;
            })
          }
        ]
      }
      getchart.setOption(option)
      // 随着屏幕大小调节图表
      window.addEventListener('resize', () => {
        getchart.resize()
      })
    },
    //今日出入城人流统计
    inAndOutOfTheCity(num) {
      let that = this;
        that.timer2 = null;
      // 拿到表格挂载后的真实DOM
      const table = this.$refs.table;
      // 拿到表格中承载数据的div元素
      const divData = table.bodyWrapper
      divData.scrollTop = 0
      if(num){
        divData.onmouseover = function () {
          window.clearInterval(that.timer2);
          that.timer2 = null;
          window.clearTimeout(this.timer5);
          that.timer5 = null;
        }; //鼠标移入，停止滚动
        divData.onmouseout = function () {
          if(!that.timer2){
            start()
          }
        };
      }
       //鼠标移出，继续滚动

      // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
      function start() {
        // 数据少于表格高度停止滚动
        if (divData.clientHeight >= divData.scrollHeight){
          return;
        }
        that.timer2  = window.setInterval(() => {
          // 元素自增距离顶部1像素
          divData.scrollTop += 1
          if (divData.clientHeight + divData.scrollTop >= divData.scrollHeight - 1) {
            // 重置table距离顶部距离
            divData.scrollTop = 0
            window.clearInterval(that.timer2);
            that.timer2 = null;
            window.clearTimeout(that.timer5);
            that.timer5 = null;
            that.timer5 = setTimeout(function(){
              start()
            },1000)
          }
        }, 50)
      }
      start()
    },
    //按户籍类型统计
    censusRegister() {
      let data = [
        { value: this.dataCnt.userCensus['1'], name: '东兴户籍本地居住' },
        { value: this.dataCnt.userCensus['2'], name: '东兴户籍非本地居住' },
        { value: this.dataCnt.userCensus['3'], name: '外地户籍非东兴居住' },
        { value: this.dataCnt.userCensus['4'], name: '外地户籍东兴居住' }
      ]
      const getchart = echarts.init(document.getElementById('censusRegister'))
      var option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        color:['#489FFD','#ED7573','#A6EA89','#E7A974','#808AE0','#842182','#E4D365','#562085','#9F887A'],
        series: [
          {
            name: 'Radius Mode',
            type: 'pie',
            radius: ['25%', '40%'],
            center: ['50%', '50%'],
            itemStyle:{
              normal:{
                label:{
                    show: true,
                    formatter: '{a|{b}} \n{b|{c}}',//显示格式
                    padding: [-60, -80],
                    color: '#fff',
                    rich:{
                      a: {
                        height: 20,
                        fontSize: 14,
                        color: "#fff"
                      }
                    }
                },
                labelLine:{
                  show:true,
                  length: 10,
                  length2: 80
                }
              }
            },
            startAngle: 120,
            label: {
              show: true
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: data.sort(function (a, b) {
              return b.value - a.value;
            })
          }
        ]
      }
      getchart.setOption(option)
      // 随着屏幕大小调节图表
      window.addEventListener('resize', () => {
        getchart.resize()
      })
    },
    //地图初始化
    initMap(index, type) {
      if(!index){
        this.$set(this.bmInfoWindow, 'show', false);
        return false;
      }
      if(this.userId != index){
        this.userId = index;
        getUserInfo({userId: index}).then(res=>{
          if(res.data){
            this.bmInfoWindowUserInfo = {...res.data,state: this.state}
            this.$set(this.bmInfoWindow, 'show', true)
            this.mapInfo.center = {
              lat: this.bmInfoWindowUserInfo.lat + 0.0003,
              lng: this.bmInfoWindowUserInfo.lng
            }
            this.bmInfoWindow.position = {
              lat: this.bmInfoWindowUserInfo.lat,
              lng: this.bmInfoWindowUserInfo.lng
            }
          }else{
            this.$set(this.bmInfoWindow, 'show', false)
          }
        })
      }else{
        this.bmInfoWindowUserInfo.state = this.state
      }
    },
    //重点场所监测
    monitor(num) {
      let newDataList = []
      let current = 0
      if(this.monitorList && this.monitorList.length>0){
        for(let i=0;i<=this.monitorList.length-1;i++){
          if(i%3 !== 0 || i === 0 ){
            if(!newDataList[current]){
              newDataList.push([this.monitorList[i]])
            }else{
              newDataList[current].push(this.monitorList[i])
            }
          }else{
            current++
            newDataList.push([this.monitorList[i]])
          }
        }
      }
      this.dataList = [...newDataList]
      console.log(this.dataList)
      // return false;
      // let that = this;
      // this.timer1 = null;
      // if(this.monitorList.length > 3){//场所大于三,轮巡启动
      //   this.showMonitorBtn = true;
      //   let speed = 3000//字体的整体滚动速度
      //   let box = this.$refs.slideshowBox
      //   let msg = this.$refs.slideshow
      //   let width = Math.floor(((document.documentElement.clientWidth * 0.5) - 80)/3)
      //   msg.style.transition = 'all 0s'
      //   msg.style.left = "0px";
      //   let scroll = ()=>{
      //     if (msg.offsetLeft <= (- msg.offsetWidth)) {
      //       msg.style.left = box.offsetWidth + 'px'
      //     }else{
      //       msg.style.transition = 'all 2.5s'
      //       msg.style.left = msg.offsetLeft - width + 'px';
      //     }
      //   }
      //   if(num){
      //     msg.addEventListener("webkitTransitionEnd",function() {
      //       let newItem = that.monitorList[0];
      //       msg.style.transition = 'all 0s'
      //       that.monitorList.splice(0,1);
      //       that.monitorList.push(newItem);
      //       msg.style.left = '0px';
      //     });
      //     msg.onmouseover = ()=>{
      //       window.clearInterval(that.timer1);
      //       that.timer1 = null;
      //     }
      //     //移开继续滚动
      //     msg.onmouseout = ()=>{
      //       that.timer1 = window.setInterval(scroll,speed)
      //     }
      //   }
      //   this.timer1 = window.setInterval(scroll,speed)
      //   //鼠标移动到通知内容上暂停
      // }
    },
    //今日通行证异常人数
    abnorma(num) {
      let that = this;
        that.timer3 = null;
      // 拿到表格挂载后的真实DOM
      const table = this.$refs.abnorma;
      // 拿到表格中承载数据的div元素
      const divData = table.bodyWrapper
      divData.scrollTop = 0
      if(num){
        divData.onmouseover = function () {
          window.clearInterval(that.timer3);
          that.timer3 = null;
          window.clearTimeout(that.timer6);
          that.timer6 = null;
        }; //鼠标移入，停止滚动
        divData.onmouseout = function () {
          if(!that.timer3){
            start()
          }
        };
      }
       //鼠标移出，继续滚动

      // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
      function start() {
        // 数据少于表格高度停止滚动
        if (divData.clientHeight >= divData.scrollHeight){
          return;
        }
        that.timer3 = window.setInterval(() => {
          // 元素自增距离顶部1像素
          divData.scrollTop += 1
          if (divData.clientHeight + divData.scrollTop >= divData.scrollHeight - 1) {
            // 重置table距离顶部距离
            divData.scrollTop = 0
            window.clearInterval(that.timer3);
            that.timer3 = null;
            window.clearTimeout(that.timer6);
            that.timer6 = null;
            that.timer6 = setTimeout(function(){
              start()
            },1000)
          }
        }, 50)
      }
      start()
    },
    //按户籍类型统计
    risk() {
      let data = [this.dataCnt.userStateCnt[2],this.dataCnt.userStateCnt[3],this.dataCnt.userStateCnt[4],this.dataCnt.userStateCnt[5]],
          sociosomaticDistinctionSeriesSumArray = [];
      let sociosomaticDistinctionNewsum = data.reduce((n, m) => n + m);
      data.forEach(item => {
        if (!sociosomaticDistinctionNewsum) {
          sociosomaticDistinctionSeriesSumArray.push(100)
        } else {
          sociosomaticDistinctionSeriesSumArray.push(sociosomaticDistinctionNewsum)
        }
      })
      const getchart = echarts.init(document.getElementById('riskEchart'))
      var option = {
        legend: {
          show:false
        },
        color: [],
        xAxis: {
          type: 'value', //坐标轴类型,分别有：
          //'value'-数值轴；'category'-类目轴;
          //'time'-时间轴;'log'-对数轴
          splitLine: { show: false }, //坐标轴在 grid 区域中的分隔线
          axisLabel: { show: false }, //坐标轴刻度标签
          axisTick: { show: false }, //坐标轴刻度
          axisLine: { show: false }, //坐标轴轴线
        },
        yAxis: {
          type: 'category',
          axisTick: { show: false },
          axisLine: { show: false },
          axisLabel: {
            color: '#fff',
            fontSize: 14
          },
          data: ["健康监测人数","居家隔离人数","集中隔离人数"]
        },
        grid: {
          top: 20,
          left: 100,
          height: '70%'
        },
        series: [
          //系列列表。每个系列通过 type 决定自己的图表类型
          {
            name: '%', //系列名称
            type: 'bar', //柱状、条形图
            barWidth: 10, //柱条的宽度,默认自适应
            silent: true,
            data: data, //系列中数据内容数组
            label: {
              //图形上的文本标签
              normal: {
                show: false//标签内容格式器 {a}-系列名,{b}-数据名,{c}-数据值
              }
            },
            itemStyle: {
              //图形样式
              normal: {
                //normal 图形在默认状态下的样式;
                //emphasis图形在高亮状态下的样式
                barBorderRadius: 5, //柱条圆角半径,单位px.
                //此处统一设置4个角的圆角大小;
                //也可以分开设置[10,10,10,10]顺时针左上、右上、右下、左下
                color: '#489FFD'
              }
            },
            zlevel: 1 //柱状图所有图形的 zlevel 值,
            //zlevel 大的 Canvas 会放在 zlevel 小的 Canvas 的上面
          },
          {
            name: '进度条背景',
            type: 'bar',
            barGap: '-100%', //不同系列的柱间距离，为百分比。
            // 在同一坐标系上，此属性会被多个 'bar' 系列共享。
            // 此属性应设置于此坐标系中最后一个 'bar' 系列上才会生效，
            //并且是对此坐标系中所有 'bar' 系列生效。
            barWidth: 10,
            silent: true,
            data: sociosomaticDistinctionSeriesSumArray,
            itemStyle: {
              normal: {
                barBorderRadius: 5,
                color: '#113E76', //柱条颜色,
              }
            },
            label: {
              //图形上的文本标签
              normal: {
                show: true,
                position: 'right', //标签的位置
                offset: [0, 0], //标签文字的偏移，此处表示向上偏移40
                formatter: function(value,index) {
                  return data[value.dataIndex]
                },
                color: '#fff'
              }
            }
          }
        ]
      }
      getchart.setOption(option)
      // 随着屏幕大小调节图表
      window.addEventListener('resize', () => {
        getchart.resize()
      })
    },
    //通行证异常外出扫码预警
    sweepCodeWarning(num) {
      let that = this;
      that.timer4 = null;
      // 拿到表格挂载后的真实DOM
      const table = this.$refs.sweepCodeWarning;
      // 拿到表格中承载数据的div元素
      const divData = table.bodyWrapper
      divData.scrollTop = 0;
      if(num){
        divData.onmouseover = function () {
          window.clearInterval(that.timer4);
          that.timer4 = null;
          window.clearTimeout(that.timer7);
          that.timer7 = null;
        }; //鼠标移入，停止滚动
        divData.onmouseout = function () {
          if(!that.timer4){
            start()
          }
        };
      }
      //鼠标移出，继续滚动

      // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
      function start() {
        // 数据少于表格高度停止滚动
        if (divData.clientHeight >= divData.scrollHeight){
          return;
        }
        that.timer4 = window.setInterval(() => {
          // 元素自增距离顶部1像素
          divData.scrollTop += 1
          if (divData.clientHeight + divData.scrollTop >= divData.scrollHeight - 1) {
            // 重置table距离顶部距离
            divData.scrollTop = 0
            window.clearInterval(that.timer4);
            that.timer4 = null;
            window.clearTimeout(that.timer7);
            that.timer7 = null;
            that.timer7 = setTimeout(function(){
              start()
            },1000)
          }
        }, 50)
      }
      start()
    },
    numZero(num){
      return num < 10?'0'+num:num;
    },
    weekInfo(num){
      let str = '';
      switch(num){
        case 0:
          str = '星期日';
          break;
        case 1:
          str = '星期一';
          break;
        case 2:
          str = '星期二';
          break;
        case 3:
          str = '星期三';
          break;
        case 4:
          str = '星期四';
          break;
        case 5:
          str = '星期五';
          break;
        case 6:
          str = '星期六';
          break;
      }
      return str;
    },
    //点击用户数据触发地图
    rowClick(row, column, event) {
      //this.state = 1;
      this.userId1 = row.userId;
      //this.initMap(row.userId);
    },
    //点击用户数据触发地图
    rowClick1(row, column, event) {
      this.state = 2;
      this.initMap(row.userId);
    },
    getStateTxt(state){
      let str = '';
      switch(state){
        case 1:
          str = '';
          break;
        case 2:
          str = '扫码异常';
          break;
      }
      return str;
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
    },
    getRouter(){
       this.$router.push({ path: '/index' }).catch(()=>{});
    }
  }
};
</script>
<style scoped lang='scss'>
  .warpper-main {
    background-color: #02274f;
    width: 100%;
    min-height: 100%;
    padding-bottom: 20px;
    .header {
      .announcement-box {
        display: flex;
        height: 60px;
        padding: 21px 50px 21px 30px;
        &>span {
          flex-shrink: 0;
          display: inline-block;
          color: #fff;
          width: 80px;
        }
        .msg-box {
          flex-grow: 1;
          overflow: hidden;
          position: relative;
          .msg {
            white-space:nowrap;
            color: #fff;
            position: absolute;
          }
        }
      }
      .title {
        height: 80px;
        text-align: center;
        img {
          vertical-align: middle;
          &:nth-of-type(1) {
            margin-top: 15px;
            margin-right: 10px;
          }
          &:nth-of-type(2) {
            margin-top: 19px;
          }
        }
      }
      .close-box {
        height: 60px;
      }
      .time-box {
        height: 60px;
        padding: 17px 36px 21px 0;
        text-align: right;
        color: #69C3FF;
        font-size: 18px;
        text-shadow:2px 2px 8px;
      }
    }
    .main {
      h3{
        margin: 0;
        height:38px;
        padding-top: 12px;
        padding-left: 21px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
      }
      margin-top: 20px;
      .left-header {
        height: 370px;
        padding-top: 15px;
      }
      .left-main {
        height: 280px;
        margin-top: 20px;
        padding-top: 15px;
        ul{
          padding: 20px 0;
          margin: 0;
          display: flex;
          width: 100%;
          li {
            list-style: none;
            border-right: 1px solid #1A4B89;
            flex-grow: 1;
            &:nth-of-type(3){
              border:none;
            }
            h4 {
              font-size: 12px;
              color: #fff;
              text-align: center;
              margin: 0;
              padding: 0;
            }
            p {
              font-size: 30px;
              font-weight: bold;
              color: #5CE6FF;
              text-align: center;
              margin: 0;
              margin-top: 12px;
              padding: 0;
            }
          }
        }
        ::v-deep .el-table {
          background-color: transparent;
        }
        ::v-deep .el-table::before {
          height: 0;
        }
        ::v-deep .el-table tr {
          background-color: transparent;
        }
        ::v-deep .el-table th {
          padding: 0;
          margin: 0;
          font-size: 14px;
          color: #489FFD!important;
          background-color: transparent!important;
          height: 32px;
        }
        ::v-deep .el-table--scrollable-y .el-table__body-wrapper{
          overflow-y: hidden;
        }
        ::v-deep .el-table td.el-table__cell, ::v-deep .el-table th.el-table__cell.is-leaf{
          border-bottom: 1px solid #1A4B89;
        }
        ::v-deep .el-table--enable-row-transition .el-table__body td {
          padding: 0;
          margin: 0;
          font-size: 12px;
          color: #fff;
          background-color: transparent;
          height: 30px;
        }
      }
      .left-footer {
        height: 280px;
        margin-top: 20px;
        padding-top: 15px;
      }
      .center-header {
        height: 180px;
        ul {
          padding: 0;
          margin: 0;
          display: flex;
          flex-warp: no-warp;
          li {
            list-style: none;
            flex-grow: 1;
            h5 {
              padding: 0;
              margin: 0;
              margin-top: 45px;
              font-size: 18px;
              color: #fff;
              text-align: center;
              line-height: 40px;
              letter-spacing: 3px;
            }
            &:nth-of-type(4) {
              .item {
                border-right: none;
              }
            }
            .item {
              border-right: 1px solid #1A4B89;
              padding-top: 10px;
              text-align: center;
              margin: 0;
              padding: 0;
              img {
              }
              .num {
                font-size: 56px;
                color: #5CE6FF;
                margin: 0 12px;
              }
              .unit {
                color: #fff;
                vertical-align: bottom;
                font-size: 12px;
              }
            }
          }
        }
      }
      .center-main {
        height: 500px;
        margin-top: 20px;
        .bm-view {
          height: 500px;
          .map-item-box {
            width: 274px;
            .map-header{
              height: 48px;
              border-bottom: 1px solid #ccc;
              ::v-deep .el-image {
                img {
                  width: 40px;
                  height: 40px;
                }
                float: left;
                border-radius: 20px;
              }
              p {
                float: left;
                line-height: 40px;
                font-size: 16px;
                margin: 0;
                padding: 0;
                margin-left: 12px;
                font-weight: 600;
                color: #333;
              }
            }
            .map-main {
              ul {
                margin: 0;
                padding: 0;
                li {
                  list-style: none;
                  line-height: 24px;
                  color: #333;
                  span {
                    font-size: 12px;
                  }
                  .label {
                    width: 80px;
                    display: inline-block;
                    text-align: right;
                    margin-right: 5px;
                  }
                }
              }
            }
            .map-footer {
              border-top: 1px solid #ccc;
              ul {
                padding: 0;
                margin: 0;
                display: flex;
                li {
                  list-style: none;
                  flex-grow: 1;
                  height: 48px;
                  text-align: center;
                  padding-top: 12px;
                  cursor: pointer;
                  .el-input__icon {
                    height: 40px;
                  }
                  p {
                    color: #333;
                    margin: 0;
                    padding: 0;
                    line-height: 24px;
                    font-size: 14px;
                  }
                }
              }
            }
          }
        }
      }
      .center-footer {
        height: 250px;
        margin-top: 20px;
        padding-top: 15px;
        .slideshow {
          margin: 0;
          padding: 0;
          display: flex;
          height: 150px;
          margin-top: 20px;
          .btn {
            width: 40px;
            height: 100%;
            flex-shrink: 0;
            text-align: center;
            height: 100%;
            cursor: pointer;
            img {
              margin-top: 57px
            }
          }
          .slideshow-main {
            ::v-deep .el-carousel__container .el-car-item {
              width: 100%;
              display: flex;
              .monitor-item {
                width: calc(33.3333333% - 20px);
                margin-right: 15px;
                &:nth-of-type(1){
                  margin-left: 15px;
                }
              }
            }
            ::v-deep .el-carousel__arrow, ::v-deep .el-carousel__indicators {
              display: none!important;
            }
            flex-grow: 1;
            position: relative;
            overflow: hidden;
            ul {
              display: flex;
              margin: 0;
              padding: 0;
              left:0;
              position: absolute;
              transition: all 2.5s;
              li {
                list-style: none;
                border: 1px solid #2970C9;
                broder-raiuds: 4px;
                flex-shrink: 0;
                margin-right: 10px;
                height: 150px;
              }
            }
            h5 {
              text-align: center;
              margin: 0;
              padding: 0;
              line-height: 59px;
              color: #fff;
              font-size: 18px;
              border: 1px solid #2970C9;
            }
            .list-data {
              width: 100%;
              height: 89px;
              border-bottom: 1px solid #2970C9;
              display: flex;
              .list-data-item {
                flex-grow: 1;
                border-right: 1px solid #2970C9;
                &:nth-of-type(1) {
                  border-left: 1px solid #2970C9;;
                }
                padding-top: 15px;
                h6 {
                  color: #fff;
                  font-soze: 14px;
                  text-align: center;
                  margin: 0;
                  padding: 0;
                }
                .hint {
                  color: red;
                  font-size: 12px;
                  line-height: 16px;
                  text-align: center;
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  height: 16px;
                }
                p {
                  color: #5CE6FF;
                  font-size: 24px;
                  text-align: center;
                  margin: 0;
                  padding: 0;
                }
              }
            }
          }
        }
      }
      .right-header, .right-main {
        height: 370px;
        padding-top: 15px;
        h5 {
          text-align: center;
          vertical-align: bottom;
          marign: 20px 0;
          padding: 0;
          color: #5CE6FF;
          font-weight: bold;
          span {
            font-size: 42px;
          }
        }
        ::v-deep .el-table {
          background-color: transparent;
        }
        ::v-deep .el-table::before {
          height: 0;
        }
        ::v-deep .el-table tr {
          background-color: transparent;
          cursor: pointer;
        }
        ::v-deep .el-table th {
          padding: 0;
          margin: 0;
          font-size: 14px;
          color: #fff!important;
          background-color: #12417C!important;
          height: 32px;
          font-weight: 400;
        }
        ::v-deep .el-table--scrollable-y .el-table__body-wrapper{
          overflow-y: hidden;
        }
        ::v-deep .el-table td.el-table__cell, ::v-deep .el-table th.el-table__cell.is-leaf{
          border-bottom: 1px solid transparent;
        }
        ::v-deep .el-table--enable-row-transition .el-table__body td {
          padding: 0;
          margin: 0;
          font-size: 12px;
          color: #fff;
          background-color: transparent;
          height: 30px;
        }
        ::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td {
          color: #fff!important;
          background-color: #1F86FF!important;
        }
      }
      .right-main {
        margin-top: 20px;
      }
      .right-footer {
        margin-top: 20px;
        height: 190px;
        padding-top: 10px;
        .risk {
          display: flex;
          .riskSumNum {
            width: 122px;
            margin-right: 20px;
            h6 {
              font-size: 16px;
              margin: 0;
              margin-top: 38px;
              text-align: center;
              color: #fff;
            }
            p {
              font-size: 32px;
              color: #5CE6FF;
              margin: 0;
              pading: 0;
              text-align: center;
              margin-top: 12px;
            }
          }
          .riskEchart {
            width: calc(100% - 142px)
          }
        }
      }
    }
  }
</style>
