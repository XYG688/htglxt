<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" >
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
        <el-select v-model="queryParams.spType" placeholder="商区类型" size="small" clearable>
          <el-option
            v-for="dict in dict.type.business_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value*1"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="负责人" prop="nameFilter">
        <el-input
          v-model="queryParams.nameFilter"
          placeholder="请输入负责人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="phoneFilter">
        <el-input
          v-model="queryParams.phoneFilter"
          placeholder="请输入联系方式"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="场所防控状态" prop="spState">
        <el-select v-model="queryParams.spState" placeholder="场所防控状态" size="small" clearable>
          <el-option
            v-for="dict in dict.type.sp_state"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="重点关注场所" prop="spState">
        <el-select v-model="queryParams.focus" placeholder="重点关注场所" size="small" clearable>
          <el-option
            v-for="dict in dict.type.is_focus"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="revision">
        <el-select v-model="queryParams.requestState" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.business_state_type"
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
          v-hasPermi="['permit:pollCode:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          :disabled="multiple"
          @click="handleAudits"
          v-hasPermi="['permit:pollCode:audit']"
        >一键审核
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['permit:pollCode:remove']"
        >删除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="applyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" align="center" type="index" width="80"/>
      <el-table-column label="商区名称" align="center" prop="spName"/>
      <el-table-column label="商区类型" align="center" prop="spType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.business_type" :value="scope.row.spType"/>
        </template>
      </el-table-column>
      <el-table-column label="负责人" align="center" prop="name"/>
      <el-table-column label="联系电话" align="center" prop="phone"/>
      <el-table-column label="社区/网格" align="center" prop="companyName"/>
      <el-table-column label="联系地址" align="center" prop="addr"/>
      <el-table-column label="重点关注场所" align="center" prop="focus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_focus" :value="scope.row.focus"/>
        </template>
      </el-table-column>
      <el-table-column label="场所防控状态" align="center" prop="spState">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sp_state" :value="scope.row.spState"/>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="spStreamState">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.business_state_type" :value="scope.row.requestState"/>
        </template>
      </el-table-column>
       <el-table-column label="申请时间" align="center" prop="requestTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.requestTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="verifyName"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.requestState==='REQUEST'"
            size="mini"
            type="text"
            @click="handleAudit(scope.row)"
            v-hasPermi="['permit:pollCode:auditOne']"
          >审核
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row.spId)"
            v-hasPermi="['permit:pollCode:update']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['permit:pollCode:remove']"
          >删除
          </el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            @click="handleDownload(scope.row)"-->
