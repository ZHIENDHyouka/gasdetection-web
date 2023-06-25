<template>
  <div id="MainHome">
    <el-container>
      <el-header>
        <div style="float: left;display: inline">
          <el-menu :default-active="activeIndexHorizontal" class="el-menu-demo" mode="horizontal"
                   router active-text-color="rgb(110,0,0)">
            <el-menu-item v-for="(item,index) in this.$router.options.routes[1].children" :key="index" :index="item.path">
              {{ item.name }}
            </el-menu-item>
          </el-menu>
        </div>
        <div class="userBar">
          <el-dropdown trigger="click">
            <i class="el-icon-setting" style="padding-right: 10px;" ></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>退出</el-dropdown-item>
              <el-dropdown-item>2</el-dropdown-item>
              <el-dropdown-item>3</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{ username }}</span>
        </div>
      </el-header>
      <router-view></router-view>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "MainHome",
  data() {
    return {
      // activeIndexHorizontal: this.$router.options.routes[1].children[0].children[0].path,
      activeIndexHorizontal: this.$router.options.routes[1].children[0].path,
      username: '',
    }
  },
  mounted() {

    if (this.$route.query.username) window.localStorage.setItem("username", this.$route.query.username);
    this.username = window.localStorage.getItem("username");
  }
}
</script>

<style scoped>
.el-header {
  background-color: #ffffff;
  color: #000000;
  text-align: center;
  line-height: 50px;
  text-align: center;
  font-size: 12px;
  border-bottom: 1px solid #8c8888;
}

.el-menu {
  margin-left: 200px;
  border-bottom: 1px solid #8c8888;
  height: 60px;
  width: 800px;
}

.el-menu-item {
  color: rgb(29, 31, 32);
  width: 150px;
  margin: 0 auto;
  text-align: center;
  display: inline-block;
}

.el-submenu__title:hover {
  background-color:  #eae6e6 !important;
}

.el-menu-item:hover {
  background-color: #eae6e6 !important;
}

.userBar{
  /*margin-left: 600px;*/
  font-size: 15px;
  display: inline;
  width: 50px;
  height: 60px;
  margin-left: -100px;
}

</style>