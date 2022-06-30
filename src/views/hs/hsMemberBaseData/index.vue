<template>
  <div class="app-container">
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
      <el-form-item label="居住地址" prop="addr1">
        <el-input
          v-model="queryParams.addr1"
          placeholder="请输入居住地址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="现住址" prop="addr2">
        <el-input
          v-model="queryParams.addr2"
          placeholder="请输入现住址"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="采样时间" prop="testtime">
        <el-date-picker clearable size="small"
                        v-model="queryParams.testtime"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择采样时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="daterangeCreatetime"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
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

    <el-row :gutter="10" class="mb8">
      <!--<el-col :span="1.5">-->
      <!--<el-button-->
      <!--type="primary"-->
      <!--plain-->
      <!--icon="el-icon-plus"-->
      <!--size="mini"-->
      <!--@click="handleAdd"-->
      <!--v-hasPermi="['hs:hsMemberBaseData:add']"-->
      <!--&gt;新增</el-button>-->
      <!--</el-col>-->
      <!--<el-col :span="1.5">-->
      <!--<el-button-->
      <!--type="success"-->
      <!--plain-->
      <!--icon="el-icon-edit"-->
      <!--size="mini"-->
      <!--:disabled="single"-->
      <!--@click="handleUpdate"-->
      <!--v-hasPermi="['hs:hsMemberBaseData:edit']"-->
      <!--&gt;修改</el-button>-->
      <!--</el-col>-->
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['hs:hsMemberBaseData:remove']"
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
          v-hasPermi="['hs:hsMemberBaseData:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          v-hasPermi="['hs:hsMemberBaseData:import']"
          @click="handleImport"
        >导入
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="hsMemberBaseDataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="编号" align="center" prop="id"/>
      <el-table-column label="核酸码" align="center" prop="hscode"/>
      <el-table-column label="姓名" align="center" prop="name"/>
      <el-table-column label="身份证" align="center" prop="idnumber"/>
      <el-table-column label="电话" align="center" prop="phone"/>
      <el-table-column label="居住地址" align="center" prop="addr1" show-overflow-tooltip/>
      <el-table-column label="监测地址" align="center" prop="addr2" show-overflow-tooltip/>
      <el-table-column label="采样时间" align="center" prop="testtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.testtime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createtime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createtime )}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
        <!--<template slot-scope="scope">-->
          <!--&lt;!&ndash;<el-button&ndash;&gt;-->
          <!--&lt;!&ndash;size="mini"&ndash;&gt;-->
          <!--&lt;!&ndash;type="text"&ndash;&gt;-->
          <!--&lt;!&ndash;icon="el-icon-edit"&ndash;&gt;-->
          <!--&lt;!&ndash;@click="handleUpdate(scope.row)"&ndash;&gt;-->
          <!--&lt;!&ndash;v-hasPermi="['hs:hsMemberBaseData:edit']"&ndash;&gt;-->
          <!--&lt;!&ndash;&gt;修改</el-button>&ndash;&gt;-->
          <!--<el-button-->
            <!--size="mini"-->
            <!--type="text"-->
            <!--icon="el-icon-delete"-->
            <!--@click="handleDelete(scope.row)"-->
            <!--v-hasPermi="['hs:hsMemberBaseData:remove']"-->
          <!--&gt;删除-->
          <!--</el-button>-->
        <!--</template>-->
      <!--</el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改原始数据对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="核酸码" prop="hscode">
          <el-input v-model="form.hscode" placeholder="请输入核酸码"/>
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
        <el-form-item label="居住地址" prop="addr1">
          <el-input v-model="form.addr1" placeholder="请输入居住地址"/>
        </el-form-item>
        <el-form-item label="现住址" prop="addr2">
          <el-input v-model="form.addr2" placeholder="请输入现住址"/>
        </el-form-item>
        <el-form-item label="采样时间" prop="testtime">
          <el-date-picker clearable size="small"
                          v-model="form.testtime"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择采样时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
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
    listHsMemberBaseData,
    getHsMemberBaseData,
    delHsMemberBaseData,
    addHsMemberBaseData,
    updateHsMemberBaseData,
    importData
  } from '@/api/hs/hsMemberBaseData'
  import { getToken } from '@/utils/auth'
  import store from '@/store'
  export default {
    name: 'HsMemberBaseData',
    data() {
      return {

        // 遮罩层
        loading: false,
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
        // 原始数据表格数据
        hsMemberBaseDataList: [],
        // 弹出层标题
        title: '',
        // 是否显示弹出层
        open: false,
        // 采样时间时间范围
        daterangeCreatetime: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          hscode: null,
          name: null,
          idnumber: null,
          phone: null,
          addr1: null,
          addr2: null,
          testtime: null,
          createtime: null,
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
          url: process.env.VUE_APP_BASE_API + '/hs/hsMemberBaseData/import'
        },
        fileList: [],
        // 表单参数
        form: {},
        file: null,
        // 表单校验
        rules: {
          hscode: [
            { required: true, message: '核酸码不能为空', trigger: 'blur' }
          ],
          createtime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          updatetime: [
            { required: true, message: '修改时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {

      const roles = store.getters && store.getters.roles
      if(roles.indexOf("admin") > -1){
        this.getList()
      }
      console.log(roles)
    },
    methods: {
      /** 查询原始数据列表 */
      getList() {

        const roles = store.getters && store.getters.roles
        if(roles.indexOf("admin") == -1){
          if((this.queryParams.hscode==null || this.queryParams.hscode=='') &&(this.queryParams.name==null ||this.queryParams.name=='')
            &&(this.queryParams.idnumber==null ||this.queryParams.idnumber=='' )&&(this.queryParams.phone==null||this.queryParams.phone=='')
            &&(this.queryParams.addr1==null ||this.queryParams.addr1=='' )&&(this.queryParams.addr2==null||this.queryParams.addr2=='')
          ){
            this.$modal.msgWarning('请至少输入一个条件，进行搜索')
            return false
          }

        }
        this.loading = true
        this.queryParams.params = {}
        if (null != this.daterangeCreatetime && '' != this.daterangeCreatetime) {
          this.queryParams.params['beginCreatetime'] = this.daterangeCreatetime[0]
          this.queryParams.params['endCreatetime'] = this.daterangeCreatetime[1]
        }
        listHsMemberBaseData(this.queryParams).then(response => {
          this.hsMemberBaseDataList = response.rows
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
          hscode: null,
          name: null,
          idnumber: null,
          phone: null,
          addr1: null,
          addr2: null,
          testtime: null,
          createtime: null,
          updatetime: null
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
        this.daterangeCreatetime = []
        this.resetForm('queryForm')
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
        this.reset()
        this.open = true
        this.title = '添加原始数据'
      },
      // 移除列表
      upRemve(file) {
        this.file = null
        this.fileList = []
      },
      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = '原始数据导入'
        this.fileList = []
        this.file = null
        this.upload.open = true
      },
      /** 下载模板操作 */
      importTemplate() {
        this.download('/hs/hsMemberBaseData/importTemplate', {}, `原始数据上传模板${new Date().getTime()}.xlsx`)
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        this.$modal.msgSuccess('数据导入中，大约1-10分钟，请稍后')
        this.upload.open = false
        this.upload.isUploading = false
        this.$refs.upload.clearFiles()
        this.$alert('<div style=\'overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;\'>' + response.msg + '</div>', '导入结果', { dangerouslyUseHTMLString: true })
        this.getList()
      },
      fileChange(file, fileList) {
        this.file = file
        //const isLt2M = file.size / 1024 / 1024 < 2;
        //console.log(file, fileList)
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
          that.upload.open = false
          that.getList()
        }).catch(err => {
          console.log(err)
          loading.close()
          // that.$modal.msgSuccess('导入失败')
        })
        // this.$refs.upload.submit();
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id || this.ids
        getHsMemberBaseData(id).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改原始数据'
        })
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateHsMemberBaseData(this.form).then(response => {
                this.$modal.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            } else {
              addHsMemberBaseData(this.form).then(response => {
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
        this.$modal.confirm('是否确认删除原始数据编号为"' + ids + '"的数据项？').then(function() {
          return delHsMemberBaseData(ids)
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
          this.download('hs/hsMemberBaseData/export', {
            ...this.queryParams
          }, `原始数据表${new Date().getTime()}.xlsx`)

        }).catch(() => {

        })

      }
    }
  }
</script>
