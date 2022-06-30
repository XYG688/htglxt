<template>
  <div class="app-container">
    <div class="container-left">
      <ul class="left-header">
        <li v-for="(item, index) in personTypes" 
          :key="index" 
          :class="['left-header-item', selectedType.value === item.value ? 'selected-item' : '']"
          @click="handleChangeType(item)">
          {{item.label}}
        </li>
      </ul>
      <p class="left-total-num">{{`${selectedType.label}（${totalPersonByType}）`}}</p>
      <section class="search-box" style="margin-top: 10px;">
        <el-input placeholder="请输入名称" v-model="name" class="input-with-select" style="width: calc(100% - 20px);margin-left: 10px;">
          <el-button slot="append" icon="el-icon-search" @click='getUserList'></el-button>
        </el-input>
      </section>

      <!-- 数据部分 -->
      <div class="left-container">
        <ul class="left-content" :style="listBoxHeight">
          <li
            v-for="item in userList" 
            @click="handleCheckDetail(item)" 
            :key="item.id"
            :class="['content-item',curUser.id === item.id ?  'selected-user': '']">
            <img v-if="item.userState == 0" class="user-item-img" src="@/assets/images/icon_zhengchang.png"/>
            <img v-else class="user-item-img" src="@/assets/images/icon_quezhen.png"/>
            <span class="user-item-name">{{item.name}}</span>
            <span class="user-item-state" v-if="item.userState != 0">(<dict-tag style="display:inline;" :options="dict.type.track_state" :value="item.userState"/>)</span>
          </li>
        </ul>
        <div class="left-pagination">
          <p class="pagination-page">
            <span>{{pageNo}}</span>/
            <span>{{pageTotal}}</span>
          </p>
          <div class="pagination-img">
            <img class="btn-img" v-show="pageNo > 1" src="@/assets/images/icon_left_enable.png" @click="pageDecrease">
            <img class="btn-img" v-show="pageNo === 1" src="@/assets/images/icon_left_disabled.png" @click="pageDecrease">
            <img class="btn-img" v-show="pageNo < pageTotal" src="@/assets/images/icon_right_enable.png" @click="pageIncrease">
            <img class="btn-img" v-show="pageNo >= pageTotal" src="@/assets/images/icon_right_disabled.png" @click="pageIncrease">
          </div>
        </div>
      </div>
     
    </div>
    <div class="container-right">
      <div class="right-header">
        <ul class="header-menu">
          <li v-for="item in menuData" 
            :key="item.id" 
            :class="['menu-item', currentMenu.id === item.id ? 'selected-menu' : '']"
            @click="handleChangeMenu(item)">{{item.name}}
          </li>
        </ul>
      <el-divider class="header-divider"></el-divider>
      </div>
      <TrackEvents :curUser="curUser" v-if="currentMenu.id === '1'" :userId = 'userId'></TrackEvents>
      <LocatorData :curUser="curUser" v-if="currentMenu.id === '2'" :userId = 'userId'></LocatorData>
    </div>
  </div>
</template>

<script>
import { getUserListByType, getAbnormalstate } from '@/api/hs/track.js'
import LocatorData from './components/locatorData/index.vue'
import TrackEvents from './components/trackEvents/index.vue'


