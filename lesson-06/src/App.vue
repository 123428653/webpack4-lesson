<style lang="scss" scoped>
  #app {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-size: 35px;
  }
</style>

<template>
  <div id="app">
    <div><img src="@/assets/images/logo.png"></div>
    <h1>Hello Vue</h1>
    <el-button type="primary">主要按钮</el-button>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    console.log('App.vue')
  }
}
</script>
