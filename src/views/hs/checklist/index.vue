<template xmlns:border-radius="http://www.w3.org/1999/xhtml">
  <div class="app-container">
    <el-row>
      <el-col :span="4">
        <el-row class="left-title-box">
          <el-col :span="12" align="center">
            <div>
              检测时间
            </div>
          </el-col>
        </el-row>
          <div class="infinite-list-wrapper"
               style="overflow: auto; margin-right: 20px; border: 1px solid #ccc; ">
            <ul class="list"
                infinite-scroll-disabled="disabled">
              <li v-for="date in checkedDate" class="list-item"
                  @click="handleHsDateClick(date)">
                {{ date.hsDate }}
              </li>
            </ul>
            <li class="p-hsdate-loading" v-if="!checkedDateLoadEnd" @click="loadMoreHsDate">加载</li>
            <li class="p-hsdate-loading" v-if="loadingCheckedDate" @click="loadMoreHsDate">加载中...</li>
            <li class="p-hsdate-end" v-if="checkedDateLoadEnd">没有更多了</li>
<!--        <el-table class="left-content-box" :data="checkedDate" border :show-header=false @row-click="handleHsDateClick">-->
<!--         infinite-scroll-immediate=false <el-table-column label="" align="center" prop="hsDate" />-->
<!--        infinite-scroll-immediate=false</el-table>-->

<!--        <pagination-->
<!--          v-show="checkedDateTotal>0"-->
<!--          :total="checkedDateTotal"-->
<!--          :page.sync="queryParams.pageNum"-->
<!--          :limit.sync="queryParams.pageSize"-->
<!--          :small=true-->
<!--          @pagination="getList"-->
<!--        />-->
        </div>
      </el-col>
      <el-col :span="20">
        <el-row class="right-title-box">
          <el-col :span="12" align="left">
            <div>
            {{ parseTime(this.getLeftSelect().queryDate, "{y}-{m}-{d}") }} 已检测({{ total }}人)
            </div>
          </el-col>
          <el-col :span="12" align="right">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="memberList" class="right-content-box" border>
          <el-table-column label="序号" align="center" type="index" >
            <template scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="姓名" align="center" prop="name" />
          <el-table-column label="核酸码" align="center" prop="hsCode" />
          <el-table-column label="社区/网格" align="center" prop="companyName" />
          <!-- <el-table-column label="登记人" align="center" prop="adminUserName" /> -->
          <el-table-column label="频次" align="center" prop="hsTotalCount" />
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { listMember } from "@/api/hs/member";
  import { parseTime } from "@/utils/ruoyi";
  import { listHsDate } from "@/api/hs/hsdate";
  import { listMemberWithDetail } from "@/api/hs/memberwithdetail"
  import { getUserTree } from "@/api/hs/comparison";

