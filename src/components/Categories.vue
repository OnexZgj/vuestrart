<template>
  <div>      <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="addCategroies">添加分类</el-button>

      <tree-table
          class="tree-table"
          ref="table"
          sum-text="sum"
          index-text="#"
          :data="cateList"
          :columns="columns"
          :stripe="props.stripe"
          :border="props.border"
          :show-header="props.showHeader"
          :show-summary="props.showSummary"
          :show-row-hover="props.showRowHover"
          show-index
          :tree-type="props.treeType"
          :is-fold="props.isFold"
          :expand-type="props.expandType"
          :selection-type="props.selectionType">


        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: #55a532"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>

        <template slot="opt">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>

      </tree-table>


      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[3, 5, 10, 20]"
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
      total: 0,
      props: {
        stripe: false,
        border: false,
        showHeader: true,
        showSummary: false,
        showRowHover: true,
        showIndex: false,
        treeType: true,
        isFold: true,
        expandType: false,
        selectionType: false,
      },
      cateList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '250px',
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        },
      ],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      }
    };
  },
  methods: {
    addCategroies() {

    },
    handleSizeChange(val) {
      this.queryInfo.pagesize = val
      this.getCateList()
    },

    handleCurrentChange(val) {
      this.queryInfo.pagenum = val
      this.getCateList()
    },

    async getCateList() {
      const {data: res} = await this.$http.get('categories', {params: this.queryInfo})
      console.log(res)
      if (res.meta.status != 200) {
        this.$message.error("获取分类列表失败")
      }

      this.cateList = res.data.result
      this.total = res.data.total

    }

  },

  created() {
    this.getCateList()
  }

}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
</style>
