<template>
  <div class="indexdiv">
    <el-image class="indexbg" fit="cover" :src="require('@/assets/images/welcome-bg.png')"/>
    <!--<div class="indexWel">-->
      <!--<div><span class="come">{{$t('welcome')}}</span></div>-->
    <!--</div>-->
  </div>

</template>

<script>

  export default {
    name: '',
    data() {
      return {}
    },
    created() {

    },
  }
</script>

<style lang="scss" scoped>
  .indexbg {
    width: 100%;
    height: 100%
  }

  .indexdiv {
    height: calc(100vh - 80px);
    .indexWel {
      position: absolute;
      left: 370px;
      top: 25%;
      color: #182E39;
      transform: translateX(-50%);
      transform: translateY(-50%);
      font-weight: 600;
      div {
        padding-bottom: 10px;
      }
      .come {
        font-size: 60px;
      }
      .en {
        margin-left: 20px;
        font-size: 38px;
        font-weight: 400;
      }
      .hb {
        font-size: 50px;
      }
    }
  }
</style>
