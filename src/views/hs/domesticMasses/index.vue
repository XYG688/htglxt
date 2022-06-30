<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
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
      <el-form-item label="人员类型" prop="userProfession">
        <el-select v-model="queryParams.userProfession" placeholder="请选择人员类型" clearable size="small">
          <el-option
            v-for="dict in dict.type.user_profession"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value*1"
          />
        </el-select>
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
      <el-form-item label="是否进入东兴" prop="enterState">
        <el-select v-model="queryParams.enterState" placeholder="请选择是否进入东兴" clearable size="small">
          <el-option
            v-for="dict in dict.type.is_enter"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value*1"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="网格证状态" prop="userState">
        <el-select v-model="queryParams.userState" placeholder="请选择网格证状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.permit_state"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value*1"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="permitAudit">
        <el-select v-model="queryParams.permitAudit" placeholder="请选择审核状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.permit_audit"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value*1"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="报备证状态" prop="permitAudit">
        <el-select v-model="queryParams.valid" placeholder="请选择报备证状态" clearable size="small">
          <el-option
            v-for="dict in dict.type.valid_report"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value*1"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="来源地" prop="originAddr">
        <el-select v-model="queryParams.originAddr" placeholder="请选择来源地" size="small" clearable @clear="clearCompany">
          <el-option :value="queryParams.originAddrId" :label="queryParams.originAddr"
                     style="height:200px;overflow: auto;background-color:#fff">
            <el-tree
              v-if="originTreeList.length > 0"
              :data="originTreeList"
              :props="provinceProps"
              @node-click="queryhandleNodeClick1"
            ></el-tree>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间类型" prop="dateType">
        <el-select v-model="queryParams.dateType" placeholder="请选择时间类型"  size="small">
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
      <el-form-item style="margin-left:10px">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">

      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          size="mini"
          icon="el-icon-delete"
          :disabled="multiple"
          v-hasPermi="['permit:domesticMasses:remove']"
          @click="handleArrDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          :disabled="multiple"
          @click="handleAudit"
          v-hasPermi="['permit:domesticMasses:audit']"
        >一键审核
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          size="mini"
          :disabled="multiple"
          @click="handleReject"
          v-hasPermi="['permit:domesticMasses:reject']"
        >一键驳回
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          size="mini"
          icon="el-icon-download"
          @click="handleExport"
          v-hasPermi="['permit:domesticMasses:export']"
        >导出
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          size="mini"
          @click="handleSet"
          v-hasPermi="['permit:domesticMasses:set']"
        >设置
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-table v-loading="loading" :data="driverList" @selection-change="selectionChangeHandle" class="masterTable">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="序号" align="center" type="index" width="80"/>
      <el-table-column label="姓名" align="center" prop="name"/>
      <el-table-column label="手机号" align="center" prop="phone"/>
      <el-table-column label="社区/网格" align="center" prop="companyName"/>
      <!-- <el-table-column label="人员类型" align="center" prop="userProfession">
         <template slot-scope="scope">
           <dict-tag :options="dict.type.user_profession" :value="scope.row.userProfession"/>
        </template>
     </el-table-column> -->
      <el-table-column label="预计进东兴时间" align="center" width="180">
        <template slot-scope="scope">
          {{ parseTime(scope.row.enterDate, "{y}-{m}-{d}") }}
        </template>
      </el-table-column>
      <el-table-column label="来源地" align="center" prop="originAddr">
      </el-table-column>
      <el-table-column label="目的地地址" align="center" prop="destAddr">
      </el-table-column>
      <el-table-column label="来东兴目的" align="center" prop="enterPurpose">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.user_profession" :value="scope.row.enterPurpose"/>
        </template>
      </el-table-column>
      <el-table-column label="48小时核酸证明" align="center" prop="hsUrl">
        <template slot-scope="scope">
          <div style="display: flex;align-items: center;justify-content: center">
            <el-image
              style="width: 80px; height: 80px"
              :src="scope.row.hsUrl"
              fit="cover"
              :preview-src-list="[scope.row.hsUrl,scope.row.healthUrl,scope.row.routeUrl,scope.row.otherUrl]">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="健康码" align="center" prop="healthUrl">
        <template slot-scope="scope">
          <div style="display: flex;align-items: center;justify-content: center">
            <el-image
              style="width: 80px; height: 80px"
              :src="scope.row.healthUrl"
              fit="cover"
              :preview-src-list="[scope.row.hsUrl,scope.row.healthUrl,scope.row.routeUrl,scope.row.otherUrl]">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="行程卡" align="center" prop="routeUrl">
        <template slot-scope="scope">
          <div style="display: flex;align-items: center;justify-content: center">
            <el-image
              style="width: 80px; height: 80px"
              :src="scope.row.routeUrl"
              fit="cover"
              :preview-src-list="[scope.row.hsUrl,scope.row.healthUrl,scope.row.routeUrl,scope.row.otherUrl]">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="其他" align="center" prop="otherUrl">
        <template slot-scope="scope">
          <div style="display: flex;align-items: center;justify-content: center" v-if="scope.row.otherUrl">
            <el-image
              style="width: 80px; height: 80px"
              :src="scope.row.otherUrl"
              fit="cover"
              :preview-src-list="[scope.row.hsUrl,scope.row.healthUrl,scope.row.routeUrl,scope.row.otherUrl]">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="是否进入东兴" align="center" prop="enterState">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.is_enter" :value="scope.row.enterState"/>
        </template>
      </el-table-column>
      <el-table-column label="扫码时间" align="center" prop="createTime">
        <template slot-scope="scope">
          {{ scope.row.scanTime }}
        </template>
      </el-table-column>
      <el-table-column label="网格证状态" align="center" prop="userState">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.permit_state" :value="scope.row.userState"/>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.permit_audit" :value="scope.row.permitAudit"/>
        </template>
      </el-table-column>
      <el-table-column label="报备证状态" align="center">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.valid_report" :value="scope.row.valid"/>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" prop="createTime">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="审核人" align="center" prop="verifyName"/>
      <el-table-column label="审核时间" align="center" prop="verifyTime">
        <template slot-scope="scope">
          {{ scope.row.verifyTime }}
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleAdd(scope.row,'default')"
          >查看
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleAdd(scope.row)"
            v-show="scope.row.permitAudit === 0"
            v-hasPermi="['permit:domesticMasses:edit']"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleArrDelete(scope.row)"
            v-hasPermi="['permit:domesticMasses:remove']"
          >删除
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleExamine(scope.row)"
            v-show="scope.row.permitAudit === 0"
            v-hasPermi="['permit:domesticMasses:audit']"
          >审核
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
    <div class="other">
      <async-modal :dialogVisible="dialogVisible" :title="modalTitle" @closeDialog="closeDialog" :width="'1300px'"
                   :isShowScroll="true">
        <el-form :model="driverForm" ref="queryForm" :inline="true" v-show="showSearch" label-width="260px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="driverForm.name" class="formWidth" disabled/>
              </el-form-item>
              <el-form-item label="证件类型" prop="documentType">
                <el-select v-model="driverForm['documentType']" placeholder="请选择证件类型" clearable size="small"
                           style="width:320px" disabled>
                  <el-option
                    v-for="dict in dict.type.document_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value*1"
                  />
                </el-select>
              </el-form-item>

              <el-form-item label="预计进东兴时间" prop="enterDate">
                <el-date-picker v-model="driverForm['userReport'] && driverForm['userReport'].enterDate" type="date"
                                value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd" placeholder="预计进东兴时间"
                                class="formWidth"
                                style="width:320px" :disabled="editFlag === 0"></el-date-picker>
              </el-form-item>

              <el-form-item label="进东兴后目的地" prop="destAddr">
                <el-input v-model="driverForm.destAddr" type="textarea"
                          :rows="2" class="formWidth" :disabled="editFlag === 0"/>
              </el-form-item>
              <el-form-item label="详细地址" prop="destAddrDetail">
                <el-input v-model="driverForm.destAddrDetail" class="formWidth" :disabled="editFlag === 0"/>
              </el-form-item>
              <el-form-item label="14天内是否有国内中高风险地区旅居史" prop="highRisk">
                <el-select v-model="driverForm['highRisk']" placeholder="请选择" class="formWidth" style="width:320px"
                           :disabled="editFlag === 0">
                  <el-option
                    v-for="item in options1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="当前体温状况" prop="tempNormal">
                <el-select v-model="driverForm['tempNormal']" placeholder="请选择" class="formWidth" style="width:320px"
                           :disabled="editFlag === 0">
                  <el-option
                    v-for="item in tempNormalOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="目的地社区网格" prop="companyId">
                <el-select v-model="driverForm.companyName" placeholder="请选择村社区" style="width:320px"
                           :disabled="editFlag === 0">
                  <el-option :value="driverForm.companyId" :label="driverForm.companyName"
                             style="width: 260px;height:200px;overflow: auto;background-color:#fff">
                    <el-tree
                      v-if="treeOptions.length > 0"
                      :data="treeOptions"
                      :props="defaultProps"
                      @node-click="handleNodeClick1"
                    ></el-tree>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="driverForm.phone" class="formWidth" disabled/>
              </el-form-item>
              <el-form-item label="证件号码" prop="idNumber">
                <el-input v-model="driverForm.idNumber" class="formWidth" disabled/>
              </el-form-item>
              <el-form-item label="来源地" prop="originAddr">
                <el-input v-model="driverForm.originAddr" class="formWidth" disabled/>
              </el-form-item>
              <el-form-item label="进东兴交通方式" prop="transportation">
                <el-select v-model="driverForm['transportation']" placeholder="请选择交通方式" clearable size="small"
                           :disabled="editFlag === 0">
                  <el-option
                    v-for="dict in dict.type.user_transportation"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value*1"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="航班(车次/车牌号)" prop="originAddr">
                <el-input v-model="driverForm.flight" class="formWidth" disabled/>
              </el-form-item>
              <el-form-item label="来东兴目的" prop="enterPurpose">
                <el-select v-model="driverForm['enterPurpose']" placeholder="请选择来东兴目的" clearable size="small"
                           :disabled="editFlag === 0">
                  <el-option
                    v-for="dict in dict.type.user_profession"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value*1"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="是否进入东兴" prop="enterState">
                <el-select v-model="driverForm['userReport'] && driverForm['userReport'].enterState"
                           placeholder="请选择是否进入东兴" class="formWidth" style="width:320px" :disabled="editFlag === 0">
                  <el-option
                    v-for="dict in dict.type.is_enter"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value*1"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="是否需要隔离" prop="">
                <el-select v-model="driverForm['userReport'] && driverForm['userReport'].iso" placeholder="请选择"
                           class="formWidth" style="width:320px" :disabled="editFlag === 0">
                  <el-option
                    v-for="item in options1"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-select v-model="driverForm['userReport'] && driverForm['userReport'].isoType" placeholder="请选择隔离方式"
                           class="displayIn" style="width:260px" :disabled="editFlag === 0 "
                           v-show="driverForm['userReport'] && driverForm['userReport'].iso === true">
                  <el-option
                    v-for="dict in dict.type.iso_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value*1"
                  />
                </el-select>
                <el-select v-model="driverForm['userReport'] && driverForm['userReport'].isoSPId" filterable
                           allow-create default-first-option :filter-method="filterMethodThrottle"
                           @blur="inputOperationValueSel" class="displayIn" style="margin-left:10px;width:325px"
                           :disabled="editFlag === 0" v-show="isShowSelect">
                  <el-option v-for="item in businessList" :key="item.isoSPId" :label="item.isoSPName"
                             :value="item.isoSPId">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10.8">
              <el-form-item label="网格证状态" prop="userState">
                <el-select v-model="driverForm['userReport'] && driverForm['userReport'].userState" placeholder="状态"
                           clearable size="small" style="width:320px" :disabled="editFlag === 0">
                  <el-option
                    v-for="dict in dict.type.permit_state"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value*1"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12.2">
              <el-date-picker v-model="driverForm['userReport'] && driverForm['userReport'].isoStartDate"
                              placeholder="开始时间" style="width:260px;margin-left:14px" type="date"
                              value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                              :disabled="editFlag === 0"></el-date-picker>
              <el-date-picker v-model="driverForm['userReport'] && driverForm['userReport'].isoEndDate"
                              placeholder="结束时间" style="margin-left:11px;width:195px"
                              @change="jsTime(driverForm['userReport'].isoStartDate,driverForm['userReport'].isoEndDate)"
                              type="date" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd"
                              :disabled="editFlag === 0"></el-date-picker>
              <el-input v-model="day" placeholder="" class="displayS" style="width:120px" disabled></el-input>
            </el-col>
          </el-row>
        </el-form>
        <div class="bothSides"></div>
        <el-form :model="driverForm" ref="queryForm" :inline="true" v-show="showSearch" label-width="" class="mt30">
          <el-row>
            <el-col :span="24">
              <el-form-item label="48小时核酸证明" class="form_height">
                <userInfoImageUpload v-if="imageUploadData"
                                     v-model="driverForm['userReport'] && driverForm['userReport'].hsUrl" :limit='1'
                                     :isShowTip="false" :imageUploadData='imageUploadData' :disabled="editFlag === 0"/>
              </el-form-item>
              <el-form-item label="行程卡" class="form_height">
                <userInfoImageUpload v-if="imageUploadData"
                                     v-model="driverForm['userReport'] && driverForm['userReport'].routeUrl" :limit='1'
                                     :isShowTip="false" :imageUploadData='imageUploadData' :disabled="editFlag === 0"/>
              </el-form-item>
              <el-form-item label="健康码" class="form_height">
                <userInfoImageUpload v-if="imageUploadData"
                                     v-model="driverForm['userReport'] && driverForm['userReport'].healthUrl" :limit='1'
                                     :isShowTip="false" :imageUploadData='imageUploadData' :disabled="editFlag === 0"/>
              </el-form-item>
              <el-form-item label="其他" class="form_height">
                <userInfoImageUpload v-if="imageUploadData"
                                     v-model="driverForm['userReport'] && driverForm['userReport'].otherUrl" :limit='1'
                                     :isShowTip="false" :imageUploadData='imageUploadData' :disabled="editFlag === 0"/>
              </el-form-item>
            </el-col>
            <el-col :span="16" v-if="driverForm['userReport'] && driverForm['userReport'].permitAudit===2 ">
              <el-form-item label="驳回原因" prop="rejectReason">
                <el-input type="textarea" :disabled="true" :autosize="{ minRows: 3, maxRows: 10}" placeholder="请输入驳回原因"
                          v-model="driverForm['userReport'].rejectReason" style="width:700px">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-form :model="passForm" ref="passForm" :inline="true" label-width="" class="mt30" :rules="rules"
                 v-if="isShowRadio">
          <el-row>
            <el-col :span="24">
              <el-form-item label="审核状态" prop="pass">
                <el-radio-group v-model="passForm.pass">
                  <el-radio :label="true">同意</el-radio>
                  <el-radio :label="false">驳回</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="快捷回复"  v-if="passForm.pass === false " >
                <el-select v-model="passForm.rejectReason_type"   @change="rejectReasonChange" placeholder="请选择或输入搜索" clearable >
                  <el-option
                    v-for="dict in dict.type.dismiss_content"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="驳回原因" v-if="passForm.pass === false " prop="rejectReason">
                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" placeholder="请输入驳回原因"
                          v-model="passForm.rejectReason" style="width:700px">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <template slot="footerBar">
          <el-button v-if="type=='default'" type="primary" @click="closeDialog()">确定</el-button>
          <el-button v-else type="primary" @click="saveForm()">保存</el-button>
          <el-button @click="closeDialog()">取消</el-button>
        </template>
      </async-modal>
    </div>
    <el-dialog title="驳回内容" :visible.sync="rejectViewDialog" >
      <el-form :model="rejectForm" ref="rejectForm" :inline="true" label-width="100px" :rules="rules">
        <el-row>
          <el-col :span="24">
            <el-form-item label="快捷回复">
              <el-select v-model="rejectForm.rejectReason_type" @change="rejectReasonChange" placeholder="请选择或输入搜索"
                         clearable>
                <el-option
                  v-for="dict in dict.type.dismiss_content"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="驳回原因" prop="rejectReason">
              <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 10}" placeholder="请输入驳回原因"
                        v-model="rejectForm.rejectReason" style="width:700px">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitReject">确 定</el-button>
        <el-button @click="rejectViewDialog = false">取 消</el-button>
      </div>
    </el-dialog>



    <!-- 添加或修改自动审核设置对话框 -->
    <el-dialog title="自动审核设置" :visible.sync="handleSetOpen" width="500px" append-to-body>
      <el-form ref="form" :model="reportSetForm" :rules="rules" label-width="80px">
        <el-form-item label="自动审核" prop="autoAudit">
          <el-switch
            v-model="reportSetForm.autoAudit"
            active-text="开启"
            inactive-text="关闭"
            active-value="1"
            inactive-value="2">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormreportSet">确 定</el-button>
        <el-button @click="handleSetOpen=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
  getMasses, saveMasses, massesDetail, massesDel, batchAuditl, getGrid
} from "@/api/masses/masses";
import {
  cascadeQuery
} from "@/api/driver/driver";
import {getBusinessList} from '@/api/hs/businessManage.js'
import {getTree, getUserTree} from '@/api/hs/comparison'

