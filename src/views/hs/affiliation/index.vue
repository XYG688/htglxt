<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="88px">
      <el-form-item label="核酸码" prop="revision">
        <el-input
          v-model="queryParams.hsCode"
          placeholder="请输入核酸码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="社区/网格" prop="depId">
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
      <el-form-item label="姓名" prop=" name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号" prop="revision">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="身份证号" prop="idNumber">
        <el-input
          v-model="queryParams.idNumber"
          placeholder="请输入身份证号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="状态" prop="revision">
        <el-select v-model="queryParams.state" placeholder="状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.permit_audit"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="创建时间">
        <el-date-picker
          v-model="daterangeCreateTime"
          size="small"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item> -->
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
      <!--v-hasPermi="['permit:apply:add']"-->
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
      <!--v-hasPermi="['permit:apply:edit']"-->
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
          v-hasPermi="['permit:apply:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          :disabled="multiple"
          @click="handleAudits"
          v-hasPermi="['permit:apply:audit']"
        >一键通过
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          :disabled="multiple"
          @click="handleRejecteds"
          v-hasPermi="['permit:apply:reject']"
        >一键驳回
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['permit:apply:export']"
        >导出</el-button>
        </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="applyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" align="center" type="index" width="80"/>
      <el-table-column label="核酸码" align="center" prop="hsFamilyMember.hsCode"/>
      <el-table-column label="姓名" align="center" prop="name"/>
      <el-table-column label="手机号" align="center" prop="phone"/>
      <el-table-column label="当前归属社区/网格" align="center" prop="depId">
        <template slot-scope="scope">
          <span v-if="scope.row.hsFamilyMember && scope.row.hsFamilyMember.sysDept2">{{
              scope.row.hsFamilyMember.sysDept2.deptName
            }}/</span>
          <span
            v-if="scope.row.hsFamilyMember&& scope.row.hsFamilyMember.sysDept"
          >{{ scope.row.hsFamilyMember.sysDept.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请修改为社区/网格" align="center" prop="depId">
        <template slot-scope="scope">
          <span v-if="scope.row.hsFamilyMember && scope.row.hsFamilyMember.sysDept2">{{
              scope.row.hsFamilyMember.sysDept2.deptName
            }}/</span>
          <span
            v-if="scope.row.hsFamilyMember&& scope.row.hsFamilyMember.sysDept"
          >{{ scope.row.hsFamilyMember.sysDept.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="idNumber" />
      <el-table-column label="联系电话" align="center" prop="phone"/>
      <el-table-column label="申请时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="depId">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.permit_audit" :value="scope.row.state"/>
        </template>
      </el-table-column>
      <!-- <el-table-column label="性别" align="center" prop="phone" width="50">
        <template slot-scope="scope">
          {{ scope.row.sex != null ? scope.row.sex === 0 ? '男' : '女' : '未知' }}
        </template>
      </el-table-column>
      <el-table-column label="生日" align="center" prop="birthday" />
      <el-table-column label="身份证号" align="center" prop="idNumber" />
      <el-table-column label="社区网格" align="center" prop="depId">
        <template slot-scope="scope">
          <span v-if="scope.row.hsFamilyMember && scope.row.hsFamilyMember.sysDept2">{{
              scope.row.hsFamilyMember.sysDept2.deptName
            }}/</span>
          <span
            v-if="scope.row.hsFamilyMember&& scope.row.hsFamilyMember.sysDept"
          >{{ scope.row.hsFamilyMember.sysDept.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="现居住地址" align="center" prop="addr"/> -->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <!--<el-button-->
          <!--v-if="scope.row.state==='0'"-->
          <!--size="mini"-->
          <!--type="text"-->
          <!--@click="handleAudit(scope.row)"-->
          <!--&gt;审核通过</el-button>-->
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row,'query')"
            v-hasPermi="['permit:apply:query']"
          >查看
          </el-button>
          <el-button
            v-if="scope.row.state==='0'"
            size="mini"
            type="text"
            @click="handleUpdate(scope.row,'update')"
            v-hasPermi="['permit:apply:auditOne']"
          >审核
          </el-button>
          <!-- <el-button
            v-if="scope.row.state==='0'"
            size="mini"
            type="text"
            @click="handleUpdateUser(scope.row.userId)"
            v-hasPermi="['permit:apply:updateUser']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['permit:apply:remove']"
          >删除
          </el-button> -->
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
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-descriptions class="margin-top" title="用户数据" :column="3" :size="size" border
                         v-if="formAuit && JSON.stringify(formAuit) !== '{}'"
        >
          <!-- <template slot="extra">
            <el-button type="primary" @click="handleUpdateUser(formAuit.hsFamilyMember.id)" size="small">修改用户信息
            </el-button>
          </template> -->
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              姓名
            </template>
            {{ formAuit.hsFamilyMember.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              手机号
            </template>
            {{ formAuit.hsFamilyMember.phone }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i v-if="formAuit.hsFamilyMember.sex!=null && formAuit.hsFamilyMember.sex == 0 " class="el-icon-male"></i>
              <i v-if="formAuit.hsFamilyMember.sex!=null && formAuit.hsFamilyMember.sex == 1 "
                 class="el-icon-female"
              ></i>
              性别
            </template>
            {{ formAuit.hsFamilyMember.sex != null ? formAuit.hsFamilyMember.sex === 0 ? '男' : '女' : '未知' }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              民族
            </template>
            <dict-tag :options="dict.type.nation" :value="formAuit.hsFamilyMember.nation"/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-potato-strips"></i>
              生日
            </template>
            {{ formAuit.hsFamilyMember.birthday }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-postcard"></i>
              身份证号码
            </template>
            {{ formAuit.hsFamilyMember.idNumber }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              社区网格
            </template>
            {{ formAuit.hsFamilyMember.companyName }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              户籍地址
            </template>
            {{ formAuit.hsFamilyMember.registerAddr }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              现居住地址
            </template>
            {{ formAuit.hsFamilyMember.addr1 }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="margin-top" style="margin-top: 30px" title="申请信息" :column="3" :size="size" border
                         v-if="form && JSON.stringify(form) !== '{}'"
        >

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              姓名
            </template>
            <el-input v-if="!defaultOrUpdate" v-model="form.name" placeholder="请输入姓名"/>
            <span v-if="defaultOrUpdate">{{ form.name }}</span>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i v-if="form.sex!=null && form.sex == 0 " class="el-icon-male"></i>
              <i v-if="form.sex!=null && form.sex == 1 " class="el-icon-female"></i>
              性别
            </template>
            <el-select v-if="!defaultOrUpdate" v-model="form.sex" placeholder="请选择性别">
              <el-option
                v-for="dict in dict.type.sys_user_sex"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
            <span v-if="defaultOrUpdate">{{ form.sex != null ? form.sex == 0 ? '男' : '女' : '未知' }}</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              民族
            </template>
            <el-select v-if="!defaultOrUpdate" v-model="form.nation" placeholder="请选择民族">
              <el-option
                v-for="dict in dict.type.nation"
                :key="dict.value"
                :label="dict.label"
                :value="parseInt(dict.value)"
              ></el-option>
            </el-select>
            <span v-if="defaultOrUpdate"><dict-tag :options="dict.type.nation" :value="form.nation"/></span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-potato-strips"></i>
              生日
            </template>
            <el-date-picker v-if="!defaultOrUpdate" clearable
              v-model="form.birthday"
              type="date"
              value-format="yyyy-MM-dd"
              format = 'yyyy-MM-dd'
              placeholder="选择生日"
            >
            </el-date-picker>
            <span v-if="defaultOrUpdate">{{ form.birthday }}</span>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              手机号
            </template>
            <el-input v-if="!defaultOrUpdate" v-model="form.phone" placeholder="请输入手机号"/>
            <span v-if="defaultOrUpdate">{{ form.phone }}</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-postcard"></i>
              身份证号码
            </template>
            <el-input v-if="!defaultOrUpdate" v-model="form.idNumber" placeholder="请输入户主身份证号"/>
            <span v-if="defaultOrUpdate">{{ form.idNumber }}</span>
          </el-descriptions-item>
          <!-- <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-picture-outline"></i>
              身份证正面
            </template>
            <el-image
              style="width:200px; height: 100px"
              fit="cover"
              :src="form.frontImg"
              :preview-src-list="srcList"
            >
            </el-image>
          </el-descriptions-item> -->
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              户籍地址
            </template>
            <el-input v-if="!defaultOrUpdate" v-model="form.registerAddr" type="textarea" placeholder="请输入户籍地址"/>
            <span v-if="defaultOrUpdate">{{ form.registerAddr }}</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              现居住地址
            </template>
            <el-input v-if="!defaultOrUpdate" v-model="form.addr" type="textarea" placeholder="请输入现居住地址"/>
            <span v-if="defaultOrUpdate">{{ form.addr }}</span>
          </el-descriptions-item>
          <!-- <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-picture-outline"></i>
              身份证反面
            </template>
            <el-image
              style="width:200px; height: 100px"
              fit="cover"
              :src="form.reverseImg"
              :preview-src-list="srcList"
            >
            </el-image>
          </el-descriptions-item> -->
        </el-descriptions>
        <el-form-item label="审核状态" prop="state" v-if="title==='审核数据'">
          <el-radio-group v-model="form.state">
            <el-radio label="1">同意</el-radio>
            <el-radio label="2">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="驳回原因" prop="reject" v-if="form.state==='2'">
          <el-input v-model="form.reject" type="textarea" placeholder="请输入内容"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" v-if="title==='审核数据'">确 定</el-button>
        <el-button type="primary" @click="updateForm" v-if="!defaultOrUpdate">保 存</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="titleUser" :visible.sync="openUser" width="1000px" append-to-body>
      <el-form ref="formUser" :model="formUser" :rules="rulesUser" label-width="100px">

        <el-row>
          <el-col :span="8">
            <el-form-item label="头像">
              <imageUpload v-model="formUser.headUrl" :limit="1" :isShowTip="false"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证正面">
              <imageUpload v-model="formUser.frontImg" :limit="1" :isShowTip="false"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="身份证反面">
              <imageUpload v-model="formUser.reverseImg" :limit="1" :isShowTip="false"/>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="社区/网格" prop="companyId">
              <el-select v-model="formUser.companyName" placeholder="请选择村社区">
                <el-option :value="formUser.companyId" :label="formUser.companyName"
                           style="width: 260px;height:200px;overflow: auto;background-color:#fff"
                >
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
            <el-form-item label="核酸码" prop="hsCode">
              <el-input v-model="formUser.hsCode" placeholder="请输入核酸码"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="核酸状态" prop="hsState">
              <el-select v-model="formUser.hsState" placeholder="请选择核酸状态" clearable size="small">
                <el-option
                  v-for="state in this.hsState3"
                  :key="state.value"
                  :label="state.label"
                  :value="state.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="身份证号" prop="idNumber">
              <el-input v-model="formUser.idNumber" placeholder="请输入身份证号"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="formUser.name" placeholder="请输入姓名"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别" prop="sex">
              <el-select v-model="formUser.sex" placeholder="请选择性别">
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
                              v-model="formUser.birthday"
                              type="date"
                              value-format="yyyy-MM-dd"
                              format = 'yyyy-MM-dd'
                              placeholder="选择生日"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="formUser.phone" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="民族" prop="nation">
              <el-select v-model="formUser.nation" placeholder="请选择民族">
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
              <el-input v-model="formUser.vaccineCnt" placeholder="请输入接种疫苗次数">
                <template slot="append">次</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="户主姓名" prop="hohName">
              <el-input v-model="formUser.hohName" placeholder="请输入户主姓名"/>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="户主身份证" prop="hohIdNumber">
              <el-input v-model="formUser.hohIdNumber" placeholder="请输入户主身份证号"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="紧急联系人1" prop="ec1Name">
              <el-input v-model="formUser.ec1Name" placeholder="请输入紧急联系人1"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="ec1Phone">
              <el-input v-model="formUser.ec1Phone" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="与户主关系" prop="hohRelationship">
              <el-select v-model="formUser.hohRelationship" placeholder="请选择与户主关系">
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
              <el-input v-model="formUser.ec2Name" placeholder="请输入紧急联系人2"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="联系电话" prop="ec2Phone">
              <el-input v-model="formUser.ec2Phone" placeholder="请输入联系电话"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="12">
            <el-form-item label="监测点地址" prop="addr2">
              <el-input v-model="formUser.addr2" type="textarea" placeholder="请输入监测点地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现居住地址" prop="addr1">
              <el-input v-model="formUser.addr1" type="textarea" placeholder="请输入现居住地址"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="户籍地址" prop="registerAddr">
              <el-input v-model="formUser.registerAddr" type="textarea" placeholder="请输入户籍地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="description">
              <el-input v-model="formUser.description" type="textarea" placeholder="请输入内容"/>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormUser">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from '@/api/system/dept'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { listApply, getApply, delApply, addApply, updateApply, audit, audits, rejecteds } from '@/api/permit/apply'
import { getTree, getUserTree } from '@/api/hs/comparison'
import {
  getMember,
  updateMember
} from '@/api/hs/member'

export default {
  name: 'Apply',
  dicts: ['permit_audit', 'sys_user_sex', 'nation', 'hoh_relationship'],
  components: { Treeselect },
  data() {
    return {
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
        createTime: null,
        state: null,
        companyIds: null,
        companyId: null,
        companyName: null,
        orderByColumn: 'createTime',
        isAsc: 'desc'
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
      // 表单校验
      rulesUser: {
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        companyId: [
          { required: true, message: '村社区不能为空', trigger: 'blur' }
        ]
      },
      companyList: [],

      treeOptions: [],
      options: [],
      // 表单校验
      rules: {
        reject: [
          { required: true, message: '驳回原因不能为空', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请选择审核状态', trigger: 'change' }
        ]
      },
      isAdmin: false
    }
  },
  created() {
    this.getList()
    this.getUserTree()
    // listDept().then(response => {
    //   this.deptOptions = this.handleTree(response.data, 'deptId')
    // })
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

    /** 查询申请记录 列表 */
    getList() {
      this.loading = true
      this.queryParams.params = {}
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.params['beginCreateTime'] = this.daterangeCreateTime[0]
        this.queryParams.params['endCreateTime'] = this.daterangeCreateTime[1]
      }

      if (this.queryParams.companyName!=null && this.queryParams.companyName!=''&& this.queryParams.companyIds != null && this.queryParams.companyIds.length > 0) {
        this.queryParams.params['depId'] = this.queryParams.companyIds[this.queryParams.companyIds.length-1]
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
        reverseImg: null
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
      this.queryParams.companyIds = null
      this.queryParams.companyName = null
      this.daterangeCreateTime = []
      this.resetForm('queryForm')
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
    /** 修改按钮操作 */
    handleUpdateUser(id) {
      this.resetUser()
      getMember(id).then(response => {
        this.formUser = response.data
        this.openUser = true
        this.titleUser = '修改用户'
      })
    },

    /** 修改按钮操作 */
    handleUpdate(row, type) {
      this.reset()
      this.formAuit = row
      console.log(row)
      const id = row.id || this.ids
      getApply(id).then(response => {
        this.form = response.data
        this.srcList.push(this.form.frontImg)
        this.srcList.push(this.form.reverseImg)
        console.log(this.form)
        this.open = true
        if (type === 'update') {
          this.title = '审核数据'
          this.form.state = ''
          this.defaultOrUpdate = true;
        } else {
          this.title = '查看信息';
          this.defaultOrUpdate = false;
        }

      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            if (this.form.state === '1') {
              audit(this.form).then(response => {
                this.$modal.msgSuccess('审核成功')
                this.open = false
                this.getList()
              })
            } else {
              updateApply(this.form).then(response => {
                this.$modal.msgSuccess('驳回成功')
                this.open = false
                this.getList()
              })
            }

          }
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids
      this.$modal.confirm('是否确认删除申请记录 编号为"' + ids + '"的数据项？').then(function() {
        return delApply(ids)
      }).then(() => {
        this.getList()
        this.$modal.msgSuccess('删除成功')
      }).catch(() => {
      })
    },

    /** 批量审核 */
    handleAudits(row) {
      const ids = row.id || this.ids
      var that = this

      this.$confirm('是否确认审核通过  编号为"' + ids + '"的数据项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.loading = true
        audits(ids).then(response => {
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
      }).then(({ value }) => {
        const ids = row.id || that.ids

        that.$confirm('是否确认审核驳回  编号为"' + ids + '"的数据项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.loading = true
          rejecteds({
            ids: ids,
            reject: value
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
          if (!this.formUser.hsCode && !this.formUser.idNumber) {
            this.$modal.msgError('身份证号、核酸码请选择一项输入！')
            return false
          }
          if (!this.formUser.hsCode && this.formUser.idNumber) {
            this.formUser.hsCode = this.formUser.idNumber
          }
          if (this.formUser.id != null) {
            updateMember(this.formUser).then(response => {
              this.$modal.msgSuccess('修改成功')
              this.getList()
              this.openUser = false
            })
          }
        }
      })
    },

    handleNodeClick1(val) {
      this.formUser.companyId = val.id
      var companyName =  this.getHierarchyData(this.treeOptions,[val.id],val.label)
      console.log(companyName)
      this.formUser.companyName = companyName.toString().replaceAll(',','/')
    },
    handleAudit(row) {
      this.titleAuit = '申请信息'
      this.openAuit = true
      this.formAuit = row
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('permit/apply/export', {
        ...this.queryParams
      }, `apply_${new Date().getTime()}.xlsx`)
    }
  }
}
</script>
