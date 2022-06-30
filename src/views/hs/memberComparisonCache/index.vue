<template>
  <div class="app-container" v-loading="importLoading"
       element-loading-text="数据导入中，大约1-10分钟，请耐心等待"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="核酸码" prop="hscode">
        <el-input
          v-model="queryParams.hscode"
          placeholder="请输入核酸码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份证" prop="idnumber">
        <el-input
          v-model="queryParams.idnumber"
          placeholder="请输入身份证"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!--<el-form-item label="数据状态" prop="state">-->
      <!--<el-input-->
      <!--v-model="queryParams.state"-->
      <!--placeholder="请输入数据状态"-->
      <!--clearable-->
      <!--size="small"-->
      <!--@keyup.enter.native="handleQuery"-->
      <!--/>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <!--<el-col :span="1.5">-->
      <!--<el-button-->
      <!--type="primary"-->
      <!--plain-->
      <!--icon="el-icon-plus"-->
      <!--size="mini"-->
      <!--@click="handleAdd"-->
      <!--v-hasPermi="['hs:memberComparisonCache:add']"-->
      <!--&gt;新增</el-button>-->
      <!--</el-col>-->

      <!--<el-col :span="1.5" v-if="activeName==='second'">-->
      <!--<el-button-->
      <!--type="success"-->
      <!--plain-->
      <!--icon="el-icon-edit"-->
      <!--size="mini"-->
      <!--:disabled="single"-->
      <!--@click="handleUpdate"-->
      <!--v-hasPermi="['hs:memberComparisonCache:edit']"-->
      <!--&gt;修改-->
      <!--</el-button>-->
      <!--</el-col>-->

      <el-col :span="1.5" v-if="activeName==='first'">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleDeleteAll"
        >清空花名册
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
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5" v-if="activeName!=='first'">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['hs:memberComparisonCache:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5" v-if="activeName==='first'">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          v-hasPermi="['hs:memberComparisonCache:import']"
          @click="handleImport"
        >导入花名册
        </el-button>
      </el-col>
      <el-col :span="1.5" v-if="activeName==='third'">
        <el-tooltip class="item" effect="dark" content="将对比成功的数据保存到当前网格" placement="top">
          <el-button
            type="primary"
            plain
            size="mini"
            :disabled="multiple"
            @click="submitSaveOpen('')"
          >保存用户
          </el-button>
        </el-tooltip>

      </el-col>
      <el-col :span="1.5" v-if="activeName==='third'">
        <el-tooltip class="item" effect="dark" content="将对比成功的所有数据保存到当前网格" placement="top">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="submitSaveOpen('ALL')"
          >保存所有用户
          </el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="1.5" v-if="activeName==='second' || activeName==='fourth' ">
        <el-tooltip class="item" effect="dark" content="与原始数据对比同步数据信息" placement="top">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="comparison('')"
          >重新同步
          </el-button>
        </el-tooltip>
      </el-col>
      <el-col :span="1.5" v-if="activeName==='second' || activeName==='fourth' ">
        <el-tooltip class="item" effect="dark" content="与原始数据对比同步所有数据信息大约1-5分钟" placement="top">
          <el-button
            type="primary"
            plain
            size="mini"
            @click="comparison('ALL')"
          >重新同步所有数据
          </el-button>
        </el-tooltip>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane :label="'花名册数据'+ countData.hmcCount" name="first">

      </el-tab-pane>
      <el-tab-pane :label="'花名册异常数据'+ countData.hmcerrCount" name="second"></el-tab-pane>
      <el-tab-pane :label="'对比数据'+countData.normalCount" name="third"></el-tab-pane>
      <el-tab-pane :label="'对比异常数据'+countData.dataErrCount" name="fourth"></el-tab-pane>
      <el-tab-pane :label="'保存社区网格成功'+countData.succeedCount" name="five"></el-tab-pane>
    </el-tabs>

    <el-table v-loading="loading" :data="memberComparisonCacheList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="核酸码" align="center" prop="hscode"/>
      <el-table-column label="姓名" align="center" prop="name"/>
      <el-table-column label="身份证" align="center" prop="idnumber"/>
      <el-table-column label="电话" align="center" prop="phone"/>
      <el-table-column label="社区网格" align="center" prop="companyname" v-if="activeName==='third'"/>
      <el-table-column label="现居住地址" align="center" prop="addr1" show-overflow-tooltip/>
      <el-table-column label="监测点地址" align="center" prop="addr2" show-overflow-tooltip/>
      <el-table-column label="户籍地址" align="center" prop="registeraddr" show-overflow-tooltip/>
      <el-table-column label="创建时间" align="center" prop="createtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="activeName!=='five'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['hs:memberComparisonCache:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hs:memberComparisonCache:remove']"
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

    <!-- 添加或修改数据同步对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="核酸码" prop="hscode">
          <el-input v-model="form.hscode" placeholder="请输入核酸码" readonly="true"/>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名"/>
        </el-form-item>
        <el-form-item label="身份证" prop="idnumber">
          <el-input v-model="form.idnumber" placeholder="请输入身份证"/>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话"/>
        </el-form-item>
        <el-form-item label="现居住地址" prop="addr1">
          <el-input type="textarea" v-model="form.addr1" placeholder="请输入现居住地址"/>
        </el-form-item>
        <el-form-item label="监测点地址" prop="addr2">
          <el-input type="textarea" v-model="form.addr2" placeholder="请输入监测点地址"/>
        </el-form-item>
        <el-form-item label="户籍地址" prop="registeraddr">
          <el-input type="textarea" v-model="form.registeraddr" placeholder="请输入户籍地址"/>
        </el-form-item>
        <!--<el-form-item label="唯一标识" prop="uniquekey">-->
        <!--<el-input v-model="form.uniquekey" placeholder="请输入唯一标识" />-->
        <!--</el-form-item>-->
        <!--<el-form-item label="管理员id" prop="userid">-->
        <!--<el-input v-model="form.userid" placeholder="请输入管理员id" />-->
        <!--</el-form-item>-->
        <!--<el-form-item label="数据状态" prop="state">-->
        <!--<el-input v-model="form.state" placeholder="请输入数据状态" />-->
        <!--</el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 添加或修改数据同步对话框 -->
    <el-dialog :title="titleUser" :visible.sync="openUser" width="500px" append-to-body>
      <el-form ref="uploadForm" :model="uploadForm" :rules="uploadFormRules" label-width="100px">
        <el-form-item label="社区/网格" prop="companyId">
          <el-cascader
            v-if="options.length > 0"
            v-model="uploadForm.companyId"
            :options="options"
            :props="{...defaultPropsValue, 'checkStrictly': true}"
            @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSave">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 数据导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <!--<el-upload-->
      <!--ref="upload"-->
      <!--:limit=1-->
      <!--accept=".xlsx, .xls"-->
      <!--:headers="upload.headers"-->
      <!--:action="upload.url + '?updateSupport=' + upload.updateSupport"-->
      <!--:disabled="upload.isUploading"-->
      <!--:on-progress="handleFileUploadProgress"-->
      <!--:on-success="handleFileSuccess"-->
      <!--:auto-upload="false"-->
      <!--drag-->
      <!--&gt;-->
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx"
        :headers="upload.headers"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        :on-remove="upRemve"
        :on-change="fileChange"
        :file-list="fileList"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <!--<div class="el-upload__tip" slot="tip">-->
          <!--<el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的数据-->
          <!--</div>-->
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                   @click="importTemplate">下载模板
          </el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    importData,
    listHsMemberImportCache,
    getHsMemberImportCache,
    delHsMemberImportCache,
    addHsMemberImportCache,
    updateHsMemberImportCache,
    delHsMemberImportCacheByUserid,
    commit,
    commitAll,
    comparison,
    comparisonsome,
    cnt
  } from '@/api/hs/hsMemberImportCache'
  import { getTree, getUserTree } from '@/api/hs/comparison'
  import {
    listMemberComparisonCache,
    getMemberComparisonCache,
    delMemberComparisonCache,
    addMemberComparisonCache,
    updateMemberComparisonCache
  } from '@/api/hs/memberComparisonCache'
  import { getToken } from '@/utils/auth'
  import axios from 'axios'

  export default {
    name: 'MemberComparisonCache',
    data() {
      return {
        importLoading: false,
        saveType: 'ALL',
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
        // 数据同步表格数据
        memberComparisonCacheList: [],
        countData: {
          hmcCount: '(0)',
          hmcerrCount: '(0)',
          normalCount: '(0)',
          dataErrCount: '(0)',
          succeedCount: '(0)'
        },
        activeName: 'first',
        // 弹出层标题
        title: '',
        titleUser: '',
        // 是否显示弹出层
        open: false,
        openUser: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          hscode: null,
          name: null,
          idnumber: null,
          phone: null,
          state: null,
          orderByColumn: 'createtime',
          isAsc: 'desc'
        },
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
          url: process.env.VUE_APP_BASE_API + '/hs/cache/import'
        },
        fileList: [],
        uploadForm: {
          list: [],
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
        // 表单参数
        form: {},
        // 表单校验
        rules: {},

        treeOptions: [],
        options: [],
        isAdmin: false
      }
    },
    created() {
      this.getList()
      this.getUserTree()
    },
    methods: {
      getUserTree() {
        getUserTree().then(res => {
          if (res == '') {
            this.queryParams.companyIds = null
            this.defaultPropsValue = {
              value: 'id',
              label: 'label',
              children: 'children'
            }
            this.getTree()
            this.isAdmin = true
          } else {
            this.defaultPropsValue = {
              value: 'id',
              label: 'companyName',
              children: 'subList'
            }
            this.options.push(res)
            console.log(res)
            this.treeOptions.push(res)
          }
        })
      },
      getTree() {
        getTree().then(res => {
          this.options = res.data[0].children
          this.treeOptions = res.data[0].children
          this.getList()
        })
      },
      handleClick(tab, event) {
        this.queryParams.pageNum = 1
        if (this.activeName === 'first') {
          this.queryParams.state = 1
        } else if (this.activeName === 'second') {
          this.queryParams.state = 1
        } else if (this.activeName === 'third') {
          this.queryParams.state = 0
        } else if (this.activeName === 'fourth') {
          this.queryParams.state = 2
        }else if(this.activeName === 'five'){
          this.queryParams.state = 3
        }
        this.getList()
      },
      /** 查询数据同步列表 */
      getList() {
        this.loading = true
        if (this.activeName === 'first') {
          listHsMemberImportCache(this.queryParams).then(response => {
            this.memberComparisonCacheList = response.rows
            this.total = response.total
            this.countData.hmcCount = '(' + response.total + ')'
            this.loading = false
          })
        } else {
          listMemberComparisonCache(this.queryParams).then(response => {
            this.memberComparisonCacheList = response.rows
            this.total = response.total
            this.loading = false
          })
        }

        this.getCount()

      },
      getCount() {
        cnt().then(response => {
          var data = response.data
          if (data && data.length >= 3) {
            data.forEach(item => {
              if (item.state === 1) {
                this.countData.hmcerrCount = '(' + item.cnt + ')'
              } else if (item.state === 2) {
                this.countData.dataErrCount = '(' + item.cnt + ')'
              } else if (item.state === 0) {
                this.countData.normalCount = '(' + item.cnt + ')'
              } else if (item.state === 3) {
                this.countData.succeedCount = '(' + item.cnt + ')'
              }
            })
          }
        })

      },
      // 取消按钮
      cancel() {
        this.openUser = false
        this.open = false
        this.reset()
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          hscode: null,
          name: null,
          idnumber: null,
          phone: null,
          addr1: null,
          addr2: null,
          uniquekey: null,
          userid: null,
          registeraddr: null,
          createtime: null,
          updatetime: null,
          state: null
        }
        this.resetForm('form')

        this.uploadForm = {
          companyId: null,
          companyName: null
        }
        this.resetForm('uploadForm')
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1
        this.getList()
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm('queryForm')
        this.handleQuery()
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
        console.log( this.options)

        this.options.forEach(val => {
          if (str) return false
          if (id == val.id) {
            str = val[this.defaultPropsValue.label]
          } else {
            console.log(val[this.defaultPropsValue.children])
            if(val[this.defaultPropsValue.children]){
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
      /** 重新同步 */
      comparison(type) {
        console.log(type)
        var state = 0
        if (this.activeName === 'second') {
          state = 1
        } else if (this.activeName === 'fourth') {
          state = 2
        }
        if (type === 'ALL') {
          const loading = this.$loading({
            lock: true,
            text: '数据同步需要1-5分钟，请耐心等待',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          comparison({ state: state }).then(response => {
            loading.close()
            this.getList()
            this.$modal.msgSuccess('操作成功！')
          }).catch(err => {
            loading.close()
          })
        } else if (this.memberComparisonCacheList && this.memberComparisonCacheList.length > 0) {
          const ids = this.ids
          var list = []
          this.memberComparisonCacheList.forEach(item => {
            ids.forEach(id => {
              if (item.id === id) {
                list.push(item)
              }
            })
          })
          const loading = this.$loading({
            lock: true,
            text: '数据同步需要1-5分钟，请耐心等待',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          comparisonsome(list).then(response => {
            loading.close()
            this.getList()
            this.$modal.msgSuccess('操作成功！')
          }).catch(err => {
            loading.close()
          })

        } else {
          this.$message({
            message: '当前列表暂无需要同步的数据',
            type: 'warning'
          })
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
        this.open = true
        this.title = '添加数据同步'
      },

      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getMemberComparisonCache(id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改数据同步'
        })
      },
      /** 保存信息 */
      submitSaveOpen(type) {
        this.saveType = type
        this.titleUser = '保存社区网格用户'
        this.uploadForm.companyId = null
        this.uploadForm.companyName = null
        this.resetForm('uploadForm')
        this.openUser = true
      },
      submitSave() {
        const ids = this.ids
        var list = []
        this.memberComparisonCacheList.forEach(item => {
          ids.forEach(id => {
            if (item.id === id) {
              list.push(item)
            }
          })
        })
        this.uploadForm.list = list
        var data = {
          companyId: (this.uploadForm.companyId[this.uploadForm.companyId.length - 1]) * 1,
          list: list,
          companyName: this.uploadForm.companyName
        }

        this.$refs['uploadForm'].validate(valid => {
          if (valid) {
            const loading = this.$loading({
              lock: true,
              text: '数据上传需要1-5分钟，请耐心等待',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.7)'
            })
            if (this.saveType === 'ALL') {
              commitAll(data).then(response => {
                loading.close()
                this.openUser = false
                this.getList()
                this.$modal.msgSuccess('操作成功！')
              }).catch(err => {
                loading.close()
              })
            } else {
              commit(data).then(response => {
                loading.close()
                this.openUser = false
                this.getList()
                this.$modal.msgSuccess('操作成功！')
              }).catch(err => {
                loading.close()
              })
            }

          }
        })

      },

      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = '花名册导入'
        this.upload.open = true
        this.fileList = []
        this.file = null

      },
      /** 下载模板操作 */
      importTemplate() {
        this.download('/hs/memberComparisonCache/importTemplate', {}, `原始数据上传模板${new Date().getTime()}.xlsx`)
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true
      },
      fileChange(file, fileList) {
        this.file = file
        //const isLt2M = file.size / 1024 / 1024 < 2;
        //console.log(file, fileList)
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.importLoading = false
        this.upload.open = false
        this.upload.isUploading = false
        this.$refs.upload.clearFiles()
        this.$alert('<div style=\'overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;\'>' + response.msg + '</div>', '导入结果(数据分析需要1-5分钟)', { dangerouslyUseHTMLString: true })
        this.getList()
      },
      // 移除列表
      upRemve(file) {
       this.file = null
        this.fileList = []
      },
      // 提交上传文件
      submitFileForm() {
        var that = this
        console.log(this.file)
        if (!this.file) {
          this.$modal.msgError('请选择上传文件')
          return false
        }
        const loading = this.$loading({
          lock: true,
          text: '数据上传需要1-10分钟，请耐心等待',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        var that = this
        var formData = new FormData()
        formData.append('file', this.file.raw)

        importData(formData).then(response => {
          that.$modal.msgSuccess('导入成功')
          loading.close()
          that.upload.open = false;
          that.getList()
        }).catch(err => {
          console.log(err)
          loading.close()
        })

        // this.$refs.upload.submit()
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateMemberComparisonCache(this.form).then(response => {
                this.$modal.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              addMemberComparisonCache(this.form).then(response => {
                this.$modal.msgSuccess('新增成功')
                this.open = false
                this.getList()
              })
            }
          }
        })
      },
      /** 清空数据 */
      handleDeleteAll() {
        if (this.memberComparisonCacheList && this.memberComparisonCacheList.length > 0) {

          this.$modal.confirm('是否确认清空花名册数据项？').then(function() {
            return delHsMemberImportCacheByUserid()
          }).then(() => {
            this.getList()
            this.$modal.msgSuccess('删除成功')
          }).catch(() => {
          })
        } else {
          this.$message({
            message: '当前列表暂无需要清空的数据',
            type: 'warning'
          })
        }
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids
        var that= this
        this.$modal.confirm('是否确认删除数据同步编号为"' + ids + '"的数据项？').then(function() {
          if (that.activeName === 'first') {
            return delHsMemberImportCache(ids)
          } else {
            return delMemberComparisonCache(ids)
          }

        }).then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        }).catch(() => {
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('hs/memberComparisonCache/export', {
          ...this.queryParams
        }, `花名册数据同步${new Date().getTime()}.xlsx`)
      }
    }
  }
</script>
