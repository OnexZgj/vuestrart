<template>
  <div>
    <!--    头部区域-->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    搜索正文区域-->
    <el-card>
      <div>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="addUser">添加用户</el-button>
          </el-col>
        </el-row>
      </div>


      <!--    用户列表区域-->
      <el-table border :data="userlist" stripe style="width: 100%">
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column label="状态">
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
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" size="mini" icon="el-icon-setting" @click="setRole(scope.row)"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>

      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <el-dialog title="修改用户" :visible.sync="editDialogVisible"
               @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef">
        <el-form-item label="用户名" label-width="70px">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="邮箱" label-width="70px" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" label-width="70px" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="addDialogClosed">
      <el-form :model='addForm' :rules='addUserRules' ref='addUserRef' label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
export default {
  data() {

    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return cb;
      }
      cb(new Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }


    return {
      queryInfo: {
        query: "",
        //当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 控制添加用户的对话框的显示与隐藏
      addDialogVisible: false,

      // 查询到的用户信息对象
      editForm: {},

      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },

      editFormRules: {
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入用户手机', trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ]
      },
      addUserRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'},
          {validator: checkEmail, trigger: 'blur'}
        ],
        mobile: [
          {required: true, message: '请输入用户手机', trigger: 'blur'},
          {validator: checkMobile, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {

    //添加用户按钮
    addUser() {
      this.addDialogVisible = true
    },
    //添加用户
    addUserInfo() {
      // debugger
      console.log("addUserInfo")
      this.$refs.addUserRef.validate(async (valid) => {
        console.log(valid)
        if (!valid) return

        console.log(this.addForm)
        const {data: res} = await this.$http.post('users', this.addForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error("添加失败")
        }
        this.$message.success("添加成功")
        this.addDialogVisible = false
        this.getUserList();

      })
    },

    //编辑弹框关闭
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },


    addDialogClosed() {
      this.$refs.addUserRef.resetFields();
    },


    //更新用户信息
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return
        const {data: res} = await this.$http.put(`users/${this.editForm.id}`, {
          'email': this.editForm.email,
          'mobile': this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败")
        }
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success("更新用户信息成功")
      })
    },

    async showEditDialog(id) {
      const {data: res} = await this.$http.get(`users/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败")
      }
      this.editForm = res.data
      this.editDialogVisible = true
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