export default {
  name: "Member",
  dicts: ['sys_user_sex', 'nation', 'hoh_relationship'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      memberList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 左侧选择状态
      leftSelect: {
        index: null,
        queryDate: null
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: 2,
        hsStartDate: null,
        hsEndDate: null,
        name: null,
        idNumber: null,
        sex: null,
        birthday: null,
        nation: null,
        phone: null,
        addr: null,
        hohIdNumber: null,
        hohRelationship: null,
        ec1Name: null,
        ec1Phone: null,
        ec2Name: null,
        ec2Phone: null,
        hsCount: null,
        sortType: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "姓名不能为空", trigger: "change" }
        ],
        idNumber: [
          { required: true, message: "身份证号不能为空", trigger: "blur" }
        ],
        sex: [
          { required: true, message: "性别不能为空", trigger: "change" }
        ],
        birthday: [
          { required: true, message: "出生日期不能为空", trigger: "blur" }
        ],
        nation: [
          { required: true, message: "民族不能为空", trigger: "change" }
        ],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        addr: [
          { required: true, message: "联系地址不能为空", trigger: "blur" }
        ]
      },
      checkedDate: [],
      loadingCheckedDate: false,
      checkedDateCurrPageNum: 1,
      checkedDateCurrPageSize: 5,
      checkedDateLoadEnd: false,
      submitBtn: true,
      timer: null,
      date: new Date(new Date().getTime() + 6000),
      endTimeText: "00天00时00分00秒",
      treeOptions: [],
      isAdmin: false,
    };
  },
  computed: {
    disabled () {
      return !this.checkedDateLoadEnd
    }
  },
  created() {
    //this.loadMoreHsDate(true);
    this.getUserTree();
  },
  methods: {
    getUserTree(){
      getUserTree().then(res => {
        if(res == ''){
          this.queryParams.companyIds = null;
          this.isAdmin = true;
        }else{
          this.treeOptions.push(res);
          this.queryParams.companyName = res.companyName;
          this.queryParams.companyIds = this.getCompanyIds(res.id);
        }
       this.loadMoreHsDate(true);
      })
    },
    getCompanyIds(companyId){
      let newArr = [];
      this.treeOptions.forEach(value =>{
        if(value.id == companyId){
          newArr.push(value.id);
          if(value.subList && value.subList.length > 0) {
            value.subList.forEach(val => {
              newArr.push(val.id);
            })
          }
        }
      })
      return newArr;
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      const now = this.getLeftSelect().queryDate;
      const pattern = "{y}-{m}-{d} {h}:{i}:{s}";
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      this.queryParams.hsStartDate = parseTime(now, pattern);
      now.setHours(23);
      now.setMinutes(59);
      now.setSeconds(59);
      this.queryParams.hsEndDate = parseTime(now, pattern);
      this.queryParams.sortType = 2;
      listMemberWithDetail(this.queryParams).then(response => {
        this.memberList = response.rows;
        if (this.memberList) {
          this.memberList.forEach(t => {
            if(t.idNumber){
              t.idNumber = this.getIdNumber(t.idNumber)
            }
          })
        }
        this.total = response.total;
        this.loading = false;
      });
    },
    loadMoreHsDate(first) {
      console.log("loadMoreHsDate " + first);
      if (this.loadingCheckedDate) {
        return
      }
      this.loadingCheckedDate = true;

      if (this.checkedDateLoadEnd === true) {
        console.log("no data!");
        this.loadingCheckedDate = false;
        return
      }

      const param = {
        pageNum: this.checkedDateCurrPageNum,
        pageSize: this.checkedDateCurrPageSize,
      };
      listHsDate(param).then(response => {
        if (!response.rows || response.rows.length === 0) {
          this.checkedDateLoadEnd = true;
          this.loadingCheckedDate = false;
          return
        }
        this.checkedDate.push(...response.rows);
        console.log(response.rows.length);
        this.checkedDateTotal = response.total;
        if (this.checkedDateCurrPageSize <= response.rows.length) { // 应该还有下一页
          this.checkedDateCurrPageNum += 1;
        } else { // 没有下一页了
          this.checkedDateLoadEnd = true;
        }
        if (first) {
          if (response.rows.length > 0) {
            this.setLeftSelect(undefined, new Date(response.rows[0].hsDate));
          }
          this.getList();
        }

        this.loadingCheckedDate = false;
      });
    },
    handleHsDateClick(row, column, event) {
      this.setLeftSelect(undefined, new Date(row.hsDate));
      this.getList();
    },
    getLeftSelect() {
      if (!this.leftSelect.queryDate) {
        this.leftSelect.index = null;
        this.leftSelect.queryDate = new Date();
      }
      return this.leftSelect;
    },
    setLeftSelect(index, strDate) {
      this.leftSelect.index = index;
      this.leftSelect.queryDate = new Date(strDate);
    },
    endTime(){
      let endTimeDate = (new Date(this.date).getTime()) - (new Date().getTime()),
          that = this;
      if(endTimeDate <= 0){
        that.submitBtn = false;
        clearInterval(this.timer);
        return false;
      }
      var days = parseInt(endTimeDate / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数
      var hours = parseInt(endTimeDate / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时
      var minutes = parseInt(endTimeDate / 1000 / 60 % 60, 10);//计算剩余的分钟
      var seconds = parseInt(endTimeDate / 1000 % 60, 10);//计算剩余的秒数
      console.log(this.checkTime(days)+"天" + this.checkTime(hours)+"时" + this.checkTime(minutes)+"分"+this.checkTime(seconds)+"秒")
      this.endTimeText = this.checkTime(days)+"天" + this.checkTime(hours)+"时" + this.checkTime(minutes)+"分"+this.checkTime(seconds)+"秒";
    },
    checkTime(num){
      return num<10?'0'+num:num;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        idNumber: null,
        sex: null,
        birthday: null,
        nation: null,
        phone: null,
        addr: null,
        hohIdNumber: null,
        hohRelationship: null,
        ec1Name: null,
        ec1Phone: null,
        ec2Name: null,
        ec2Phone: null,
        hsCount: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMember(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMember(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    submitFormData(){//签到
      if(!this.submitBtn) return false;

    },
    resetFormData(){//重置表单
      this.reset();
    },
    getIdNumber(idNumber) {
      return idNumber.startsWith("0-") || idNumber.startsWith("1-") ? "" : idNumber;
    }
  }
};
</script>
<style type="text/css" lang="scss" scoped>
  .left-content-box {
    border: 1px solid #ccc;
    margin-right: 20px;
    min-height: 300px;
  }

  .left-title-box {
    border: 1px solid #ccc;
    margin-right: 20px;
    height: 50px;
    display:flex;
    align-items:center;
    justify-content:center;
    padding-left: 10px;

    text-align:center
  }

  .right-title-box {
    border: 1px solid #ccc;
    height: 50px;
    display:flex;
    align-items:center;
    padding-left: 10px;
    padding-right: 10px;
  }

  .right-content-box {
    border: 1px solid #ccc;
    margin-top: 0px;
    min-height: 300px;
  }

  ul {
    overflow:auto;
    padding-left: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
  }

  li {
    text-align: center;
    list-style-type: none;
    /*margin-bottom: 1px;*/
    border-bottom: 1px solid #ccc;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    cursor:default;
  }

  .p-hsdate-loading .p-hsdate-end {
    text-align: center;
    font-size: 14px;
    color: #606266;
  }
</style>