const AsyncModal = () => import( '../truckDriver/AsyncModal')
const asyncSelector = () => import( '../truckDriver/asyncSelector')
import userInfoImageUpload from '@/components/userInfoImageUpload'
import {getImageToken, updateUserCompany} from "@/api/hs/manageMember"
import {isEmpty, isArray} from '../../../utils/util.js'
import axios from 'axios'
import {getSet,updateSet} from "@/api/reportSet/reportSet";

export default {
  name: 'Apply',
  dicts: ['iso_type', 'is_enter', 'user_transportation', 'goods_type', 'driver_type', 'permit_audit', 'sys_user_sex',
    'nation', 'hoh_relationship', 'permit_state', 'sys_sos', 'apply_head_state', 'user_type', 'user_profession',
    'residence_type', 'user_census', 'document_type','dismiss_content','valid_report'],
  data() {
    return {
      handleSetOpen:false,
      reportSetForm:{
        id:null,
        reportType:null,
        autoAudit:null,
      },
      rejectViewDialog: false,
      //审核状态
      rejectForm: {
        ids: null,
        pass: false,
        rejectReason: '',
        rejectReason_type: ''
      },
      //司机列表
      driverList: [],
      dateTypeList: [{
        value: '1',
        label: '申请时间'
      },
        {
          value: '2',
          label: '预计进东兴时间'
        },
        {
          value: '3',
          label: '审核时间'
        },
        {
          value: '4',
          label: '扫码时间'
        }],
      size: 'medium',
      rejectReason_type:null,
      // 遮罩层
      loading: true,
      total: 0,
      // 显示搜索条件
      showSearch: true,
      // 非多个禁用
      multiple: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dateType:'1',
        name: null,
        phone: null,
        enterState: null,
        userState: null,
        permitAudit: null,
        companyIds: null,
        companyId: null,
        companyName: null,
        userProfession: null,
        originAddr: null
      },
      //新增弹框标题
      modalTitle: '',
      //弹框默认值为关闭
      dialogVisible: false,
      //新增弹框对象
      driverForm: {},
      //默认新增(不禁用)
      editFlag: 1,
      imageUploadData: null,
      //下拉框是和否选项
      options1: [{id: true, name: '是'}, {id: false, name: '否'}],
      tempNormalOptions: [{id: true, name: '正常'}, {id: false, name: '异常且超过37.3℃'}],
      //初始化隔离天数
      day: null,
      //商区数组
      businessList: [],
      //商区搜索条件
      operationValueSel: '',
      //选中列表中的数据
      selectedData: [],
      //审核状态
      passForm: {
        pass:null,
        rejectReason:'',
        rejectReason_type:''
      },
      //社区网格
      treeOptions: [],
      defaultProps: {},
      options: [],
      isShowRadio: false,
      daterangeCreateTime: [],
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
      fileViewDialog: false,
      dialogImageUrl: '',
      bigImg: '',
      isShowSelect: false,
      originPlace: [],
      //存储加载的数据
      provinceList: [],
      provinceProps: {
        value: "id",
        children: "children",
        label: "label",
        //添加这个可以选择每一层级，不添加这个只能选择最后一级
        checkStrictly: false,
        // multiple：true 设置多选
      },


      originTreeList: [],
      // 表单校验
      rules: {
        rejectReason: [
          {required: true, message: '驳回原因不能为空', trigger: 'blur'}
        ],
        pass: [
          {required: true, message: '请选择审核状态', trigger: 'change'}
        ]
      },
      type: null
    }
  },
  created() {
    this.getList()
    this.getUserTree()
    this.getQiniuToken()
    this.getPosition(null, () => {
    });
    axios.get('/region2.json').then(res => {
      this.originTreeList = res.data;
    })
  },
  computed: {
    // 防抖
    filterMethodThrottle() {
      var time = null
      return (param) => {
        if (time) {
          clearTimeout(time)
        }
        time = setTimeout(() => {
          this.getBusiness(param)
          clearTimeout(time)
        }, 2000)
      }
    }
  },
  methods: {

    // 地区联动获取数据
    getPosition(val, cb) {
      let vm = this; //查询省市县
      //我们这查询省级数据要传取参数pid:0
      let params = {pid: '0'};
      if (!val) {
        //初始化加载 获取所有省份数据
        params = {pid: '0'};
      } else if (val.length === 1) {
        //加载二级  获取市级数据
        params = {pid: val[0]};
      } else {
        //加载3级   获取县级数据
        params = {pid: val[1]};
      }
      //请求后台数据
      cascadeQuery(params).then((res) => {
        if (!val) {
          //初始化加载   查询省份数据
          vm.provinceList = res.data.map((e) => {
            return {
              value: e.id,
              label: e.extName,
              cities: [],
            };
          });

        } else if (val.length === 1) {
          //加载二级    查询该省下市级数据
          vm.provinceList.map((item) => {
            if (item.value === val[0]) {
              item.cities = res.data.map((e) => {
                return {value: e.id, label: e.extName, cities: []};
              });

            }
          });
        } else {
          //加载3级   查询该省市下县级数据
          vm.provinceList.map((item) => {
            if (item.value === val[0]) {
              item.cities.map((value) => {
                if (value.value === val[1]) {
                  value.cities = res.data.map((e) => {
                    return {value: e.id, label: e.extName};

                  });
                }
              });
            }

          });

        }
        cb && cb(res);
      })
        .catch((err) => {
          console.log(err);
        });
    },
    // 一级二级改变的时候调取下一级数据
    handleItemChange(val) {

      this.getPosition(val);
    },
    getTreeName(list, id) {
      let _this = this
      for (let i = 0; i < list.length; i++) {
        let a = list[i]
        if (a.value === id) {
          return a.label
        } else {
          if (a.cities && a.cities.length > 0) {
            let res = _this.getTreeName(a.cities, id)
            if (res) {
              return res
            }
          }
        }
      }
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
      console.log(companyName)
      if (val.children) {
        var companyIds = this.getChildNodes(val)
        companyIds.push(val.id)
        this.queryParams.companyIds = companyIds
      } else {
        this.queryParams.companyIds = [val.id]
      }
    },
    getBusiness(param) {
      var params = {page: 1, requestState: 'AGREE', row: 10, spType: 1, spState: 'NORMAL', spName: param}
      getBusinessList(params).then(res => {
        const {code, data} = res
        if (code == 200 && data) {
          data.list.forEach((item) => {
            item.isoSPId = item.spId
            item.isoSPName = item.spName
          })
          this.businessList = data.list
        }
      })
    },
    handleNodeClick1(val) {
      this.driverForm.companyId = val.id
      var companyName = this.getHierarchyData(this.treeOptions, [val.id], val.label)
      this.driverForm.companyName = companyName.toString().replaceAll(',', '/')

    },
    //快捷回复
    rejectReasonChange(val) {
      var that = this
      console.log(val)
      if (val) {
        this.dict.type.dismiss_content.forEach(item => {
          console.log(item)
          if (val === item.value) {
            console.log(val === item.value)
            that.passForm.rejectReason = item.raw.remark
            that.rejectForm.rejectReason = item.raw.remark
          }
        })
      }
      this.$forceUpdate();
    },

    // 表单重置
    reset() {
      this.passForm = {
        pass:null,
        rejectReason:'',
        rejectReason_type:''
      }
      this.resetForm('passForm')
    },
    //列表审核
    handleExamine(row) {
      this.reset()
      this.type = 'update';
      this.modalTitle = '审核'
      this.dialogVisible = true
      this.massesDetail(row.urId, row)
      this.editFlag = 0
      this.dataId = row.urId
      this.isShowRadio = true
    },

    //批量驳回
    handleReject() {
      this.rejectViewDialog = true
      //审核状态
      this.rejectForm = {
        ids: null,
        pass: false,
        rejectReason: '',
        rejectReason_type: ''
      }
      this.resetForm('rejectForm')
    },
    submitReject(){
      let that = this;
      this.rejectForm.ids = that.selectedData
      that.$refs['rejectForm'].validate(valid => {
        if (valid) {
          that.$modal.confirm('是否确认删除申请记录 编号为"' + that.selectedData.join(',') + '"的数据项？').then(function () {
            return batchAuditl(that.rejectForm)
          }).then(() => {
            that.rejectViewDialog = false
            that.getList()
            that.selectedData = []
            that.$modal.msgSuccess('驳回成功')
          }).catch(() => {
          })
        }
      })
    },

    //批量审核
    handleAudit() {

      let that = this;
      that.$modal.confirm('是否确认审核编号为"' + that.selectedData.join(',') + '"的数据项？').then(function () {
        batchAuditl({pass: true, ids: that.selectedData}).then(response => {
          if (response.code !== 200) {
            return false;
          } else {
            that.selectedData = []
            that.getList()
          }
        })
      }).then(() => {
        that.selectedData = []
        that.getList()
        that.$modal.msgSuccess('审核成功')
      }).catch(() => {
      })
    },


    getQiniuToken() {
      getImageToken().then(res => {
        this.imageUploadData = {
          token: res.data
        }
      })
    },
    inputOperationValueSel(e) {
      this.operationValueSel = e.target.value;

    },
    dateMinus(date1) {
      var sdate = new Date(date1);
      var now = new Date();
      var days = now.getTime() - sdate.getTime();
      var day = parseInt(days / (1000 * 60 * 60 * 24));
      return day;
    },
    /** 查询国内群众列表 */
    getList() {
      this.loading = true
      if (null != this.daterangeCreateTime && '' != this.daterangeCreateTime) {
        this.queryParams.startTime = this.daterangeCreateTime[0]
        this.queryParams.endTime = this.daterangeCreateTime[1]
      } else {
        this.queryParams.startTime = null
        this.queryParams.endTime = null
      }
      getMasses(this.queryParams).then(response => {
        this.driverList = response.rows
        this.total = response.total
        this.loading = false

      }).catch(() => {
        this.loading = false
      })
    },
    //保存并修改
    saveForm() {
      let that = this;
      if (that.editFlag === 0) {
        that.$refs['passForm'].validate(valid => {
          if (valid) {
            var submitObj = {}
            if (!that.passForm.pass) {
              submitObj = {pass: that.passForm.pass, ids: [that.dataId], rejectReason: that.passForm.rejectReason}
            } else {
              submitObj = {pass: that.passForm.pass, ids: [that.dataId]}
            }
            batchAuditl(submitObj).then(response => {
              if (response.code !== 200) {
                return false;
              } else {
                that.$modal.msgSuccess('操作成功！')
                that.dialogVisible = false
                that.getList()
              }
            })
          }
        })

      } else {
        if (this.driverForm['userReport'] && this.driverForm['userReport'].iso === false) {
          this.driverForm['userReport'].isoType = null
          this.driverForm['userReport'].isoSPId = null
        }
        delete this.driverForm.urId
        saveMasses(this.driverForm).then(response => {
          if (response.code !== 200) {
            return false;
          } else {
            that.$modal.msgSuccess('修改成功！')
            this.dialogVisible = false
            this.getList()
          }
          this.loading = false

        }).catch(() => {
          this.loading = false
        })
      }

    },
    //列表转换布尔值
    parseTBoolean(val) {
      if (val) {
        return '是'
      } else {
        return '否'
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.originPlace = []
      this.daterangeCreateTime = []
      this.resetForm('queryForm')
      this.queryParams.companyIds = null
      this.queryParams.companyName = null
      this.handleQuery()
    },
    //关闭详情弹框
    closeDialog() {
      this.dialogVisible = false
    },
    // 多选框选中数据
    selectionChangeHandle(data) {
      this.selectedData = []
      data.forEach((item) => {
        this.selectedData.push(item.urId)
      })
      this.multiple = !data.length
    },
    /** 设置自动审核 */
    handleSet() {
      this.reportSetForm = {
        id:null,
        reportType:null,
        autoAudit:null,
      }
      this.resetForm('reportSetForm')
      getSet(1).then(res =>{
        this.handleSetOpen = true
        this.reportSetForm = res.data
      })
    },
    /** 设置自动审核 */
    submitFormreportSet(){
      updateSet(this.reportSetForm).then(response => {
        this.$modal.msgSuccess("修改成功");
        this.handleSetOpen = false;
      });
    },

    /** 删除按钮操作 */
    handleArrDelete(row) {

      let that = this;
      var delArr = []
      if (row.urId) {
        delArr.push(row.urId)
      } else {
        delArr = that.selectedData
      }
      that.$modal.confirm('是否确认删除编号为"' + delArr.join(',') + '"的数据项？').then(function () {
       return  massesDel(delArr)
      }).then(() => {
        that.selectedData = []
        that.getList()
        that.$modal.msgSuccess('删除成功')
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
        this.download('/ur/v2/domestic/list/export', {
          ...this.queryParams
        }, `国内群众报备列表_${new Date().getTime()}.xlsx`)
      }).catch(() => {

      })
    },
    /** 修改按钮操作 */
    handleAdd(row, type = "update") {
      this.type = type;
      this.dialogVisible = true
      this.massesDetail(row.urId, row)
      this.isShowRadio = false
      if (type == 'default') {
        this.editFlag = 0
        this.modalTitle = '查看'
      } else {
        this.editFlag = 1
        this.modalTitle = '修改'
      }
    },
    //获取详情
    massesDetail(id, row) {
      massesDetail({id: id}).then(response => {
        if (response.code !== 200) {
          return false;
        } else {
          this.driverForm = response.data
          if (this.driverForm['userReport'] && this.driverForm['userReport'].iso === false) {
            this.driverForm['userReport'].isoType = null
            this.driverForm['userReport'].isoSPId = null
          }
          this.driverForm['userReport'].userState = row.userState
          this.driverForm['name'] = row.name
          this.driverForm['idNumber'] = row.idNumber
          this.driverForm['documentType'] = row.documentType
          this.driverForm['phone'] = row.phone
          this.jsTime(this.driverForm['userReport'].isoStartDate, this.driverForm['userReport'].isoEndDate)
        }
        this.loading = false

      }).catch(() => {
        this.loading = false
      })
    },
    getStr(str) {
      return str ? str : ''
    },
    jsTime(beginTime, endTime) {
      var dayObj = {};
      var endNum = new Date(endTime).getTime()
      var startNum = new Date(beginTime).getTime()
      var dateDiff = endNum - startNum; //时间差的毫秒数
      this.day = Math.floor(dateDiff / (24 * 3600 * 1000)) + '天'; //计算出相差天数
      return this.day

    },
    queryhandleNodeClick1(val) {
      this.queryParams.originAddrId = val.id
      var origin = this.getHierarchyData(this.originTreeList, [val.id], val.label)
      //console.log(origin)
      this.queryParams.originAddr = origin.toString().replaceAll(',', '/')
    },
  },
  components: {AsyncModal, asyncSelector, userInfoImageUpload},
  watch: {
    dialogVisible: {
      handler(newVal, oldVal) {
        if (!newVal) {
          this.driverForm = {}
          this.day = null
        } else {
          this.$set(this.driverForm, 'userState', 0)
          this.getBusiness()
        }
      },
      immediate: true
    },
    'driverForm.userReport.iso': {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          if (!newVal && this.driverForm.userReport) {
            this.driverForm.userReport.isoType = 0
            this.isShowSelect = false
          }
        })
      },
      immediate: true,
    },
    'driverForm.userReport.isoType': {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          if (newVal === 0) {
            this.isShowSelect = false
          } else if (newVal === 1) {
            this.isShowSelect = true
          }
        })
      },
      immediate: true
    },
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

.formWidth {
  width: 320px;
}

.displayIn {
  display: inline-block;
  margin-left: 25px;
}

.ml400 {
  margin-left: 605px;
}

.displayS {
  display: inline-block;
  margin-left: 10px;
}

.bothSides {
  margin: 20px 0px 10px 0;
  border-top: 1px solid #EEEEEE;
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bothSides p {
  display: inline-block;
}

.bothSides p:nth-child(2) {
  width: 20px;
  height: 20px;
  line-height: 18px;
  border: 1px solid #1890FF;
  color: #fff;
  background-color: #1890FF;
  border-radius: 4px;
  text-align: center;
  margin: 0;
  cursor: default;
}

.edit-input ::v-deep.el-input .el-input__inner {
  width: 100%;
  padding: 0 5px
}

.mt30 {
  margin-top: 30px;
}

.form_height ::v-deep .el-form-item__label {
  margin-top: 50px;
}

.input-range {
  display: flex;
  width: 320px
}

.input-range1 {
  flex: 0.5
}

.input-range2 {
  flex: 1
}

.input-range3 {
  flex: 0.6;
  padding-right: 5px;
}

.input-span {
  flex: 0 0 15px;
  text-align: center
}

</style>
