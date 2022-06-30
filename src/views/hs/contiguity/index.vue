<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="88px">
<!--      <el-form-item label="核酸码" prop="hsCode">-->
<!--        <el-input-->
<!--          v-model="queryParams.hsCode"-->
<!--          placeholder="请输入核酸码"-->
<!--          clearable-->
<!--          size="small"-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="姓名" prop="name">
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
      <!-- <br/> -->
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="确诊人" prop="revision">
        <el-select v-model="queryParams.userId" placeholder="请选择确诊人" clearable size="small"  @change="changeUserId"  :clearable='false'>
          <el-option
            v-for="dict in DiagnosisUserInfoList"
            :key="dict.userId"
            :label="dict.name"
            :value="dict.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="确诊日期" prop="revision">
        <el-select v-model="queryParams.udrId" placeholder="请选择确诊日期" clearable size="small"  :clearable='false'>
          <el-option
            v-for="dict in DiagnosisUserInfoListTime"
            :key="dict.udrId"
            :label="dict.createTime"
            :value="dict.udrId"
          />
        </el-select>
      </el-form-item>
<!--      <el-form-item label="登记商区" prop="revision">-->
<!--        <el-select v-model="queryParams.state" placeholder="请选择登记商区" clearable size="small">-->
<!--          <el-option-->
<!--            v-for="dict in dict.type.permit_audit"-->
<!--            :key="dict.value"-->
<!--            :label="dict.label"-->
<!--            :value="dict.value"-->
<!--          />-->
<!--        </el-select>-->
<!--      </el-form-item>-->
      <el-form-item label="用户状态" prop="revision">
        <el-select v-model="queryParams.userState" placeholder="请选择用户状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.permit_state"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
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
          v-hasPermi="['permit:contiguity:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['permit:contiguity:audit']"
        >一键解除
        </el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['permit:apply:remove']"-->
<!--        >删除-->
<!--        </el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="applyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" align="center" type="index" width="80"/>
<!--      <el-table-column label="核酸码" align="center" prop="hsCode"/>-->
      <el-table-column label="姓名" align="center" prop="name"/>
<!--      <el-table-column label="性别" align="center" prop="sex">-->
<!--        <template slot-scope="scope">-->
<!--          <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.sex"/>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="身份证号" align="center" prop="idNumber">
        <template slot-scope="scope">
          <span>{{ getIdNumber(scope.row.idNumber) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="phone"/>
      <el-table-column label="社区/网格" align="center" prop="companyName"/>
      <el-table-column label="现居住地址" align="center" prop="addr" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ getStr(scope.row.addr)  }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="登记地址" align="center" prop="addr1" show-overflow-tooltip>-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ getStr(scope.row.addr)  }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="创建日期" align="center" prop="birthday" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="已隔离天数" align="center" prop="phone">-->
<!--        <template slot-scope="scope">-->
<!--          <span>{{ dateMinus(scope.row.createTime) }}</span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column label="用户状态" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.permit_state" :value="scope.row.userState"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['permit:contiguity:remove']"
          >解除
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
    <!-- 添加或修改申请记录 对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="70%">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-descriptions class="margin-top" title="" :column="3" :size="size" border
                         v-if="form && JSON.stringify(form) !== '{}'"
        >
          <!-- <template slot="extra">
            <el-button type="primary" @click="handleUpdateUser(form.hsFamilyMember.id)" size="small">修改用户信息
            </el-button>
          </template> -->
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-picture-outline-round"></i>
              头像
            </template>
            <el-image
              :src="form.avatar"
              :preview-src-list="[form.avatar]"
              fit="fit"
              class="el-image"
              style="width: 100px;height: 100px;"
            >
            </el-image>
