<template>
  <div>
    <div class="gva-search-box">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="searchInfo.name" placeholder="搜索条件" />
        </el-form-item>
        <el-form-item label="会员手机号">
          <el-input v-model="searchInfo.mobile" placeholder="搜索条件" />
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="searchInfo.gender" placeholder="搜索条件" />
        </el-form-item>
            <el-form-item label="是否会员" prop="memberCard">
            <el-select v-model="searchInfo.memberCard" clearable placeholder="请选择">
                <el-option
                    key="true"
                    label="是"
                    value="true">
                </el-option>
                <el-option
                    key="false"
                    label="否"
                    value="false">
                </el-option>
            </el-select>
            </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="search" @click="onSubmit">查询</el-button>
          <el-button size="small" icon="refresh" @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="gva-table-box">
        <div class="gva-btn-list">
            <el-button size="small" type="primary" icon="plus" @click="openDialog">新增</el-button>
            <el-popover v-model:visible="deleteVisible" placement="top" width="160">
            <p>确定要删除吗？</p>
            <div style="text-align: right; margin-top: 8px;">
                <el-button size="small" type="text" @click="deleteVisible = false">取消</el-button>
                <el-button size="small" type="primary" @click="onDelete">确定</el-button>
            </div>
            <template #reference>
                <el-button icon="delete" size="small" style="margin-left: 10px;" :disabled="!multipleSelection.length" @click="deleteVisible = true">删除</el-button>
            </template>
            </el-popover>
        </div>
        <el-table
        ref="multipleTable"
        style="width: 100%"
        tooltip-effect="dark"
        :data="tableData"
        row-key="ID"
        @selection-change="handleSelectionChange"
        >
        <el-table-column type="selection" width="55" />
        <el-table-column align="left" label="日期" width="180">
            <template #default="scope">{{ formatDate(scope.row.CreatedAt) }}</template>
        </el-table-column>
        <el-table-column align="left" label="姓名" prop="name" width="120" />
        <el-table-column align="left" label="会员手机号" prop="mobile" width="120" />
        <el-table-column align="left" label="性别" prop="gender" width="120">
            <template #default="scope">
            {{ filterDict(scope.row.gender,genderOptions) }}
            </template>
        </el-table-column>
          <el-table-column align="left" label="喜好" prop="like" width="120" />
          <el-table-column align="left" label="忌口" prop="diet" width="120" />
          <el-table-column align="left" label="是否会员" prop="memberCard" width="120">
            <template #default="scope">{{ formatBoolean(scope.row.memberCard) }}</template>
        </el-table-column>
        <el-table-column align="left" label="会员卡余额" prop="memberBalance" width="120" />
        <el-table-column align="left" label="开通时间" prop="openDate" width="120" >
          <template #default="scope">{{ formatDateTime(scope.row.openDate) }}</template>
        </el-table-column>
        <el-table-column align="left" label="按钮组">
            <template #default="scope">
            <el-button type="text" icon="edit" size="small" class="table-button" @click="openRechargeDialog(scope.row)">充值</el-button>
            <el-button type="text" icon="edit" size="small" class="table-button" @click="gotoMemberFunc(scope.row)">消费记录</el-button>
            <el-button type="text" icon="edit" size="small" class="table-button" @click="updateMemberFunc(scope.row)">变更</el-button>
            <el-button type="text" icon="delete" size="small" @click="deleteRow(scope.row)">删除</el-button>
            </template>
        </el-table-column>
        </el-table>
        <div class="gva-pagination">
            <el-pagination
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="page"
            :page-size="pageSize"
            :page-sizes="[10, 30, 50, 100]"
            :total="total"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            />
        </div>
    </div>
    <el-dialog v-model="dialogFormVisible" :before-close="closeDialog" title="弹窗操作">
      <el-form :model="formData" label-position="right" label-width="120px">
        <el-form-item label="姓名:">
          <el-input v-model="formData.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="会员手机号:">
          <el-input v-model.number="formData.mobile" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="性别:">
          <el-select v-model="formData.gender" placeholder="请选择" style="width:100%" clearable>
            <el-option v-for="(item,key) in genderOptions" :key="key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否会员:" v-if="type !== 'update'">
          <el-switch v-model="formData.memberCard" active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否" clearable ></el-switch>
        </el-form-item>
        <el-form-item label="会员卡余额:" v-if="formData.memberCard && type !=='update'">
          <el-input-number v-model="formData.memberBalance"  style="width:100%" :precision="2" clearable />
        </el-form-item>
        <el-form-item label="开通时间:" v-if="formData.memberCard && type !=='update'">
          <el-date-picker  v-model="formData.openDate" type="date" style="width:100%" placeholder="选择日期" clearable />
        </el-form-item>
        <el-form-item label="喜好:">
          <el-input v-model="formData.like" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="忌口:">
          <el-input v-model="formData.diet" clearable placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="rechargeDialogFormVisible" :before-close="closeRechargeDialog" title="弹窗操作">
      <el-form :model="rechargeFormData" label-position="right" label-width="80px">
        <el-form-item label="充值金额:">
          <el-input-number v-model="rechargeFormData.amount"  style="width:100%" :precision="2" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeRechargeDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterRechargeDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Member'
}
</script>

