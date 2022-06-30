<template xmlns:border-radius="http://www.w3.org/1999/xhtml">
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-row class="left-title-box">
          <el-col :span="12" align="left">
            <div>
              检测登记
            </div>
          </el-col>
        </el-row>
        <div class="form-box">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-row>
              <el-col :span="6" class="left-content-header">
                <el-form-item label="">
                  <imageUpload v-model="form.headUrl" :limit=1 />
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="姓名" prop="name">
                  <el-select v-model="form.name" placeholder="请选择姓名"
                             style="width:calc(100% - 60px)"
                             filterable  remote :remote-method="handleRemoteSearchMemberWithName"
                              @change="handleRemoteMemberSelected">
                    <el-option
                      v-for="member in this.nameList"
                      :key="member.id"
                      :label="`${member.name} ${member.idNumber}`"
                      :value="parseInt(member.id)"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="性别" prop="sex" label-width="120px">
                      <el-select v-model="form.sex" placeholder="请选择性别" style="width:calc(100%)">
                         <el-option
                          v-for="dict in dict.type.sys_user_sex"
                          :key="dict.value"
                          :label="dict.label"
                          :value="parseInt(dict.value)"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="民族" prop="nation" label-width="60px">
                      <el-select v-model="form.nation" placeholder="请选择民族" style="width:calc(100% - 60px)">
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
                <el-form-item label="出生日期" prop="birthday">
                  <el-date-picker clearable size="small"
                                  style="width:calc(100% - 60px)"
                                  v-model="form.birthday"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="选择出身日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="身份证号" prop="idNumber">
                  <el-select v-model="form.idNumber" placeholder="请输入身份证号"
                             style="width:calc(100% - 60px)"
                             filterable  remote :remote-method="handleRemoteSearchMemberWithIdNumber"
                             @change="handleRemoteMemberSelected">
                    <el-option
                      v-for="member in this.nameList"
                      :key="member.id"
                      :label="`${member.name} ${member.idNumber}`"
                      :value="parseInt(member.id)"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="联系地址" prop="addr">
                  <el-input v-model="form.addr1" placeholder="请输入联系地址" style="width:calc(100% - 60px)" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <section style="position: relative;left: calc((100% - 120px - 270px) / 2)">
                <el-button type="primary" round @click="submitFormData" style="width: 120px;margin-right: 30px;"
                         :disabled="!submitBtn">
<!--                {{ !submitBtn?'已过期':'签到' }}<span v-if="submitBtn">{{'('+endTimeText+')'}}</span>-->
                  签到
                </el-button>
                <el-button round @click="resetFormData" style="width: 120px">取消</el-button>
              </section>

            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="12">
        <el-row class="right-title-box">
          <el-col :span="12" align="left">
            <div>
            今日登记({{ total }}人次)
            </div>
          </el-col>
          <el-col :span="12" align="right">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          </el-col>
        </el-row>
         <el-table :data="memberList" class="right-content-box" border>
          <el-table-column label="序号" align="center" prop="id" />
          <el-table-column label="姓名" align="center" prop="name" />
          <el-table-column label="身份证号" align="center" prop="idNumber" />
          <el-table-column label="频次" align="center" prop="hsCount" />
          <el-table-column label="登记时间" align="center" prop="hsRecordDate" />
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { listMember } from "@/api/hs/member";
  import { listMemberWithDetail } from "@/api/hs/memberwithdetail";
  import { insertHsDetail } from "@/api/hs/hsdetail";
  import { parseTime } from "@/utils/ruoyi";

