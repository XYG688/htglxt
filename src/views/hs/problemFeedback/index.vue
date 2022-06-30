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
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="completed">
        <el-select v-model="queryParams.completed" placeholder="状态" clearable size="small">
          <el-option
            v-for="item in stateTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
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
          type="primary"
          plain
          size="mini"
          :disabled="multiple"
          @click="handleAudits"
          v-hasPermi="['permit:apply:audit']"
        >一键回复
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="applyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" align="center" type="index" width="80"/>
      <el-table-column label="姓名" align="center" prop="name"/>
      <el-table-column label="手机号" align="center" prop="phone"/>
      <el-table-column label="社区/网格" align="center" prop="companyName"/>
      <el-table-column label="反馈问题" align="center" prop="askContent"/>
      <el-table-column label="状态" align="center" prop="completed">
        <template slot-scope="scope">
          <div :class="[!!scope.row.completed? 'is-passed': 'not-passed']">{{!!scope.row.completed ? '已处理' : '未处理'}}</div>
        </template>
      </el-table-column>
      <el-table-column label="反馈时间" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- v-if="!scope.row.state" -->
          <el-button
            size="mini"
            type="text"
            v-if="!scope.row.completed"
            @click="handleUpdate(scope.row,'update')"
            v-hasPermi="['permit:apply:auditOne']"
          >回复
          </el-button><el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row,'add')"
            v-hasPermi="['permit:apply:query']"
          >查看
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

    <!-- 添加或修改申请记录 对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="70%">
      <el-form ref="form" :model="form" :rules="rules">
        <el-descriptions class="margin-top" title="用户数据" :column="3" :size="size" border
                         v-if="form && JSON.stringify(form) !== '{}'"
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
        <el-row>
          <el-col :span="11">
            <el-descriptions class="margin-top" style="margin-top: 30px" title="申请信息" :column="1" :size="size" border v-if="form && JSON.stringify(form) !== '{}'"
            >
              <el-descriptions-item>
                <template slot="label">
                  问题反馈
                </template>
                {{ formAuit.askContent }}
              </el-descriptions-item>
              <el-descriptions-item>
                <template slot="label">
                  图片资料
                </template>
                <template>
                  <el-image
                    v-if="formAuit.imgUrl1"
                    :src="formAuit.imgUrl1"
                    :preview-src-list="[formAuit.imgUrl1]"
                    fit="cover"
                    class="el-image"
                    style="width: 100px;height: 100px;"
                  >
                  </el-image>
                  <el-image
                    v-if="formAuit.imgUrl2"
                    :src="formAuit.imgUrl2"
                    :preview-src-list="[formAuit.imgUrl2]"
                    fit="cover"
                    class="el-image"
                    style="width: 100px;height: 100px;"
                  >
                  </el-image>
                  <el-image
                    v-if="formAuit.imgUrl3"
                    :src="formAuit.imgUrl3"
                    :preview-src-list="[formAuit.imgUrl3]"
                    fit="cover"
                    class="el-image"
                    style="width: 100px;height: 100px;"
                  >
                  </el-image>
                </template>
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="2" style="height: 1px"></el-col>
          <el-col :span="11">
            <section class="reply">
              <h5>回复</h5>
              <el-form-item prop="answerContent">
                <el-input v-model="form.answerContent" type="textarea" placeholder="请回复问题反馈" :disabled='defaultProps'/>
              </el-form-item>
            </section>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {problemFeedbackList, callbackAllProblemFeedback, callbackProblemFeedback, getUserInfo } from '@/api/hs/problemFeedback.js'
import { listApply, getApply, delApply, addApply, updateApply, audit, audits, rejecteds } from '@/api/permit/apply'

import {getImageToken} from "@/api/hs/manageMember";
import {getUserTree} from "@/api/hs/comparison";

export default {
  name: 'Apply',
  dicts: ['permit_audit', 'sys_user_sex', 'nation', 'hoh_relationship','user_type', 'user_profession', 'residence_type', 'user_census', 'document_type'],
  data() {
    return {
      stateTypes: [{
        label: '已回复',
        value: true
      },{
        label: '未回复',
        value: false
      }],
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
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        completed: null,
        name: '',
        phone:'',
        companyIds: null,
        companyName: null,
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
      companyList: [],

      treeOptions: [],
      options: [],
      // 表单校验
      rules: {
        answerContent: [
          { required: true, message: '回复内容不能为空', trigger: 'blur' }
        ]
      },
      isAdmin: false,
      defaultProps: false
    }
  },
  created() {
    this.getUserTree()
    this.getList()
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
      console.log(val)
      this.form.companyId = val.id
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
    getList() {
      this.loading = true
      problemFeedbackList(this.queryParams).then(res => {
        this.applyList = res.rows
        this.total = res.total
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

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */

    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.companyIds = null
      this.queryParams.companyName = null
      this.handleQuery()
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
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
      this.resetForm('form')
    },


    /** 回复按钮操作 */
    handleUpdate(row,type) {
      this.reset();
      if(type == 'add'){
        this.defaultProps = true;
      }else{
        this.defaultProps = false;
      }
      this.formAuit = row
      getUserInfo({userId: row.askUserId}).then(res => {
        const {code,  data} = res
        console.log('var ', res.data);
        if(code == 200 && data) {
          this.form = data
          this.open = true
          this.title = '回复'
        }
      })
    },

    /** 提交按钮 */
    submitForm() {
      if(this.defaultProps){
        this.open = false;
        return false;
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          callbackProblemFeedback(Object.assign(this.form, {questionId: this.formAuit.id})).then(response => {
            this.$modal.msgSuccess('回复成功')
            this.open = false
            this.getList()
          })
        }
      })
    },
    updateForm(){
      updateApply(this.form).then(response =>{
        this.$modal.msgSuccess('修改成功')
        this.open = false
        this.getList()
      })
    },

    /** 批量回复 */
    handleAudits(row) {
      const ids = row.id || this.ids
      var that = this
      that.$prompt('', '请输入回复内容', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '回复原因不能为空'
      }).then(({ value }) => {
        that.loading = true
        callbackAllProblemFeedback({questionIds: ids, answerContent: value}).then(response => {
          that.$modal.msgSuccess('一键回复成功')
          that.loading = false
          that.getList()
        })
      }).catch(() => {
        that.loading = false
      })

    },

    handleAudit(row) {
      this.titleAuit = '申请信息'
      this.openAuit = true
      this.formAuit = row
    }
  }
}
</script>
<style scoped lang='scss'>
  ::v-deep .reply{
    margin-top: 30px;
    h5{
      font-size: 16px;
      line-height: 21px;
      margin: 0;
      margin-bottom: 20px;
      font-weight: bold;
    }
    textarea {
      resize: none;
      height: 100px;
    }
  }
  .is-passed{
    width: 58px;
    height: 28px;
    line-height: 28px;
    background: #FEEDED;
    border: 1px solid #FCDBDB;
    border-radius: 4px;
    font-size: 13px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #F99494;
    text-align: center;
    display: inline-block;
  }
  .not-passed {
    width: 58px;
    height: 28px;
    line-height: 28px;
    background: #E5FEEE;
    border: 1px solid #CBFECB;
    border-radius: 4px;
    font-size: 13px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #21E834;
    text-align: center;
    display: inline-block;
  }
  .data-img{
    width: 120px;
    height: 84px;
  }
</style>
