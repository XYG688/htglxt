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
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
                v-hasPermi="['article:article:export']"
              >导出</el-button>
              <el-button
                type="primary"
                plain
                size="mini"
                @click="setContentOpen"
              >设置</el-button>
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
              <el-button type="text" @click="clickReply(slotProps.row)">回复</el-button>
              <el-button type="text" icon="el-icon-delete" @click="deleteData(slotProps.row)">删除</el-button>
          </template>
      </basic-table>
        <el-dialog
        title="反馈内容公开设置"
        :visible.sync="contentOpendialogShow"
        width="30%"
        :before-close="handleClose">
        <div>
            <span class="dialog-content">内容是否开启公开显示：</span>
            <el-switch
                class="contentOpen-type-switch"
                v-model="contentOpenType"
                active-text="公开"
                inactive-text="关闭">
            </el-switch>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleClose">确 定</el-button>
            <el-button @click="handleClose">取 消</el-button>
        </span>
        </el-dialog>
      <el-dialog
        title="回复"
        :visible.sync="replyDialogVisible"
        width="30%"
        :before-close="replyHandleClose">
        <span>准备进行回复</span>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitReply">确 定</el-button>
            <el-button @click="replyHandleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>

/*
 * 表单管理
 */

import query from "../socialConditions/components/query.vue";
import basicTable from "../socialConditions/components/basicTable.vue";

import {queryLists, tableData} from "./config";

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
            contentOpendialogShow: false,
            contentOpenType: false,
            replyDialogVisible: false
        };
    },
    mounted() {},
    methods: {
        submitReply() {
            console.log('提交回复成功后关闭弹窗：')
            this.replyDialogVisible = false
        },
        replyHandleClose() {
            this.replyDialogVisible = false;
        },
        handleClose() {
            this.contentOpendialogShow = false;
        },
        setContentOpen() {
            this.contentOpendialogShow = true;
            console.log('看一下数据', this.contentOpendialogShow)
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
        clickReply(data) {
            this.replyDialogVisible = true;
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
