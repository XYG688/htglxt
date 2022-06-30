<template>
  <div class="consultation-records-style">
      <query
        v-show="queryShow"
        :queryLists="queryLists" 
        @handleQuery="handleQuery"
      />
      <div class="buttons-box">
          <!-- <div class="left-style">
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
          </div> -->
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
        openAddDialog() {
            console.log('点击新增')
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
            console.log('点击修改', data)
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
