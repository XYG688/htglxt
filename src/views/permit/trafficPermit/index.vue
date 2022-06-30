<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="社区/网格">
        <el-select v-model="queryParams.companyName" placeholder="请选择村社区" size="small" clearable @clear="clearCompany">
          <el-option :value="queryParams.companyId" :label="queryParams.companyName"
                     style="width: 260px;height:200px;overflow: auto;background-color:#fff"
          >
            <el-tree
              v-if="treeOptions.length > 0"
              :data="treeOptions"
              :props="defaultPropsValue"
              @node-click="queryhandleNodeClick"
            ></el-tree>
          </el-option>
        </el-select>
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
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
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
      <el-form-item label="户口类型" prop="revision">
        <el-select v-model="queryParams.userCensus" placeholder="请选择户口类型" clearable size="small">
          <el-option
            v-for="dict in dict.type.user_census"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

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

      <el-form-item label="申请类型" prop="revision">
        <el-select v-model="queryParams.applyType" placeholder="请选择申请类型" clearable size="small">
          <el-option
            v-for="dict in dict.type.apply_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="时间类型" prop="dateType">
        <el-select v-model="queryParams.dateType" placeholder="请选择时间类型" size="small">
          <el-option
            v-for="dict in dateTypeList"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
        <el-date-picker
          v-model="daterangeCreateTime"
          size="small"
          style="width: 440px"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptions"
          type="datetimerange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <!--      <el-form-item label="创建时间">-->
      <!--        <el-date-picker-->
      <!--          v-model="daterangeCreateTime"-->
      <!--          size="small"-->
      <!--          style="width: 240px"-->
      <!--          value-format="yyyy-MM-dd"-->
      <!--          type="daterange"-->
      <!--          range-separator="-"-->
      <!--          start-placeholder="开始日期"-->
      <!--          end-placeholder="结束日期"-->
      <!--        ></el-date-picker>-->
      <!--      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['permit:trafficPermit:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['hs:trafficPermit:import']"
        >一键导入更改状态
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          :disabled="multiple"
          @click="handleUpdateUser"
          v-hasPermi="['permit:trafficPermit:audit']"
        >一键更改状态
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['permit:applyPass:export']"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="applyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" align="center" type="index">
        <template scope="scope">
          <span>{{ (queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center" prop="name"/>
      <el-table-column label="性别" align="center" prop="phone" width="50">
        <template slot-scope="scope">
          {{ scope.row.sex != null ? scope.row.sex === 0 || scope.row.sex === '0' ? '男' : '女' : '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="户口类型" align="center" prop="depId">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.user_census" :value="scope.row.userCensus"/>
        </template>

      </el-table-column>
      <el-table-column label="手机号" align="center" prop="phone"/>
      <el-table-column label="身份证号" align="center" prop="idNumber"/>
      <el-table-column label="社区网格" align="center" prop="companyName">
      </el-table-column>
      <el-table-column label="现居住地址" align="center" prop="addr"/>

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
      <el-table-column label="状态" align="center" prop="depId">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.permit_state" :value="scope.row.userState"/>
        </template>

      </el-table-column>
      <el-table-column label="申请类型" align="center" prop="applyType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.apply_type" :value="scope.row.applyType"/>
        </template>

      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="导入时间" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.importTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row,'query')"
            v-hasPermi="['permit:trafficPermit:query']"
          >查看
          </el-button> -->
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['permit:trafficPermit:edit']"
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleUpdateUser(scope.row)"
            v-hasPermi="['permit:trafficPermit:auditOne']"
          >更改状态
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['permit:trafficPermit:remove']"
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
    <el-dialog :title="titleUser" :visible.sync="openUser" width="500px" append-to-body>
      <el-form ref="formUser" :model="formUser" :rules="rulesUser" label-width="100px">
        <el-form-item label="状态" prop="userState">
          <el-select v-model="formUser.userState" placeholder="状态" clearable size="small">
            <el-option
              v-for="dict in dict.type.permit_state"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value*1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="警告提示" v-if="!!formUser.userState">
          <el-select v-model="formUser.sysSos" placeholder="请选择警告提示" clearable size="small" @change="changeSos">
            <el-option
              v-for="dict in dict.type.sys_sos"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="弹窗文字" prop="remarks" v-if="!!formUser.userState">
          <el-input v-model="formUser.remarks" type="textarea" :autosize="{ minRows: 2, maxRows: 8}"
                    placeholder="请输入弹窗文字"/>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormUser">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="头像">
              <userInfoImageUpload v-if="imageUploadData" v-model="form.avatar" :limit='1' :isShowTip="false"
                                   :imageUploadData='imageUploadData'/>
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
              <el-input v-model="form.idNumber" placeholder="请输入证件号码" disabled/>
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
              <el-select v-model="form.leaveType" placeholder="请选择是否在东兴" size="small">
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
              <el-select v-model="form.userProfession " placeholder="请选择人员类型"
                         :disabled="!checkPermi(['member:update:userProfession'])">
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


    <el-dialog :title="importUpdateTitle" :visible.sync="importUpdateOpen">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExportImport"
            v-hasPermi="['permit:applyPass:export']"
          >导出
          </el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="importUpdatList" :height="500">
        <el-table-column label="序号" align="center" type="index"/>
        <el-table-column label="姓名" align="center" prop="name"/>
        <el-table-column label="证件号" align="center" prop="idNumber"/>
        <el-table-column label="手机号" align="center" prop="phone"/>
        <el-table-column label="修改状态" align="center" prop="passState"/>
        <el-table-column label="弹框内容" align="center" prop="remarks" :show-overflow-tooltip="true"/>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importUpdateOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild} from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import userInfoImageUpload from '@/components/userInfoImageUpload'
import {
  listApply,
  getApply,
  delApply,
  addApply,
  updateApply,
  audit,
  audits,
  rejecteds,
  updateaudit,
  auditRejectes
} from '@/api/permit/trafficPermit'
import {
  getMember1,
  updateMember1,
  getImageToken,
  updateMemberAvater, importPassState
} from '@/api/hs/member'
import {getTree, getUserTree} from '@/api/hs/comparison'
import {
  getMember,
  updateMember
} from '@/api/hs/member'
import {checkPermi} from "@/utils/permission";
import {getToken} from "@/utils/auth";

export default {
  name: 'Apply',
  dicts: ['permit_state', 'sys_sos', 'sys_user_sex', 'nation', 'hoh_relationship', 'document_type', 'user_type',
    'user_profession', 'residence_type', 'user_census', 'leave_type','apply_type'],
  components: {Treeselect, userInfoImageUpload},
  data() {
    return {
      importUpdateTitle: '未查询到的网格用户列表',
      importUpdatList: [],
      importUpdateOpen: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近三天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      dateTypeList: [{
        value: '1',
        label: '创建时间'
      },
        {
          value: '2',
          label: '导入时间'
        }],
      size: 'medium',
      // 遮罩层
      loading: true,
      srcList: [],
      // 选中数组
      ids: [],
      idNumbers: [],
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
        dateType: '1',
        createTime: null,
        state: null,
        companyIds: null,
        companyId: null,
        companyName: null,
        userState: null,
        applyType: null,
        userCensus: null,
        startTime: null,
        endTime: null,
        orderByColumn: 'createTime',
        isAsc: 'desc',
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
      file: null,
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
        headers: {Authorization: 'Bearer ' + getToken()},
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/up/v2/userpassrecord/import'
      },
      // 表单参数
      form: {},
      formAuit: {},
      formUser: {},
      // 表单校验
      rulesUser: {
        userState: [
          {required: true, message: '请选择状态', trigger: 'change'}
        ],
        remarks: [
          {required: true, message: '弹框内容不能为空', trigger: 'blur'}
        ]
      },
      companyList: [],

      treeOptions: [],
      options: [],
      // 表单校验
      rules: {
        reject: [
          {required: true, message: '驳回原因不能为空', trigger: 'blur'}
        ],
        state: [
          {required: true, message: '请选择审核状态', trigger: 'change'}
        ]
      },
      isAdmin: false,
      imageUploadData: null
    }
  },
  created() {
    this.getList()
    this.getUserTree()
    this.getQiniuToken()
    // listDept().then(response => {
    //   this.deptOptions = this.handleTree(response.data, 'deptId')
    // })
  },
  methods: {

    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '批量修改通行证状态'
      this.upload.open = true
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('/up/v2/userpassrecord/importTemplate', {}, `批量修改通行证状态模板.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess() {
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.file = null
      this.upload.open = false
      this.getList()
    },
    fileChange(file, fileList) {
      this.file = file
    },
    // 提交上传文件
    submitFileForm() {
      if (!this.file || !this.file.raw) {
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

      const loading = this.$loading({
        lock: true,
        text: '数据上传需要1-10分钟，请耐心等待',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      importPassState(formData).then(response => {
        that.$modal.msgSuccess('导入成功')
        that.importUpdatList = []
        if (response.data && response.data.length > 0) {
          that.importUpdateOpen = true
          that.importUpdatList = response.data
          that.importUpdateTitle = "未查询到的网格用户列表 ("+response.data.length+")人"
          // var content  = ''
          // response.data.forEach(item =>{
          //   var name = item.name?item.name:''
          //   var idNumber = item.idNumber?item.idNumber:''
          //   var phone = item.phone?item.phone:''
          //   content+= name+"  "+ idNumber +'  '+ phone +"；"
          // })
          // that.open2(content)
        }


        //that.upload.open = false
        loading.close()
        that.handleFileSuccess()
      }).catch(err => {
        console.log(err)
        loading.close()
        // that.$modal.msgSuccess('导入失败')
      })

    },
    open2(content) {
      this.$notify({
        title: '导入未查询到的用户',
        type: 'warning',
        message: content,
        duration: 0
      });
    },


    checkPermi,
    changeSos(val) {
      var that = this
      if (val) {
        this.dict.type.sys_sos.forEach(item => {
          if (val === item.value) {
            that.formUser.remarks = item.raw.remark
          }
        })
      }
      this.$forceUpdate()
    },
    getQiniuToken() {
      getImageToken().then(res => {
        this.imageUploadData = {
          token: res.data
        }
      })
    },
    getUserTree() {
      getUserTree().then(res => {
        res.data.forEach(i => {
          i.value = i.id
        })
        this.treeOptions = res.data
      })
    },

    clearCompany() {
      this.queryParams.companyIds = null
    },

    queryhandleNodeClick(val) {
      var companyName = this.getHierarchyData(this.treeOptions, [val.id], val.label)
      this.queryParams.companyName = companyName.toString().replaceAll(',', '/')
      if (val.children) {
        var companyIds = this.getChildNodes(val)
        companyIds.push(val.id)
        this.queryParams.companyIds = companyIds
      } else {
        this.queryParams.companyIds = [val.id]
      }
    },


    /** 查询申请记录 列表 */
    getList() {
      this.loading = true
      this.queryParams.params = {}
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.startTime = this.daterangeCreateTime[0]
        this.queryParams.endTime = this.daterangeCreateTime[1]
      } else {
        this.queryParams.startTime = null
        this.queryParams.endTime = null
      }

      if (this.queryParams.companyName != null && this.queryParams.companyName != '' && this.queryParams.companyIds != null && this.queryParams.companyIds.length > 0) {
        this.queryParams.params['depId'] = this.queryParams.companyIds[this.queryParams.companyIds.length - 1]
      }
      // if (null != this.queryParams.depId && '' != this.queryParams.depId) {
      //   this.queryParams.params['depId'] = this.queryParams.depId
      // }
      if (null != this.queryParams.hsCode && '' != this.queryParams.hsCode) {
        this.queryParams.params['hsCode'] = this.queryParams.hsCode
      }
      // if (null != this.queryParams.name && '' != this.queryParams.name) {
      //   this.queryParams.params["name"] = this.queryParams.name;
      // }
      if (null != this.queryParams.phone && '' != this.queryParams.phone) {
        this.queryParams.params['phone'] = this.queryParams.phone
      }
      console.log(this.queryParams)
      listApply(this.queryParams).then(response => {
        this.applyList = response.rows
        this.total = response.total
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
        reverseImg: null,
        userState: null
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
      this.daterangeCreateTime = [];
      this.resetForm('queryForm');
      this.queryParams.companyIds = null
      this.queryParams.companyName = null
      this.handleQuery()
    },

    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      }
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.idNumbers = selection.map(item => item.respondentIdNumber)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加申请记录 '
    },
    // 表单重置
    resetUser() {
      this.formUser = {
        ids: null,
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
        vaccineCnt: null,
        userState: null,
        sysSos: null,
        remarks: null,
      }
      this.resetForm('formUser')
    },
    /** 修改按钮操作 */
    handleUpdateUser(row) {
      // console.log(row)
      const ids = row.id ? [row.id] : this.ids
      this.resetUser();
      if (row.id) {
        this.formUser = JSON.parse(JSON.stringify(row));
      }
      this.formUser.sysSos = null
      this.formUser.remarks = null
      this.formUser.ids = ids;
      this.openUser = true
      this.titleUser = '修改通行证状态'
      // this.$forceUpdate()
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      console.log(row)
      this.reset()
      const id = row.userId
      getMember1({userId: id}).then(response => {
        this.form = response.data
        if (response.data.userType != null && response.data.userType.length > 0) {
          this.memberTypeList = response.data.userType.split(",")
        } else {
          this.memberTypeList = []
        }
        this.open = true
        this.title = '修改用户'
      })
    },
    handleNodeClick(val) {
      this.form.companyId = val.id
      var companyName = this.getHierarchyData(this.treeOptions, [val.id], val.label)
      this.form.companyName = companyName.toString().replaceAll(',', '/')
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.memberTypeList != null && this.memberTypeList.length > 0) {
            this.form.userType = this.memberTypeList.toString()
          } else {
            this.form.userType = ""
          }
          if (this.form.id != null) {
            updateMember1(this.form).then(response => {
              updateMemberAvater(this.form).then(res => {
                this.$modal.msgSuccess('修改成功')
                this.open = false
                this.getList()
              })
            })
          } else {
            addMember1(this.form).then(response => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    // /** 修改按钮操作 */
    // handleUpdate(row, type) {
    //   this.reset()
    //   this.formAuit = row
    //   console.log(row)
    //   const id = row.id || this.ids
    //   getApply({id: id}).then(response => {
    //     this.form = {...response.data.record, idNumber: row.respondentIdNumber}
    //     // this.srcList.push(this.form.frontImg)
    //     // this.srcList.push(this.form.reverseImg)
    //     // console.log(this.form)
    //     this.open = true
    //     if (type === 'update') {
    //       this.title = '审核数据'
    //       this.defaultOrUpdate = false;
    //     } else {
    //       this.title = '查看信息';
    //       this.defaultOrUpdate = true;
    //     }

    //   })
    // },
    /** 提交按钮 */
    // submitForm() {
    //   this.$refs['form'].validate(valid => {
    //     if (valid) {
    //       if (this.form.id != null) {
    //         updateaudit({
    //           ...this.form,
    //           "pass": this.form.state === '1' ? true : false,
    //           "rejectReason": this.form.reject
    //         }).then(response => {
    //           this.$modal.msgSuccess('处理成功')
    //           this.open = false
    //           this.getList()
    //         })
    //       }
    //     }
    //   })
    // },
    updateForm() {
      updateApply(this.form).then(response => {
        this.$modal.msgSuccess('修改成功')
        this.open = false
        this.getList()
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id ? [row.id] : this.ids
      this.$modal.confirm('是否确认删除申请记录 编号为"' + ids + '"的数据项？').then(function () {
        return delApply({ids: ids})
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },

    /** 批量审核 */
    handleAudits() {
      var that = this

      this.$confirm('是否确认审核通过  编号为"' + this.idNumbers + '"的数据项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.loading = true
        auditRejectes({
          idNumber: this.idNumbers,
          "pass": true
        }).then(response => {
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
      }).then(({value}) => {

        that.$confirm('是否确认审核驳回  编号为"' + this.idNumbers + '"的数据项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.loading = true
          auditRejectes({
            idNumber: this.idNumbers,
            "pass": false,
            "rejectReason": value
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
          updateApply({
            ...this.formUser,
            'remarks': this.formUser.userState != '0' ? this.formUser.remarks : null
          }).then(response => {
            this.$modal.msgSuccess('修改成功')
            this.getList()
            this.openUser = false
          })
        }
      })
    },


    handleAudit(row) {
      this.titleAuit = '申请信息'
      this.openAuit = true
      this.formAuit = row
    },


    /** 导出按钮操作 */
    handleExportImport() {
      this.$confirm('是否导出全部数据?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.download('/up/v2//userpass/list/export/importState', this.importUpdatList
        , `未查询到的网格用户列表_${new Date().getTime()}.xlsx`,true)
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
        this.download('/up/v2/userpass/list/export', {
          ...this.queryParams
        }, `通行证列表_${new Date().getTime()}.xlsx`)
      }).catch(() => {

      })

    },
  }
}
</script>
