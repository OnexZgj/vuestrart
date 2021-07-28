<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card>
      <el-table
          :data="goodsList"
          stripe
          style="width: 100%">

        <el-table-column
            type="index"
            label="#">
        </el-table-column>

        <el-table-column
            prop="goods_name"
            label="日期"
            width="180">
        </el-table-column>
        <el-table-column
            prop="goods_price"
            label="姓名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="goods_number"
            label="地址">
        </el-table-column>
        <el-table-column
            prop="goods_number"
            label="地址">
        </el-table-column>
      </el-table>
    </el-card>


  </div>
</template>

<script>
export default {
  data() {
    return {
      goodsList: [],
      queryInfo:{
        query:'',
        pagenum: 1,
        pagesize:10
      }
    }
  },
  methods: {
    async getGoodList() {
      const {data: res} = await this.$http.get("goods",{params:this.queryInfo})
      if (res.meta.status != 200) {
        return this.$message.error("请求商品列表失败")
      }
      this.goodsList = res.data
    }
  },
  created() {
    this.getGoodList()
  }
}
</script>

<style scoped>

</style>
