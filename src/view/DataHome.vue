<template>
  <div id="DataHome">
        <el-container >
<!--          <el-aside width="200px">-->
<!--            <el-menu :default-active="activeIndexVertical" class="el-menu-vertical-demo" mode="vertical"-->
<!--                     router active-text-color="rgb(110,0,0)">-->
<!--              <el-menu-item v-for="(item,index) in this.$router.options.routes[1].children[0].children" :key="index" :index="item.path">{{ item.name }}-->
<!--              </el-menu-item>-->
<!--            </el-menu>-->
<!--          </el-aside>-->

            <el-main >
              <div class="HomeContainer">
                <router-view/>
              </div>
            </el-main>

        </el-container>
  </div>
</template>

<script>

export default {
  name: "DataHome",
  data() {
    return {
      activeIndexVertical: this.$router.options.routes[1].children[0].children[0].path,
    };
  },
  mounted() {
    // this.$router.push({
    //   path:'/data',
    // })
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

.HomeContainer {
  height: 600px;
  width: 95%;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  border-radius: 15px;
  background-clip: padding-box;
  background-color: rgba(85, 0, 0, 0);
  border: 1px solid azure;
  box-shadow: 0 0 25px rgba(222, 187, 195, 1);
  border-color: lavenderblush;
  overflow: auto;
  display: flex;
  flex-flow: row wrap;
  align-content: flex-start;
}

</style>