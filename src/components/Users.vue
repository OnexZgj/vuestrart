<template>
  <div>
    <!--    头部区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    搜索正文区域-->
    <el-card>
      <div>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input
                placeholder="请输入内容"
                v-model="queryInfo.query"
                clearable
                @clear="getUserList">

              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>

            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="addUser">添加用户</el-button>
          </el-col>
        </el-row>
      </div>


      <!--    用户列表区域-->
      <el-table
          border
          :data="userlist"
          stripe
          style="width: 100%">
        <el-table-column
            prop="username"
            label="姓名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="email"
            label="邮箱"
            width="180">
        </el-table-column>
        <el-table-column
            prop="mobile"
            label="电话">
        </el-table-column>
        <el-table-column
            prop="role_name"
            label="角色">
        </el-table-column>
        <el-table-column
            label="状态">
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
            label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" size="mini" icon="el-icon-delete"
                       @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button type="warning" size="mini" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>

      </el-table>

      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>

    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      total: 0
    }
  },
  methods: {
    showEditDialog(id) {
      console.log(id)
    },
    async removeUserById(id) {
      const {data: res} = await this.$http.delete(`users/${id}`)
      console.log(res)
      if (res.meta.status === 200) {
        this.$message.success("删除成功")
        this.getUserList()
      } else {
        this.$message.success("删除失败")
      }
    },
    setRole() {

    },

    handleSizeChange(newSize) {
      console.log(`每页 ${newSize} 条`);
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    handleCurrentChange(pageIndex) {
      console.log(`当前页: ${pageIndex}`);
      this.queryInfo.pagenum = pageIndex
      this.getUserList()
    },

    async getUserList() {
      var response = await this.$http.get('users', {params: this.queryInfo})
      console.log(response)
      const {data: res} = await this.$http.get('users', {params: this.queryInfo})
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败")
      }
      this.userlist = res.data.users
      this.total = res.data.total
    },

    async userStateChanged(userinfo) {
      console.log(userinfo)
      const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.state != 200) {
        this.$message.success("更新状态成功")
      } else {
        this.$message.error("更新状态失败")
        userinfo.mg_state = !userinfo.mg_state
      }
    },

  },

  created() {
    this.getUserList()
  },

}
</script>

<style scoped>

</style>
