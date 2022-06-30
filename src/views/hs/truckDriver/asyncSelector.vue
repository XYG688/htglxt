<template>
  <div class="asyncSelect">
	<el-select 
        v-model="selectVal"  
        :placeholder="placeholder"
        :disabled="disabled"
        :clearable="clearable"
        :multiple="multiple"
        @focus="searchView()" 
		:class="setClass()"
        @change="selectChange"
        @keyup.enter.native="queryEnter"
        :loading="loading">
        <el-option v-if="allowEmpty" value="" label="" class="select-no">请选择数据</el-option>
        <el-option v-for="option in selectList" :key="parseInt(option.dictValue)" :value="parseInt(option.dictValue)" :label="option.dictLabel" :disabled="Number(option.isvalid)===0">{{option.dictLabel}}</el-option>
    </el-select>
  </div>
</template>

<script>
import {isEmpty, isArray} from '../../../utils/util.js'
import request from '@/utils/request'
export default {
	props: {
		value: {
			type: [String, Number, Array],
            default: ''
		},
		address: {
			type: String,
            default: ''
		},
		params: {
			type: Object,
			default: () => {
        return {};
      }
		},
		placeholder: {
	      type: String,
	      default: ''
	    },
	    disabled: {
	    	type: Boolean,
	    	default: false
	    },
	    clearable: {
	    	type: Boolean,
	    	default: true
	    },
	    allowEmpty: {
	    	type: Boolean,
	    	default: false
	    },
	    multiple: {
	    	type: Boolean,
	    	default: false
	    },
		selectW:{
			type:Number,
			default:0
		}
	},
	data() {
		return {
			selectList: [],
			loading:false,
			selectVal: null,
			VUE_APP_BASE_API_URL: process.env.VUE_APP_BASE_API_URL,
			VUE_APP_BASE_API:process.env.VUE_APP_BASE_API
		}
	},
	created() {
		if (isEmpty(this.value)) {
			return;
		} else {
			this.getSelectData().then((res) => {
				if (res.code === 200) {
					if (isArray(res.data)) {
						this.selectList = res.data;
						this.selectVal = this.value
					}
				}
				
			}).catch(() => {
				this.selectVal = this.value
			})
		}
	},
	methods: {
		setClass(){
			if(this.selectW===0){
				return 'selectDefault'
			}else if(this.selectW===2){
				return 'selectSmall'
			}else if(this.selectW===3){
				return 'selectMedium'
			}
			else if(this.selectW===4){
				
				return 'selectmin'
			}else if(this.selectW===5){
				return 'selectDx'
			}
			{
				return 'selectSpecial'
			}
		},
		searchView(){
			if (this.selectList.length > 0) {
				return;
			}
			this.loading = true;
			this.getSelectData().then((res) => {
				// 
				if (res.code === 200 || res.cod === ERR_OK) {
					if (isArray(res.data)) {
						this.selectList = res.data
					} else {
						this.selectList = []
					}
				} else {
					this.$message({
				        type: 'error',
				        message: res.message
				    });
				}
				this.loading = false;
			}).catch(() => {
				this.loading = false;
				this.$message({
			        type: 'error',
			        message: '获取失败'
			    });
			})
		},
		getSelectData() {
			if (isEmpty(this.address)) {
				this.loading = false
				return
				
			}
			var base_api_url = '';
			var base_api = '';
			if(process.env.NODE_ENV === 'development'){
				base_api_url = this.VUE_APP_BASE_API_URL
				base_api = this.VUE_APP_BASE_API
			}else{
				base_api_url = this.VUE_APP_BASE_API_URL
				base_api = this.VUE_APP_BASE_API
			}
			return request({
				url: base_api_url+this.address,
				method: 'get',
				// params: this.params
				params:{}
			})
		},
		selectChange(val) {//回显关键性代码，每一次选择后执行，val是上面dom的value值
			let selectItem = this.selectList.find((item) => {
				return item.codeid === val;
			})
			this.$emit('selectChange', selectItem)
			this.$forceUpdate()
		},
		queryEnter() {
			this.$emit('queryEnter')
		}
	},
	watch: {
	    value:{
			handler(newVal,oldval){
				if (newVal && isEmpty(this.selectList)) {
	    		this.getSelectData().then((res) => {
					if (res.code === 200) {
						if (isArray(res.data)) {
							this.selectList = res.data;
						}
					}
					
				}).catch(() => {
					this.selectVal = this.value
				})
	    	}
	      	this.selectVal = newVal;
			},
			immediate:true
	    },
	    selectVal:{
			handler(newVal, oldVal) {
	      if (newVal !== oldVal) {
	        this.$emit("input", this.selectVal);
	      }
	    },
		immediate:true
		}
	}
}
</script>

<style scoped>
.asyncSelect{
  height: 36px;
  width:202px
}
.selectSmall{
	width: 123px;
}
.selectDefault{
	width: 320px;
}
.selectSpecial{
	width: 260px;
}
.selectMedium{
	width: 326px;
}
.selectmin{
	width: 256px;
}
.selectDx{
	width: 215px;
}
</style>