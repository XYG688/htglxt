<template>
  <div class="basic-table-style">
      <el-table
        :data="tableData.listsData"
        style="width: 100%">
        <el-table-column
            v-if="tableData.table_index!==undefined ? tableData.table_index : false"
            type="index"
            width="65"
            :index="indexMethod"
            label="序号"
            align="center"
        ></el-table-column>
        <el-table-column
            v-for="item in tableData.header" :key="item.key"
            :prop="item.key"
            :label="item.label"
            :width="item.width"
            :min-width="item.minWidth"
            :align="item.align ? item.align : 'center'"
            :fixed="item.fixed ? item.fixed : false">
            <template slot-scope="scope">
                <slot
                    :name="item.key"
                    :row="scope.row"
                    :numIndex="scope.$index"
                > {{scope.row[item.key]}} </slot>
            </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagination-style"
        @size-change="fn_handleSizeChange"
        @current-change="fn_handleCurrentChange"
        :current-page="tableData.pageData.currentPage"
        :page-sizes="tableData.pageData.pageSizes"
        :page-size="tableData.pageData.pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.pageData.total">
      </el-pagination>
  </div>
</template>

<script>

/*
 * 封装的按钮/列表/分页组合的组件
 */

export default {
    name: 'basicTable',
    props: {
        tableData: {
            type: Object,
            default: () => [{}]
        }
    },
    data() {
        return {};
    },
    mounted() {},
    methods: {
        fn_handleSizeChange(val) {
            this.$emit('handleSizeChange', val)
        },
        fn_handleCurrentChange(val) {
            this.$emit('handleCurrentChange', val)
        },
        indexMethod(index) {
            return (
                index + 1 + this.tableData.pageData.pageSize * (this.tableData.pageData.currentPage - 1)
            );
        }
    }
};
</script> 

<style lang='scss' scoped>
.basic-table-style {
    .pagination-style {
        float: right;
        margin: 10px 10px 0 0;
    }
}
    
</style>
