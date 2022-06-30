<template xmlns:border-radius="http://www.w3.org/1999/xhtml">
  <div class="app-container">
<!--    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">新增用户</el-button>-->
    <el-row>
      <el-col :span="8">
        <el-row class="left-title-box">
          <el-col :span="12" align="left">
            <div>
              检测登记
            </div>
          </el-col>
          <el-col :span="12" align="right">
            <div>
              <a :href='baseUrl + "/res/身份证读卡器.zip"' title="点击下载身份证读卡器驱动等文件" style="color: #0000FF;">身份证读卡器</a>状态 {{ idCertStrStatus }}
            </div>
          </el-col>
        </el-row>
        <div class="form-box">
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-row>
              <el-col :span="6" class="left-content-header">
                <el-form-item label="">
                  <imageUpload v-model="form.headUrl" :limit="1" :isShowTip="false"
                               style="line-height: 10px; line-width: 10px;"/>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="姓名" prop="name">
                  <el-select v-model="form.name" placeholder="请选择姓名"
                             style="width:calc(100% - 120px)"
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
                <el-form-item label="身份证号" prop="idNumber">
                  <el-select v-model="form.idNumber" placeholder="请输入身份证号"
                             style="width:calc(100% - 120px)"
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
                <el-form-item label="联系电话" prop="phone">
                  <el-select v-model="form.phone" placeholder="请输入联系电话"
                             style="width:calc(100% - 120px)"
                             filterable  remote :remote-method="handleRemoteSearchMemberWithPhone"
                             @change="handleRemoteMemberSelected">
                    <el-option
                      v-for="member in this.nameList"
                      :key="member.id"
                      :label="`${member.name} ${member.phone}`"
                      :value="parseInt(member.id)"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="性别" prop="sex" label-width="120px">
                      <el-select v-model="form.sex" placeholder="请选择性别" style="width:calc(100% - 120px)">
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
                      <el-select v-model="form.nation" placeholder="请选择民族" style="width:calc(100% - 120px)">
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
                                  style="width:calc(100% - 120px)"
                                  v-model="form.birthday"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="选择出身日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="联系地址" prop="addr">
                  <el-input type="textarea" v-model="form.addr1" placeholder="请输入联系地址" style="width:calc(100% - 120px)" />
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
                <el-button round @click="resetFormData" style="width: 120px">重置</el-button>
              </section>

            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="16">
        <el-row class="right-title-box">
          <el-col :span="12" align="left">
            <div>
              今日登记({{ total }}人次)
            </div>
          </el-col>
          <el-col :span="12" align="right">
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">刷新</el-button>
          </el-col>
        </el-row>
        <el-table v-loading="loading" :data="memberList" class="right-content-box" border>
          <el-table-column label="序号" align="center" type="index" >
            <template scope="scope">
              <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column label="核酸码" align="center" prop="hsCode" />
          <el-table-column label="姓名" align="center" prop="name" />
          <el-table-column label="社区/网格" align="center" prop="companyName" />
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
  import { listMember, addMember } from "@/api/hs/member";
  import { insertHsDetail } from "@/api/hs/hsdetail";
  import { parseTime } from "@/utils/ruoyi";
  import { idCertConnect, idCertDisconnect, idCertGetStatus, idCertReadCert } from "@/utils/idcard/idr210";
  import { getUserTree } from "@/api/hs/comparison";

  export default {
    name: "Member",
    dicts: ['sys_user_sex', 'nation', 'hoh_relationship'],
    data() {
      return {
        baseUrl: process.env.VUE_APP_BASE_API,
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
          hsCount: null,
          sortType: null
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
        },
        nameList: [],
        submitBtn: true,
        timer: null,
        date: new Date(new Date().getTime() + 6000),
        endTimeText: "00天00时00分00秒",
        // 身份证读卡器
        idCertTimer: undefined,
        idCertTimerStatus: 0,
        idCertStrStatus: "",
        idCertStatus: 0,
        that: this,
        treeOptions: [],
        isAdmin: false,
      };
    },
    created() {
      //this.getList();
      this.getUserTree();
      //console.log("定时器开启")
      let that = this;
      this.idCertTimer = setInterval(() => {
        //that.idCertCallback(that)
      }, 2000);
    },
    destroyed() {
      clearInterval(this.idCertTimer);
      // 身份证读卡器断开连接
      //idCertDisconnect();
    },
    methods: {
      getUserTree(){
        getUserTree().then(res => {
          if(res == ''){
            this.queryParams.companyIds = null;
            this.isAdmin = true;
          }else{
            this.treeOptions.push(res);
            this.queryParams.companyName = res.companyName;
            this.queryParams.companyIds = this.getCompanyIds(res.id);
          }
          this.getList();
        })
      },
      getCompanyIds(companyId){
        let newArr = [];
        this.treeOptions.forEach(value =>{
          if(value.id == companyId){
            newArr.push(value.id);
            if(value.subList && value.subList.length > 0) {
              value.subList.forEach(val => {
                newArr.push(val.id);
              })
            }
          }
        })
        return newArr;
      },
      /** 查询用户列表 */
      getList() {
        this.loading = true;
        const now = new Date();
        const pattern = "{y}-{m}-{d} {h}:{i}:{s}";
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        this.queryParams.hsStartDate = parseTime('2022-04-19 00:22:38', pattern);
        now.setHours(23);
        now.setMinutes(59);
        now.setSeconds(59);
        this.queryParams.hsEndDate = parseTime('2022-04-19 23:22:38',pattern);
        this.queryParams.sortType = 2;
        listMember(this.queryParams).then(response => {
          this.memberList = response.rows;
          // if (this.nameList) {
          //   this.memberList.forEach(t => t.idNumber = this.getIdNumber(t.idNumber))
          // }
          this.total = response.total;
          this.loading = false;
        });
      },
      // 根据用户名搜索
      handleRemoteSearchMemberWithName(name) {
        this.handleRemoteSearchMember(name, undefined, undefined);
      },
      handleRemoteSearchMemberWithIdNumber(idNumber) {
        this.handleRemoteSearchMember(undefined, idNumber, undefined);
      },
      handleRemoteSearchMemberWithPhone(phone) {
        this.handleRemoteSearchMember(undefined, undefined, phone);
      },
      handleRemoteSearchMember(name, idNumber, phone) {
        //console.log("handleRemoteSearchMember: " + name + ", " + idNumber);
        if (!name && !idNumber && !phone) {
          //console.log("handleRemoteSearchMember data empty!");
          return
        }
        this.loading = true;
        listMember({pageNum: 1, pageSize: 1000, name: name, idNumber: idNumber, phone: phone}).then(response => {
          this.nameList = response.rows;
          if (this.nameList) {
            this.nameList.forEach(t => t.idNumber = this.getIdNumber(t.idNumber))
          }
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

        // 重新开始读卡
        if(this.idCertStatus === 4) {
          this.idCertStatus = 2;
        }
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
        if(this.isAdmin){
          this.queryParams.companyIds = null;
          this.queryParams.companyName = null;
        }else{
          this.queryParams.companyName = this.treeOptions[0].companyName;
          this.queryParams.companyIds = this.getCompanyIds(this.treeOptions[0].id);
        }
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      submitFormData(){//签到
        if(!this.submitBtn) return false;
        if (!this.form.idNumber) {
          return
        }
        const data = { idNumber: this.form.idNumber, hsCount: 1 };
        insertHsDetail(data).then(response => {
          console.log(response)
          if (response.msg === "1") {
            this.resetFormData();
            this.$modal.msgSuccess("登记成功");

            this.getList();

            // 重新开始读卡
            if (this.idCertStatus === 4) {
              this.idCertStatus = 2;
            }
          } else if (response.msg ==="-1") {
            // 给出提示
            const that = this
            this.$modal.confirm('是否新增用户并签到？').then(function(action) {
              //console.log(action)
              that.addMemberAndDetail();
            }).catch(() => {
              this.resetFormData();
              // 重新开始读卡
              if(this.idCertStatus === 4) {
                this.idCertStatus = 2;
              }
            });
          }
        })
      },
      addMemberAndDetail() {
        if (!this.form.idNumber) {
          return
        }
        this.form.hsCount = 1
        addMember(this.form).then(response => {
          this.resetFormData();
          this.$modal.msgSuccess("登记成功");

          this.getList();

          // 重新开始读卡
          if(this.idCertStatus === 4) {
            this.idCertStatus = 2;
          }
        })
      },
      resetFormData(){//重置表单
        this.reset();
        if(this.idCertStatus === 4) {
          this.idCertStatus = 2;
        }
      },
      getIdNumber(idNumber) {
        return idNumber.startsWith("0-") || idNumber.startsWith("1-") ? "" : idNumber;
      },
      idCertCallback(that) {
        try {
          if (that.idCertTimerStatus === 1) {
            //console.log("定时器执行中" + that.idCertTimerStatus)
            return
          }
          // console.log("定时器开始执行" + that.idCertStatus)
          that.idCertTimerStatus = 1
          let status
          // 0 已断开连接， 1 连接中， 2 连接成功， 3 读卡中， 4 读卡成功 5 断开连接中
          if (that.idCertStatus === 0) {
            //console.log("连接中")
            that.idCertStrStatus = ":  连接中";
            that.idCertStatus = 1
            status = idCertConnect();
            if (status) {
              that.idCertStrStatus = ":  连接失败"
              that.idCertStatus = 0
              that.idCertTimerStatus = 0
              //console.log("连接失败: " + status)
              return
            }
            //console.log("连接成功")
            that.idCertStatus = 2
            that.idCertStrStatus = ":  连接成功";
          }

          // 判断连接状态
          if (that.idCertStatus !== 4) {
            //const tmpStatus = idCertGetStatus()
            if (tmpStatus === -1) {
              console.log("读卡器状态出错")
              that.idCertStrStatus = ":  读卡器状态出错";
              that.idCertStatus = 0
              that.idCertTimerStatus = false
              return false
            }
            //console.log("读卡器状态正常")
          }

          // 连接成功
          if (that.idCertStatus === 2) {
            that.idCertStatus = 3
            that.idCertStrStatus = ":  读取信息中";
            //console.log("读取信息中")
            let result = idCertReadCert();
            if (result.code < 0) {
              that.idCertStrStatus = ":  读取信息失败";
              console.log("读取信息失败: " + result.errMsg)
              that.idCertStatus = 2
              that.idCertTimerStatus = 0
              return
            }

            that.idCertStatus = 4
            that.idCertStrStatus = ":  读取信息成功";
            //console.log("读取信息成功")

            // 单独处理民族
            const dictNation = that.dict.type.nation.find(t => t.label.startsWith(result.body.nation))
            if (dictNation) {
              result.body.nation = parseInt(dictNation.value)
            }
            // 填充信息
            that.form = result.body;
            // console.log(result.body)
          }

          that.idCertTimerStatus = 0
        } catch (e) {
          //console.log(e)
        } finally {
          that.idCertTimerStatus = 0
        }
        // console.log("定时器执行完毕" + that.idCertStatus)
      },
    }
  };
</script>
<style scoped lang='scss'>
  .form-box {
    border: 1px solid #ccc;
    margin-right: 20px;
    margin-left: 0px;
    padding-left: 0px;
    padding-top: 10px;
    /*min-height: 300px;*/
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
    padding-right: 10px;
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
    min-height: 420px;
  }
  ::v-deep .el-form-item__content{
    margin-left: 20px!important;
  }
  ::v-deep .el-form-item__error{
    margin-left: 100px!important;
  }
</style>
