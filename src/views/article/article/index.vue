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
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入文章标题"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="来源" prop="sources">
        <el-select v-model="queryParams.sources" placeholder="请选择来源" clearable>
          <el-option
            v-for="dict in dict.type.article_source"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="分类" prop="articleClassificationId">
        <el-input
          v-model="queryParams.articleClassificationId"
          placeholder="请输入分类"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文章状态" prop="rowStatus">
        <el-select v-model="queryParams.rowStatus" placeholder="请选择文章状态" clearable>
          <el-option
            v-for="dict in dict.type.article_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-date-picker
          v-model="daterangeReleaseTime"
          style="width: 215px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="daterangeCreateTime"
          style="width: 215px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item style="margin-left:60px">
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
          v-hasPermi="['article:article:add']"
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
          v-hasPermi="['article:article:edit']"
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
          v-hasPermi="['article:article:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['article:article:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="articleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键id" align="center" prop="id" />
      <el-table-column label="社区/网格ID" align="center" prop="companyId" />
      <el-table-column label="社区/网格" align="center" prop="companyName" />
      <el-table-column label="文章标题" align="center" prop="title" />
      <el-table-column label="文章封面" align="center" prop="articleImg" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.articleImg" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column label="文章内容" align="center" prop="articleContent" />
      <el-table-column label="来源" align="center" prop="sources">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.article_source" :value="scope.row.sources"/>
        </template>
      </el-table-column>
      <el-table-column label="分类" align="center" prop="articleClassificationId" />
      <el-table-column label="置顶" align="center" prop="upFlag">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_top" :value="scope.row.upFlag"/>
        </template>
      </el-table-column>
      <el-table-column label="文章状态" align="center" prop="rowStatus">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.article_status" :value="scope.row.rowStatus"/>
        </template>
      </el-table-column>
      <el-table-column label="发布时间" align="center" prop="releaseTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.releaseTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览量" align="center" prop="browseCount" />
      <el-table-column label="点赞量" align="center" prop="likeCount" />
      <el-table-column label="评论量" align="center" prop="commentsCount" />
      <el-table-column label="作者" align="center" prop="createUser" />
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" align="center" prop="updateUser" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['article:article:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['article:article:remove']"
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

    <!-- 添加或修改文章管理对话框 -->
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
              <el-form-item label="文章标题" prop="title">
                <el-input v-model="form.title" placeholder="请输入文章标题" />
              </el-form-item>
            </el-col>
        </el-row>  
        <el-row>
          <el-col :span="8">
            <el-form-item label="来源" prop="sources">
              <el-select v-model="form.sources" placeholder="请选择来源">
                <el-option
                  v-for="dict in dict.type.article_source"
                  :key="dict.value"
                  :label="dict.label"
    :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分类" prop="articleClassificationId">
              <el-input v-model="form.articleClassificationId" placeholder="请输入分类" />
            </el-form-item>
          </el-col>
          <el-col :span="8"> 
            <el-form-item label="乐观锁" prop="revision">
              <el-input v-model="form.revision" placeholder="请输入乐观锁" />
            </el-form-item>
          </el-col>
        </el-row>  
        <el-row>
          <el-col :span="8">
            <el-form-item label="置顶">
              <el-radio-group v-model="form.upFlag">
                <el-radio
                  v-for="dict in dict.type.is_top"
                  :key="dict.value"
    :label="parseInt(dict.value)"
                >{{dict.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="8">  
            <el-form-item label="文章状态" prop="rowStatus">
              <el-select v-model="form.rowStatus" placeholder="请选择文章状态">
                <el-option
                  v-for="dict in dict.type.article_status"
                  :key="dict.value"
                  :label="dict.label"
    :value="parseInt(dict.value)"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8"> 
            <el-form-item label="发布时间" prop="releaseTime">
              <el-date-picker clearable
                v-model="form.releaseTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请选择发布时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8"> 
            <el-form-item label="浏览量" prop="browseCount">
              <el-input v-model="form.browseCount" placeholder="请输入浏览量" />
            </el-form-item>
          </el-col>
          <el-col :span="8"> 
            <el-form-item label="点赞量" prop="likeCount">
              <el-input v-model="form.likeCount" placeholder="请输入点赞量" />
            </el-form-item>
          </el-col>
          <el-col :span="8"> 
            <el-form-item label="评论量" prop="commentsCount">
              <el-input v-model="form.commentsCount" placeholder="请输入评论量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8"> 
            <el-form-item label="作者" prop="createUser">
              <el-input v-model="form.createUser" placeholder="请输入作者" />
            </el-form-item>
          </el-col>
          <el-col :span="8"> 
            <el-form-item label="操作人" prop="updateUser">
              <el-input v-model="form.updateUser" placeholder="请输入操作人" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="8"> 
          </el-col>
          <el-col :span="8"> 
          </el-col>
          <el-col :span="8"> 
          </el-col>
        </el-row> -->


        
        <el-divider content-position="center">文章封面</el-divider>
        <el-row>
          <el-col :span="24">
            <el-form-item label="文章封面">
              <image-upload v-model="form.articleImg"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">文章内容</el-divider>
        <el-row>
          <el-col :span="24">
              <el-form-item label="文章内容">
                <editor v-model="form.articleContent" :min-height="192"/>
              </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="center">文章附件 信息</el-divider>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddWzAttachment">添加</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="handleDeleteWzAttachment">删除</el-button>
          </el-col>
        </el-row>
        <el-table :data="wzAttachmentList" :row-class-name="rowWzAttachmentIndex" @selection-change="handleWzAttachmentSelectionChange" ref="wzAttachment">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column label="序号" align="center" prop="index" width="50"/>
          <el-table-column label="附件名称" prop="attachmentName">
            <template slot-scope="scope">
              <el-input v-model="scope.row.attachmentName" placeholder="请输入附件名称" />
            </template>
          </el-table-column>
          <el-table-column label="附件大小" prop="attachmentSize" >
            <template slot-scope="scope">
              <el-input v-model="scope.row.attachmentSize" placeholder="请输入附件大小" />
            </template>
          </el-table-column>
          <el-table-column label="附件类型" prop="attachmentType" >
            <template slot-scope="scope">
              <el-select v-model="scope.row.attachmentType" placeholder="请选择附件类型">
                <el-option label="请选择字典生成" value="" />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listArticle,
  getArticle,
  delArticle,
  addArticle,
  updateArticle,
} from "@/api/article/article";

export default {
  name: "Article",
  dicts: ["article_status", "article_source", "is_top"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 子表选中数据
      checkedWzAttachment: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 文章管理表格数据
      articleList: [],
      // 文章附件 表格数据
      wzAttachmentList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 附件类型时间范围
      daterangeReleaseTime: [],
      // 附件类型时间范围
      daterangeCreateTime: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyId: null,
        companyName: null,
        title: null,
        sources: null,
        articleClassificationId: null,
        rowStatus: null,
        releaseTime: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        companyId: [
          { required: true, message: "社区/网格ID不能为空", trigger: "blur" },
        ],
        companyName: [
          { required: true, message: "社区/网格不能为空", trigger: "blur" },
        ],
        title: [
          { required: true, message: "文章标题不能为空", trigger: "blur" },
        ],
        articleContent: [
          { required: true, message: "文章内容不能为空", trigger: "blur" },
        ],
        sources: [
          { required: true, message: "来源不能为空", trigger: "change" },
        ],
        articleClassificationId: [
          { required: true, message: "分类不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询文章管理列表 */
    getList() {
      this.loading = true;
      this.queryParams.params = {};
      if (
        null != this.daterangeReleaseTime &&
        "" != this.daterangeReleaseTime
      ) {
        this.queryParams.params[
          "beginReleaseTime"
        ] = this.daterangeReleaseTime[0];
        this.queryParams.params[
          "endReleaseTime"
        ] = this.daterangeReleaseTime[1];
      }
      if (null != this.daterangeCreateTime && "" != this.daterangeCreateTime) {
        this.queryParams.params[
          "beginCreateTime"
        ] = this.daterangeCreateTime[0];
        this.queryParams.params["endCreateTime"] = this.daterangeCreateTime[1];
      }
      listArticle(this.queryParams).then((response) => {
        this.articleList = response.rows;
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
        title: null,
        articleImg: null,
        articleContent: null,
        sources: null,
        articleClassificationId: null,
        upFlag: 0,
        rowStatus: null,
        releaseTime: null,
        browseCount: null,
        likeCount: null,
        commentsCount: null,
        createUser: null,
        createTime: null,
        updateTime: null,
        updateUser: null,
        revision: null,
      };
      this.wzAttachmentList = [];
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeReleaseTime = [];
      this.daterangeCreateTime = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加文章管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getArticle(id).then((response) => {
        this.form = response.data;
        this.wzAttachmentList = response.data.wzAttachmentList;
        this.open = true;
        this.title = "修改文章管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.wzAttachmentList = this.wzAttachmentList;
          if (this.form.id != null) {
            updateArticle(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addArticle(this.form).then((response) => {
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
      this.$modal
        .confirm('是否确认删除文章管理编号为"' + ids + '"的数据项？')
        .then(function() {
          return delArticle(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 文章附件 序号 */
    rowWzAttachmentIndex({ row, rowIndex }) {
      row.index = rowIndex + 1;
    },
    /** 文章附件 添加按钮操作 */
    handleAddWzAttachment() {
      let obj = {};
      obj.attachmentName = "";
      obj.attachmentUrl = "";
      obj.attachmentSize = "";
      obj.attachmentType = "";
      this.wzAttachmentList.push(obj);
    },
    /** 文章附件 删除按钮操作 */
    handleDeleteWzAttachment() {
      if (this.checkedWzAttachment.length == 0) {
        this.$modal.msgError("请先选择要删除的文章附件 数据");
      } else {
        const wzAttachmentList = this.wzAttachmentList;
        const checkedWzAttachment = this.checkedWzAttachment;
        this.wzAttachmentList = wzAttachmentList.filter(function(item) {
          return checkedWzAttachment.indexOf(item.index) == -1;
        });
      }
    },
    /** 复选框选中数据 */
    handleWzAttachmentSelectionChange(selection) {
      this.checkedWzAttachment = selection.map((item) => item.index);
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "article/article/export",
        {
          ...this.queryParams,
        },
        `article_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
