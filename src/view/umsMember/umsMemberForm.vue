<template>
  <div>
    <div class="gva-form-box">
      <el-form :model="formData" label-position="right" label-width="80px">
        <el-form-item label="姓名:">
          <el-input v-model="formData.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="会员手机号:">
          <el-input v-model.number="formData.mobile" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="性别:">
          <el-select v-model="formData.gender" placeholder="请选择" clearable>
            <el-option v-for="(item,key) in genderOptions" :key="key" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="是否会员:">
          <el-switch v-model="formData.memberCard" active-color="#13ce66" inactive-color="#ff4949" active-text="是" inactive-text="否" clearable ></el-switch>
        </el-form-item>
        <el-form-item label="会员卡余额:">
          <el-input-number v-model="formData.memberBalance" :precision="2" clearable></el-input-number>
        </el-form-item>
        <el-form-item label="开通时间:">
          <el-date-picker v-model="formData.openDate" type="date" placeholder="选择日期" clearable></el-date-picker>
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
  name: 'Member'
}
</script>

<script setup>
import {
  createMember,
  updateMember,
  findMember
} from '@/api/umsMember'

// 自动获取字典
import { getDictFunc } from '@/utils/format'
import { useRoute, useRouter } from "vue-router"
import { ElMessage } from 'element-plus'
import { ref } from 'vue'
const route = useRoute()
const router = useRouter()
const type = ref('')
const genderOptions = ref([])
const formData = ref({
        name: '',
        mobile: 0,
        gender: undefined,
        memberCard: false,
        memberBalance: 0,
        openDate: new Date(),
        })

// 初始化方法
const init = async () => {
 // 建议通过url传参获取目标数据ID 调用 find方法进行查询数据操作 从而决定本页面是create还是update 以下为id作为url参数示例
    if (route.query.id) {
      const res = await findMember({ ID: route.query.id })
      if (res.code === 0) {
        formData.value = res.data.remember
        type.value = 'update'
      }
    } else {
      type.value = 'create'
    }
    genderOptions.value = await getDictFunc('gender')
}

init()
// 保存按钮
const save = async() => {
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
      }
}

// 返回按钮
const back = () => {
    router.go(-1)
}

</script>

<style>
</style>
