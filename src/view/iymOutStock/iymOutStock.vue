<template>
  <div>
    <div class="gva-search-box">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="类型">
          <el-input v-model="searchInfo.type" placeholder="搜索条件" />
        </el-form-item>
        <el-form-item label="物品名称">
          <el-input v-model="searchInfo.name" placeholder="搜索条件" />
        </el-form-item>
        <el-form-item label="物品类型">
          <el-input v-model="searchInfo.item_type" placeholder="搜索条件" />
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
        <el-table-column align="left" label="物品名称" prop="name" width="120" />
          <el-table-column align="left" label="所属部门" prop="department" width="120" >
            <template #default="scope" >
              <el-tag v-if="scope.row.department === 'food'">餐饮部</el-tag>
              <el-tag v-if="scope.row.department === 'tea'">茶艺部</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="left" label="物品类别" prop="type" width="120">
            <template #default="scope" >
              <el-tag v-if="scope.row.department === 'food'">{{ filterDict(scope.row.type,foodOptions) }}</el-tag>
              <el-tag v-if="scope.row.department === 'tea'">{{ filterDict(scope.row.type,teaOptions) }}</el-tag>
            </template>
          </el-table-column>
        <el-table-column align="left" label="单位" prop="unit" width="120" />
        <el-table-column align="left" label="数量" prop="quantity" width="120">
        </el-table-column>

        <el-table-column align="left" label="单价" prop="unitPrice" width="120" />
        <el-table-column align="left" label="金额" prop="amount" width="120" />
        <el-table-column align="left" label="备注" prop="remarks" width="120" />
        <el-table-column align="left" label="按钮组">
            <template #default="scope">
            <el-button type="text" icon="edit" size="small" class="table-button" @click="updateOutStockFunc(scope.row)">变更</el-button>
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
        <el-form-item label="物品名称:">
          <el-select v-model="formData.name" @change="getWarehousingInfo">
            <el-option v-for="(item,key) in WarehousingName" :key="key" :label="item.name" :value="item.ID"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属部门:">
          <el-select v-model="formData.department" :disabled="true" @change="getDepartment">
            <el-option v-for="(item,key) in options" :key="key" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物品类别:">
          <el-select v-model="formData.type" disabled placeholder="请选择">
            <el-option v-for="(item,key) in departmentOptions" :key="key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="单位:">
          <el-input v-model="formData.unit" disabled placeholder="请输入" />
        </el-form-item>
        <el-form-item label="数量:">
          <el-input-number v-model="formData.quantity" min="1" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="单价:">
          <el-input-number v-model="formData.unitPrice" disabled  :precision="2" clearable />
        </el-form-item>
        <el-form-item label="金额:">
          <el-input-number v-model="formData.amount"  :precision="2" clearable />
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="formData.remarks" clearable placeholder="请输入" />
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
  name: 'OutStock'
}
</script>

<script setup>
import {
  createOutStock,
  deleteOutStock,
  deleteOutStockByIds,
  updateOutStock,
  findOutStock,
  getOutStockList
} from '@/api/iymOutStock'

// 全量引入格式化工具 请按需保留
import { getDictFunc, formatDate, formatBoolean, filterDict } from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import {findWarehousing, getWarehousingName} from "@/api/iymWarehousing";
const options = ref([
  {
    label: '餐饮部',
    value: 'food'
  }, {
    label: '茶艺部',
    value: 'tea'
  }
])
// 自动化生成的字典（可能为空）以及字段
const intOptions = ref([])
const foodOptions = ref([])
const teaOptions = ref([])
const pay_byOptions = ref([])
const departmentOptions = ref([])
const WarehousingName = ref([])
const formData = ref({
        type: '',
        wareId: 0,
        name: '',
        item_type: '',
        unit: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
        remarks: '',
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
  const table = await getOutStockList({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
  const Warehousing = await getWarehousingName()
  if (Warehousing.code === 0){
    console.log(Warehousing)
    WarehousingName.value = Warehousing.data.rewarehousing
    console.log(WarehousingName)
  }
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
    intOptions.value = await getDictFunc('int')
    foodOptions.value = await getDictFunc('food')
    teaOptions.value = await getDictFunc('tea')
    pay_byOptions.value = await getDictFunc('pay_by')
}

// 获取需要的字典 可能为空 按需保留
setOptions()
const getDepartment = (value) => {
  if (value === 'food'){
    departmentOptions.value = foodOptions.value
  }
  if (value === 'tea'){
    departmentOptions.value = teaOptions.value
  }
}
const getWarehousingInfo = async (value) => {
  console.log(value)
  const res = await findWarehousing ({ID: value})
  if (res.code === 0) {
    console.log(res.data.rewarehousing)
    formData.value.wareId = res.data.rewarehousing.ID
    formData.value.type = res.data.rewarehousing.type
    formData.value.name = res.data.rewarehousing.name
    formData.value.item_type = res.data.rewarehousing.item_type
    formData.value.unit = res.data.rewarehousing.unit
    formData.value.unitPrice = res.data.rewarehousing.unitPrice
    formData.value.department = res.data.rewarehousing.department
    if (formData.value.department === 'food'){
      departmentOptions.value = foodOptions.value
    }
    if (formData.value.department === 'tea'){
      departmentOptions.value = teaOptions.value
    }
  }
  console.log(res.data)
  console.log(formData)
}

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
            deleteOutStockFunc(row)
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
      const res = await deleteOutStockByIds({ ids })
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
const updateOutStockFunc = async(row) => {
    const res = await findOutStock({ ID: row.ID })
    type.value = 'update'
    if (res.code === 0) {
        formData.value = res.data.restock
      if (formData.value.department === 'food'){
        departmentOptions.value = foodOptions.value
      }
      if (formData.value.department === 'tea'){
        departmentOptions.value = teaOptions.value
      }
        dialogFormVisible.value = true
    }
}


// 删除行
const deleteOutStockFunc = async (row) => {
    const res = await deleteOutStock({ ID: row.ID })
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

// 关闭弹窗
const closeDialog = () => {
    dialogFormVisible.value = false
    formData.value = {
        type: '',
        name: '',
        item_type: '',
        unit: '',
        quantity: undefined,
        unit_price: 0,
        amount: 0,
        remarks: '',
        }
}
// 弹窗确定
const enterDialog = async () => {
      let res
      switch (type.value) {
        case 'create':
          res = await createOutStock(formData.value)
          break
        case 'update':
          res = await updateOutStock(formData.value)
          break
        default:
          res = await createOutStock(formData.value)
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
</script>

<style>
</style>
