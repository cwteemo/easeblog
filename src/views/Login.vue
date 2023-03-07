<template>
  <div class="login-body">
    <div class="login-panel">
      <div class="login-title">用户登录</div>
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="account">
          <el-input placeholder="请输入账号" v-model="formData.account">
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="formData.password">
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input placeholder="请输入验证码" v-model="formData.checkCode" class="input-panel" @keyup.enter.native="login"/>
            <img :src="checkCodeUrl" class="check-code" @click="changeCheckCode"/>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="formData.rememberMe" :true-label="1">
            记住我
          </el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :style="{width:'100%'}" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import VueCookies from 'vue-cookies'
import md5 from 'js-md5'
import {useRouter} from 'vue-router';
import {getCurrentInstance, reactive, ref} from "vue";

const {proxy} = getCurrentInstance();

const router = useRouter();

const api = {
  checkCode: "blog/checkCode",
  login: 'user/login',
}

const checkCodeUrl = ref(api.checkCode + "?" + new Date().getTime());
const changeCheckCode = () => {
  checkCodeUrl.value = api.checkCode + "?" + new Date().getTime();
}

//表单
const formDataRef = ref();
const formData = reactive({});

const rules = {
  account: [{
    required: true,
    message: "请输入用户名",
  }],
  password: [{
    required: true,
    message: "请输入密码",
  }],
  checkCode: [{
    required: true,
    message: "请输入验证码",
  }]
};


const init = () => {
  const loginInfo = VueCookies.get('loginInfo')
  if (!loginInfo) {
    return;
  }
  Object.assign(formData, loginInfo)

  //监听回车触发登录
  /*document.onkeydown = (e)=>{
    if (e.keyCode !== 13){
      return;
    }
    login()
  }*/
}
init();

const login = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      proxy.Message.error('登陆失败')
      return false;
    }

    let cookieLoginInfo = VueCookies.get('loginInfo');
    let cookiePassword = cookieLoginInfo == null ? null : cookieLoginInfo.password
    if (cookiePassword !== formData.password){
      formData.password = md5(formData.password);
    }

    let param = {
      account: formData.account,
      password: formData.password,
      checkCode: formData.checkCode,
    }
    console.log(param);
    let result = await proxy.Request({
      url: api.login,
      params: param,
      errorCallback: () => {
        changeCheckCode();
      }
    })
    if (!result) {
      return;
    }

    proxy.Message.success('登陆成功')
    VueCookies.set('userInfo', result, 0)
    const loginInfo = {
      account: param.account,
      password: param.password,
      rememberMe: formData.rememberMe,
    }
    if (formData.rememberMe == 1) {
      VueCookies.set('loginInfo', loginInfo, '7d')
    }

    setTimeout(()=>{
      router.push('/')
    },1500)

  })
}

</script>

<style lang="scss">
.login-body {
  width: 100%;
  height: calc(100vh);
  background-size: cover;
  background-position: center;
  background-image: url("../assets/login-bg.jpg")
}

.login-panel {
  margin-top: 150px;
  width: 350px;
  float: right;
  margin-right: 100px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 5px;
  box-shadow: #ddd;
}

.login-title {
  font-size: 20px;
  text-align: center;
  margin-bottom: 10px;
}

.check-code-panel {
  width: 100%;
  display: flex;
  align-items: center;
}

.input-panel {
  flex: 1;
  margin-right: 5px;
}

.check-code {
  height: 30px;
  cursor: pointer;
}
</style>