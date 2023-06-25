<template>
<div id="ManagerHome">
  <el-container>
    <el-aside width="200px">
      <el-menu :default-active="activeIndexVertical" class="el-menu-vertical-demo" mode="vertical"
               router active-text-color="rgb(110,0,0)">
        <el-menu-item v-for="(item,index) in this.$router.options.routes[1].children[1].children" :key="index" :index="item.path">{{ item.name }}
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<script>
export default {
  name: "ManagerHome",
  data(){
    return{
      activeIndexVertical: this.$router.options.routes[1].children[1].children[0].path,
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.el-aside {
  background-color: #ffffff;
  color: #333;
  text-align: center;
  line-height: 200px;
  border-top: 1px solid  #eae6e6;
  height: 635px;
  border-right: 1px solid #eae6e6;
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

.el-menu-item{
  border-bottom: 1px solid #eae6e6;
}

</style>