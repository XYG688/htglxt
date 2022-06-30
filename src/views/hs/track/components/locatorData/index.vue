<template>
  <div class="app-container">
    <div class="locator-data-content">
      <el-form :model="queryParams" :inline="true" label-width="88px">
        <el-form-item label="开始时间" align="center" prop="startDate" width="320">
          <el-date-picker  size="small"
            v-model="queryParams.startTime"
            type="date"
            :clearable="false"
            value-format="yyyy-MM-dd"
            placeholder="选择筛查开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" align="center" prop="endDate" width="220">
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

      <el-table :data="locatorData">
        <el-table-column label="序号" align="center" type="index"/>
        <el-table-column label="商区名称" align="center" prop="spName"/>
        <el-table-column label="定位地址" prop="spAddr"/>
        <el-table-column label="入口登记时间" align="center" prop="inTime"/>
        <el-table-column label="出口登记时间" align="center" prop="outTime"/>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
 import { getTrackDataByUser } from '@/api/hs/track.js'
export default {
  name: 'locatorData',
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
  data(){
    return {
      queryParams: {
        startTime: this.parseTime(this.IsoTime(
            new Date(new Date(new Date().toLocaleDateString()).getTime())
          )),
        endTime: this.parseTime(this.IsoTime(
          new Date(new Date(new Date().toLocaleDateString()).getTime())
        )),
        pageNum: 1,
        pageSize:10,
        userId: ''
      },
      loading: true,
      locatorData: [
        {
          id: '1',
          time: '1111',
          businessAddress: '1dqw3fc',
          locateAddress:'pwkjmcvn;ojf'
        }
      ],
      total: 0,
    }
  },
  mounted() {
    if(this.userId){
      this.getList();
    }
  },
  watch:{
    // curUser() {
    //   this.getList()
    // },
    userId(){
      this.locatorData = [];
      this.total=0;
      this.resetQuery();
      if(this.userId){
        this.getList();
      }
    }
  },
  methods: {
    handleQuery(){
      this.getList();
    },
    resetQuery(){
      this.queryParams = {
        startTime: this.parseTime(this.IsoTime(
            new Date(new Date(new Date().toLocaleDateString()).getTime())
          )),
        endTime: this.parseTime(this.IsoTime(
          new Date(new Date(new Date().toLocaleDateString()).getTime())
        )),
        pageNum: 1,
        pageSize:10
      }
      this.getList()
    },
    getList(){
      console.log(this.queryParams)
      this.locatorData = [];
      getTrackDataByUser({
        ...this.copyParams(this.queryParams,'startTime','endTime'),
        'userId': this.userId
      }).then(res=>{
        if(res.rows && res.rows.length > 0){
          this.locatorData = res.rows;
          this.total = res.total
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.app-container {
  display: flex;
  flex-direction: column;
  .locator-data-content {
    padding: 15px 18px 0 18px;
    width: 100%;
  }
}
</style>

