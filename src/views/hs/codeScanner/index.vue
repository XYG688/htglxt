<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="社区/网格" prop="companyId">
        <el-select v-model="queryParams.companyName" placeholder="请选择村社区"  size="small" clearable @clear="clearCompany">
          <el-option :value="queryParams.companyId" :label="queryParams.companyName"
                     style="width: 260px;height:200px;overflow: auto;background-color:#fff">
            <el-tree
              v-if="treeOptions.length > 0"
              :data="treeOptions"
              :props="defaultPropsValue"
              @node-click="queryhandleNodeClick"
            ></el-tree>
          </el-option>
        </el-select>

      </el-form-item>
      <el-form-item label="姓名" prop=" name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证号" prop="idNumber">
        <el-input
          v-model="queryParams.idNumber"
          placeholder="请输入身份证号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="登记商区" prop="spName">
        <el-input
          v-model="queryParams.spName"
          placeholder="请输入登记商区"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="扫码时间">
        <el-date-picker
          v-model="daterangeCreateTime"
          :clearable='false'
          size="small"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions"
          type="datetimerange"
          :default-time="['00:00:00', '23:59:59']"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="状态" prop="normal">
        <el-select v-model="queryParams.normal" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="state in stateOptions"
            :key="state.value"
            :label="state.label"
            :value="state.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          size="mini"
          @click="handleExport"
          v-hasPermi="['permit:codeScanner:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['permit:codeScanner:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="applyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" align="center" type="index" width="80"/>
      <el-table-column label="姓名" align="center" prop="name"/>
      <el-table-column label="身份证号" align="center" prop="idNumber">
        <template slot-scope="scope">
          <span>{{ getIdNumber(scope.row.idNumber) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="phone"/>
      <el-table-column label="社区/网格" align="center" prop="companyName"/>
      <el-table-column label="现居住地址" align="center" prop="addr"/>
      <el-table-column label="登记商区" align="center" prop="spName"/>
      <el-table-column label="定位地址" align="center" prop="spAddr"/>
      <el-table-column label="进场时间" align="center" prop="inTime"/>
      <el-table-column label="出场时间" align="center" prop="outTime"/>
      <el-table-column label="状态" align="center" prop="depId">
        <template slot-scope="scope">
          <span class="el-tag el-tag--success el-tag--medium el-tag--light" v-if="scope.row.normal">{{ '正常' }}</span>
          <span class="el-tag el-tag--danger el-tag--medium el-tag--light" v-if="!scope.row.normal">{{ '异常' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['permit:codeScanner:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
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
import {getCodeScannerList, delCodeScannerData} from '@/api/hs/codeScanner.js'
import {
  getMember,
  updateMember
} from '@/api/hs/member'
import {getUserTree} from "@/api/hs/comparison";

export default {
  name: 'Apply',
  dicts: ['permit_audit', 'sys_user_sex', 'nation', 'hoh_relationship'],
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近三天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      size: 'medium',
      // 遮罩层
      loading: true,
      srcList: [],
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 部门树选项
      deptOptions: [],
      // 总条数
      total: 0,
      // 申请记录 表格数据
      applyList: [],
      // 弹出层标题
      title: '',
      titleAuit: '',
      titleUser: '',
      // 是否显示弹出层
      open: false,
      openAuit: false,
      openUser: false,
      defaultOrUpdate: true,
      // 用户Id时间范围
      daterangeCreateTime: [
        this.parseTime(this.IsoTime(
          new Date(new Date(new Date().toLocaleDateString()).getTime())
        )),
        this.parseTime(this.IsoTime(
          new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
        ))

      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        createTime: null,
        state: null,
        companyIds: null,
        companyId: null,
        companyName: null,
        orderByColumn: 'createTime',
        isAsc: 'desc',
        startTime: null,
        endTime: null,
        spName: null,
        name: null,
        phone: null,
        idNumber: null,
        normal: null
      },
      // 核酸状态
      hsState3: [
        {
          label: '全部',
          value: 0
        },
        {
          label: '绿码',
          value: 1
        },
        {
          label: '红码',
          value: 2
        },
        {
          label: '黄码',
          value: 3
        }
      ],
      // 表单参数
      form: {},
      formAuit: {},
      formUser: {},
      // 表单校验
      rulesUser: {
        name: [
          {required: true, message: '姓名不能为空', trigger: 'blur'}
        ],
        companyId: [
          {required: true, message: '村社区不能为空', trigger: 'blur'}
        ]
      },
      companyList: [],

      treeOptions: [],
      options: [],
      // 表单校验
      rules: {
        reject: [
          {required: true, message: '驳回原因不能为空', trigger: 'blur'}
        ],
        state: [
          {required: true, message: '请选择审核状态', trigger: 'change'}
        ]
      },
      isAdmin: false,
      stateOptions: [{
        value: true,
        label: '正常'
      }, {
        value: false,
        label: '异常'
      }]
    }
  },
  created() {
    this.getUserTree()
    this.getList()
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
    /** 查询申请记录 列表 */
    getList() {
      this.loading = true
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.startTime = this.daterangeCreateTime[0]
        this.queryParams.endTime = this.daterangeCreateTime[1]
      }else{
        this.queryParams.startTime = null
        this.queryParams.endTime = null
      }
      getCodeScannerList(this.queryParams).then(response => {
        this.applyList = response.rows
        this.total = response.total
        this.loading = false
      })
    },

    // 取消按钮
    cancel() {
      this.openUser = false
      this.open = false
      this.reset()
      this.resetUser()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        revision: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        userId: null,
        state: null,
        reject: null,
        name: null,
        sex: null,
        birthday: null,
        registerAddr: null,
        nation: null,
        idNumber: null,
        frontImg: null,
        reverseImg: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateTime = []
      this.queryParams.companyIds = null
      this.queryParams.companyName = null
      this.resetForm('queryForm')
      this.handleQuery()
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.openUser = true
      this.titleUser = '新增 '
    },
    // 表单重置
    resetUser() {
      this.formUser = {
        id: null,
        name: null,
        idNumber: null,
        sex: null,
        birthday: null,
        nation: null,
        phone: null,
        addr1: null,
        hohIdNumber: null,
        hohRelationship: null,
        ec1Name: null,
        ec1Phone: null,
        ec2Name: null,
        ec2Phone: null,
        hsTotalCount: null,
        headUrl: null,
        addr2: null,
        workDesc: null,
        incomeDesc: null,
        smuggleDesc: null,
        retentionDesc: null,
        fishingBoatDesc: null,
        companyId: null,
        hsCode: null,
        companyName: null,
        dataSources: null,
        hsState: null,
        state: null,
        registerAddr: null,
        frontImg: null,
        reverseImg: null,
        hohName: null,
        description: null,
        vaccineCnt: null
      }
      this.resetForm('formUser')
    },
    /** 修改按钮操作 */
    handleUpdate(id) {
      this.resetUser()
      // checkCodeScannerData(id).then(res => {
      //   const {code, data} = res
      //   if(code === 200 && data) {
      //     this.formUser = data
      //     this.openUser = true
      //   }
      // })
      getMember(id).then(response => {
        this.formUser = response.data
        this.openUser = true
        this.titleUser = '修改'
      })
    },

    /** 审核按钮操作 */
    handleAudit(row) {
      console.log(row)
      this.reset()
      this.formAuit = row
      const id = row.id || this.ids
      getApply(id).then(response => {
        this.form = response.data
        this.srcList.push(this.form.frontImg)
        this.srcList.push(this.form.reverseImg)
        this.open = true
        this.title = '审核数据'
        this.form.state = ''
        this.defaultOrUpdate = true;
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            if (this.form.state === '1') {
              audit(this.form).then(response => {
                this.$modal.msgSuccess('审核成功')
                this.open = false
                this.getList()
              })
            } else {
              updateApply(this.form).then(response => {
                this.$modal.msgSuccess('驳回成功')
                this.open = false
                this.getList()
              })
            }

          }
        }
      })
    },
    updateForm() {
      updateApply(this.form).then(response => {
        this.$modal.msgSuccess('修改成功')
        this.open = false
        this.getList()
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id ? [row.id] : this.ids;
      this.$modal.confirm('是否确认删除申请记录 编号为"' + ids + '"的数据项？').then(function () {
        return delCodeScannerData(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    //下载
    handleDownload() {

    },
    /** 批量审核 */
    handleAudits(row) {
      const ids = row.id || this.ids
      var that = this

      this.$confirm('是否确认审核通过  编号为"' + ids + '"的数据项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.loading = true
        audits(ids).then(response => {
          that.$modal.msgSuccess('一键审核成功')
          that.loading = false
          that.getList()
        })
      }).catch(() => {
        that.loading = false
      })

    },

    /** 批量驳回 */
    handleRejecteds(row) {
      var that = this;
      that.$prompt('', '请输入驳回原因', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '驳回原因不能为空'
      }).then(({value}) => {
        const ids = row.id || that.ids

        that.$confirm('是否确认审核驳回  编号为"' + ids + '"的数据项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.loading = true
          rejecteds({
            ids: ids,
            reject: value
          }).then(response => {
            that.$modal.msgSuccess('一键驳回成功')
            that.loading = false
            that.getList()
          })
        }).catch(() => {
          that.loading = false
        })
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    },

    /** 提交按钮 */
    submitFormUser() {
      this.$refs['formUser'].validate(valid => {
        if (valid) {
          if (this.formUser.id != null) {//修改
            updateMember(this.formUser).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.getList()
              this.openUser = false
            })
          } else {//新增

          }
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('/up/v2/back/scan/list/export', {
        ...this.queryParams
      }, `登记扫码列表_${new Date().getTime()}.xlsx`)
    },
    getStr(str) {
      return str ? str : ''
    },
    getIdNumber(idNumber) {
      if (!idNumber) {
        return ''
      }
      return idNumber.startsWith('0-') || idNumber.startsWith('1-') ? '' : idNumber
    }
  }
}
</script>
