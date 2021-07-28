<template>
  <div>
    <!--    头部区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    角色列表区域-->
    <el-card>

      <el-button type="primary">添加角色</el-button>
      <el-table :data="rolelist" stripe border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">

          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>

        </el-table-column>
      </el-table>

    </el-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      rolelist: []
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const {data: res} = await this.$http.get('roles')
      console.log(res)
      if (res.meta.status != 200) {
       return  this.$message.error("获取角色列表失败")
      }
      this.rolelist = res.data;
    }
  }
}
</script>

<style scoped>

</style>
