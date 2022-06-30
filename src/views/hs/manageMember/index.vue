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
      <!--  <el-form-item label="性别" prop="sex">
         <el-select v-model="queryParams.sex" placeholder="请选择性别" clearable size="small">
           <el-option
             v-for="dict in dict.type.sys_user_sex"
             :key="dict.value"
             :label="dict.label"
             :value="dict.value"
           />
         </el-select>
       </el-form-item> -->
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
      <el-form-item label="联系电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入联系电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="核酸码" prop="hsCode">
        <el-input
          v-model="queryParams.hsCode"
          placeholder="请输入核酸码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="核酸状态" prop="hsState">
        <el-select v-model="queryParams.hsState" placeholder="请选择核酸状态" clearable  size="small" >
          <el-option
            v-for="state in this.hsState3"
            :key="state.value"
            :label="state.label"
            :value="state.value"
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
      <el-form-item label="用户类型" size="small">
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
<!--        <el-checkbox-group v-model="memberTypeListQuery">-->
<!--          <el-checkbox  v-for="dict in dict.type.user_type" :label="dict.value" :key="dict.value">{{dict.label}}</el-checkbox>-->
<!--        </el-checkbox-group>-->
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
          v-hasPermi="['hs:screening:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['hs:screening:import']"
        >导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hs:screening:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hs:screening:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">

        <el-tooltip class="item" effect="dark" content="当前操作是根据搜索条件查询出来的数据，统一批量操作，请谨慎操作看清提示！！！" placement="top-start"
                    v-hasPermi="['hs:screening:company']" >
          <el-button
            type="primary"
            plain
            icon="el-icon-sort"
            size="mini"
            @click="handleCompany"
            v-hasPermi="['hs:screening:company']"
          >一键转移用户归属
          </el-button>
        </el-tooltip>
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
      <el-table-column label="核酸码" align="center" prop="hsCode"/>
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
      <el-table-column label="身份证号" align="center" prop="idNumber">
        <template slot-scope="scope">
          <span>{{ getIdNumber(scope.row.idNumber) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center" prop="phone"/>
      <el-table-column label="社区/网格" align="center" prop="companyName"/>
      <el-table-column label="核酸状态" align="center">
        <template slot-scope="scope">
          <span>{{ gethsState(scope.row.hsState) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="现居住地址" align="center" prop="addr1" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ getStr(scope.row.addr1)  }}</span>
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
            v-hasPermi="['hs:screening:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hs:screening:remove']"
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

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="头像">
              <userInfoImageUpload v-if="imageUploadData" v-model="form.headUrl" :limit='1':isShowTip="false" :imageUploadData = 'imageUploadData'/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证正面">
              <userInfoImageUpload v-if="imageUploadData" v-model="form.frontImg" :limit='1':isShowTip="false" :imageUploadData = 'imageUploadData'/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证反面">
              <userInfoImageUpload v-if="imageUploadData" v-model="form.reverseImg" :limit='1':isShowTip="false" :imageUploadData = 'imageUploadData'/>
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
                    @node-click="handleNodeClick1"
                  ></el-tree>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="证件类型" >
              <el-select v-model="form.documentType" placeholder="请选择性别">
                <el-option
                  v-for="dict in dict.type.document_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="核酸码" prop="hsCode">
              <el-input v-model="form.hsCode" placeholder="请输入核酸码"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="核酸状态" prop="hsState">
              <el-select v-model="form.hsState" placeholder="请选择核酸状态" clearable >
                <el-option
                  v-for="state in this.hsState3"
                  :key="state.value"
                  :label="state.label"
                  :value="state.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="用户类型" prop="hohName">
              <el-checkbox-group v-model="memberTypeList">
                <el-checkbox  v-for="dict in dict.type.user_type" :label="dict.value" :key="dict.value">{{dict.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="身份证号" prop="idNumber">
              <el-input v-model="form.idNumber" placeholder="请输入身份证号"/>
            </el-form-item>
          </el-col>
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
        </el-row>
        <el-row>
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
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="民族" prop="nation">
              <el-select v-model="form.nation" placeholder="请选择民族">
                <el-option
                  v-for="dict in dict.type.nation"
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
            <el-form-item label="疫苗接种" prop="vaccineCnt">
              <el-input v-model="form.vaccineCnt" placeholder="请输入接种疫苗次数">
                <template slot="append">次</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="户主姓名" prop="hohName">
              <el-input v-model="form.hohName" placeholder="请输入户主姓名"/>
            </el-form-item>
          </el-col>

        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="户主身份证" prop="hohIdNumber">
              <el-input v-model="form.hohIdNumber" placeholder="请输入户主身份证号"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="紧急联系人1" prop="ec1Name">
              <el-input v-model="form.ec1Name" placeholder="请输入紧急联系人1"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="ec1Phone">
              <el-input v-model="form.ec1Phone" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="与户主关系" prop="hohRelationship">
              <el-select v-model="form.hohRelationship" placeholder="请选择与户主关系">
                <el-option
                  v-for="dict in dict.type.hoh_relationship"
                  :key="dict.value"
                  :label="dict.label"
                  :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="紧急联系人2" prop="ec2Name">
              <el-input v-model="form.ec2Name" placeholder="请输入紧急联系人2"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="ec2Phone">
              <el-input v-model="form.ec2Phone" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="12">
            <el-form-item label="监测点地址" prop="addr2">
              <el-input v-model="form.addr2" type="textarea" placeholder="请输入监测点地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现居住地址" prop="addr1">
              <el-input v-model="form.addr1" type="textarea" placeholder="请输入现居住地址"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="户籍地址" prop="registerAddr">
              <el-input v-model="form.registerAddr" type="textarea" placeholder="请输入户籍地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="description">
              <el-input v-model="form.description" type="textarea" placeholder="请输入内容" />
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
          <el-select v-model="uploadForm.companyName" placeholder="请选择村社区">
            <el-option :value="uploadForm.companyId" :label="uploadForm.companyName"
                       style="width: 260px;height:200px;overflow: auto;background-color:#fff">
              <el-tree
                v-if="treeOptions.length > 0"
                :data="treeOptions"
                :props="defaultPropsValue"
                @node-click="handleNodeClick3"
              ></el-tree>
            </el-option>
          </el-select>
          <!-- <el-cascader
            v-if="options.length > 0"
            v-model="uploadForm.companyId"
            :options="options"
            :props="{...defaultPropsValue, 'checkStrictly': true}"
            @change="handleChange"></el-cascader> -->
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
    <el-dialog :title="companyTitle" :visible.sync="companyOpen" width="600px" append-to-body @close="companyCancel">
      <el-form ref="companyForm" :model="companyForm" :rules="companyRules" label-width="110px">
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
        <el-form-item label="操作说明">
         <div style="color: red"> 批量转归属，是根据上面条件搜索出的数据来进行全部转移.该操作需格外谨慎，看清查询列表的条数。不是勾选一个就转一个。</div>
        </el-form-item>
        <el-form-item label="是否了解">
          <el-radio-group v-model="radio">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="!radio" @click="companySubmitForm">确 定</el-button>
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
    getCompanyList
  } from '@/api/hs/manageMember'
  import { getTree, getUserTree } from '@/api/hs/comparison'
  import { getToken } from '@/utils/auth'
  import axios from 'axios'
  import userInfoImageUpload from '@/components/userInfoImageUpload'
  import { getImageToken, updateUserCompany } from "@/api/hs/manageMember"

  export default {
    name: 'Member',
    dicts: ['sys_user_sex', 'nation', 'hoh_relationship','document_type','user_type'],
    components: {
      userInfoImageUpload
    },
    data() {
      return {
        radio:false,
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
          hsState: 0
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
      //this.getCompanyList();
      this.getUserTree()
      this.getQiniuToken()
      //this.getTree();
      this.getList();
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

      /** 查询用户列表 */
      getList() {
        this.loading = true
        this.queryParams.sortType = 1
        if(this.memberTypeListQuery!=null&&this.memberTypeListQuery.length>0){
          this.queryParams.memberTypeSel =  this.memberTypeListQuery
        }else{
          this.queryParams.memberTypeSel = null
        }

        listMember1(this.queryParams).then(response => {
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
        const id = row.id || this.ids
        getMember(id).then(response => {
          this.form = response.data
          if(response.data.memberType!=null && response.data.memberType.length>0){
            this.memberTypeList = response.data.memberType.split(",")
          }else{
            this.memberTypeList = []
          }
          this.open = true
          this.title = '修改用户'
        })
      },

      untieWxUpdate(row){
        this.$modal.confirm('是否确认解除用户编号为"' +  row.id + '"的微信绑定数据项？').then(function() {
          return untieWx( row.id)
        }).then(() => {
          this.getList()
          this.$modal.msgSuccess('解绑成功')
        }).catch(() => {
        })
      },

      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if(this.memberTypeList!=null && this.memberTypeList.length>0){
              this.form.memberType =  this.memberTypeList.toString()
            }else{
              this.form.memberType =""
            }
            if (!this.form.hsCode && !this.form.idNumber) {
              this.$modal.msgError('身份证号、核酸码请选择一项输入！')
              return false
            }
            if (!this.form.hsCode && this.form.idNumber) {
              this.form.hsCode = this.form.idNumber
            }
            if (this.form.id != null) {
              updateMember(this.form).then(response => {
                this.$modal.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              addMember(this.form).then(response => {
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
        this.$modal.confirm('是否确认删除用户编号为"' + ids + '"的数据项？').then(function() {
          return delMember(ids)
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
          this.download('hs/member/v2/list/export', {
            ...this.queryParams
          }, `用户记录_${new Date().getTime()}.xlsx`, true)

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
        this.file = null
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
        console.log(this.r)
        console.log(this.uploadForm)
        if (!this.uploadForm.companyId) {
          this.$modal.msgError('请选择社区/网格')
          return false
        }
        if (!this.file||!this.file.raw) {
          this.$modal.msgError('请选择上传文件')
          return false
        }

        const isLt2M = this.file.size / 1024 / 1024 < 1

        // if (!isLt2M) {
        //   this.$message.error('上传文件大小不能超过 1MB!')
        // }

        let that = this
        var formData = new FormData()
        formData.append('file', this.file.raw)
        formData.append('companyId', this.uploadForm.companyId)
        formData.append('companyName', this.uploadForm.companyName)

        const loading = this.$loading({
          lock: true,
          text: '数据上传需要1-10分钟，请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        importMember(formData).then(response => {
          that.$modal.msgSuccess('导入成功')
          //that.upload.open = false
          loading.close()
          that.handleFileSuccess()
        }).catch(err => {
          console.log(err)
          loading.close()
          // that.$modal.msgSuccess('导入失败')
        })

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

      handleNodeClick1(val) {
        console.log(val)
        this.form.companyId = val.id
        var companyName =  this.getHierarchyData(this.treeOptions,[val.id],val.label)
        console.log(companyName)
        this.form.companyName = companyName.toString().replaceAll(',','/')

      },
      handleNodeClick2(val) {
        this.companyForm.toCompanyId = val.id
        var companyName =  this.getHierarchyData(this.treeOptions,[val.id],val.label)
        this.companyForm.toCompanyName = companyName.toString().replaceAll(',','/')

      },
      handleNodeClick3(val) {
        this.uploadForm.companyId = val.id
        var companyName =  this.getHierarchyData(this.treeOptions,[val.id],val.label)
        this.uploadForm.companyName = companyName.toString().replaceAll(',','/')

      },
      companySubmitForm() {
        if (!this.companyForm.toCompanyId) {
          this.$modal.msgError('请选择社区/网格')
          return false
        }
        let listTotal = null;
        listMember1(this.queryParams).then(response => {
          listTotal = response.total;
          this.$modal.confirm('本次操作会转移（'+listTotal+'条）用户归属为【'+this.companyForm.toCompanyName+"】,请谨慎操作!").then(() => {
            const loading = this.$loading({
              lock: true,
              text: 'Loading',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            });
            updateUserCompany({
              ...this.queryParams,
              ...this.companyForm
            }).then(res => {
                loading.close();
              this.companyCancel();
              this.getList();
            })
          }).catch(() => {

          })
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
