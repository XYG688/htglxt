<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="通知类型" prop="hsState">
        <el-select v-model="queryParams.noticeType" placeholder="请选择通知类型" clearable  size="small" >
          <el-option
            v-for="state in dict.type.inform_type"
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['hs:member:add']"
        >新增
        </el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="memberList">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" align="center" type="index">
        <template scope="scope">
          <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" prop="title"/>
      <el-table-column label="社区网格" align="center" prop="sqwg"/>
      <el-table-column label="文章封面" align="center" prop="wzfm"/>
      <el-table-column label="是否置顶" align="center" prop="zd"/>
      <el-table-column label="通知类型" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.inform_type" :value="scope.row.noticeType"/>
        </template>
      </el-table-column>
      <!-- <el-table-column label="联系电话" align="center" prop="ec1Phone" /> -->
      <el-table-column label="发布时间" align="center" prop="birthday" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
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
          <!-- <el-button
            size="mini"
            type="text"
            v-hasPermi="['hs:member:unbundle']"
            @click="untieWxUpdate(scope.row)"
          >微信解绑
          </el-button> -->
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['hs:member:remove']"
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
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="form.title"
            placeholder="请输入标题"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="通知类型" prop="noticeType">
          <el-select v-model="form.noticeType" placeholder="请选择通知类型" clearable  size="small" style="width: 100%">
            <el-option
              v-for="state in dict.type.inform_type"
              :key="state.value"
              :label="state.label"
              :value="state.value*1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <quill-editor v-if="open" ref="editor" v-model="form.content" class="editor"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { listInform, getInform, addInform, updateInform, delInform } from '@/api/hs/inform'
  import { getTree, getUserTree } from '@/api/hs/comparison'
  import Tinymce from '@/components/Tinymce'

  export default {
    name: 'Member',
    dicts: ['inform_type'],
    components: {
      Tinymce
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
        showSearch: false,
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
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          noticeType: null,
          title: null
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
          title: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ],
          noticeType: [
            { required: true, message: '请选择通知类型', trigger: 'change' }
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
      this.getList();
    },
    methods: {
      getList() {
        this.loading = true
        listInform(this.queryParams).then(response => {
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
          noticeType: null,
          title: null,
          content: ''
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
        this.handleQuery()
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.memberTypeList =[]
        this.reset()
        this.open = true
        this.title = '添加通知'
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset()
        const id = row.id
        getInform({id: id}).then(response => {
          this.form = response.data
          this.open = true
          this.title = '修改通知'
        })
      },

      /** 提交按钮 */
      submitForm() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            if (this.form.id != null) {
              updateInform(this.form).then(response => {
                this.$modal.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            }else {
              addInform(this.form).then(response => {
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
        this.$modal.confirm('是否确认删除用户编号为"' + row.id + '"的数据项？').then(function() {
          return delInform({id: row.id})
        }).then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        }).catch(() => {
        })
      }
    }
  }
</script>
