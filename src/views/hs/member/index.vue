<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
       <el-form-item label="证件类型" prop="sex">
         <el-select v-model="queryParams.documentType" placeholder="请选择证件类型" clearable size="small">
           <el-option
             v-for="dict in dict.type.document_type"
             :key="dict.value"
             :label="dict.label"
             :value="dict.value"
           />
         </el-select>
       </el-form-item>
      <el-form-item label="证件号码" prop="idNumber">
        <el-input
          v-model="queryParams.idNumber"
          placeholder="请输入证件号码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <br/> -->
      <el-form-item label="联系电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入联系电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
       <el-form-item label="人员类型" prop="sex">
         <el-select v-model="queryParams.userProfession" placeholder="请选择人员类型" clearable size="small">
           <el-option
             v-for="dict in dict.type.user_profession"
             :key="dict.value"
             :label="dict.label"
             :value="dict.value"
           />
         </el-select>
       </el-form-item>
       <el-form-item label="是否在东兴" prop="sex" label-width="120px">
         <el-select v-model="queryParams.leaveType" placeholder="请选择是否在东兴" clearable size="small">
           <el-option
             v-for="dict in dict.type.leave_type"
             :key="dict.value"
             :label="dict.label"
             :value="dict.value"
           />
         </el-select>
       </el-form-item>
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
      <!-- <el-form-item label="用户类型" size="small">
        <el-select
          v-model="memberTypeListQuery"
          multiple
          collapse-tags
          style="margin-left: 20px;"
          placeholder="请选择">
          <el-option
            v-for="dict in dict.type.user_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="现居住地址" prop="addr" label-width="100px">
        <el-input
          v-model="queryParams.addr"
          placeholder="请输入现居住地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['hs:member:add']"
        >新增
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['hs:member:import']"
        >导入
        </el-button>
      </el-col> -->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="danger"-->