<!--            <el-avatar shape="square" :size="100" :src="form.avatar"></el-avatar>-->
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              姓名
            </template>
            {{ form.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i v-if="form.sex!=null && form.sex == 0 " class="el-icon-male"></i>
              <i v-if="form.sex!=null && form.sex == 1 "
                 class="el-icon-female"
              ></i>
              性别
            </template>
            {{ form.sex != null ? form.sex === 0 ? '男' : '女' : '未知' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-postcard"></i>
              身份证号码
            </template>
            {{ form.idNumber }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              手机号
            </template>
            {{ form.phone }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-potato-strips"></i>
              生日
            </template>
            {{ form.birthday }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              证件类型
            </template>
            <dict-tag :options="dict.type.document_type" :value="form.documentType"/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              社区网格
            </template>
            {{ form.companyName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              民族
            </template>
            <dict-tag :options="dict.type.nation" :value="form.nation"/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              人员类型
            </template>
            <dict-tag :options="dict.type.user_profession" :value="form.userProfession"/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              居住类型
            </template>
            <dict-tag :options="dict.type.residence_type" :value="form.residenceType"/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              户籍类型
            </template>
            <dict-tag :options="dict.type.user_census" :value="form.userCensus"/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              户籍地址
            </template>
            {{ form.registerAddr }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              现居住地址
            </template>
            {{ form.addr }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              备注
            </template>
            {{ form.remarks }}
          </el-descriptions-item>
        </el-descriptions>

        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { listApply, getApply, delApply, addApply, updateApply, audit, audits, rejecteds } from '@/api/permit/apply'
import {
  getMember, getMember1,
  updateMember
} from '@/api/hs/member'
import {
  getContactsUserInfoByPage,
  removeUserDiagnosisState,
  getDiagnosisUserInfoList,
  getDiagnosisUserTimeList
} from "@/api/visit/visit";

export default {
  name: 'Apply',
  dicts: ['permit_audit', 'sys_user_sex', 'nation', 'hoh_relationship', 'permit_state', 'apply_head_state','user_type', 'user_profession', 'residence_type', 'user_census', 'document_type'],

  data() {
    return {
      DiagnosisUserInfoList: [],
      DiagnosisUserInfoListTime: [],
      size: 'medium',
      // 遮罩层
      loading: false,
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
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        page: 1,
        row: 10,
        userId: null,
        userState: null,
        name: null,
        idNumber: null,
        phone: null,
        udrId: null,
        spId: null,
        companyIds: null,
        orderByColumn: 'createTime',
        isAsc: 'desc'
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
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '村社区不能为空', trigger: 'blur' }
        ]
      },
      companyList: [],

      treeOptions: [],
      options: [],
      // 表单校验
      rules: {
        reject: [
          { required: true, message: '驳回原因不能为空', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ]
      },
      isAdmin: false
    }
  },
  created() {
    var that = this

    var param ={
      page:1,
      row:1000
    }
    getDiagnosisUserInfoList(param).then(response => {
      console.log(response)
      this.DiagnosisUserInfoList = response.data
      if(response.data && response.data.length>0){
        that.queryParams.userId = response.data[0].userId
        getDiagnosisUserTimeList(response.data[0].userId).then(res => {
          console.log(res)
          that.DiagnosisUserInfoListTime = res.data
          if(res.data && res.data.length>0){
             that.queryParams.udrId = res.data[0].udrId
            that.getList()
          }
        })
      }
    })
  },
  methods: {
    dateMinus(date1){//date1:小日期   date2:大日期
      var sdate = new Date(date1);
      var now = new Date();
      var days = now.getTime() - sdate.getTime();
      var day = parseInt(days / (1000 * 60 * 60 * 24));
      return day;
    },
    changeUserId(val){
      var that = this
      getDiagnosisUserTimeList(val).then(res => {
        console.log(res)
        that.DiagnosisUserInfoListTime = res.data
        if(res.data && res.data.length>0){
          that.queryParams.udrId = res.data[0].udrId
        }
      })
    },
    /** 查询申请记录 列表 */
    getList() {
      this.loading = true
      this.queryParams.params = {}
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params['beginCreateTime'] = this.daterangeCreateTime[0]
        this.queryParams.params['endCreateTime'] = this.daterangeCreateTime[1]
      }

      if (this.queryParams.companyName!=null && this.queryParams.companyName!=''&& this.queryParams.companyIds != null && this.queryParams.companyIds.length > 0) {
        this.queryParams.params['depId'] = this.queryParams.companyIds[this.queryParams.companyIds.length-1]
      }
      if (null != this.queryParams.hsCode && '' != this.queryParams.hsCode) {
        this.queryParams.params['hsCode'] = this.queryParams.hsCode
      }
      if (null != this.queryParams.phone && '' != this.queryParams.phone) {
        this.queryParams.params['phone'] = this.queryParams.phone
      }
      if(!this.queryParams.userState){
        this.queryParams.userState = null
      }
      getContactsUserInfoByPage(this.queryParams).then(response => {
        this.applyList = response.data.list
        this.total = response.data.cnt
        this.loading = false
      })
    },
    getTree() {
      getTree().then(res => {
        this.options = res.data[0].children
        this.treeOptions = res.data[0].children
        this.getList()
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
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId)
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
    /** 修改按钮操作 */
    handleUpdate(row) {
      getMember1({userId: row.userId}).then(response => {
        this.form = {...response.data, ...JSON.parse(JSON.stringify(row))}
        this.open = true
        this.title = '查看信息';
        this.defaultOrUpdate = false;

      })
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.userId || this.ids
      console.log(typeof ids)
      var idsList = []
      if(typeof ids ==='number'){
        idsList.push(ids)
      }else{
        idsList = ids
      }
      var param = {
        udrId : this.queryParams.udrId,
        isDiagnosis:false,
        userIds : idsList
      }
      this.$modal.confirm('是否确认解除状态 编号为"' + ids + '"的数据项？').then(function() {
        return removeUserDiagnosisState(param)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download('/up/v2/spvisit/user/contacts/export', {
        ...this.queryParams
      }, `密接者列表_${new Date().getTime()}.xlsx`)
    },
    getStr(str) {
      return str ? str : ''
    },
    getIdNumber(idNumber) {
      if (!idNumber) {
        return ''
      }
      return idNumber.startsWith('0-') || idNumber.startsWith('1-') ? '' : idNumber
    },
    gethsState(hsState) {
      let str = ''
      switch (hsState) {
        case 0:
          str = '无'
          break
        case 1:
          str = '绿码'
          break
        case 2:
          str = '红码'
          break
        case 3:
          str = '黄码'
          break
      }
      return str
    }
  }
}
</script>