<!--            v-hasPermi="['permit:apply:query']"-->
<!--          >下载-->
<!--          </el-button>-->
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

    <!-- 审核 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="70%">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-descriptions class="margin-top" title="用户数据" :column="3" :size="size" border
          v-if="formAuit && JSON.stringify(formAuit) !== '{}'"
        >
          <!-- <template slot="extra">
            <el-button type="primary" @click="handleUpdateUser(form.hsFamilyMember.id)" size="small">修改用户信息
            </el-button>
          </template> -->
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              姓名
            </template>
            {{ formAuit.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i v-if="formAuit.sex!=null && formAuit.sex == 0 " class="el-icon-male"></i>
              <i v-if="formAuit.sex!=null && formAuit.sex == 1 "
                 class="el-icon-female"
              ></i>
              性别
            </template>
            {{ formAuit.sex != null ? formAuit.sex === 0 ? '男' : '女' : '未知' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-postcard"></i>
              身份证号码
            </template>
            {{ formAuit.idNumber }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              手机号
            </template>
            {{ formAuit.phone }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-potato-strips"></i>
              生日
            </template>
            {{ formAuit.birthday }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              证件类型
            </template>
            <dict-tag :options="dict.type.document_type" :value="formAuit.documentType"/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              社区网格
            </template>
            {{ formAuit.companyName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              民族
            </template>
            <dict-tag :options="dict.type.nation" :value="formAuit.nation"/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              人员类型
            </template>
            <dict-tag :options="dict.type.user_profession" :value="formAuit.userProfession"/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              居住类型
            </template>
            <dict-tag :options="dict.type.residence_type" :value="formAuit.residenceType"/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              户籍类型
            </template>
            <dict-tag :options="dict.type.user_census" :value="formAuit.userCensus"/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              户籍地址
            </template>
            {{ formAuit.registerAddr }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              现居住地址
            </template>
            {{ formAuit.addr }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              备注
            </template>
            {{ formAuit.remarks }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="margin-top" style="margin-top: 30px" title="申请信息" :column="3" :size="size" border
          v-if="form && JSON.stringify(form) !== '{}'"
        >
          <el-descriptions-item>
            <template slot="label">
              商户名称
            </template>
            <el-input v-if="!defaultOrUpdate" v-model="form.spName" placeholder="请输入商户名称"/>
            <span v-if="defaultOrUpdate">{{ form.spName }}</span>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              商区类型
            </template>
            <el-select v-if="!defaultOrUpdate" v-model="form.spType" placeholder="请选择商区类型">
              <el-option
                v-for="dict in dict.type.sys_user_sex"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
            <dict-tag v-if="defaultOrUpdate" :options="dict.type.business_type" :value="form.spType"/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              负责人
            </template>
            <el-input v-if="!defaultOrUpdate" v-model="form.name" placeholder="请输入负责人"/>
            <span v-if="defaultOrUpdate">{{ form.name }}</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              申请时间
            </template>
            <el-date-picker v-if="!defaultOrUpdate" clearable
              v-model="form.createTime"
              type="date"
              value-format="yyyy-MM-dd"
              format = 'yyyy-MM-dd'
              placeholder="选择申请时间"
            >
            </el-date-picker>
            <span v-if="defaultOrUpdate">{{ parseTime(form.createTime) }}</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              联系电话
            </template>
            <el-input v-if="!defaultOrUpdate" v-model="form.phone" placeholder="请输入联系电话"/>
            <span v-if="defaultOrUpdate">{{ form.phone }}</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-postcard"></i>
              身份证号码
            </template>
            <el-input v-if="!defaultOrUpdate" v-model="form.idNumber" placeholder="请输入户主身份证号"/>
            <span v-if="defaultOrUpdate">{{ form.idNumber }}</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              商区地址
            </template>
            <el-input v-if="!defaultOrUpdate" v-model="form.addr" type="textarea" placeholder="请输入商区地址"/>
            <span v-if="defaultOrUpdate">{{ form.addr }}</span>
          </el-descriptions-item>
        </el-descriptions>
        <el-form-item label="审核状态" prop="state" v-if="title==='审核数据'">
          <el-radio-group v-model="form.state">
            <el-radio label="1">同意</el-radio>
            <el-radio label="2">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="驳回原因" prop="rejectReason" v-if="form.state==='2'">
          <el-input v-model="form.rejectReason" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="title==='审核数据'">确 定</el-button>
        <el-button type="primary" @click="updateForm" v-if="!defaultOrUpdate">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 修改商户 -->
    <el-dialog :title="titleUser" :visible.sync="openUser" width="500px" append-to-body>
      <el-form ref="formUser" :model="formUser" :rules="rulesUser" label-width="120px">
        <el-form-item label="商区名称" prop="spName">
          <el-input v-model="formUser.spName" placeholder="请输入商区名称"/>
        </el-form-item>
        <el-form-item label="商区类型" prop="spType">
          <el-select v-model="formUser.spType" placeholder="请选择商区类型" clearable style="width: 100%">
            <el-option
              v-for="dict in dict.type.business_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value*1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="负责人" prop="name">
          <el-input v-model="formUser.name" placeholder="请输入负责人姓名"/>
        </el-form-item>
        <el-form-item label="身份证号" prop="idNumber">
          <el-input v-model="formUser.idNumber" placeholder="请输入身份证号"/>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="formUser.phone" placeholder="请输入联系电话"/>
        </el-form-item>
        <el-form-item label="商区地址" prop="addr">
          <el-input v-model="formUser.addr"  type="textarea" placeholder="请输入商区地址"/>
        </el-form-item>
        <el-form-item label="经度" prop="lng">
          <el-input-number v-model="formUser.lng" ></el-input-number>
        </el-form-item>
        <el-form-item label="纬度" prop="lat">
          <el-input-number v-model="formUser.lat" ></el-input-number>
        </el-form-item>
        <el-form-item label="是否重点检测" prop="state" >
          <el-radio-group v-model="formUser.focus">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否疫区" prop="state" >
          <el-radio-group v-model="formUser.spState">
            <el-radio label="ABNORMAL">是</el-radio>
            <el-radio label="NORMAL">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="状态" prop="revision">
          <el-select v-model="formUser.state" placeholder="请选择状态" clearable style="width: 100%">
            <el-option
              v-for="dict in dict.type.permit_audit"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormUser">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getBusinessDetail,
  editDetail,
  rejectApply,
  agreeApply,
  applicationCode,
  delBusinessList,
  deriveBusiness,
  auditsShop,
  getBusinessListV3
} from '@/api/hs/businessManage.js'
import QRCode from "qrcodejs2";
import { formatDate } from '@/utils'
import {getImageToken} from "@/api/hs/manageMember";
import {getUserTree} from "@/api/hs/comparison";
export default {
  name: 'pollCode',
  dicts: ['permit_audit', 'sys_user_sex', 'nation', 'hoh_relationship', 'business_type', 'business_state_type', 'user_profession', 'residence_type', 'user_census','sp_state','is_focus'],

  data() {
    return {
      size: 'medium',
      multiple: true,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      showSearch: true,
      total: 0,
      // 申请记录 表格数据
      applyList: [],
      // 弹出层标题
      title: '',
      titleUser: '',
      // 是否显示弹出层
      open: false,
      openUser: false,
      defaultOrUpdate: true,
      // 查询参数
      queryParams: {
        nameFilter: '', // 负责人
        page: 1,
        row: 10,
        phoneFilter:'',
        spName: '', // 商户名称
        spType: null, // 商户类型
        requestState:null,
        companyIds: null,
        companyName: null,
      },
      // 表单参数
      form: {},
      formAuit: {},
      formUser: {},
      // 表单校验
      rulesUser: {
        spName: [
          { required: true, message: '商区名称不能为空', trigger: 'blur' }
        ],
        spType: [
          { required: true, message: '商区类型不能为空', trigger: 'change' }
        ],
        addr: [
          { required: true, message: '商区地址不能为空', trigger: 'blur' }
        ],

        lng: [
          { required: true, message: '商区经度不能为空', trigger: 'blur' }
        ],
        lat: [
          { required: true, message: '商区纬度不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '负责人姓名不能为空', trigger: 'blur' }
        ],
        idNumber: [
          { required: true, message: '负责人身份证号不能为空', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' }
        ]
      },

      treeOptions: [],
      options: [],
      // 表单校验
      rules: {
        rejectReason: [
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
    this.getList()
    this.getUserTree()
  },
  methods: {
    getQiniuToken(){
      getImageToken().then(res =>{
        this.imageUploadData = {
          token: res.data
        }
      })
    },
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

    formatDate,
    /** 查询申请记录 列表 */
    getList() {
      this.loading = true
      if(!this.queryParams.requestState){
        this.queryParams.requestState = null
      }
      getBusinessListV3(this.queryParams).then(res => {
        const { code , data } = res
        if(code == 200 && data) {
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.spId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 表单重置
    resetUser() {
      this.formUser = {
        addr: "",
        descDetail: "",
        idNumber: "", //身份证号
        lat: 0,
        lng: 0,
        name: "",
        phone: "",
        qrInUrl: "",
        qrOutUrl: "",
        spId: 0,
        spName: "",
        spType: null,
        userId: 0
      }
      // this.resetForm('formUser')
    },
    /** 修改按钮操作 */
    handleUpdate(id) {
      this.resetUser()
      getBusinessDetail({spId: id}).then(response => {
        const {code , data} = response
        if(code ===200 && data) {
          this.formUser = JSON.parse(JSON.stringify(data.spInfo));
          this.openUser = true;
        }
      })
    },

    /** 审核按钮操作 */
    handleAudit(row) {
      this.reset()
      getBusinessDetail({spId: row.spId}).then(response => {
        const {code , data} = response
        if(code ===200 && data) {
          this.formAuit = JSON.parse(JSON.stringify(data.userInfo))
          this.form = JSON.parse(JSON.stringify(data.spInfo))
          this.open = true
          this.title = '审核数据'
          this.defaultOrUpdate = true;
        }
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            if (this.form.state === '1') {
              agreeApply({...this.form,'spId': this.form.id}).then(response => {
                this.$modal.msgSuccess('审核成功')
                this.open = false
                this.getList()
              })
            } else {
              rejectApply({...this.form,'spId': this.form.id}).then(response => {
                this.$modal.msgSuccess('驳回成功')
                this.open = false
                this.getList()
              })
              // this.$prompt('', '请输入驳回原因', {
              //   confirmButtonText: '确定',
              //   cancelButtonText: '取消',
              //   inputPattern: /\S/,
              //   inputErrorMessage: '驳回原因不能为空'
              // }).then(({ value }) => {
              //   console.log('value ', value);
              //   });
            }
          }
        }
      })
    },
    updateForm(){
      editDetail(this.form).then(response =>{
        this.$modal.msgSuccess('修改成功')
        this.open = false
        this.getList()
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.spId ? [row.spId] : this.ids
      this.$modal.confirm('是否确认删除申请记录 编号为"' + ids + '"的数据项？').then(function() {
        return delBusinessList(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },
    //生成二维码下载
    handleDownload(row) {
      const string1 = this.getRandomString(8)
      const string2 = this.getRandomString(8)
      const num = this.getRandomNum(1000, 9999)
      const spId  = row.spId
      const randomString = string1 + '-' + 1 +'-' + num + '-' + row.spId + '-' + string2
      // 生成二维码
      let dvObj = document.createElement('div');
      dvObj.setAttribute('id', 'qrcode')
      document.body.appendChild(dvObj)

      let qrcode = new QRCode('qrcode', {
          width: 200,
          height: 200,
          text: randomString,   // 二维码内容
      })
      let myCanvas = document.getElementById('qrcode').getElementsByTagName('canvas');
      let img=document.getElementById('qrcode').getElementsByTagName('img')
      let a= document.createElement("a")
      let ua = navigator.userAgent;
      if (ua.indexOf("Trident") != -1 && ua.indexOf("Windows") != -1) { // IE内核 并且  windows系统 情况下 才执行;
          var bstr = atob(imgURL.split(',')[1])
          var n = bstr.length
          var u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          var blob = new Blob([u8arr])
          window.navigator.msSaveOrOpenBlob(blob, '下载' + '.' + 'png')
      }else if(ua.indexOf("Firefox") > -1){ //火狐兼容下载
          let blob = this.base64ToBlob(imgURL); //new Blob([content]);
          let evt = document.createEvent("HTMLEvents");
          evt.initEvent("click", true, true);//initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
          a.download = ' ';//下载图片名称，如果填内容识别不到，下载为未知文件，所以我这里就不填为空
          a.href = URL.createObjectURL(blob);
          a.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));//兼容火狐
      }else{ //谷歌兼容下载
          img.src=myCanvas[0].toDataURL('image/jpg');
          // a.href = myCanvas[0].toDataURL('image/png').replace('image/png', 'image/octet-stream')
          a.href=img.src
          //设置下载文件的名字
          a.download = "下载"
            //点击
          a.click()
      }
      document.body.removeChild(dvObj)
    },

    // 生成8位随机字符串
    getRandomString (length) {
      let passArrItem = [];
      const getLowLetter = () => String.fromCharCode(Math.floor(Math.random() * 26) + 97); // a-z
      // 随机index
      const getIndex = () => Math.floor(Math.random() * 25);
      for(let i = 0 ;i < length ; i++) {
        passArrItem.push(getLowLetter())
      }
      return passArrItem.join('')
    },

    getRandomNum (min,max) {
      return Math.floor(Math.random()*(max-min))+min;
    },

    // 批量
    handleAudits(row) {
      const ids = row.spId || this.ids
      var that = this

      this.$confirm('是否确认审核通过  编号为"' + ids + '"的数据项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.loading = true
        auditsShop(ids).then(response => {
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
      }).then(({ value }) => {
        const ids = row.id || that.ids

        that.$confirm('是否确认审核驳回  编号为"' + ids + '"的数据项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.loading = true
          rejecteds({
            ids: ids,
            rejectReason: value
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
        editDetail({...this.formUser,spId: this.formUser.id}).then(response => {
          this.$modal.msgSuccess('修改成功')
          this.getList()
          this.openUser = false
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
        this.download('/up/api/v2/sp/manager/request/export', {
          ...this.queryParams
        }, `登记码申请_${new Date().getTime()}.xlsx`, true)

      }).catch(() => {

      })
    }
  }
}
</script>
