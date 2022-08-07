<template>
  <div>
    <div class="gva-search-box">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="支出类型">
          <el-input v-model="searchInfo.type" placeholder="搜索条件" />
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="searchInfo.payment" placeholder="请选择搜索条件" style="width:100%" clearable>
            <el-option v-for="(item,key) in Pay_byOptions" :key="key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="经办人">
          <el-input v-model="searchInfo.executor" placeholder="搜索条件" />
        </el-form-item>
        <el-form-item label="是否开票" prop="invoice">
          <el-select v-model="searchInfo.invoice" clearable placeholder="请选择">
            <el-option
              key="true"
              label="是"
              value="true"
            />
            <el-option
              key="false"
              label="否"
              value="false"
            />
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
        <el-button class="excel-btn" size="small" type="primary" icon="download" @click="handleExcelExport()">导出</el-button>
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
        <el-table-column align="left" label="支出日期" width="120">
          <template #default="scope">{{ formatDateTime(scope.row.expnDate) }}</template>
        </el-table-column>
        <el-table-column align="left" label="支出说明" prop="content" width="120" />
        <el-table-column align="left" label="金额" prop="amount"  />
        <el-table-column align="left" label="支出部门" prop="department"  >
          <template #default="scope" >
            <el-tag v-if="scope.row.department === 'food'">餐饮部</el-tag>
            <el-tag v-if="scope.row.department === 'tea'">茶艺部</el-tag>
            <el-tag v-if="scope.row.department === 'other'">其他</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="left" label="支出类型" prop="type"  >
          <template #default="scope" >
            <el-tag v-if="scope.row.department === 'food'">{{ filterDict(scope.row.type,foodOptions) }}</el-tag>
            <el-tag v-if="scope.row.department === 'tea'">{{ filterDict(scope.row.type,teaOptions) }}</el-tag>
            <el-tag v-if="scope.row.department === 'other'">{{ filterDict(scope.row.type,otherOptions) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="left" label="支付方式" prop="payment"  >
          <template #default="scope">
            <el-tag>
              {{ filterDict(scope.row.payment,Pay_byOptions) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column align="left" label="经办人" prop="executor"  />
        <el-table-column align="left" label="是否开票" prop="invoice" >
          <template #default="scope">{{ formatBoolean(scope.row.invoice) }}</template>
        </el-table-column>
        <el-table-column align="left" label="备注" prop="note" show-overflow-tooltip width="120" />
        <el-table-column align="left" label="创建日期" width="180">
          <template #default="scope">{{ formatDate(scope.row.CreatedAt) }}</template>
        </el-table-column>
        <el-table-column align="left" label="按钮组">
          <template #default="scope">
            <el-button type="text" icon="edit" size="small" class="table-button" @click="updateExpensesFunc(scope.row)">变更</el-button>
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
      <el-form :model="formData" label-position="right" label-width="80px">
        <el-form-item label="支出说明:">
          <el-input v-model="formData.content" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="支出日期:">
          <el-date-picker  v-model="formData.expnDate" :disabled-date="disabledDate" type="date" format="YYYY/MM/DD"
            value-format="YYYY-MM-DD" style="width:100%" placeholder="选择日期" clearable />
        </el-form-item>
        <el-form-item label="金额:">
          <el-input-number v-model="formData.amount" style="width:100%" :precision="2" clearable />
        </el-form-item>
        <el-form-item label="部门:">
          <el-select v-model="formData.department" @change="getDepartment" placeholder="请选择">
            <el-option v-for="item in options" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item label="支出类型:">
          <el-select v-model="formData.type" placeholder="请选择" style="width:100%" clearable>
            <el-option v-for="(item,key) in departmentOptions" :key="key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式:">
          <el-select v-model="formData.payment" placeholder="请选择" style="width:100%" clearable>
            <el-option v-for="(item,key) in Pay_byOptions" :key="key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="经办人:">
          <el-input v-model="formData.executor" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="是否开票:">
          <el-switch v-model="formData.invoice" active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否" clearable />
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="formData.note" clearable placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button size="small" @click="closeDialog">取 消</el-button>
          <el-button size="small" type="primary" @click="enterDialog">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Expenses'
}
</script>

<script setup>
import {
  createExpenses,
  deleteExpenses,
  deleteExpensesByIds,
  updateExpenses,
  findExpenses,
  getExpensesList, getExpensesExcel
} from '@/api/fi_expenses'

// 全量引入格式化工具 请按需保留
import { formatDate, formatDateTime, formatBoolean,filterDict, getDictFunc } from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import {getWarehousingExcel} from "@/api/iymWarehousing";
const options = ref([
  {
    name: '餐饮部',
    code: 'food'
  }, {
    name: '茶艺部',
    code: 'tea'
  }, {
    name: '其他',
    code: 'other'
  }
])
// 自动化生成的字典（可能为空）以及字段
let departmentOptions = ref([])
const Pay_byOptions = ref([])
const teaOptions = ref([])
const foodOptions = ref([])
const otherOptions = ref([])
const formData = ref({
  content: '',
  amount: 0,
  type: 0,
  payment: '',
  department: '',
  expnDate: '',
  executor: '',
  invoice: false,
  note: '',
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
  if (searchInfo.value.invoice === '') {
    searchInfo.value.invoice = null
  }
  if (searchInfo.value.payment === '') {
    searchInfo.value.payment = null
  }
  getTableData()
}
const disabledDate = (time) => {
  return time.getTime() > Date.now()
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
  const table = await getExpensesList({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
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
const setFoodOptions = async(data) => {
  foodOptions.value = await getDictFunc('food')
  teaOptions.value = await getDictFunc('tea')
  Pay_byOptions.value = await getDictFunc('pay_by')
  otherOptions.value = await getDictFunc('other')
}
const setOptions = async(data) => {
  departmentOptions.value = await getDictFunc(data)
}

// 获取需要的字典 可能为空 按需保留
setFoodOptions()
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
    deleteExpensesFunc(row)
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
  const res = await deleteExpensesByIds({ ids })
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
const updateExpensesFunc = async(row) => {
  const res = await findExpenses({ ID: row.ID })
  type.value = 'update'
  if (res.code === 0) {
    formData.value = res.data.reexpenses
    if (formData.value.department === 'food'){
      departmentOptions.value = foodOptions.value
    }
    if (formData.value.department === 'tea'){
      departmentOptions.value = teaOptions.value
    }
    if (formData.value.department === 'other'){
      departmentOptions.value = otherOptions.value
    }
    dialogFormVisible.value = true
  }
}

// 删除行
const deleteExpensesFunc = async(row) => {
  const res = await deleteExpenses({ ID: row.ID })
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

// 打开弹窗
const openDialog = () => {
  type.value = 'create'
  dialogFormVisible.value = true
}
const getDepartment = (value) => {
  if (value === 'food'){
    departmentOptions.value = foodOptions.value
  }
  if (value === 'tea'){
    departmentOptions.value = teaOptions.value
  }
  if (value === 'other'){
    departmentOptions.value = otherOptions.value
  }
}
// 关闭弹窗
const closeDialog = () => {
  dialogFormVisible.value = false
  formData.value = {
    content: '',
    amount: 0,
    type: 0,
    payment: '',
    department: '',
    expnDate: '',
    executor: '',
    invoice: false,
    note: '',
  }
}
// 弹窗确定
const enterDialog = async() => {
  let res
  switch (type.value) {
    case 'create':
      res = await createExpenses(formData.value)
      break
    case 'update':
      res = await updateExpenses(formData.value)
      break
    default:
      res = await createExpenses(formData.value)
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
const handleExcelExport = (fileName) => {
  if (!fileName || typeof fileName !== 'string') {
    fileName = '支出列表.xlsx'
  }
  getExpensesExcel(searchInfo.value, fileName)
}
</script>

<style>
</style>
