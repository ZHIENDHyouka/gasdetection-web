<template>
  <div id="LoginManager">
    <div class="loginbackgroundImg" v-show="!showRegisterOrLogin">
      <el-form
          :rules="loginRules" ref="loginForm"
          class="loginContainer" :model="loginForm">
        <h3 class="loginTitle">登录</h3>
        <el-form-item prop="username">
          <el-input type="text" placeholder="请输入账号" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" auto-complete="false"
                    placeholder="请输入密码" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round style="margin-left: 80px; width: 100px" @click="login('loginForm')">登录
          </el-button>
          <el-link style="margin-left: 10px; color: cornflowerblue" @click="changeRegister">注册</el-link>
        </el-form-item>
      </el-form>
    </div>

    <div class="loginbackgroundImg" v-show="showRegisterOrLogin">
      <el-form ref="registerForm" class="loginContainer"
               :model="registerForm" :rules="registerRules">
        <h3 class="loginTitle">注册</h3>
        <el-form-item prop="username">
          <el-input auto-complete="false" type="text"
                    placeholder="请输入用户名"  v-model.trim="registerForm.username"
                    maxlength="7"></el-input>
<!--          oninput="if(value.length>11)value=value.slice(0,10)"-->
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" auto-complete="false"
                    placeholder="请输入密码" v-model.trim="registerForm.password"
                    maxlength="10"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round style="margin-left: 80px; width: 100px" @click="register('registerForm')">注册
          </el-button>
          <el-link style="margin-left: 10px;color: cornflowerblue" @click="changeRegister">登录</el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {login, register} from "@/utils/api";

export default {
  name: 'LoginManager',
  data() {
    return {
      showRegisterOrLogin: false,
      registerForm: {
        username: '',
        password: '',
      },
      loginForm: {
        username: '',
        password: '',
      },
      loginRules: {
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
      },
      registerRules: {
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
      },
    }
  },
  methods: {
    changeRegister() {
      this.showRegisterOrLogin = !this.showRegisterOrLogin;
      this.clearRegisterForm();
      this.clearLoginForm();
    },
    login(loginForm) {
      // this.$router.replace('/home')
      // this.$router.push({
      //   path:'/home',
      //   query:{
      //     username:'张三'
      //   }
      // })
      this.$refs[loginForm].validate((valid) => {
        if (valid) {
          login(this.loginForm).then(res => {
            const message = res.msg;
            const code = res.code;
            const username  = res.data.username;
            const userId=res.data.managerId;
            const userLevel=res.data.managerLevel;
            const flag = this.returnInfo(message, code);
            if (flag) {
              this.clearLoginForm();
              //页面跳转
              // this.$store.state.username=username;
              // this.$router.replace(`${this.$router.options.routes[1].path}`);
              this.$router.push({
                // path:'/MainHome',
                path:`${this.$router.options.routes[1].path}`,
                query:{
                  username: username,
                  userId:userId,
                  userLevel:userLevel
                }
              })
            }
          })
        } else {
          return false;
        }
      });
    },
    register(registerForm) {
      console.log(this.registerForm);
      this.$refs[registerForm].validate((valid) => {
        if (valid) {
          register(this.registerForm).then((res) => {
            const message = res.msg;
            const code = res.code;
            const flag = this.returnInfo(message, code);
            if (flag) {
              this.changeRegister();
              this.loginForm.username = this.registerForm.username;
              this.loginForm.password = this.registerForm.password;
            }
          });
        } else {
          return false;
        }
      });
    },
    clearLoginForm() {
      this.loginForm.username = '';
      this.loginForm.password = '';
    },
    clearRegisterForm() {
      this.registerForm.username = '';
      this.registerForm.password = '';
    },
    returnInfo(message, code) {
      if (code === 1) {
        this.$message.success({
          message:message,
          duration:1000,
        });
        return true;
      } else {
        this.$message.error({
          message:message,
          duration:1000,
        });
        return false;
      }
    }
  }
}
</script>

<style scoped>
.loginContainer {
  /*圆角*/
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background-color: rgba(85, 0, 0, 0);
  border: 1px solid azure;
  box-shadow: 0 0 25px rgba(222, 187, 195, 1);
  border-color: lavenderblush;
}

.loginTitle {
  margin: 0px auto 20px auto;
  text-align: center;
}

.loginRemember {
  text-align: left;
  margin: 0px 0px 15px 0px;
}

.loginbackgroundImg {
  width: 100%;
  height: 100%;
  /*background-image: url("img/dinner.jpg");*/
  /* background: lavenderblush; */
  /*使div占满整个屏幕*/
  position: fixed;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

/*input输入框变成透明*/
/deep/ .el-input__inner {
  background-color: transparent !important;
  border: 1px solid #1296db;
}

/*input { !*背景透明*! background-color: transparent; !*去边框*! border: 0; !*去外边框*! outline: none; !*文本颜色*! color: white; }*/


</style>
