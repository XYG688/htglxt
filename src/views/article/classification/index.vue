<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="100px">
      <el-form-item label="社区/网格ID" prop="companyId">
        <el-input
          v-model="queryParams.companyId"
          placeholder="请输入社区/网格ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="社区/网格" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入社区/网格"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分类名称" prop="classifyName">
        <el-input
          v-model="queryParams.classifyName"
          placeholder="请输入分类名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="rowStatus">
        <el-select v-model="queryParams.rowStatus" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_normal_disable"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker clearable
          v-model="queryParams.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择创建时间">
        </el-date-picker>
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
          v-hasPermi="['article:classification:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['article:classification:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['article:classification:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['article:classification:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="classificationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键id" align="center" prop="id" />
      <el-table-column label="社区/网格ID" align="center" prop="companyId" />
      <el-table-column label="社区/网格" align="center" prop="companyName" />
      <el-table-column label="分类名称" align="center" prop="classifyName" />
      <el-table-column label="排序" align="center" prop="classifySort" />
      <el-table-column label="状态" align="center" prop="rowStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.rowStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="备注描述" align="center" prop="classifyRemark" />
      <el-table-column label="创建人" align="center" prop="createUser" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['article:classification:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['article:classification:remove']"
          >删除</el-button>
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

    <!-- 添加或修改文章分类 对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8"> 
            <el-form-item label="社区/网格ID" prop="companyId">
              <el-input v-model="form.companyId" placeholder="请输入社区/网格ID" />
            </el-form-item>
          </el-col>
          <el-col :span="8"> 
            <el-form-item label="社区/网格" prop="companyName">
              <el-input v-model="form.companyName" placeholder="请输入社区/网格" />
            </el-form-item>
          </el-col>
          <el-col :span="8"> 
            <el-form-item label="分类名称" prop="classifyName">
              <el-input v-model="form.classifyName" placeholder="请输入分类名称" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8"> 
            <el-form-item label="排序" prop="classifySort">
              <el-input v-model="form.classifySort" placeholder="请输入排序" />
            </el-form-item>
          </el-col>
          <el-col :span="8"> 
            <el-form-item label="状态">
              <el-radio-group v-model="form.rowStatus">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
    :label="parseInt(dict.value)"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8"> 
            <el-form-item label="创建人" prop="createUser">
              <el-input v-model="form.createUser" placeholder="请输入创建人" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8"> 
            <el-form-item label="更新人" prop="updateUser">
              <el-input v-model="form.updateUser" placeholder="请输入更新人" />
            </el-form-item>
          </el-col>
          <el-col :span="8"> 
            <el-form-item label="乐观锁" prop="revision">
              <el-input v-model="form.revision" placeholder="请输入乐观锁" />
            </el-form-item>
          </el-col>
          <el-col :span="16"> 
            <el-form-item label="备注描述" prop="classifyRemark">
              <el-input v-model="form.classifyRemark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listClassification, getClassification, delClassification, addClassification, updateClassification } from "@/api/article/classification";

export default {
  name: "Classification",
  dicts: ['sys_normal_disable'],
  data() {
    return {
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
      // 文章分类 表格数据
      classificationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyId: null,
        companyName: null,
        classifyName: null,
        rowStatus: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        companyId: [
          { required: true, message: "社区/网格ID不能为空", trigger: "blur" }
        ],
        companyName: [
          { required: true, message: "社区/网格不能为空", trigger: "blur" }
        ],
        classifyName: [
          { required: true, message: "分类名称不能为空", trigger: "blur" }
        ],
        classifySort: [
          { required: true, message: "排序不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询文章分类 列表 */
    getList() {
      this.loading = true;
      listClassification(this.queryParams).then(response => {
        this.classificationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        companyId: null,
        companyName: null,
        classifyName: null,
        classifySort: null,
        rowStatus: 0,
        classifyRemark: null,
        createUser: null,
        createTime: null,
        updateUser: null,
        updateTime: null,
        revision: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加文章分类 ";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getClassification(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改文章分类 ";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateClassification(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addClassification(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除文章分类 编号为"' + ids + '"的数据项？').then(function() {
        return delClassification(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('article/classification/export', {
        ...this.queryParams
      }, `classification_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
