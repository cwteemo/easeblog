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
            <el-input placeholder="请输入验证码" v-model="formData.checkCode" class="input-panel"/>
            <img :src="checkCodeUrl" class="check-code" @click="changeCheckCode"/>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="formData.rememberMe" :label="true">
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
import VueCookie from 'vue-cookies'
import md5 from 'js-md5'
import {getCurrentInstance, reactive, ref} from "vue";

const {proxy} = getCurrentInstance();

const api = {
  checkCode: "blog/checkCode",
  login: 'login',
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

const login = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      console.log(1);
      return false;
    }
    console.log(2);
    let param = {
      account: formData.account,
      password: md5(formData.password),
      checkCode: formData.checkCode,
    }
    let result = await proxy.Request({
      url: api.login,
      params: param,
      errorCallback: () => {
        console.log(3);
        changeCheckCode();
      }
    })
    if (!result) {
      console.log(4);
      return;
    }
    console.log(5);
    VueCookie.set('userInfo',result.data,0)
    const loginInfo = {
      account:param.account,
      password:param.password,
    }
    console.log(6);
    if (formData.rememberMe){
      console.log(7);
      VueCookie.set('loginInfo',loginInfo,'7d')
    }
    console.log(8);

  })
}

</script>

<style lang="scss">
.login-body {
  width: 100%;
  height: calc(100vh);
  background-size: cover;
  background-position: center;
  background-image: url("../assets/login.jpg")
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