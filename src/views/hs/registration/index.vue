<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="社区/网格" prop="companyId">
        <el-select v-model="queryParams.companyName" placeholder="请选择村社区" size="small" clearable @clear="clearCompany">
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
      <el-form-item label="商区名称" prop="spName">
        <el-input
          v-model="queryParams.spName"
          placeholder="请输入商区名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="商区类型" prop="spType">
        <el-select v-model="queryParams.spType" placeholder="请选择商区类型" size="small" clearable>
          <el-option
            v-for="dict in dict.type.business_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value*1"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="流量状态" prop="streamState">
        <el-select v-model="queryParams.streamState" placeholder="请选择流量状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.flow_state"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="开始时间" align="center" prop="startTime" width="320">-->
<!--        <el-date-picker size="small"-->
<!--                        v-model="queryParams.startTime"-->
<!--                        type="date"-->
<!--                        value-format="yyyy-MM-dd"-->
<!--                        placeholder="选择开始时间">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="结束时间" align="center" prop="endTime" width="220">-->
<!--        <el-date-picker size="small"-->
<!--                        v-model="queryParams.endTime"-->
<!--                        type="date"-->
<!--                        value-format="yyyy-MM-dd"-->
<!--                        placeholder="选择结束时间">-->
<!--        </el-date-picker>-->
<!--      </el-form-item>-->
      <el-form-item label="统计时间">
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
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!--    <el-row :gutter="10" class="mb8">-->
    <!--      <el-col :span="1.5">-->
    <!--        <el-button-->
    <!--          type="warning"-->
    <!--          plain-->
    <!--          size="mini"-->
    <!--          @click="handleExport"-->
    <!--          v-hasPermi="['permit:apply:export']"-->
    <!--        >导出</el-button>-->
    <!--      </el-col>-->
    <!--      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>-->
    <!--    </el-row>-->

    <el-table v-loading="loading" :data="applyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" align="center" type="index" width="80"/>
      <el-table-column label="商区名称" align="center" prop="spName"/>
      <el-table-column label="商区类型" align="center" prop="spType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.business_type" :value="scope.row.spType"/>
        </template>
      </el-table-column>
      <el-table-column label="社区/网格" align="center" prop="companyName"/>
      <el-table-column label="进入人数" align="center" prop="streamInCnt"/>
      <el-table-column label="出入人数" align="center" prop="streamOutCnt"/>
      <el-table-column label="总登记人数" align="center" prop="streamInCnt"/>
      <el-table-column label="流量状态" align="center" prop="">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.flow_state" :value="scope.row.streamState"/>
        </template>
      </el-table-column>
      <!--      <el-table-column label="登记时间" align="center" prop="">-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ parseTime(scope.row.testTime) }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!-- <el-table-column label="疫情状态" align="center" prop="depId">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.permit_audit" :value="scope.row.state"/>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            @click="handleDefault(scope.row.spId)"
            v-hasPermi="['permit:apply:auditOne']"
          >查看
          </el-button> -->
          <el-button
            size="mini"
            type="text"
            @click="handleSet(scope.row.spId)"
            v-hasPermi="['permit:apply:updateUser']"
          >设置
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.page"
      :limit.sync="queryParams.row"
      @pagination="getList"
    />

    <!-- 添加或修改商户 -->
    <el-dialog :title="titleUser" :visible.sync="openUser" width="700px" append-to-body class="dialogUser">
      <h5>人流量设置</h5>
      <el-form ref="formUser" :model="formUser" :rules="rulesUser" label-width="120px">
        <el-form-item label="最高人流量限制" prop="warnStreamMax">
          <el-input v-model="formUser.warnStreamMax" style="width: 240px;" placeholder="请输入最高人流量限制">
            <span slot="suffix" style="color: #000;">人</span>
          </el-input>
          <span style="color: #000;">（如200人，>200，状态为预警）</span>
        </el-form-item>
        <el-form-item label="超过限定值" prop="sosStreamMax">
          <el-input v-model="formUser.sosStreamMax" style="width: 240px;" placeholder="请输入超过限定值">
            <span slot="suffix" style="color: #000;">人</span>
          </el-input>
          <span style="color: #000;">（如50人，>50人报警）</span>
        </el-form-item>
        <el-form-item label="商区设置" prop="spState">
          <el-radio-group v-model="formUser.spState">
            <el-radio label="ABNORMAL">有疫商区</el-radio>
            <el-radio label="NORMAL">无疫商区</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormUser">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getBusinessFlow} from '@/api/hs/businessManage.js'
