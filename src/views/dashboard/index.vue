<template>
  <div class="dashboard-container">
    <div class="dashboard-text">此处为该平台的一些简介</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 15px;
    line-height: 46px;
    color: #999999;
  }
}
</style>
