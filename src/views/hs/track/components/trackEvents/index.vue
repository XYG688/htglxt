<template>
  <div class="app-container">
    <div class="track-event-content">
      <el-form :model="queryParams" :inline="true" label-width="88px">
        <el-form-item label="开始时间" align="center" prop="startTime" width="320">
          <el-date-picker  size="small"
            v-model="queryParams.startTime"
            type="date"
            :clearable="false"
            value-format="yyyy-MM-dd"
            placeholder="选择筛查开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" align="center" prop="endTime" width="220">
          <el-date-picker  size="small"
            v-model="queryParams.endTime"
            type="date"
            :clearable="false"
            value-format="yyyy-MM-dd"
            placeholder="选择筛查结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="track-event-map" id="map"></div>
  </div>
</template>

<script>
 import { getTrackDataByUser } from '@/api/hs/track.js'
import { lazyBMapApiLoaderInstance } from 'vue-bmap-gl'
import qiIcon from '@/assets/images/icon_qi.png';
import zhongIcon from '@/assets/images/icon_zhong.png'

export default {
  name: 'trackEvents',
  props: {
    curUser: {
      type: Object,
      default: () => ({})
    },
    userId: {
      type: String,
      default: ''
    }
 },
 data() {
   return {
    queryParams: {
      startTime: this.parseTime(this.IsoTime(
          new Date(new Date(new Date().toLocaleDateString()).getTime())
        )),
      endTime: this.parseTime(this.IsoTime(
          new Date(new Date(new Date().toLocaleDateString()).getTime())
        ))
    },//this.copyParams
    trackData: [{
        'lng': 116.297611,
        'lat': 40.047363
    }, {
        'lng': 116.302839,
        'lat': 40.048219
    }, {
        'lng': 116.308301,
        'lat': 40.050566
    }, {
        'lng': 116.305732,
        'lat': 40.054957
    }, {
        'lng': 116.304754,
        'lat': 40.057953
    }, {
        'lng': 116.306487,
        'lat': 40.058312
    }, {
        'lng': 116.307223,
        'lat': 40.056379
    }],
    map: null
   }
 },
 mounted() {
  lazyBMapApiLoaderInstance.load().then(() => {
    this.map = new BMapGL.Map("map");    // 创建Map实例
    this.map.enableScrollWheelZoom(); // 开启鼠标滚轮缩放
    this.map.centerAndZoom({
      'lat': 21.54792,
      'lng': 107.97188
    }, 17);
    if(this.userId == ''){
      this.resetQuery();
      this.updateMap();
    }
  })
 },
 watch: {
   curUser(){
     // this.resetQuery()
     // this.getUserTrackEventData()
     // this.initMap()
   },
   userId(){
    this.resetQuery();
    this.updateMap();
   }
 },
 methods: {
  // 获取人物出行记录
  getUserTrackEventData(){},
  initMap(){
    let trackPoint = [],
        that = this;
    for (var i = 0; i < this.trackData.length; i++) {
      var point = new BMapGL.Point(this.trackData[i].lng, this.trackData[i].lat);
      trackPoint.push(point)
    }

   var allOverlay = this.map.getOverlays();
    for (var i = 0; i < allOverlay.length; i++){
      this.map.removeOverlay(allOverlay[i]);
    }

    if(this.trackData.length == 0){
      this.map.centerAndZoom({
        'lat': 21.54792,
        'lng': 107.97188
      }, 17);
      this.$message.error('用户当前没有定位数据')
      return false;
    }
    this.map.centerAndZoom(trackPoint[this.trackData.length-1], 17);


    // var polyline = new BMapGL.Polyline(trackPoint, {
    //     strokeColor: "#1869AD",
    //     strokeWeight: 3,
    //     strokeOpacity: 1
    // });
    // this.map.addOverlay(polyline);

    if(this.trackData.length > 1){
      //画线
      var polyline = new BMapGL.Polyline(trackPoint, {
          strokeColor: "#F18937",
          strokeWeight: 4,
          strokeOpacity: 1
      });
      this.map.addOverlay(polyline);
    }


    var qiIconPoint = new BMapGL.Icon(qiIcon, new BMapGL.Size(40, 52), {
       imageOffset: new BMapGL.Size(0, 0)
    })
    var zhongIconPont = new BMapGL.Icon(zhongIcon, new BMapGL.Size(40, 52), {
       imageOffset: new BMapGL.Size(0, 0)
    })
    // 画图标
    trackPoint.forEach((item, i)=>{
      if (i === 0) {
        let marker = new BMapGL.Marker(trackPoint[i], {icon: qiIconPoint,
            offset: new BMapGL.Size(0, -36)});
        marker.addEventListener('click', (e) => {
          that.setInfoWindow(e, i*1);
        });
        this.map.addOverlay(marker);
      }else if (i === trackPoint.length - 1) {
        let marker = new BMapGL.Marker(trackPoint[i],{icon: zhongIconPont,
            offset: new BMapGL.Size(0, -36)});
        marker.addEventListener('click', (e) => {
          that.setInfoWindow(e, i*1);
        });
        this.map.addOverlay(marker);
      }else {
        let label = new BMapGL.Label(i + 1, {       // 创建文本标注
            position: trackPoint[i],                          // 设置标注的地理位置
            offset: new BMapGL.Size(-14, -16)           // 设置标注的偏移量
        })
        // let marker = new BMapGL.Marker(trackPoint[i]);
        label.addEventListener('click', (e) => {
          that.setInfoWindow(e, i*1);
        });
        this.map.addOverlay(label);
        label.setStyle({
          width: '30px',
          height: '30px',
          textAlign: 'center',
          lineHeight: '25px',
          background: '#FFFFFF',
          border: '1px solid #F0924C',
          borderRadius: '50%',
          color: '#000',
          fontSize: '14px',
          fontFamily: 'Microsoft YaHei',
          fontWeight: '400'
        })
        // this.map.addOverlay(marker);
      }
    })
    // for (var i = 0, j = trackPoint.length; i < j; i++) {
    //   if (i === 0) {
    //     let marker = new BMapGL.Marker(trackPoint[i], {icon: qiIconPoint,
    //         offset: new BMapGL.Size(0, -36)});
    //     marker.addEventListener('click', (e) => {
    //       that.setInfoWindow(e, i*1);
    //     });
    //     this.map.addOverlay(marker);
    //   }else if (i === j - 1) {
    //     let marker = new BMapGL.Marker(trackPoint[i],{icon: zhongIconPont,
    //         offset: new BMapGL.Size(0, -36)});
    //     this.map.addOverlay(marker);
    //   }else {
    //     let label = new BMapGL.Label(i + 1, {       // 创建文本标注
    //         position: trackPoint[i],                          // 设置标注的地理位置
    //         offset: new BMapGL.Size(-14, -16)           // 设置标注的偏移量
    //     })
    //     // let marker = new BMapGL.Marker(trackPoint[i]);
    //     this.map.addOverlay(label);
    //     label.setStyle({
    //       width: '30px',
    //       height: '30px',
    //       textAlign: 'center',
    //       lineHeight: '25px',
    //       background: '#FFFFFF',
    //       border: '1px solid #F0924C',
    //       borderRadius: '50%',
    //       color: '#000',
    //       fontSize: '14px',
    //       fontFamily: 'Microsoft YaHei',
    //       fontWeight: '400'
    //     })
    //     // this.map.addOverlay(marker);
    //   }
    // }

    console.log(this.map.getOverlays())
  },
  updateMap(){
    this.trackData = [];
    console.log(this.userId)
    if(this.userId){
      getTrackDataByUser({
        ...this.copyParams(this.queryParams,'startTime','endTime'),
        'userId': this.userId
      }).then(res=>{
        if(res.rows && res.rows.length > 0){
          let newData = JSON.parse(JSON.stringify(res.rows));
          newData.forEach(item=>{
            if(item.lng && item.lat){
              this.trackData.push(item)
            }
          })
        }
        this.initMap();
      })
    }else{
      this.initMap();
    }
  },
  setInfoWindow(e, num) {
    var content = '<div class="map-main">'
                    +'<ul style="margin: 10px;padding: 0;">'
                      +'<li style="list-style: none;line-height: 24px;color: #333;">'
                        +'<span class="label" style="width: 90px;display: inline-block;text-align: right;margin-right: 5px;font-size: 12px">商区名称：</span>'
                        +'<span style="font-size: 12px">'+this.trackData[num].spName+'</span>'
                      +'</li>'
                      +'<li style="list-style: none;line-height: 24px;color: #333;">'
                        +'<span class="label" style="width: 90px;display: inline-block;text-align: right;margin-right: 5px;font-size: 12px">定位地址：</span>'
                        +'<span style="font-size: 12px">'+this.trackData[num].spAddr+'</span>'
                      +'</li>'
                      +'<li style="list-style: none;line-height: 24px;color: #333;">'
                        +'<span class="label" style="width: 90px;display: inline-block;text-align: right;margin-right: 5px;font-size: 12px">入口登记时间：</span>'
                        +'<span style="font-size: 12px">'+this.trackData[num].inTime+'</span>'
                      +'</li>'
                      +'<li style="list-style: none;line-height: 24px;color: #333;">'
                        +'<span class="label" style="width: 90px;display: inline-block;text-align: right;margin-right: 5px;font-size: 12px">出口登记时间：</span>'
                        +'<span style="font-size: 12px">'+(this.trackData[num].outTime || '暂无')+'</span>'
                      +'</li>'
                    +'</ul>'
                  +'</div>';
    var infoWindow = new BMapGL.InfoWindow(content, {
      offset: new BMapGL.Size(-3, -32),
      width: 300
    }); //创建信息窗口对象
    this.map.openInfoWindow(infoWindow, e.latLng);
  },
  handleQuery(){
    this.updateMap();
  },
  resetQuery(){
    this.queryParams = {
      startTime: this.parseTime(this.IsoTime(
          new Date(new Date(new Date().toLocaleDateString()).getTime())
        )),
      endTime: this.parseTime(this.IsoTime(
          new Date(new Date(new Date().toLocaleDateString()).getTime())
        ))
    }
    //this.getUserTrackEventData()
  },
 }
}
</script>
<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  .track-event-content {
    padding: 15px 18px 0 18px;
    width: 100%;
  }
  .track-event-map {
    width: calc(100% - 36px);
    flex: 1;
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
    }
  }
}
</style>
