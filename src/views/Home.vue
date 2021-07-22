<template>
  <el-button @click="drawer = true" type="primary" style="margin-left: 16px;">
    点我打开
  </el-button>
</template>
<script>
export default {
  data() {
    return {
      drawer: false,
    };
  }
};
</script>