import {listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild} from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {listApply, getApply, delApply, addApply, updateApply, audit, audits, rejecteds} from '@/api/permit/apply'
import {getTree, getUserTree} from '@/api/hs/comparison'
import {getList, setStream, getStream} from '@/api/hs/registration'
import {
  getMember,
  updateMember
} from '@/api/hs/member'

export default {
  name: 'Apply',
  dicts: ['permit_audit', 'sys_user_sex', 'nation', 'hoh_relationship', 'business_type', 'sp_state', 'flow_state'],
  components: {Treeselect},
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
        page: 1,
        row: 10,
        createTime: null,
        state: null,
        companyIds: null,
        companyId: null,
        companyName: null,
        orderByColumn: 'createTime',
        isAsc: 'desc',
        spName: null,
        spType: null,
        streamState: null,
        startTime: null,
        endTime: null,
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
      isAdmin: false
    }
  },
  created() {
    this.getUserTree()
    this.getList()
    // listDept().then(response => {
    //   this.deptOptions = this.handleTree(response.data, 'deptId')
    // })
  },
  methods: {

    getUserTree() {
      getUserTree().then(res => {
        res.data.forEach(i => {
          i.value = i.id
        })
        this.treeOptions = res.data
      })
    },

    clearCompany() {
      this.queryParams.companyIds = null
    },

    queryhandleNodeClick(val) {
      var companyName = this.getHierarchyData(this.treeOptions, [val.id], val.label)
      this.queryParams.companyName = companyName.toString().replaceAll(',', '/')
      if (val.children) {
        var companyIds = this.getChildNodes(val)
        companyIds.push(val.id)
        this.queryParams.companyIds = companyIds
      } else {
        this.queryParams.companyIds = [val.id]
      }
    },
    /** 查询申请记录 列表 */
    getList() {
      this.loading = true
      this.queryParams.params = {}
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.startTime = this.daterangeCreateTime[0]
        this.queryParams.endTime = this.daterangeCreateTime[1]
      }else{
        this.queryParams.startTime = null
        this.queryParams.endTime = null
      }
      getList({
        ...this.queryParams,
        streamState: this.queryParams.streamState ? this.queryParams.streamState : null
      }).then(res => {
        const {code, data} = res
        if (code == 200 && data) {
          this.applyList = data.list
          this.total = data.cnt
          this.loading = false
        }
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
      this.queryParams.page = 1
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
    /** 设置按钮操作 */
    handleSet(id) {
      this.reset()
      getStream({spId: id}).then(res => {
        const {code, data} = res
        if (code === 200 && data) {
          this.formUser = JSON.parse(JSON.stringify(data));
          this.openUser = true
          this.titleUser = '设置'
        }
      })
    },
    // 表单重置
    resetUser() {
      this.formUser = {
        sosStreamMax: null,
        spId: null,
        spState: null,
        warnStreamMax: null
      }
      this.resetForm('formUser')
    },
    /** 修改按钮操作 */
    handleUpdate(id) {
      this.resetUser()
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
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除申请记录 编号为"' + ids + '"的数据项？').then(function () {
        return delApply(ids)
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
          setStream(this.formUser).then(response => {
            this.$modal.msgSuccess('设置成功')
            this.openUser = false
            this.getList()
          })
        }
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$confirm('是否导出全部数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.download('/up/api/v2/sp/manager/stream/export', {
          ...this.queryParams,
          streamState: this.queryParams.streamState != -1 ? this.queryParams.streamState : null
        }, `登记查询_${new Date().getTime()}.xlsx`, true)

      }).catch(() => {

      })
    },
    handleDefault(id) {
      getBusinessFlow({spId: id}).then(res => {
        const {code, data} = res
        if (code === 200 && data) {
          this.openUser = true
        }
      })
    }
  }
}
</script>
<style scoped lang='scss'>
.dialogUser {
  h5 {
    padding-left: 20px;
    margin-top: 20px;
    font-weight: 400;
    vertical-align: middle;
    font-size: 16px;
    color: #000;
    margin: 0;
    line-height: 50px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  ::v-deep .el-form-item__label {
    font-weight: 400;
    color: #000;
  }
}
</style>
