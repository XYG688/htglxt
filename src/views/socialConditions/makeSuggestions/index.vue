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
          <template v-slot:replyStatus="slotProps">
              {{slotProps.row.replyStatus === '1' ? '已回复' : '未回复'}}
          </template>
          <template v-slot:openStatue="slotProps">
              {{slotProps.row.openStatue === '1' ? '公开' : '非公开'}}
          </template>
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
        class="reply-dialog-style"
        title="回复"
        :visible.sync="replyDialogVisible"
        width="500px"
        :before-close="replyHandleClose">
        <div style="margin-bottom: 10px">回复内容:</div>
        <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            placeholder="请输入回复内容"
            v-model="replyContent">
        </el-input>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitReply">确 定</el-button>
            <el-button @click="replyHandleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>

/*
 * 建言献策
 */

import query from "../components/query.vue";
import basicTable from "../components/basicTable.vue";

import {queryLists, tableData} from "./config";
import {getSqmyLists, deleteSqmy, commentreplySqmy} from "@/api/socialConditions";

export default {
    name: '',
    dicts: ['sqmy_type', 'problem_reaction_type'],
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
            replyDialogVisible: false,
            replyContent: '',
            replyData: {},
            queryData: {}
        };
    },
    mounted() {
        this.fn_getSqmyLists();
        this.setQueryListsProblemType();
    },
    methods: {
        setQueryListsProblemType() {
            this.queryLists.forEach( e => {
                if (e.label === '问题类型') {
                    e.options = this.dict.type.problem_reaction_type
                }
            })
        },
        fn_getSqmyLists() {
            const param = {
                pageNum: this.tableData.pageData.currentPage,
                pageSize: this.tableData.pageData.pageSize
            }
            const data = {
                sqmyType: "2",
                ...this.queryData,
                params: {
                    beginTime: data.startDate,
                    endTime: data.endDate
                }
            }
            getSqmyLists(param, data).then(res => {
                if (res.code === 200) {
                    this.tableData.listsData = res.rows;
                    this.tableData.pageData.total = res.total;
                } else {
                    this.$message({
                        type: 'warning',
                        message: '获取列表数据失败'
                    })
                }
            }).catch(err => {
                console.log('获取列表数据失败：', err)
            })
        },
        submitReply() {
            if (!this.replyContent) {
                this.$message({
                    type: 'warning',
                    message: '请填写回复内容!'
                })
                return;
            }
            const param = {
                infoType: "1",
                parentId: this.replyData.id,
                infoContent: this.replyContent
            }
            commentreplySqmy(param).then(res => {
                if (res.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '回复成功'
                    })
                    this.replyDialogVisible = false
                    this.replyData = {};
                } else {
                    this.$message({
                        type: 'warning',
                        message: '回复失败，请稍后重试!'
                    })
                }
            }).catch(err => {
                console.log('回复失败：', err)
            })
        },
        replyHandleClose() {
            this.replyDialogVisible = false;
            this.replyData = {};
        },
        handleClose() {
            this.contentOpendialogShow = false;
        },
        setContentOpen() {
            this.contentOpendialogShow = true;
        },
        refreshClick() {
            this.fn_getSqmyLists();
        },
        setQueryShow() {
            this.queryShow = !this.queryShow;
        },
        handleExport() {
            this.download(
                "sqmy/export",
                {
                    sqmyType: "2",
                    ...this.queryData  
                },
                '建言献策.xlsx',
                true
            )
        },
        handleCurrentChange(val) {
            this.tableData.pageData.currentPage = val;
            this.fn_getSqmyLists();
        },
        handleSizeChange(val) {
            this.tableData.pageData.pageSize = val;
            this.fn_getSqmyLists();
        },
        handleQuery(data) {
            this.queryData = {
                ...data,
                companyName: data.companyName.companyName
            }
            this.fn_getSqmyLists();
        },
        clickReply(data) {
            this.replyDialogVisible = true;
            this.replyData = data;
        },
        deleteData(data) {
            this.$confirm('是否确定删除该条数据?', '删除提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteSqmy(data.id).then(res => {
                    if (res.code === 200) {
                        this.$message({
                            type: 'success',
                            message: `删除成功`
                        });
                        this.fn_getSqmyLists();
                    }
                }).catch(err  => {
                    console.log('删除该条记录失败：', err)
                })
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
    .reply-dialog-style {
        ::v-deep .el-dialog__body {
            padding: 10px 30px;
        }
    }
</style>
