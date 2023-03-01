<template>
  <div class="layout">
    <el-container>
      <el-header class="header">
        <div class="logo">EasyBlog</div>
        <div class="user-info">
          <span>欢迎回来</span>
          <el-dropdown>
            <span class="el-dropdown-link nick-name">
              {{ userInfo.nick_name }}
              <span class="iconfont icon-close"></span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div class="avatar"><img :src="userInfo.avatar"></div>
        </div>
      </el-header>
      <el-container class="container">
        <el-aside width="200px" class="left-aside">
          <div>
            <el-button class="post-btn">发布</el-button>
          </div>
          <div class="menu-panner">
            <ul>
              <li v-for="(menu,index) in menuList">
                <span class="menu-title-p" @click="openClose(index)">
                  <span :class="['iconfont',menu.icon]"></span>
                  <span class="menu-title">{{ menu.title }}</span>
                  <span :class="['iconfont','open-close',menu.open ? 'icon-open':'icon-close']"></span>
                </span>
                <ul class="sub-menu" v-if="menu.open">
                  <li v-for="subMenu in menu.child">
                    <router-link :to="subMenu.path" :class="['sub-menu-item',activePath==subMenu.path?'active':'']">
                      {{ subMenu.title }}
                    </router-link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

        </el-aside>
        <el-main class="right-main">
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import VueCookies from 'vue-cookies'
import {getCurrentInstance, ref, watch} from "vue";
import {useRouter, useRoute} from "vue-router";

const router = useRouter();
const route = useRoute();
const {proxy} = getCurrentInstance();
const menuList = ref([
  {
    title: '博客',
    icon: 'icon-blog',
    open: true,
    child: [
      {
        title: '博客管理',
        path: '/blog/list',
      },
      {
        title: '博客分类',
        path: '/blog/category',
      }
    ],
  },
  {
    title: '专题',
    icon: 'icon-zhuanti',
    open: false,
    child: [
      {
        title: '专题管理',
        path: '/special/list',
      },
    ],
  },
  {
    title: '设置',
    icon: 'icon-setting',
    open: false,
    child: [
      {
        title: '个人信息设置',
        path: '/setting/my',
      },
      {
        title: '博客成员',
        path: '/setting/user',
      },
      {
        title: '系统成员',
        path: '/setting/sysSetting',
      }
    ],
  },
  {
    title: '回收站',
    icon: 'icon-delete',
    open: false,
    child: [
      {
        title: '回收站',
        path: '/recovery/list',
      }
    ],
  }
])

const openClose = (index) => {
  const open = menuList.value[index].open;
  menuList.value[index].open = !open;
}

const userInfo = ref();

const init = () => {
  userInfo.value = VueCookies.get('userInfo')
  userInfo.value.avatar = proxy.globalInfo.imageUrl + userInfo.value.avatar;
  console.log(userInfo.value);
}
init();
const activePath = ref(null)
watch(route, (newVal, oldVal) => {
  console.log(newVal);
  activePath.value = newVal.path
}, {immediate: true, deep: true});
</script>

<style lang="scss">
.layout {
  .header {
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .logo {
      font-size: 30px;
    }

    .user-info {
      display: flex;
      align-items: center;

      .nick-name {
        cursor: pointer;
        color: #2248de;

        .icon-close {
          font-size: 14px;
        }
      }

      .avatar {
        width: 50px;

        img {
          border-radius: 25px;
          width: 100%;
        }
      }

    }
  }

  .container {
    background: #f5f6f7;
    height: calc(100vh - 60px);
  }

  .left-aside {
    padding-top: 15px;
    margin-left: 10px;
    width: 300px;

    .post-btn {
      background: green;
      color: #fff;
      width: 100%;
      height: 40px;
    }

    .menu-panner {
      margin-top: 5px;

      ul, li {
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .menu-title-p {
        padding: 0 5px;
        line-height: 45px;
        cursor: pointer;
        display: flex;

        .iconfont {
          font-size: 18px;
          color: #91949a;
        }

        .menu-title {
          flex: 1;
          color: #3f4042;
          margin-left: 10px;
        }

        .open-close {
          width: 20px;
          font-size: 16px;
        }
      }

      .menu-title-p:hover {
        background: #ddd;
      }

      .sub-menu {
        font-size: 14px;

        .sub-menu-item {
          padding: 0 10px 0 33px;
          display: block;
          cursor: pointer;
          line-height: 40px;
          text-decoration: none;
          color: #3f4042;
        }
        .active{
          background: #ddd;
        }

        .sub-menu-item:hover {
          background: #ddd;
        }
      }
    }
  }

  .right-main {
    background: #fff;
  }
}
</style>