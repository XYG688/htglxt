<template>
  <div class="query-style">
    <div>
      <el-form ref="queryForm" :model="queryForm" label-width="84px">
        <div v-for="(item, index) in queryLists" :key="index" class="item-style" :class="[bodyWidth > 1800 ? 'item-style-5' : '', bodyWidth > 2400 ? 'item-style-6' : '']">
          <el-form-item :label="item.label">
            <div v-if="item.type === 'input'">
              <el-input v-model="queryForm[item.name]" :placeholder="item.placeholder"></el-input>
            </div>
            <div v-if="item.type === 'date'">
               <el-date-picker
                v-model="queryForm[item.name]"
                type="date"
                value-format="yyyy-MM-dd"
                :placeholder="item.placeholder">
              </el-date-picker>
            </div>
            <div v-if="item.type === 'selectGrid' && queryForm[item.name]">
              <el-select v-model="queryForm[item.name].companyName" placeholder="请选择村社区"  size="small" clearable @clear="clearCompany(item.name)">
                <el-option :value="queryForm[item.name].companyId" :label="queryForm[item.name].companyName"
                          style="width: 260px;height:200px;overflow: auto;background-color:#fff">
                  <el-tree
                    v-if="treeOptions.length > 0"
                    :data="treeOptions"
                    :props="defaultPropsValue"
                    @node-click="queryhandleNodeClick($event , item.name)"
                  ></el-tree>
                </el-option>
              </el-select>
            </div>
            <div v-if="item.type === 'select'">
              <el-select v-model="queryForm[item.name]" :placeholder="item.placeholder">
                <el-option
                  v-for="item in item.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </el-form-item>
        </div>
        <div class="item-style">
          <div class="button-box" :class="[queryLists.length%4 === 0 ? 'mr-left-10' : '']">
            <el-button :class="[queryLists.length%4 === 0 ? '' : 'query-button']" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>

/*
 * 查询组件
 */

  import { getUserTree } from '@/api/hs/comparison'

export default {
    name: '',
    props: {
      queryLists: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        queryForm: {},
        resetFormData: {},
        treeOptions: [], // 社区网格数据
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        bodyWidth: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      };
    },
    mounted() {
      this.setQueryForm();
      this.fn_getUserTree();
    },
    methods: {
      queryhandleNodeClick(val, itemName){
        let companyName =  this.getHierarchyData(this.treeOptions,[val.id],val.label)
        this.queryForm[itemName].companyName = companyName.toString().replaceAll(',','/')
        if(val.children){
          var companyId =  this.getChildNodes(val)
          companyId.push(val.id)
          this.queryForm[itemName].companyId = companyId
        }else{
          this.queryForm[itemName].companyId = [val.id]
        }
      },
      clearCompany(itemName) {
        this.queryForm[itemName] = {
          companyId: [],
          companyName: ''
        }
      },
      setQueryForm() {
        let newQueryForm = {}
        this.queryLists.forEach(e => {
          if(e.type === 'selectGrid') {
            newQueryForm[e.name] = {
              companyId: [],
              companyName: ''
            }
          } else {
            newQueryForm[e.name] = ''
          }
        })
        this.queryForm = {...newQueryForm};
        this.resetFormData = {...newQueryForm};
      },
      handleQuery() {
        this.$emit('handleQuery', this.queryForm)
      },
      resetQuery() {
        this.queryForm = {...this.resetFormData}
        this.$emit('handleQuery', this.queryForm)
      },
      fn_getUserTree() {
        getUserTree().then(res => {
          res.data.forEach(i=>{
            i.value = i.id
          })
          this.treeOptions = res.data
        })
      },
    }
};
</script> 

<style lang='scss' scoped>
.query-style {
  .item-style {
    width: 24.8%;
    display: inline-block;
    .el-date-editor--date, .el-select {
      width: 100%;
    }
    .button-box {
      display: inline-block;
      margin: 0 0 20px 40px;
      .query-button {
        margin-right: 10px;
      }
    }
    .mr-left-10 {
      margin-left: 10px;
    }
  }
  .item-style-5 {
    width: 19.8%;
  }
  .item-style-6 {
    width: 16.6%;
  }
}
</style>
