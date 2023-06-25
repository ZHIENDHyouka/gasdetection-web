<template>
  <div id="ManageHome">
      <el-container>
        <el-header >
          <el-menu :default-active="activeIndexHorizontal" class="el-menu-demo" mode="horizontal" @select="handleSelect" style="float: left">
            <el-menu-item index="1">处理中心</el-menu-item>
            <el-menu-item index="3" >消息中心</el-menu-item>
            <el-menu-item index="4">订单管理</el-menu-item>
          </el-menu>
<!--          <div class="line"></div>-->
          <el-dropdown trigger="click">
            <i class="el-icon-setting" style="margin-left: 500px;padding-right: 10px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>退出</el-dropdown-item>
              <el-dropdown-item>2</el-dropdown-item>
              <el-dropdown-item>3</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{username}}</span>
        </el-header>
        <el-container>
          <el-aside width="200px">
            <el-menu :default-active="activeIndexVertical" class="el-menu-vertical-demo" mode="vertical"
                     router active-text-color="rgb(110,0,0)">
              <el-menu-item v-for="(item,index) in this.$router.options.routes[1].children" :key="index" :index="item.path">{{ item.name }}
              </el-menu-item>
            </el-menu>
          </el-aside>
          <el-container>
            <el-main>
              <router-view/>
            </el-main>
          </el-container>
        </el-container>
      </el-container>
  </div>
</template>

<script>

export default {
  name: "ManageHome",
  data() {
    return {
      activeIndexVertical: this.$router.options.routes[1].children[0].path,
      activeIndexHorizontal:'1',
      username:'',
    };
  },
  mounted() {
    this.$router.push({
      path:'/data',
    })
    if (this.$route.query.username) window.localStorage.setItem("username",this.$route.query.username);
    this.username=window.localStorage.getItem("username");
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
  }
}
</script>

<style scoped>
.el-aside {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  line-height: 200px;
}
.el-header{
  background-color: #ffffff;
  color: #333;
  text-align: center;
  line-height: 50px;
  text-align: center;
  font-size: 12px;
  border-bottom: 1px solid #eae6e6;
}
.el-main {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  padding: 0px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}



.el-aside{
  border-top: 1px solid  #eae6e6;
  height: 635px;
  border-right: 1px solid #eae6e6;
}

</style>