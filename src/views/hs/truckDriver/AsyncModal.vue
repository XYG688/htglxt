<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    :width="width"
    :fullscreen="fullscreen"
    :modal="modal"
    :close-on-click-modal="closeOnModal"
    :show-close="showclose"
    :custom-class="resetClass"
    :before-close="beforeClose"
    :top="top"
    :append-to-body="appendBody"
    :center="center"
    v-dialogDrag="dialogDrag"
    @close="onClose"
    :class="isShowScroll ?'myDialog':'noScroll'"
  >
    <div class="content" v-if="afterVisible">
      <slot name="default"></slot>
    </div>
    <span slot="footer" class="dialog-footer" v-if="isFooter">
      <slot name="footerBar" :onCancel="onCancel"></slot>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data: function () {
    return {
      afterVisible: true,
    };
  },
  props: {
    isShowScroll:{
       type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "标题",
      required: false,
    },
    dialogVisible: {
      type: Boolean,
      default: false,
      required: false,
    },
    width: {
      type: String,
      default: "50%",
      required: false,
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
    modal: {
      type: Boolean,
      default: true,
    },
    closeOnModal: {
      type: Boolean,
      default: false,
    },
    showclose: {
      type: Boolean,
      default: true,
    },
    slotProps: {
      type: Object,
    },
    resetClass: {
      type: String,
      default: "",
    },
    dialogDrag: {
      type: Boolean,
      default: true,
    },
    isFooter: {
      type: Boolean,
      default: true,
    },
    top: {
      type: String,
      default: "12vh",
    },
    appendBody: {
      type: Boolean,
      default: false,
    },
    center: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    dialogVisible: function (newVal) {
      if (newVal) {
        this.afterVisible = true;
      }
    },
  },
  mounted: function () {},
  methods: {
    beforeClose(done) {
      this.$emit("closeDialog");
      return false;
    },
    onClose: function () {
      let timer = setTimeout(() => {
        this.afterVisible = false;
        clearTimeout(timer);
      }, 300);
      //防止执行两次cancel事件导致弹窗无法关闭
      if (this.dialogVisible) {
        this.$emit("closeDialog");
      }
    },
    onCancel: function () {
      this.$emit("cancel");
    },
  },
};
</script>
<style scoped>
.myDialog >>> .el-dialog__body {
  max-height: 700px;
  min-height: 100px;
  overflow-y: scroll;
}
.noScroll >>> .el-dialog__body {
 overflow: hidden;
}
.myDialog >>> .el-dialog__header {
  border: 1px solid #eeeeee !important;
  background-color: #f8f8f8 !important;
}
</style>