<!--          plain-->
<!--          icon="el-icon-delete"-->
<!--          size="mini"-->
<!--          :disabled="multiple"-->
<!--          @click="handleDelete"-->
<!--          v-hasPermi="['system:user:remove']"-->
<!--        >删除-->
<!--        </el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hs:member:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="handleCompany"
          :disabled="multiple"
          v-hasPermi="['hs:member:company']"
        >一键转移用户归属
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="memberList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" align="center" type="index">
        <template scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="核酸码" align="center" prop="hsCode"/> -->
      <el-table-column label="姓名" align="center" prop="name"/>
      <!-- <el-table-column label="性别" align="center" prop="sex">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.sex"/>
        </template>
      </el-table-column>
      <el-table-column label="出生日期" align="center" prop="birthday" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.birthday, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="证件号码" align="center" prop="idNumber">
        <template slot-scope="scope">
          <span>{{ getIdNumber(scope.row.idNumber) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center" prop="phone"/>
      <el-table-column label="社区/网格" align="center" prop="companyName"/>
      <!-- <el-table-column label="核酸状态" align="center">
        <template slot-scope="scope">
          <span>{{ gethsState(scope.row.hsState) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="现居住地址" align="center" prop="addr" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ getStr(scope.row.addr)  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="人员类型" align="center" prop="leaveType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.user_profession" :value="scope.row.userProfession"/>
        </template>
      </el-table-column>
      <el-table-column label="是否在东兴" align="center" prop="leaveType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.leave_type" :value="scope.row.leaveType"/>
        </template>
      </el-table-column>

      <el-table-column label="注册时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="联系电话" align="center" prop="ec1Phone" /> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hs:member:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            v-hasPermi="['hs:member:unbundle']"
            @click="untieWxUpdate(scope.row)"
          >微信解绑
          </el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click="handleDelete(scope.row)"-->
<!--            v-hasPermi="['hs:member:remove']"-->
<!--          >删除-->
<!--          </el-button>-->
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

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="头像">
              <userInfoImageUpload v-if="imageUploadData" v-model="form.avatar" :limit='1' :isShowTip="false" :imageUploadData = 'imageUploadData'/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="form.sex" placeholder="请选择性别">
                <el-option
                  v-for="dict in dict.type.sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件号码" prop="idNumber">
              <el-input v-model="form.idNumber" placeholder="请输入证件号码" :disabled="title ==='修改用户'"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="生日" prop="birthday">
              <el-date-picker clearable
                              v-model="form.birthday"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择生日">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件类型" prop="documentType">
              <el-select v-model="form.documentType" placeholder="请选择证件类型">
                <el-option
                  v-for="dict in dict.type.document_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="社区/网格" prop="companyId">
              <el-select v-model="form.companyName" placeholder="请选择村社区">
                <el-option :value="form.companyId" :label="form.companyName"
                           style="width: 260px;height:200px;overflow: auto;background-color:#fff">
                  <el-tree
                    v-if="treeOptions.length > 0"
                    :data="treeOptions"
                    :props="defaultPropsValue"
                    @node-click="handleNodeClick"
                  ></el-tree>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
<!--            <el-form-item label="民族" prop="nation">-->
<!--              <el-select v-model="form.nation" placeholder="请选择民族">-->
<!--                <el-option-->
<!--                  v-for="dict in dict.type.nation"-->
<!--                  :key="dict.value"-->
<!--                  :label="dict.label"-->
<!--                  :value="parseInt(dict.value)"-->
<!--                ></el-option>-->
<!--              </el-select>-->
<!--            </el-form-item>-->
            <el-form-item label="是否出东兴" prop="leaveType">
              <el-select v-model="form.leaveType" placeholder="请选择是否在东兴"  size="small">
                <el-option
                  v-for="dict in dict.type.leave_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="人员类型" prop="userProfession">
              <el-select v-model="form.userProfession " placeholder="请选择人员类型" :disabled="!checkPermi(['member:update:userProfession'])">
                <el-option
                v-for="dict in dict.type.user_profession"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="居住类型" prop="residenceType">
              <el-select v-model="form.residenceType" placeholder="请选择居住类型">
                <el-option
                v-for="dict in dict.type.residence_type"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="户籍类型" prop="userCensus">
              <el-select v-model="form.userCensus " placeholder="请选择户籍类型">
                <el-option
                v-for="dict in dict.type.user_census"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
<!--          <el-col :span="8">-->
<!--            <el-form-item label="弹框内容" prop="remarks">-->
<!--              <el-input v-model="form.remarks" type="textarea" placeholder="请输入备注"/>-->
<!--            </el-form-item>-->
<!--          </el-col>-->
          <el-col :span="8">
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="form.notestr" type="textarea" placeholder="请输入备注"/>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="24">
            <el-form-item label="用户类型" prop="hohName">
              <el-checkbox-group v-model="memberTypeList">
                <el-checkbox  v-for="dict in dict.type.user_type" :label="dict.value" :key="dict.value">{{dict.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="现居住地址" prop="addr1">
              <el-input v-model="form.addr" type="textarea" placeholder="请输入现居住地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="户籍地址" prop="registerAddr">
              <el-input v-model="form.registerAddr" type="textarea" placeholder="请输入户籍地址"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" @close="handleFileSuccess">
      <el-form ref="uploadForm" :model="uploadForm" :rules="uploadFormRules" label-width="80px">
        <el-form-item label="社区/网格">
          <el-cascader
            v-if="treeOptions.length > 0"
            v-model="uploadForm.companyId"
            :options="treeOptions"
            :props="{...defaultPropsValue, 'checkStrictly': true}"
            @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx"
        :headers="upload.headers"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        :on-change="fileChange"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <!--<el-checkbox v-model="upload.updateSupport"/>-->
          <!--是否更新已经存在的用户数据-->
          <el-link type="primary" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板
          </el-link>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入小于1MB的“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="handleFileSuccess">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 一键转移用户归属 -->
    <el-dialog :title="companyTitle" :visible.sync="companyOpen" width="400px" append-to-body @close="companyCancel">
      <el-form ref="companyForm" :model="companyForm" :rules="companyRules" label-width="100px">
        <el-form-item label="社区/网格" prop="toCompanyId">
          <el-select v-model="companyForm.toCompanyName" placeholder="请选择村社区">
            <el-option :value="companyForm.toCompanyId" :label="companyForm.toCompanyName"
                       style="width: 260px;height:200px;overflow: auto;background-color:#fff">
              <el-tree
                v-if="treeOptions.length > 0"
                :data="treeOptions"
                :props="defaultPropsValue"
                @node-click="handleNodeClick2"
              ></el-tree>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="companySubmitForm">确 定</el-button>
        <el-button @click="companyCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  importMember,
  listMember1,
  getMember,
  delMember,
  addMember,
  updateMember,
  untieWx,
  importTemplate,
  getCompanyList,
  listMember2,
  delMember1,
  getMember1,
  updateMember1,
  updateMemberAvater, addMember1,
  updateCompany
} from '@/api/hs/member'
  import { getTree, getUserTree } from '@/api/hs/comparison'
  import { getToken } from '@/utils/auth'
  import axios from 'axios'
  import userInfoImageUpload from '@/components/userInfoImageUpload'
  import { getImageToken, updateUserCompany, updateUserCompany1 } from "@/api/hs/member"
  import { checkPermi } from "@/utils/permission";

  export default {
    name: 'Member',
    dicts: ['sys_user_sex', 'nation', 'hoh_relationship','document_type','user_type', 'user_profession', 'residence_type', 'user_census','leave_type'],
    components: {
      userInfoImageUpload
    },
    data() {
      return {
        memberTypeListQuery:[],
        memberTypeList:[],
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
        title: '',
        // 是否显示弹出层
        open: false,
        // 弹出层标题
        dialogImportTitle: '导入',
        // 是否显示弹出层
        dialogImportOpen: false,
        // 用户导入参数
        upload: {
          // 是否显示弹出层（用户导入）
          open: false,
          // 弹出层标题（用户导入）
          title: '',
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的用户数据
          updateSupport: 0,
          // 设置上传的请求头部
          headers: { Authorization: 'Bearer ' + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + '/hs/member/import'
        },
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          memberTypeSel: null,
          name: null,
          idNumber: null,
          sex: null,
          birthday: null,
          nation: null,
          phone: null,
          addr1: null,
          addr2: null,
          memberType: null,
          documentType: null,
          registerAddr: null,
          hohIdNumber: null,
          hohRelationship: null,
          ec1Name: null,
          ec1Phone: null,
          ec2Name: null,
          ec2Phone: null,
          hsCount: null,
          sortType: null,
          hsCode: null,
          companyIds: null,
          companyId: null,
          companyName: null,
          hsState: 0,
          addr: null,
          userProfession: null,
          leaveType: null
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
        // 导入表单参数
        formImport: {},
        // 表单校验
        rules: {
          name: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          idNumber: [
            { required: true, message: '证件号码不能为空', trigger: 'blur' }
          ],
          documentType: [
            { required: true, message: '证件类型不能为空', trigger: 'change' }
          ],
          companyId: [
            { required: true, message: '村社区不能为空', trigger: 'blur' }
          ]
        },
        companyList: [],
        options: [],
        uploadForm: {
          companyId: null,
          companyName: null
        },
        // 表单校验
        uploadFormRules: {
          companyId: [
            { required: true, message: '村社区不能为空', trigger: 'blur' }
          ]
        },
        file: null,

        treeOptions: [],
        isAdmin: false,
        companyTitle: '选择用户归属',
        companyOpen: false,
        companyForm: {
          toCompanyName: null,
          toCompanyId: null
        },
        // 表单校验
        companyRules: {
          toCompanyId: [
            { required: true, message: '村社区不能为空', trigger: 'blur' }
          ]
        },
        imageUploadData: null
      }
    },
    created() {
      this.getUserTree()
      this.getList()
      this.getQiniuToken()
    },
    methods: {
      checkPermi,
      untieWxUpdate(row){
        this.$modal.confirm('是否确认解除用户编号为"' +  row.id + '"的微信绑定数据项？').then(function() {
          return untieWx( row.id)
        }).then(() => {
          this.getList()
          this.$modal.msgSuccess('解绑成功')
        }).catch(() => {
        })
      },
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
      handleChange(val, b, c) {
        console.log(val)
        if (val.length == 1) {
          this.uploadForm.companyName = this.getIdOrName(val[0])
        } else if (val.length == 2) {
          this.uploadForm.companyName = this.getIdOrName(val[0]) + '/' + this.getIdOrName(val[1])
        }
      },

      getIdOrName(id) {
        console.log(id)
        let str = null
        this.treeOptions.forEach(val => {
          if (str) return false
          if (id == val.id) {
            str = val[this.defaultPropsValue.label]
          } else {
            if (val['children']) {
              val[this.defaultPropsValue.children].forEach(value => {
                if (str) return false
                if (id == value.id) {
                  str = value[this.defaultPropsValue.label]
                }
              })
            }
          }
        })
        return str
      },
      clearCompany(){
        this.queryParams.companyIds = null
      },
      //网格查询选择
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
      handleNodeClick(val){
        console.log(val)
        this.form.companyId = val.id
        var companyName =  this.getHierarchyData(this.treeOptions,[val.id],val.label)
        console.log(companyName)
        this.form.companyName = companyName.toString().replaceAll(',','/')
      },
      handleNodeClick2(val){
        console.log(val)
        this.companyForm.toCompanyId = val.id
        var companyName =  this.getHierarchyData(this.treeOptions,[val.id],val.label)
        this.companyForm.toCompanyName = companyName.toString().replaceAll(',','/')
      },

      /** 查询用户列表 */
      getList() {
        this.loading = true
        this.queryParams.sortType = 1
        if(this.memberTypeListQuery!=null&&this.memberTypeListQuery.length>0){
          this.queryParams.memberTypeSel =  this.memberTypeListQuery
        }else{
          this.queryParams.memberTypeSel = null
        }
        if( this.queryParams.companyIds && this.queryParams.companyIds.length==0){
          this.queryParams.companyIds = null
        }

        listMember2(this.queryParams).then(response => {
          this.memberList = response.rows
          this.total = response.total
          this.loading = false
        })
      },
      // 取消按钮
      cancel() {
        this.open = false
        this.reset()
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
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.memberTypeListQuery = []
        if (this.isAdmin) {
          this.queryParams.companyIds = null
          this.queryParams.companyName = null
        } else {
          this.queryParams.companyIds = null
        }
        this.handleQuery()
      },

      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length !== 1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.memberTypeList =[]
        this.reset()
        this.open = true
        this.title = '添加用户'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id
        getMember1({userId: id}).then(response => {
          this.form = response.data
          if(response.data.userType!=null && response.data.userType.length>0){
            this.memberTypeList = response.data.userType.split(",")
          }else{
            this.memberTypeList = []
          }
          this.open = true
          this.title = '修改用户'
        })
      },



      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if(this.memberTypeList!=null && this.memberTypeList.length>0){
              this.form.userType =  this.memberTypeList.toString()
            }else{
              this.form.userType =""
            }
            if (this.form.id != null) {
              updateMember1(this.form).then(response => {
                updateMemberAvater(this.form).then(res => {
                  this.$modal.msgSuccess('修改成功')
                  this.open = false
                  this.getList()
                })
              })
            }else{
              addMember1(this.form).then(response => {
                this.$modal.msgSuccess('新增成功')
                this.open = false
                this.getList()
              })
            }
          }
        })
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        this.$modal.confirm('是否确认删除用户编号为"' + ids + '"的数据项，删除用户，会同时删除（注册信息，申请信息，网格证信息，商户信息等其他关联信息），确认是否删除！？').then(function() {
          return delMember1(ids)
        }).then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        }).catch(() => {
        })
      },
      /** 导出按钮操作 */
      handleExport() {

        this.$confirm('是否导出全部数据?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.download('/up/v2/userinfo/list/export', {
            ...this.queryParams
          }, `用户列表_${new Date().getTime()}.xlsx`, true)

        }).catch(() => {

        })

      },
      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = '用户导入'
        this.upload.open = true
      },
      //一键转移用户归属
      handleCompany() {
        if(this.ids.length<=0){
           this.$modal.msgError('请选择要转移归属的用户')
          return false
        }
        this.companyOpen = true;
      },
      /** 下载模板操作 */
      importTemplate() {
        this.download('hs/member/importTemplate', {}, `用户导入模板.xlsx`)
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true
      },
      // 文件上传成功处理
      handleFileSuccess() {
        this.upload.isUploading = false
        this.$refs.upload.clearFiles()
        this.uploadForm.companyId = null
        this.uploadForm.companyName = null
        this.upload.open = false
        this.getList()
      },
      fileChange(file, fileList) {
        this.file = file
        //const isLt2M = file.size / 1024 / 1024 < 2;
        //console.log(file, fileList)
      },
      // 提交上传文件
      submitFileForm() {
        //this.$refs.upload.submit();
        console.log(this.file)
        console.log(this.uploadForm)
        if (!this.uploadForm.companyId) {
          this.$modal.msgError('请选择社区/网格')
          return false
        }
        if (!this.file.raw) {
          this.$modal.msgError('请选择上传文件')
          return false
        }

        const isLt2M = this.file.size / 1024 / 1024 < 1

        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 1MB!')
        }

        let that = this
        var formData = new FormData()
        formData.append('file', this.file.raw)
        formData.append('companyId', (this.uploadForm.companyId[this.uploadForm.companyId.length - 1]) * 1)
        formData.append('companyName', this.uploadForm.companyName)

        const loading = this.$loading({
          lock: true,
          text: '数据上传需要1-10分钟，请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        importMember(formData).then(response => {
          that.$modal.msgSuccess('导入成功')
          that.upload.open = false
          loading.close()
          that.handleFileSuccess()
        }).catch(err => {
          console.log(err)
          loading.close()
          // that.$modal.msgSuccess('导入失败')
        })

        // axios.post('http://admin.xzlglobal.com/prod-api/hs/member/import', formData, {//http://admin.xzlglobal.com/prod-api
        //   headers: {Authorization: "Bearer " + getToken()},
        // }).then(function (response) {
        //   that.$modal.msgSuccess("导入成功");
        //   that.handleFileSuccess();
        // }).catch(error => {
        //   console.log(error)
        //   that.$modal.msgSuccess("导入失败");
        // })
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
      companyChange(val) {
        let name = null
        this.companyList.forEach(value => {
          if (value.id == val) {
            this.form.companyName = value.companyName
          }
        })
      },



      companySubmitForm() {
        let id = this.ids;
        this.$modal.confirm('本次操作会转移（'+this.ids.length+'条）用户归属为【'+this.companyForm.toCompanyName+"】,请谨慎操作!").then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          updateCompany(id,{
            ...this.companyForm
          }).then(res => {
            loading.close();
            this.companyCancel();
            this.getList();
          })
        }).catch(() => {

        })
      },
      companyCancel() {
        this.companyForm = {
          toCompanyName: null,
          toCompanyId: null
        }
        this.companyOpen = false;
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
