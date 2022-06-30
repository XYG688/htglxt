<template>
  <div class="consultation-records-style">
      <query
        v-show="queryShow"
        :queryLists="queryLists" 
        @handleQuery="handleQuery"
      />
      <div class="buttons-box">
          <div class="left-style">
              <el-button
                type="primary"
                plain
                icon="el-icon-plus"
                size="mini"
                @click="openAddDialog"
              >新增</el-button>
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['article:article:export']"
              >导出</el-button>
          </div>
          <div class="right-styly">
               <el-button icon="el-icon-search" size="mini" @click="setQueryShow" circle></el-button>
               <el-button icon="el-icon-refresh" size="mini" @click="refreshClick" circle></el-button>
          </div>
      </div>
      <basic-table 
        :tableData="tableData"
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      >
          <template v-slot:doed="slotProps">
              <el-button type="text" icon="el-icon-edit" @click="clickEdit(slotProps.row)">修改</el-button>
              <el-button type="text" icon="el-icon-delete" @click="deleteData(slotProps.row)">删除</el-button>
          </template>
      </basic-table>
      <el-dialog
        class="dyxx-dialog"
        :title="dialogTitle"
        :visible.sync="addDialogShow"
        width="660px"
        :before-close="handleClose">
        <div>
            <el-form ref="addForm" :model="addForm" label-width="80px">
                <div>
                    <el-form-item label="姓名" class="in-block padd-rg-10">
                        <el-input v-model="addForm.name" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" class="in-block" label-width="90px">
                        <el-radio-group v-model="addForm.sex" size="medium">
                            <el-radio border label="男"></el-radio>
                            <el-radio border label="女"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="身份证号" class="in-block padd-rg-10">
                        <el-input v-model="addForm.sfzh" placeholder="请身份证号"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" class="in-block" label-width="90px">
                        <el-input v-model="addForm.phone" placeholder="请手机号码"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="社区/网格" class="in-block padd-rg-10">
                        <el-input v-model="addForm.sqwg" placeholder="请输入所在社区/网格"></el-input>
                    </el-form-item>
                    <el-form-item label="所在党支部" class="in-block" label-width="90px">
                        <el-input v-model="addForm.szdzb" placeholder="请输入所在党支部"></el-input>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="党员类型" class="in-block padd-rg-10">
                        <el-select v-model="addForm.dylx" placeholder="请选择党员类型">
                            <el-option v-for="item in dylxLists" :key="item.label" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="党籍状态" class="in-block" label-width="90px">
                        <el-select v-model="addForm.djzt" placeholder="请选择党籍状态">
                            <el-option v-for="item in djztLists" :key="item.label" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="入党日期" class="in-block padd-rg-10">
                        <el-date-picker
                            v-model="addForm.rdzzrq"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择入党组织日期"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="转正日期" class="in-block" label-width="90px">
                        <el-date-picker
                            v-model="addForm.zwzsdyrq"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="请选择转为正式党员日期"
                        ></el-date-picker>
                    </el-form-item>
                </div>
                <div>
                    <el-form-item label="创建时间" class="in-block padd-rg-10 mar-bt-100">
                        {{addForm.cjsj}}
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="handleClose">取 消</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>

/*
 * 党员管理
 */

import query from "../socialConditions/components/query.vue";
import basicTable from "../socialConditions/components/basicTable.vue";

import {queryLists, tableData, dylxLists, djztLists, dyxx} from "./config";

export default {
    name: '',
    components: {
      query,
      basicTable 
    },
    data() {
        return {
            queryLists,
            tableData,
            queryShow: true,
            addDialogShow: false,
            dylxLists,
            djztLists,
            addForm: {...dyxx},
            dialogTitle: '新增党员信息'
        };
    },
    mounted() {},
    methods: {
        submitForm() {
            console.log('此处应调用接口保存数据', this.addForm)
            if (this.dialogTitle === '新增党员信息') {
                this.tableData.listsData.unshift(this.addForm);
            } else {
                console.log('调用修改的接口')
            }
            this.handleClose();
        },
        handleClose() {
            this.addDialogShow = false;
            this.addForm = {...dyxx}
        },
        openAddDialog() {
            this.addDialogShow = true;
            this.dialogTitle = '新增党员信息';
        },
        refreshClick() {
            console.log('点击刷新')
        },
        setQueryShow() {
            this.queryShow = !this.queryShow;
        },
        handleExport() {
            console.log('点击导出')
        },
        handleCurrentChange(val) {
            this.tableData.pageData.currentPage = val;
            console.log('根据页码获取相应的数据')
        },
        handleSizeChange(val) {
            console.log('点击切换每页条数-然后需要重新根据数量获取下数据：', val)
            this.tableData.pageData.pageSize = val;
        },
        handleQuery(data) {
            console.log('点击搜索，拿到搜索的内容', data)
        },
        clickEdit(data) {
            this.addDialogShow = true;
            this.addForm = {...data};
            this.dialogTitle = '修改党员信息';
        },
        deleteData(data) {
            this.$confirm('是否确定删除该条数据?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                console.log('点击确认删除', data)
                this.$message({
                    type: 'success',
                    message: `删除成功`
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        }
    }
};
</script> 

<style lang='scss' scoped>
    .dyxx-dialog {
        // ::v-deep .el-dialog {
        //     background: red;
        // }
        ::v-deep .el-dialog__body {
            padding-bottom: 0px;
        }
        .in-block {
            display: inline-block;
            width: 49%;
        }
        .padd-rg-10 {
            padding-right: 10px;
        }
        .mar-bt-10 {
            margin-bottom: 10px;
        }
        .el-select {
            width: 100%;
        }
    }
    
    .consultation-records-style {
        padding: 20px;
        .buttons-box {
            height: 28px;
            padding: 0 20px 0 10px;
            margin-bottom: 20px;
            .left-style {
                float: left;
            }
            .right-styly {
                float: right;
            }
        }
        .dialog-content {
            display: inline-block;
            height: 20px;
            line-height: 22px;
        }
        .contentOpen-type-switch {
            vertical-align: top !important;
        }
    }
</style>
