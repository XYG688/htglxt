<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="开始时间" align="center" prop="hsStartDate" width="320">
        <el-date-picker clearable size="small"
                        v-model="queryParams.hsStartDate"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择筛查开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" align="center" prop="hsEndDate" width="220">
        <el-date-picker clearable size="small"
                        v-model="queryParams.hsEndDate"
                        type="date"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择筛查结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="检测状态" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择检测状态" clearable size="small">
          <el-option
            v-for="state in this.hsState"
            :key="state.value"
            :label="state.label"
            :value="state.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="社区/网格" prop="companyId">
        <el-select v-model="queryParams.companyName" placeholder="请选择村社区" clearable @clear="clearCompany">
            <el-option :value="queryParams.companyId" :label="queryParams.companyName"  style="width: 260px;height:200px;overflow: auto;background-color:#fff">
              <el-tree
                v-if="treeOptions.length > 0"
                :data="treeOptions"
                :props="defaultPropsValue"
                @node-click="queryhandleNodeClick"
              ></el-tree>
            </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--<el-col :span="1.5">-->
        <!--<el-button-->
          <!--type="warning"-->
          <!--plain-->
          <!--icon="el-icon-download"-->
          <!--size="mini"-->
          <!--@click="handleExport"-->
          <!--v-hasPermi="['hs:member:detail:export']"-->
        <!--&gt;导出</el-button>-->
      <!--</el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="memberList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="序号" align="center" type="index" >
        <template scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="核酸码" align="center" prop="hsCode" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="联系电话" align="center" prop="phone" />
      <el-table-column label="身份证" align="center" prop="idNumber" />
      <el-table-column label="社区/网格" align="center" prop="companyName" />
      <el-table-column label="最新检测日期" align="center" prop="hsRecordDate" width="180" />
      <el-table-column label="检测频次" align="center" prop="hsCount" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
import { listMemberWithDetail, exportMemberWithDetail } from "@/api/hs/memberwithdetail";
import { getCompanyList } from "@/api/hs/member";
import { getTree, getUserTree } from "@/api/hs/comparison";

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
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
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
        companyId: null,
        companyName: null,
        companyIds: null
      },
      // 表单参数
      form: {},
      // 检测状态
      hsState: [
        {
          label: "全部",
          value: 0
        },
        {
          label: "未检测",
          value: 1
        },
        {
          label: "已检测",
          value: 2
        }
      ],
      // 表单校验
      rules: {
        name: [
          { required: true, message: "姓名不能为空", trigger: "blur" }
        ],
        idNumber: [
          { required: true, message: "身份证号不能为空", trigger: "blur" }
        ],
        sex: [
          { required: true, message: "姓名不能为空", trigger: "change" }
        ],
        birthday: [
          { required: true, message: "生日不能为空", trigger: "blur" }
        ],
        nation: [
          { required: true, message: "民族不能为空", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        addr: [
          { required: true, message: "地址不能为空", trigger: "blur" }
        ],
        hohIdNumber: [
          { required: true, message: "户主身份证号不能为空", trigger: "blur" }
        ],
        hohRelationship: [
          { required: true, message: "与户主关系不能为空", trigger: "blur" }
        ],
        hsCount: [
          { required: true, message: "核酸检测次数不能为空", trigger: "blur" }
        ]
      },
      companyList: [],

      treeOptions: [],
      isAdmin: false
    };
  },
  created() {
    this.getUserTree();
    this.getList();
  },
  methods: {
    getUserTree() {
      getUserTree().then(res => {
        res.data.forEach(i=>{
          i.value = i.id
        })
        this.treeOptions = res.data
      })
    },

    clearCompany(){
      this.queryParams.companyIds = null
    },

    queryhandleNodeClick(val){
      var companyName =  this.getHierarchyData(this.treeOptions,[val.id],val.label)
      this.queryParams.companyName = companyName.toString().replaceAll(',','/')
      if(val.children){
        var companyIds =  this.getChildNodes(val)
        companyIds.push(val.id)
        this.queryParams.companyIds = companyIds
      }else{
        this.queryParams.companyIds = [val.id]
      }
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      if(this.queryParams.hsEndDate){
        let newEndTime = this.queryParams.hsEndDate;
        this.queryParams.hsEndDate = this.parseTime(
          this.endTime(newEndTime)
        )
      }
      listMemberWithDetail(this.queryParams).then(response => {
        this.memberList = response.rows;
        if (this.memberList) {
          this.memberList.forEach(t => t.idNumber = this.getIdNumber(t.idNumber))
        }
        this.total = response.total;
        this.loading = false;
      });
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
        headUrl: null,
        name: null,
        idNumber: null,
        sex: null,
        birthday: null,
        nation: null,
        phone: null,
        addr1: null,
        addr2: null,
        hohIdNumber: null,
        hohRelationship: null,
        ec1Name: null,
        ec1Phone: null,
        ec2Name: null,
        ec2Phone: null,
        hsTotalCount: null,
        hsCount: null,
        hsRecordDate: null
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
      this.queryParams.companyIds = null;
      this.queryParams.companyName = null;
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
    /** 导出按钮操作 */
    handleExport() {
      this.download('hs/member/detail/export', {
        ...this.queryParams
      }, `核酸检测记录_${new Date().getTime()}.xlsx`)
    },
    getIdNumber(idNumber) {
      if (!idNumber) {
        return "";
      }
      return idNumber.startsWith("0-") || idNumber.startsWith("1-") ? "" : idNumber;
    },
  }
};
</script>