<script setup>
import {
  createMember,
  deleteMember,
  deleteMemberByIds,
  updateMember,
  findMember,
  getMemberList
} from '@/api/umsMember'
const router = useRouter()
// 全量引入格式化工具 请按需保留
import {formatDateTime, getDictFunc, formatDate, formatBoolean, filterDict } from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import {useRouter} from "vue-router";
import {createRecharge} from "@/api/umsRecharge";

// 自动化生成的字典（可能为空）以及字段
const genderOptions = ref([])
const formData = ref({
        name: '',
        diet: '',
        like: '',
        mobile: 0,
        gender: undefined,
        memberCard: false,
        memberBalance: 0,
        openDate: new Date(),
        })
const rechargeFormData = ref({
        memberId: 0,
        amount: 0,
        sign: true,
        })

// =========== 表格控制部分 ===========
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
const searchInfo = ref({})

// 重置
const onReset = () => {
  searchInfo.value = {}
}

// 搜索
const onSubmit = () => {
  page.value = 1
  pageSize.value = 10
  if (searchInfo.value.memberCard === ""){
      searchInfo.value.memberCard=null
  }
  getTableData()
}

// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

// 修改页面容量
const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 查询
const getTableData = async() => {
  const table = await getMemberList({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

getTableData()

// ============== 表格控制部分结束 ===============

// 获取需要的字典 可能为空 按需保留
const setOptions = async () =>{
    genderOptions.value = await getDictFunc('gender')
}

// 获取需要的字典 可能为空 按需保留
setOptions()


// 多选数据
const multipleSelection = ref([])
// 多选
const handleSelectionChange = (val) => {
    multipleSelection.value = val
}

// 删除行
const deleteRow = (row) => {
    ElMessageBox.confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
            deleteMemberFunc(row)
        })
    }


// 批量删除控制标记
const deleteVisible = ref(false)

// 多选删除
const onDelete = async() => {
      const ids = []
      if (multipleSelection.value.length === 0) {
        ElMessage({
          type: 'warning',
          message: '请选择要删除的数据'
        })
        return
      }
      multipleSelection.value &&
        multipleSelection.value.map(item => {
          ids.push(item.ID)
        })
      const res = await deleteMemberByIds({ ids })
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功'
        })
        if (tableData.value.length === ids.length && page.value > 1) {
          page.value--
        }
        deleteVisible.value = false
        getTableData()
      }
    }

// 行为控制标记（弹窗内部需要增还是改）
const type = ref('')

// 更新行
const updateMemberFunc = async(row) => {
    const res = await findMember({ ID: row.ID })
    type.value = 'update'
    if (res.code === 0) {
        formData.value = res.data.remember
        dialogFormVisible.value = true
    }
}
// 消费记录
const gotoMemberFunc = async(row) => {
  router.push({
    name: 'recharge',
    params: {
      id: row.ID,
    },
  })
}


// 删除行
const deleteMemberFunc = async (row) => {
    const res = await deleteMember({ ID: row.ID })
    if (res.code === 0) {
        ElMessage({
                type: 'success',
                message: '删除成功'
            })
            if (tableData.value.length === 1 && page.value > 1) {
            page.value--
        }
        getTableData()
    }
}

// 弹窗控制标记
const dialogFormVisible = ref(false)
const rechargeDialogFormVisible = ref(false)

// 打开弹窗
const openDialog = () => {
    type.value = 'create'
    dialogFormVisible.value = true
}// 打开弹窗
const openRechargeDialog = (row) => {
    type.value = 'create'
    rechargeFormData.value.memberId = row.ID
    rechargeDialogFormVisible.value = true
}

// 关闭弹窗
const closeDialog = () => {
    dialogFormVisible.value = false
    formData.value = {
        name: '',
        diet: '',
        like: '',
        mobile: 0,
        gender: undefined,
        memberCard: false,
        memberBalance: 0,
        openDate: new Date(),
        }
}
// 关闭弹窗
const closeRechargeDialog = () => {
    rechargeDialogFormVisible.value = false
    rechargeFormData.value = {
          memberId: 0,
          amount: 0,
          sign: true,
        }
}
// 弹窗确定
const enterDialog = async () => {
      let res
      switch (type.value) {
        case 'create':
          res = await createMember(formData.value)
          break
        case 'update':
          res = await updateMember(formData.value)
          break
        default:
          res = await createMember(formData.value)
          break
      }
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '创建/更改成功'
        })
        closeDialog()
        getTableData()
      }
}
// 弹窗确定
const enterRechargeDialog = async () => {
      let res
      res = await createRecharge(rechargeFormData.value)
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '创建/更改成功'
        })
        closeRechargeDialog()
        getTableData()
      }
}
</script>

<style>
</style>
