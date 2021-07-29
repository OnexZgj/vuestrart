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
          :data="goodsList" stripe style="width: 100%">

        <el-table-column type="index" label="#">
        </el-table-column>

        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="90"></el-table-column>
        <el-table-column prop="goods_number" label="商品数量" width="90"></el-table-column>
        <el-table-column prop="goods_number" label="创建时间" width="120"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete"
                       @click="deleteGoodById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 20, 40]"
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
      goodsList: [],
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
    }
  },
  methods: {
    async getGoodList() {
      const {data: res} = await this.$http.get("goods", {params: this.queryInfo})
      console.log(res)
      if (res.meta.status != 200) {
        return this.$message.error("获取商品列表失败")
      }
      this.$message.success("获取商品列表成功")
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    async deleteGoodById(id) {
      const {data: res} = await this.$http.delete(`goods/${id}`)
      if (res.meta.status != 200) {
        return this.$message.error("删除商品出错")
      }
      this.$message.success("删除商品成功")
      this.getGoodList()
    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getGoodList()
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getGoodList()
    }


  },
  created() {
    this.getGoodList()
  }
}
</script>

<style scoped>

</style>
