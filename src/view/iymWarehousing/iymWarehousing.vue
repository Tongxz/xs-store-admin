<template>
  <div>
    <div class="gva-search-box">
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="入库名称">
          <el-input v-model="searchInfo.name" placeholder="搜索条件" />
        </el-form-item>
        <el-form-item label="所属部门">
          <el-input v-model="searchInfo.department" placeholder="搜索条件" />
        </el-form-item>
        <el-form-item label="物品类别">
          <el-input v-model="searchInfo.type" placeholder="搜索条件" />
        </el-form-item>
        <el-form-item label="付款方式">
          <el-input v-model="searchInfo.payment" placeholder="搜索条件" />
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
        <el-table-column align="left" label="物品图片" prop="imgUrl" width="120" >
          <template #default="scope">
            <CustomPic pic-type="file" :pic-src="scope.row.imgUrl" />
          </template>
        </el-table-column>
        <el-table-column align="left" label="入库名称" prop="name" width="120" />
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
        <el-table-column align="left" label="付款方式" prop="payment" width="120">
            <template #default="scope">
              <el-tag>{{ filterDict(scope.row.payment,pay_byOptions) }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column align="left" label="入库数量" prop="quantity" width="120" />
          <el-table-column align="left" label="库存余量" prop="margin" width="120"/>
        <el-table-column align="left" label="成本价" prop="cost" width="120" />
        <el-table-column align="left" label="单价" prop="unitPrice" width="120" />
        <el-table-column align="left" label="总金额" prop="amount" width="120" />
        <el-table-column align="left" label="备注" prop="remarks" width="120" />
        <el-table-column align="left" label="按钮组">
            <template #default="scope">
            <el-button type="text" icon="edit" size="small" class="table-button" @click="updateWarehousingFunc(scope.row)">变更</el-button>
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
        <el-form-item label="物品图片:">
          <el-upload
              class="avatar-uploader"
              action
              :http-request="wareUpload"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload">
            <img v-if="formData.imgUrl" :src="formData.imgUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="入库名称:">
          <el-input v-model="formData.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="所属部门:">
          <el-select v-model="formData.department" @change="getDepartment">
            <el-option v-for="(item,key) in options" :key="key" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物品类别:">
          <el-select v-model="formData.type" placeholder="请选择" style="width:100%" clearable>
            <el-option v-for="(item,key) in departmentOptions" :key="key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="付款方式:">
          <el-select v-model="formData.payment" placeholder="请选择" style="width:100%" clearable>
            <el-option v-for="(item,key) in pay_byOptions" :key="key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="数量:">
          <el-input @change="setAmount" v-model.number="formData.quantity" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="单位:">
          <el-input v-model="formData.unit" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="成本价:">
          <el-input-number v-model="formData.cost"  style="width:100%" :precision="2" clearable />
        </el-form-item>
        <el-form-item label="单价:">
          <el-input-number @change="setAmount" v-model="formData.unitPrice"  style="width:100%" :precision="2" clearable />
        </el-form-item>
        <el-form-item label="总金额:">
          <el-input-number disabled v-model="formData.amount"  style="width:100%" :precision="2" clearable />
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
  name: 'Warehousing'
}
</script>

<script setup>
import {
  createWarehousing,
  deleteWarehousing,
  deleteWarehousingByIds,
  updateWarehousing,
  findWarehousing,
  getWarehousingList, getWarehousingName
} from '@/api/iymWarehousing'

// 全量引入格式化工具 请按需保留
import { getDictFunc, formatDate, formatBoolean, filterDict } from '@/utils/format'
import { ElMessage, ElMessageBox } from 'element-plus'
import CustomPic from '@/components/customPic/index.vue'
import { ref } from 'vue'
import {upLoad} from "@/api/upload";
import ImageCompress from "@/utils/image";

// 自动化生成的字典（可能为空）以及字段
const options = ref([
  {
    label: '餐饮部',
    value: 'food'
  }, {
    label: '茶艺部',
    value: 'tea'
  }
])
const foodOptions = ref([])
const teaOptions = ref([])
const pay_byOptions = ref([])
const departmentOptions = ref([])
const formData = ref({
        imgUrl: '',
        name: '',
        department: '',
        type: undefined,
        payment: undefined,
        quantity: 0,
        unit: '',
        unitPrice: 0,
        cost: 0,
        amount: 0,
        margin: 0,
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
  const table = await getWarehousingList({ page: page.value, pageSize: pageSize.value, ...searchInfo.value })
  const Name = await getWarehousingName()
  console.log(Name)
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
const setAmount = (value) => {
  if (formData.value.unitPrice && formData.value.quantity) {
    formData.value.amount = formData.value.unitPrice* formData.value.quantity
  }
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
            deleteWarehousingFunc(row)
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
      const res = await deleteWarehousingByIds({ ids })
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
const updateWarehousingFunc = async(row) => {
    const res = await findWarehousing({ ID: row.ID })
    type.value = 'update'
    if (res.code === 0) {
        formData.value = res.data.rewarehousing
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
const deleteWarehousingFunc = async (row) => {
    const res = await deleteWarehousing({ ID: row.ID })
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
      imgUrl: '',
      name: '',
      department: '',
      type: undefined,
      payment: undefined,
      quantity: 0,
      unit: '',
      unitPrice: 0,
      cost: 0,
      amount: 0,
      margin: 0,
      remarks: '',
        }
}
// 弹窗确定
const enterDialog = async () => {
      let res
  console.log(formData.value)
      switch (type.value) {
        case 'create':
          formData.value.margin = formData.value.quantity
          res = await createWarehousing(formData.value)
          break
        case 'update':
          res = await updateWarehousing(formData.value)
          break
        default:
          res = await createWarehousing(formData.value)
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
const wareUpload  = (files) =>  {
  let formFile = new FormData
  console.log(files)
  formFile.append('file',files.file)
  console.log(formFile)
  upLoad(formFile).then((data) => {
    if (data && data.code === 0) {
      console.log(data.data.file.url)
      formData.value.imgUrl = data.data.file.url
      console.log(formData)
    } else {
      this.$message.error(data.msg)
    }
  })
}
const beforeAvatarUpload= (file) =>  {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    ElMessage.error('上传头像图片只能是 JPG 格式!');
    return false
  }
  const isRightSize = file.size / 1024 < 10*1024
  if (!isRightSize) {
    // 压缩
    const compress = new ImageCompress(file, 10*1024, 1920)
    return compress.compress()
  }
  return isRightSize && isJPG;
}
</script>
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
