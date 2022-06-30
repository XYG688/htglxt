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
        class="reply-dialog-style"
        title="回复"
        :visible.sync="replyDialogVisible"
        width="500px"
        :before-close="handleClose">
        <div style="margin-bottom: 10px">回复内容:</div>
        <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入回复内容"
            v-model="replyContent">
        </el-input>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitReply">确 定</el-button>
            <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>

/*
 * 党小员咨询记录
 */

import query from "../components/query.vue";
import basicTable from "../components/basicTable.vue";

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
            replyDialogVisible: false,
            replyContent: ''
        };
    },
    mounted() {},
    methods: {
        submitReply() {
            console.log('提交回复成功后关闭弹窗：')
            this.replyDialogVisible = false
        },
        handleClose() {
            this.replyDialogVisible = false
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
    }
    .reply-dialog-style {
        ::v-deep .el-dialog__body {
            padding: 10px 30px;
        }
    }
</style>
