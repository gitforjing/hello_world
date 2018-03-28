<template>
  <el-menu mode="vertical"  class="sideBar" text-color="#124592" active-text-color="#990000" :default-active="$route.path">
    <sidebar-item :routes='permission_routers'></sidebar-item>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permission_routers'
    ])
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.el-menu {
  min-height: 100%;
}
.sideBar{
	background-color: $themeColor;
}
</style>