export default {
  name: "Member",
  dicts: ['sys_user_sex', 'nation', 'hoh_relationship'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      memberList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: 2,
        hsStartDate: null,
        hsEndDate: null,
        name: null,
        idNumber: null,
        sex: null,
        birthday: null,
        nation: null,
        phone: null,
        addr: null,
        hohIdNumber: null,
        hohRelationship: null,
        ec1Name: null,
        ec1Phone: null,
        ec2Name: null,
        ec2Phone: null,
        hsCount: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "姓名不能为空", trigger: "change" }
        ],
        idNumber: [
          { required: true, message: "身份证号不能为空", trigger: "blur" }
        ],
        sex: [
          { required: true, message: "性别不能为空", trigger: "change" }
        ],
        birthday: [
          { required: true, message: "出生日期不能为空", trigger: "blur" }
        ],
        nation: [
          { required: true, message: "民族不能为空", trigger: "change" }
        ],
        phone: [
          { required: true, message: "联系电话不能为空", trigger: "blur" }
        ],
        addr: [
          { required: true, message: "联系地址不能为空", trigger: "blur" }
        ]
      },
      nameList: [],
      submitBtn: true,
      timer: null,
      date: new Date(new Date().getTime() + 6000),
      endTimeText: "00天00时00分00秒"
    };
  },
  created() {
    console.log(11111)
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      const now = new Date();
      const pattern = "{y}-{m}-{d} {h}:{i}:{s}";
      now.setHours(0);
      now.setMinutes(0);
      now.setSeconds(0);
      this.queryParams.hsStartDate = parseTime(now, pattern);
      now.setHours(23);
      now.setMinutes(59);
      now.setSeconds(59);
      this.queryParams.hsEndDate = parseTime(now, pattern);
      listMemberWithDetail(this.queryParams).then(response => {
        this.memberList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 根据用户名搜索
    handleRemoteSearchMemberWithName(name) {
      this.handleRemoteSearchMember(name, undefined);
    },
    handleRemoteSearchMemberWithIdNumber(idNumber) {
      this.handleRemoteSearchMember(undefined, idNumber);
    },
    handleRemoteSearchMember(name, idNumber) {
      //console.log("handleRemoteSearchMember: " + name + ", " + idNumber);
      // if (!name && !idNumber) {
      //   console.log("handleRemoteSearchMember data empty!");
      //   return
      // }
      this.loading = true;
      listMember({pageNum: 1, pageSize: 1000, name: name, idNumber: idNumber}).then(response => {
        this.nameList = response.rows;
        this.loading = false;
      });
    },
    // 选中用户名
    handleRemoteMemberSelected(id) {
      const tmp = this.nameList.find(t => t.id === id);
      if (tmp) {
        this.form = tmp;
      }
      this.nameList = [];
    },
    endTime(){
      let endTimeDate = (new Date(this.date).getTime()) - (new Date().getTime()),
          that = this;
      if(endTimeDate <= 0){
        that.submitBtn = false;
        clearInterval(this.timer);
        return false;
      }
      var days = parseInt(endTimeDate / 1000 / 60 / 60 / 24 , 10); //计算剩余的天数
      var hours = parseInt(endTimeDate / 1000 / 60 / 60 % 24 , 10); //计算剩余的小时
      var minutes = parseInt(endTimeDate / 1000 / 60 % 60, 10);//计算剩余的分钟
      var seconds = parseInt(endTimeDate / 1000 % 60, 10);//计算剩余的秒数
      //console.log(this.checkTime(days)+"天" + this.checkTime(hours)+"时" + this.checkTime(minutes)+"分"+this.checkTime(seconds)+"秒")
      this.endTimeText = this.checkTime(days)+"天" + this.checkTime(hours)+"时" + this.checkTime(minutes)+"分"+this.checkTime(seconds)+"秒";
    },
    checkTime(num){
      return num<10?'0'+num:num;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        name: null,
        idNumber: null,
        sex: null,
        birthday: null,
        nation: null,
        phone: null,
        addr1: null,
        addr2: null,
        hohName: null,
        hohIdNumber: null,
        hohRelationship: null,
        ec1Name: null,
        ec1Phone: null,
        ec2Name: null,
        ec2Phone: null,
        hsCount: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateMember(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMember(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    submitFormData(){//签到
      if(!this.submitBtn) return false;
      if (!this.form.idNumber) {
        return
      }
      const data = {idNumber: this.form.idNumber, hsCount: 1};
      insertHsDetail(data).then(response => {
        this.resetFormData();
        this.$modal.msgSuccess("登记成功");

        this.getList();
      })
    },
    resetFormData(){//重置表单
      this.reset();
    }
  }
};
</script>
<style type="text/css" lang="scss" scoped>
  .form-box {
    border: 1px solid #ccc;
    margin-right: 20px;
    margin-left: 0px;
    padding-left: 0px;
    padding-top: 10px;
    min-height: 300px;
  }

  .left-content-header {
    display:flex;
    align-items:center;
  }

  .left-title-box {
    border: 1px solid #ccc;
    margin-right: 20px;
    height: 50px;
    display:flex;
    align-items:center;
    padding-left: 10px;
  }

  .right-title-box {
    border: 1px solid #ccc;
    height: 50px;
    display:flex;
    align-items:center;
    padding-left: 10px;
    padding-right: 10px;
  }

  .right-content-box {
    border: 1px solid #ccc;
    margin-top: 0px;
    min-height: 300px;
  }
</style>
