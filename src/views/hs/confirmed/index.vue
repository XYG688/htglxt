<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="88px">
      <!--      <el-form-item label="核酸码" prop="hsCode">-->
      <!--        <el-input-->
      <!--          v-model="queryParams.hsCode"-->
      <!--          placeholder="请输入核酸码"-->
      <!--          clearable-->
      <!--          size="small"-->
      <!--          @keyup.enter.native="handleQuery"-->
      <!--        />-->
      <!--      </el-form-item>-->
      <el-form-item label="姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
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
      <el-form-item label="手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="社区/网格" prop="companyId">
        <el-select v-model="queryParams.companyName" placeholder="请选择村社区" size="small" clearable @clear="clearCompany">
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
      <el-form-item label="用户状态" prop="revision">
        <el-select v-model="queryParams.userState" placeholder="请选择登记" clearable size="small">
          <el-option
            v-for="dict in dict.type.permit_state"
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
          type="primary"
          plain
          size="mini"
          @click="handleAdd"
          v-hasPermi="['permit:confirmed:add']"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          size="mini"
          @click="handleExport"
            v-hasPermi="['permit:confirmed:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          size="mini"
          :disabled="multiple"
          @click="handleArrDelete"
          v-hasPermi="['permit:confirmed:remove']"
        >解除
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="applyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" align="center" type="index" width="80"/>
      <!--      <el-table-column label="核酸码" align="center" prop="hsCode"/>-->
      <el-table-column label="姓名" align="center" prop="name"/>
      <!--      <el-table-column label="性别" align="center" prop="sex">-->
      <!--        <template slot-scope="scope">-->
      <!--          <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.sex"/>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="身份证号" align="center" prop="idNumber">
        <template slot-scope="scope">
          <span>{{ getIdNumber(scope.row.idNumber) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="phone"/>
      <el-table-column label="社区/网格" align="center" prop="companyName"/>
      <el-table-column label="现居住地址" align="center" prop="addr" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ getStr(scope.row.addr) }}</span>
        </template>
      </el-table-column>
      <!--      <el-table-column label="登记地址" align="center" prop="addr1" show-overflow-tooltip>-->
      <!--        <template slot-scope="scope">-->
      <!--          <span>{{ getStr(scope.row.addr)  }}</span>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="创建日期" align="center" prop="birthday" width="180" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="已隔离天数" align="center" prop="phone">
        <template slot-scope="scope">
          <span>{{ dateMinus(scope.row.createTime) }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="用户状态" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.permit_state" :value="scope.row.userState"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">

          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleSet(scope.row)"
            v-hasPermi="['permit:confirmed:set']"
          >设置
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
            v-hasPermi="['permit:confirmed:remove']"
          >解除
          </el-button>
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


    <!-- 添加或修改病例 -->
    <el-dialog :title="titleUser" :visible.sync="openUser" width="80%" append-to-body class="openUser">
      <el-form :model="queryParamsUser" ref="queryFormUser" :inline="true"  v-if="titleUser==='新增'">
        <!--        <el-form-item label="核酸码" prop="hsCode">-->
        <!--          <el-input-->
        <!--            v-model="queryParamsUser.hsCode"-->
        <!--            placeholder="请输入核酸码"-->
        <!--            clearable-->
        <!--            size="small"-->
        <!--            @keyup.enter.native="handleQueryUser"-->
        <!--          />-->
        <!--        </el-form-item>-->
        <el-form-item label="姓名" prop="name">
          <el-input
            v-model="queryParamsUser.name"
            placeholder="请输入姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQueryUser"
          />
        </el-form-item>
        <el-form-item label="身份证号" prop="idNumber">
          <el-input
            v-model="queryParamsUser.idNumber"
            placeholder="请输入身份证号"
            clearable
            size="small"
            @keyup.enter.native="handleQueryUser"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="queryParamsUser.phone"
            placeholder="请输入手机号"
            clearable
            size="small"
            @keyup.enter.native="handleQueryUser"
          />
        </el-form-item>
        <!--        <el-form-item label="社区/网格" prop="companyId">-->
        <!--          <el-select v-model="queryParamsUser.companyName" placeholder="请选择村社区"  size="small">-->
        <!--            <el-option :value="queryParamsUser.companyId" :label="queryParamsUser.companyName"-->
        <!--                       style="width: 260px;height:200px;overflow: auto;background-color:#fff">-->
        <!--              <el-tree-->
        <!--                v-if="treeOptions.length > 0"-->
        <!--                :data="treeOptions"-->
        <!--                :props="defaultPropsValue"-->
        <!--                @node-click="handleNodeClick"-->
        <!--              ></el-tree>-->
        <!--            </el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQueryUser">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryUser">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table v-if="titleUser==='新增'" v-loading="loadingUser" :data="applyListUser" border
                @selection-change="handleSelectionChangeUser" :height="'176px'"
                :header-cell-style="{ background: '#FFFFFF', color: '#333333', width: '5px'}">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="序号" align="center" type="index" width="80"/>
        <!--        <el-table-column label="核酸码" align="center" prop="hsCode"/>-->
        <el-table-column label="姓名" align="center" prop="name"/>
        <!--        <el-table-column label="性别" align="center" prop="sex">-->
        <!--          <template slot-scope="scope">-->
        <!--            <dict-tag :options="dict.type.sys_user_sex" :value="scope.row.sex"/>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="身份证号" align="center" prop="idNumber">
          <template slot-scope="scope">
            <span>{{ getIdNumber(scope.row.idNumber) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" align="center" prop="phone"/>
        <el-table-column label="社区/网格" align="center" prop="companyName"/>
        <el-table-column label="现居住地址" align="center" prop="addr1" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ getStr(scope.row.addr) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <h6 v-if="titleUser==='新增'">筛查设置</h6>
      <el-form :model="queryParamsScreening" ref="queryFormScreening" :inline="true" label-width="88px">
        <!--        <el-form-item label="开始时间" align="center" prop="hsStartDate" width="320">-->
        <!--          <el-date-picker  size="small"-->
        <!--                          v-model="queryParamsScreening.startTime"-->
        <!--                          type="date"-->
        <!--                          value-format="yyyy-MM-dd"-->
        <!--                          placeholder="选择筛查开始时间">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="结束时间" align="center" prop="EndDate" width="220">-->
        <!--          <el-date-picker  size="small"-->
        <!--                          v-model="queryParamsScreening.endTime"-->
        <!--                          type="date"-->
        <!--                          value-format="yyyy-MM-dd"-->
        <!--                          placeholder="选择筛查结束时间">-->
        <!--          </el-date-picker>-->
        <!--        </el-form-item>-->
        <el-form-item label="筛查时间">
          <el-date-picker
            v-model="daterangeCreateTime"
            :clearable='false'
            size="small"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            type="datetimerange"
            range-separator="-"
            :default-time="['00:00:00', '23:59:59']"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" :disabled="singleUser"
                     @click="handleQueryScreening">搜索
          </el-button>
          <!--          <el-button icon="el-icon-refresh" size="mini" @click="resetQueryScreening">重置</el-button>-->
        </el-form-item>
      </el-form>

      <el-form :inline="true" label-width="88px" ref="formUser" :model="formUser" >
        <el-form-item label="筛查时间">
          <section class="btn-box">
            <ul>
              <li v-for="(item) in timeSelectList" :key="item.value" @click="selectTime(item.value)"
                  :class="timeSelectChecked == item.value?'checked item-click':'item-click'">
                {{ item.label }}
              </li>
            </ul>
          </section>
        </el-form-item>
        <el-form-item label="警告提示">
          <el-select v-model="formUser.sysSos" placeholder="请选择警告提示" clearable size="small" @change="changeSos">
            <el-option
              v-for="dict in dict.type.sys_sos"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="弹窗文字" prop="remarks">
          <el-input v-model="formUser.remarks" style="width: 500px" type="textarea" :autosize="{ minRows: 2, maxRows: 8}"
                    placeholder="请输入弹窗文字"/>

        </el-form-item>
      </el-form>
      <el-table v-loading="loadingScreening" :data="applyListScreening" border :height="'276px'"
                :header-cell-style="{ background: '#FFFFFF', color: '#333333', width: '5px'}"
                :span-method="objectSpanMethod"
      >
        <!--        <el-table-column type="selection" width="55" align="center"/>-->
        <el-table-column label="序号" align="center" type="index" width="80"/>
        <el-table-column label="商区名称" align="center" prop="spName"show-overflow-tooltip/>
        <el-table-column label="商区地址" align="center" prop="addr" show-overflow-tooltip/>
        <el-table-column label="筛查类型" align="center" prop="inMinute"  :render-header="renderHeader" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.timeState" placeholder="请选择筛查类型" @change="selectChanged" :clearable="false"
                       size="small">
              <el-option
                v-for="item in screeningTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="进场时间" align="center" prop="inTime">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.inTime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </template>
        </el-table-column>
        <el-table-column label="进场筛查时间" align="center" prop="inMinute" width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.inMinute" placeholder="请选择筛查时间" @change="selectChanged" :clearable="false"
                       size="small">
              <el-option
                v-for="item in timeSelectList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="出场时间" align="center" prop="outTime" >
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.outTime"
              format="yyyy-MM-dd HH:mm:ss"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              placeholder="选择日期时间">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column label="出场筛查时间" align="center" prop="outMinute"  width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.outMinute" placeholder="请选择筛查时间" @change="selectChanged" :clearable="false"
                       size="small">
              <el-option
                v-for="item in timeSelectList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="是否疫区" align="center" prop="spState" :render-header="renderHeaderSpState">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.spState" @change="changeSpState($event,scope.row.spId)" >
              <el-radio label="ABNORMAL">是</el-radio>
              <el-radio label="NORMAL">否</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormUser" :disabled="singleUser">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改申请记录 对话框 -->
    <el-dialog :title="title" :visible.sync="open" append-to-body width="70%">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-descriptions class="margin-top" title="" :column="3" :size="size" border
                         v-if="form && JSON.stringify(form) !== '{}'"
        >
          <!-- <template slot="extra">
            <el-button type="primary" @click="handleUpdateUser(form.hsFamilyMember.id)" size="small">修改用户信息
            </el-button>
          </template> -->
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-picture-outline-round"></i>
              头像
            </template>
            <el-image
              :src="form.avatar"
              :preview-src-list="[form.avatar]"
              fit="fit"
              class="el-image"
              style="width: 100px;height: 100px;"
            >
            </el-image>
            <!--            <el-avatar shape="square" :size="100" :src="form.avatar"></el-avatar>-->
          </el-descriptions-item>
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

        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getTree, getUserTree} from '@/api/hs/comparison'
import {
  getMember, getMember1, listMember2,
  updateMember
} from '@/api/hs/member'
import {
  getUsersSpVisitRecord,
  getDiagnosisUserInfoByPage,
  removeUserDiagnosisState,
  removeAllUserDiagnosisState,
  diagnosisUserSpVisit
} from "@/api/visit/visit";
export default {
  name: 'Apply',
  dicts: ['permit_audit', 'sys_user_sex', 'nation', 'hoh_relationship', 'permit_state', 'sys_sos', 'apply_head_state', 'user_type', 'user_profession', 'residence_type', 'user_census', 'document_type'],
  data() {
    return {
      typeNameArr: [],  // 第一列进行合并操作时存放的数组变量
      typeNamePos: 0, // 上面的数组的下标值
      storeArr: [],  // 第二列进行合并操作时存放的数组变量
      storePos: 0,// 上面的数组的下标值
      feeArr: [], // 第三列进行合并操作时存放的数组变量
      feePos: 0,// 上面的数组的下标值、
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
      udrId: -1,
      size: 'medium',
      // 遮罩层
      loading: true,
      srcList: [],
      // 遮罩层
      loadingUser: false,
      // 选中数组
      ids: [],
      // 遮罩层
      loadingScreening: false,
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
      // 选中数组
      idsUser: [],
      // 非单个禁用
      singleUser: true,
      // 非多个禁用
      multipleUser: true,
      // 弹出层标题
      title: '',
      // 选中数组
      idsScreening: [],
      // 非单个禁用
      singleScreening: true,
      // 非多个禁用
      multipleScreening: true,
      // 申请记录 表格数据
      applyListUser: [],
      // 申请记录 表格数据
      applyListScreening: [],
      screeningTypeList:[
        {
          value:'TIMING',
          label:'时间点',
        },
        {
          value:'QUANTUM',
          label:'时间段',
        }
      ],
      titleAuit: '',
      titleUser: '',
      // 是否显示弹出层
      open: false,
      openAuit: false,
      openUser: false,
      defaultOrUpdate: true,
      // 用户Id时间范围
      daterangeCreateTime: [
        this.parseTime(this.IsoTime(
          new Date(new Date(new Date().toLocaleDateString()).getTime())
        )),
        this.parseTime(this.IsoTime(
          new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1)
        ))

      ],
      // 查询参数
      queryParams: {
        page: 1,
        row: 10,
        name: null,
        idNumber: null,
        phone: null,
        companyIds: null,
        companyId: null,
        companyName: null,
        userState: null,
      },
      // 查询参数
      queryParamsUser: {
        pageNum: 1,
        pageSize: 10,
        createTime: null,
        state: null,
        companyIds: null,
        companyId: null,
        companyName: null,
        orderByColumn: 'createTime',
        isAsc: 'desc'
      },
      // 查询参数
      queryParamsScreening: {
        userId: null,
        startTime: null,
        endTime: null,
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
      form: {
        checkboxList: []
      },
      formAuit: {},
      formUser: {},
      // 表单校验
      rulesUser: {
        name: [
          {required: true, message: '姓名不能为空', trigger: 'blur'}
        ],
        companyId: [
          {required: true, message: '村社区不能为空', trigger: 'blur'}
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
      timeSelectList: [{
        value: 3,
        label: '3分钟'
      }, {
        value: 5,
        label: '5分钟'
      }, {
        value: 10,
        label: '10分钟'
      }, {
        value: 15,
        label: '15分钟'
      }, {
        value: 20,
        label: '20分钟'
      }, {
        value: 30,
        label: '30分钟'
      }],
      timeSelectChecked: null
    }
  },
  created() {
    this.getUserTree()
    this.getList()
  },
  methods: {

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

    merageInit() { // 在下文的时候会用到，对数据进行初始化是很有必要的
      this.typeNameArr = []
      this.typeNamePos = 0
      this.storeArr = []
      this.storePos = 0
      this.feeArr = []
      this.feePos = 0
    },

    merage() {
      this.merageInit() // 前文的初始化数据函数
      for (let i = 0; i < this.applyListScreening.length; i += 1) {
        if (i === 0) {
          // 第一行必须存在
          this.typeNameArr.push(1)
          this.typeNamePos = 0
          this.storeArr.push(1)
          this.storePos = 0
          this.feeArr.push(1)
          this.feePos = 0
        } else {
          // 判断当前元素与上一个元素是否相同,eg：this.typeNamePos 是 this.typeNameArr序号
          // 第一列 下面的是eslint的不限制语法
          // eslint-disable-next-line no-lonely-if
          if (this.applyListScreening[i].spId === this.applyListScreening[i - 1].spId) {
            this.typeNameArr[this.typeNamePos] += 1
            this.typeNameArr.push(0)
            this.storeArr[this.storePos] += 1
            this.storeArr.push(0)
            this.feeArr[this.feePos] += 1
            this.feeArr.push(0)
          } else {
            this.typeNameArr.push(1)
            this.typeNamePos = i
            this.storeArr.push(1)
            this.storePos = i
            this.feeArr.push(1)
            this.feePos = i
          }
          // // // 第二列
          // if (this.applyListScreening[i].id === this.applyListScreening[i - 1].id) {
          //   this.storeArr[this.storePos] += 1
          //   this.storeArr.push(0)
          // } else {
          //   this.storeArr.push(1)
          //   this.storePos = i
          // }
        }
      }
    },

    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        // 第一列的合并方法
        const row1 = this.typeNameArr[rowIndex]
        const col1 = row1 > 0 ? 1 : 0 // 如果被合并了row = 0; 则他这个列需要取消
        return {
          rowspan: row1,
          colspan: col1
        }
      } else if (columnIndex === 1) {
        // 第二列的合并方法
        const row2 = this.storeArr[rowIndex]
        const col2 = row2 > 0 ? 1 : 0 // 如果被合并了row = 0; 则他这个列需要取消
        return {
          rowspan: row2,
          colspan: col2
        }
      } else if (columnIndex === 2) {
        // 第二列的合并方法
        const row3 = this.feeArr[rowIndex]
        const col3 = row3 > 0 ? 1 : 0 // 如果被合并了row = 0; 则他这个列需要取消
        return {
          rowspan: row3,
          colspan: col3
        }
      } else if (columnIndex === 8) {
        // 第二列的合并方法
        const row3 = this.feeArr[rowIndex]
        const col3 = row3 > 0 ? 1 : 0 // 如果被合并了row = 0; 则他这个列需要取消
        return {
          rowspan: row3,
          colspan: col3
        }
      }
    },

    renderHeader(h, { column }) {
      return h('div', [
        h('span', column.label),
        h(
          'el-tooltip',
          {
            props: {
              effect: 'dark',
              content: `时间点：代表查询时间范围为进场的前XX分钟~出场的后XX分钟，查询所有的与病例同时空交集人员；时间段：（必须保证有进场和出场时间）代表查询时间范围为进场的前XX分钟~进场的后XX分钟 和 出场的前XX分钟~出场的后XX分钟，查询所有的与病例同时空交集人员；`,
              placement: 'top',
            },
          },
          [
            h('i', {
              class: 'el-icon-question',
              style: 'color:#409eff;margin-left:5px;',
            }),
          ],
        ),
      ]);
    },
    renderHeaderSpState(h, { column }) {
      return h('div', [
        h('span', column.label),
        h(
          'el-tooltip',
          {
            props: {
              effect: 'dark',
              content: '选择是的话，会将当前商户改为疫区，并根据上面选择的筛查时间，将所有到过该商户的人员状态改为与病例同时空交集人员。请悉知！',
              placement: 'top',
            },
          },
          [
            h('i', {
              class: 'el-icon-question',
              style: 'color:#409eff;margin-left:5px;',
            }),
          ],
        ),
      ]);
    },

    changeSos(val) {
      var that = this
      console.log(val)
      if (val) {
        this.dict.type.sys_sos.forEach(item => {
          console.log(item)
          if (val === item.value) {
            console.log(val === item.value)
            that.formUser.remarks = item.raw.remark
          }
        })
      }
      this.$forceUpdate();
    },
    // 改变的值
    selectChanged(e) {
      // 强制刷新
      this.$forceUpdate();
    },
    dateMinus(date1) {//date1:小日期   date2:大日期
      var sdate = new Date(date1);
      var now = new Date();
      var days = now.getTime() - sdate.getTime();
      var day = parseInt(days / (1000 * 60 * 60 * 24));
      return day;
    },

    /** 查询申请记录 列表 */
    getList() {
      this.loading = true
      this.queryParams.params = {}
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params['beginCreateTime'] = this.daterangeCreateTime[0]
        this.queryParams.params['endCreateTime'] = this.daterangeCreateTime[1]
      }

      if (this.queryParams.companyName != null && this.queryParams.companyName != '' && this.queryParams.companyIds != null && this.queryParams.companyIds.length > 0) {
        this.queryParams.params['depId'] = this.queryParams.companyIds[this.queryParams.companyIds.length - 1]
      }

      if (null != this.queryParams.hsCode && '' != this.queryParams.hsCode) {
        this.queryParams.params['hsCode'] = this.queryParams.hsCode
      }

      if (null != this.queryParams.phone && '' != this.queryParams.phone) {
        this.queryParams.params['phone'] = this.queryParams.phone
      }
      if (!this.queryParams.userState) {
        this.queryParams.userState = null
      }
      getDiagnosisUserInfoByPage(this.queryParams).then(response => {
        this.applyList = response.data.list
        this.total = response.data.cnt
        this.loading = false

      })
    },
    handleSelectionChangeScreening() {
    },
    // 查看
    handleDefault() {
      // checkConfirmed()
    },

    /** 查询申请记录 列表 */
    getListUser() {
      this.loadingUser = true
      this.queryParamsUser.params = {}
      // if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
      //   this.queryParams.params['beginCreateTime'] = this.daterangeCreateTime[0]
      //   this.queryParams.params['endCreateTime'] = this.daterangeCreateTime[1]
      // }

      // if (this.queryParamsUser.companyName!=null && this.queryParamsUser.companyName!=''&& this.queryParamsUser.companyIds != null && this.queryParamsUser.companyIds.length > 0) {
      //   this.queryParamsUser.params['depId'] = this.queryParamsUser.companyIds[this.queryParamsUser.companyIds.length-1]
      // }
      // if (null != this.queryParamsUser.depId && '' != this.queryParamsUser.depId) {
      //   this.queryParamsUser.params['depId'] = this.queryParamsUser.depId
      // }
      // if (null != this.queryParamsUser.hsCode && '' != this.queryParamsUser.hsCode) {
      //   this.queryParamsUser.params['hsCode'] = this.queryParamsUser.hsCode
      // }
      // if (null != this.queryParamsUser.name && '' != this.queryParamsUser.name) {
      //   this.queryParamsUser.params["name"] = this.queryParamsUser.name;
      // }
      if (null != this.queryParamsUser.phone && '' != this.queryParamsUser.phone) {
        this.queryParamsUser.params['phone'] = this.queryParamsUser.phone
      }
      listMember2(this.queryParamsUser).then(response => {
        this.applyListUser = response.rows
        this.totalUser = response.total
        this.loadingUser = false
      })
    },

    /** 查询申请记录 列表 */
    getListScreening() {
      this.loadingScreening = true
      this.queryParamsScreening.userId = this.idsUser[0]
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParamsScreening.startTime = this.daterangeCreateTime[0]
        this.queryParamsScreening.endTime = this.daterangeCreateTime[1]
      }else{
        this.queryParamsScreening.startTime = null
        this.queryParamsScreening.endTime = null
      }
      getUsersSpVisitRecord(this.queryParamsScreening).then(response => {
        if (response.data && response.data.length > 0) {
          response.data.forEach(item => {
            item.outMinute = 10
            item.inMinute = 10
            item.timeState = 'TIMING'
          })
        }
        this.applyListScreening = response.data
        this.merage()
        this.loadingScreening = false

      })

    },
    // 取消按钮
    cancel() {
      this.openUser = false
      this.open = false
      this.reset()
      this.resetUser()
    },

    selectTime(val) {
      this.timeSelectChecked = val
      this.applyListScreening.forEach(item => {
        item.outMinute = val
        item.inMinute = val
      })
      //强制刷新
      this.$forceUpdate()
    },
    changeSpState(val,id){
      console.log(val,id)
      this.applyListScreening.forEach(item => {
        if(item.spId === id ){
          item.spState = val
        }
      })
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
        reverseImg: null
      }
      this.resetForm('form')

      this.formUser = {
        sysSos : null,
        remarks : null
      }
      this.resetForm('formUser')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 搜索按钮操作 */
    handleQueryUser() {
      this.queryParamsUser.pageNum = 1
      this.getListUser()
    },
    /** 搜索按钮操作 */
    handleQueryScreening() {
      this.getListScreening()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.daterangeCreateTime = []
      this.resetForm('queryForm')
      this.queryParams.companyIds = null
      this.queryParams.companyName = null
      this.handleQuery()
    },

    /** 重置按钮操作 */
    resetQueryUser() {
      this.resetForm('queryFormUser')
      this.handleQueryUser()
    },
    /** 重置按钮操作 */
    resetQueryScreening() {
      this.resetForm('queryFormScreening')
      this.handleQueryScreening()
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.udrId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 多选框选中数据
    handleSelectionChangeUser(selection) {
      this.idsUser = selection.map(item => item.id)
      this.singleUser = selection.length !== 1
      this.multipleUser = !selection.length
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      getMember1({userId: row.userId}).then(response => {
        this.form = {...response.data, ...JSON.parse(JSON.stringify(row))}
        this.open = true
        this.title = '查看信息';
        this.defaultOrUpdate = false;

      })
    },

    /** 审核按钮操作 */
    handleSet(row) {
      this.reset();
      this.openUser = true;

      this.applyListUser = []
      this.applyListScreening = []
      this.timeSelectChecked = null
      this.udrId = row.udrId
      this.idsUser = []
      this.idsUser.push(row.userId)
      this.titleUser = '设置';
      this.singleUser = false
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.userId || this.ids
      var listIds = []
      listIds.push(ids)
      var param = {
        udrId: row.udrId,
        isDiagnosis: true,
        userIds: listIds
      }
      this.$modal.confirm('是否确认解除用户 编号为"' + ids + '"的数据项？').then(function () {
        return removeUserDiagnosisState(param)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('解除成功')
      }).catch(() => {
      })
    },

    /** 删除按钮操作 */
    handleArrDelete(row) {
      const ids = this.ids
      this.$modal.confirm('是否确认解除用户 编号为"' + ids + '"的数据项？').then(function () {
        return removeAllUserDiagnosisState(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('解除成功')
      }).catch(() => {
      })
    },


    /** 提交按钮 */
    submitFormUser() {
      var that = this
      var details = []
      var flag = false
      this.applyListScreening.forEach(item => {
        // var start = item.inTime ? new Date(item.inTime).getTime() : '';
        // var end = item.outTime ? new Date(item.outTime).getTime() : new Date(item.inTime).getTime() ;
        var param = {
          spId: item.spId,
          spState: item.spState,
          inTime: item.inTime,
          outTime: item.outTime,
          outMinute: item.outMinute,
          inMinute: item.inMinute,
          timeState: item.timeState,
        }
        if(item.timeState === 'QUANTUM'){
          if(!item.inTime || !item.outTime){
            flag = true
          }
        }
        details.push(param)
      })
      if(flag){
        this.$modal.msgError('当选择筛查类型为时间段的时候，请确保有进场和出场时间')
        return false
      }
      if(!that.formUser.remarks){
        this.$modal.msgError('请输入弹框内容')
        return false
      }
      var param = {
        startTime : this.queryParamsScreening.startTime,
        endTime : this.queryParamsScreening.endTime,
        remarks:that.formUser.remarks,
        udrId: this.udrId,
        userId: this.idsUser[0],
        details: details
      }
      console.log(param)
      diagnosisUserSpVisit(param).then(response => {
        this.$modal.msgSuccess('操作成功')
        this.getList()
        this.openUser = false
      })
    },


    /** 导出按钮操作 */
    handleExport() {
      this.download('/up/v2/spvisit/user/diagnosis/export', {
        ...this.queryParams
      }, `确诊列表_${new Date().getTime()}.xlsx`)
    },
    getIdNumber(idNumber) {
      if (!idNumber) {
        return ''
      }
      return idNumber.startsWith('0-') || idNumber.startsWith('1-') ? '' : idNumber
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.openUser = true;
      this.applyListUser = []
      this.applyListScreening = []
      this.timeSelectChecked = null
      this.udrId = -1
      this.idsUser = []
      this.singleUser = true
      // this.getListUser();
      // this.getListScreening();
      this.titleUser = '新增';
    },
    // 表单重置
    resetUser() {
      this.formUser = {
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
      this.resetForm('formUser')
    },
    getStr(str) {
      return str ? str : ''
    }
  }
}
</script>
<style scoped lang='scss'>
.openUser {
  h6 {
    margin: 0;
    //margin-top: 20px;
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    line-height: 40px;
  }

  .btn-box {
    //margin-top: -5px;
    margin: 0;
    padding: 0;

    ul {
      margin: 0;
      padding: 0;
      margin-top: 5px;
      display: flex;

      li {
        line-height: 24px;
        padding: 0 20px;
        list-style: none;
        font-size: 12px;

        &.item-click {
          border: 1px solid #D3E9FF;
          color: #7DBDFF;
          border-radius: 3px;
          cursor: pointer;
          margin: 0 12px;

          &.checked {
            background-color: #D3E9FF;
          }
        }
      }
    }
  }
}

.setDialog {
  ::v-deep .el-form-item__label {
    font-weight: 400;
    color: #000;
  }

  ::v-deep .el-radio {
    margin: 10px 15px;
    color: #000;
  }

  ::v-deep .el-checkbox__label {
    color: #000;
  }

  .hint-info {
    font-size: 12px;
    color: #ED3131;
    margin: 0;
    padding: 0;
  }
}
</style>