export default {
  name: 'track',
  dicts: ['permit_audit', 'sys_user_sex', 'nation', 'hoh_relationship', 'track_state'],
  components: {LocatorData, TrackEvents},
  data() {
    return {
      selectType: 'all',
      selectedType: {}, //被选中的全部/确诊/疑似
      personTypes: [{
        value: '-1',
        label: '全部',
      },{
        value: '0',
        label :'正常',
      },{
        value: '2',
        label :'疑似风险人员',
      }],
      listBoxHeight: {
        "height": document.documentElement.clientHeight - 298 + "px"
      },
      userSumList: [{
          id: '1',
          icon: 1,
          name: '章三 '
        }, {
          id: '2',
          icon: 2,
          name: '李四 '
        }
      ],
      // 活动轨迹 / 定位数据
      currentMenu: {},
      menuData: [{
        id: '1',
        name: '活动轨迹',
      },
      {
        id: '2',
        name: '定位数据',
      }],
      totalPersonByType: 0, // 全部/确诊/疑似 的总人数
      pageNo: 1,
      pageSize: 20,
      pageTotal: 1,
      curUser: {
        id: '2',
        icon: 2,
        name: '李四 '
      },
      userState: null,
      userId: null,
      name: null,
    }
  },
  created() {
    this.selectedType = this.personTypes[0]
    this.currentMenu = this.menuData[0]
    this.getUserList()
  },
  methods: {
    // 左侧header切换
    handleChangeType (item) {
      this.selectedType = item
      this.userState = item.value
      this.getUserList();
    },
    // 点击左侧菜单进行人群查询
    handleChangeMenu(item) {
      this.currentMenu = item;
    },
    //查询左侧用户列表
    getUserList() {
      // this.totalPersonByType = 2837
      // this.pageTotal = Math.ceil(this.totalPersonByType / 10)
      this.userSumList = [];
      getUserListByType({'userState':this.userState == -1 || this.userState == 2?null:this.userState,nameFilter: this.name}).then(res => {
        if(res.code === 200) {
          if(this.userState == 2){
            let newArr = [];
            res.rows.length > 0 && res.rows.forEach(item=>{
              if(item.userState != '0'){
                newArr.push(item)
              }
            })
            this.userSumList =  newArr; 
          }else{
            this.userSumList =  res.rows; 
          }
          this.totalPersonByType = this.userSumList.length;
          this.pageNo = 1;
          this.userList = this.userSumList.length>0?this.getList():[];
          if(this.userList.length>0){
            this.handleCheckDetail(this.userList[0])
          }else{
            this.userId = null
          }
          this.pageTotal = Math.ceil(this.userSumList.length / 20)
        }
      })
    },
    // 按减
    pageDecrease() {
      if (this.pageNo === 1) return
      this.pageNo --
      this.userList = this.getList()
    },
    //按增
    pageIncrease(){
      if(this.pageNo === this.pageTotal) return
      this.pageNo ++
      this.userList = this.getList()
    },
    getList() {
      let count = 0,
          newArr = [];
      this.userSumList.forEach((item,index) =>{
        if(count == 20) return false;
        if(index >= (this.pageNo-1)*20){
          count ++;
          newArr.push(item);
        }
      })
      return newArr;
    },
    //点击左侧某一个人
    handleCheckDetail(item){
      this.userId = item.userId;
    }
  }
}
</script>

<style scoped lang='scss'>
.app-container {
  padding: 0;
  display: flex;
  width: 100%;
  min-height: calc(100vh - 140px);
  ul {
    padding:  0;
    margin: 0;
    list-style: none;
    li {
      cursor: pointer;
    }
  }
  .container-left {
    min-width: 270px;
    background-color: #fff;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 12%), 0 0 3px 0 rgb(0 0 0 / 4%);
    .left-header {
      width: 100%;
      height: 47px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 7px;
      margin-bottom: 13px;
      .left-header-item{
        border-bottom: 4px solid transparent;
        display: inline-block;
        padding: 14px 0;
        width: 90px;
        font-size: 14px;
        text-align: center;
        font-family: Microsoft YaHei;
        font-weight: 400;
      }
      .selected-item {
        border-bottom: 4px solid #3693FF;
        color: #3693FF;
      }
    }
    .left-total-num {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #333333;
      padding-left: 22px;
      margin: 0;
    }
    .left-container {
      width: 100%;
      height: calc(100% - 150px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .left-content {
        margin-top: 21px;
        overflow-y: auto;
        .content-item {
          cursor: pointer;
          display: flex;
          align-items: center;
          margin-bottom: 11px;
          padding-left: 22px;
          height: 28px;
          .user-item-img{
            width: 11px;
            height: 13px;
            display: inline-block;
            margin-right: 10px;
          }
          .user-item-name {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #333333;
            display: inline-block;
          }
          .user-item-state {
            font-size: 12px;
            color: #333;
            margin-left: 12px;
          }
        } 
        .selected-user{
          background: #D9EAFF;
        }
      }
      .left-pagination{
        margin: 0 13px 0 22px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .pagination-page{
          font-size: 14px;
          font-family: Microsoft YaHei;
        }
        .pagination-img {
          .btn-img {
            cursor: pointer;
            width: 28px;
            height: 28px;
            margin-left: 10px;
          }
        }
      }
    }
  }
  .container-right {
    flex: 1;
    margin-left: 1px;
    .right-header{
      position: relative;
      padding: 18px 18px 0 18px;
      .header-menu{
        display: flex;
        justify-content: flex-start;
        .menu-item {
          padding: 0 32px 13px 31px;
          box-sizing: border-box;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #222C45;
        }
        .selected-menu {
          border-bottom:4px solid #3693FF;
          z-index: 8;
        }
      }
      .header-divider {
        position: absolute;
        margin: 0;
        height: 4px;
        top: 51px;
        width: calc(100%  - 36px);
      }
    }
  }
}
</style>