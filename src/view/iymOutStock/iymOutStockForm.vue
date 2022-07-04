<template>
  <div>
    <div class="gva-form-box">
      <el-form :model="formData" label-position="right" label-width="80px">
        <el-form-item label="类型:">
          <el-input v-model="formData.type" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="物品名称:">
          <el-input v-model="formData.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="物品类型:">
          <el-input v-model="formData.item_type" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="单位:">
          <el-input v-model="formData.unit" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="数量:">
          <el-select v-model="formData.quantity" placeholder="请选择" clearable>
            <el-option v-for="(item,key) in intOptions" :key="key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="单价:">
          <el-input-number v-model="formData.unit_price" :precision="2" clearable></el-input-number>
        </el-form-item>
        <el-form-item label="金额:">
          <el-input-number v-model="formData.amount" :precision="2" clearable></el-input-number>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input v-model="formData.remarks" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="save">保存</el-button>
          <el-button size="mini" type="primary" @click="back">返回</el-button>
        </el-form-item>
      </el-form>
    </div>
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
  updateOutStock,
  findOutStock
} from '@/api/iymOutStock'

// 自动获取字典
import { getDictFunc } from '@/utils/format'
import { useRoute, useRouter } from "vue-router"
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
const route = useRoute()
const router = useRouter()
const type = ref('')
const intOptions = ref([])
const formData = ref({
        type: '',
        name: '',
        item_type: '',
        unit: '',
        quantity: undefined,
        unit_price: 0,
        amount: 0,
        remarks: '',
        })

// 初始化方法
const init = async () => {
 // 建议通过url传参获取目标数据ID 调用 find方法进行查询数据操作 从而决定本页面是create还是update 以下为id作为url参数示例
    if (route.query.id) {
      const res = await findOutStock({ ID: route.query.id })
      if (res.code === 0) {
        formData.value = res.data.restock
        type.value = 'update'
      }
    } else {
      type.value = 'create'
    }
    intOptions.value = await getDictFunc('int')
}

init()
// 保存按钮
const save = async() => {
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
      }
}

// 返回按钮
const back = () => {
    router.go(-1)
}

</script>

<style>
</style>
