<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <span>渣渣辉代言</span>
      </div>

      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="#ffd04b"
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 router :default-active='activePath'>
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>

            <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id"
                          @click="saveNavState('/' + subitem.path)">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>

          </el-submenu>

        </el-menu>
      </el-aside>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      activePath: '',
      isCollapse: false
    }
  },

  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    async getMenuList() {
      const {data: res} = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(res)
    },
    async saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
    logout() {

    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    }
  }

}
</script>

<style scoped>
.home-container {
  height: 100%;
  background-color: #2b4b6b;
}

.el-header {
  background-color: #373d41;
  padding-left: 10px;
  color: #fff;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-aside {
  background-color: #333744;
}

.toggle-button {
  background-color: #4a5064;
  text-align: center;
  letter-spacing: 0.2em;
  color: #fff;
}

.el-menu {
  border-right: none;
}

.el-main {
  background-color: #eaedf1;
}
</style>
