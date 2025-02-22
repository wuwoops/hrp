<script setup>
import api from '@/utils/api'
import { useDebounceFn } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { onMounted, ref, watch } from 'vue'

const dialogVisible = ref(false)
const form = ref({
  id: undefined,
  userName: '',
  age: undefined,
  email: '',
})
const employeeList = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const searchEmail = ref('')

const debouncedGetEmployeeList = useDebounceFn(async () => {
  await getEmployeeList()
}, 300)

watch(searchEmail, () => {
  debouncedGetEmployeeList()
})

async function getEmployeeList() {
  employeeList.value = await api.get('/employeeList', { params: {
    currentPage: currentPage.value,
    pageSize: pageSize.value,
    email: searchEmail.value,
  } })
}

async function handleSizeChange(size) {
  pageSize.value = size
  await getEmployeeList()
}
async function handleCurrentChange(page) {
  currentPage.value = page
  await getEmployeeList()
}
async function addEmployee() {
  try {
    form.value.authorities = form.value.authorities.join(',')
    await api.post('/employee', form.value)
    await getEmployeeList()
    dialogVisible.value = false
    ElMessage.success('新增員工成功')
    form.value = {
      id: undefined,
      userName: '',
      age: undefined,
      email: '',
      job: '',
      authority: '',
    }
  }
  catch (error) {
    console.error(error)
    ElMessage.error('新增員工失敗')
  }
}
async function getEmployee(id) {
  const resp = await api.get(`/employee/${id}`)
  resp.authorities = resp.authorities.split(',')
  form.value = resp
  dialogVisible.value = true
}
async function editEmployee() {
  form.value.authorities = form.value.authorities.join(',')
  await api.put('/employee', form.value)
  dialogVisible.value = false
  await getEmployeeList()
  ElMessage.success('編輯員工成功')
}
async function handleDelete(id) {
  await api.delete(`/employee/${id}`)
  await getEmployeeList()
  ElMessage.success('刪除員工成功')
}
function closeDialog() {
  dialogVisible.value = false
  cleanEmployee()
}
function cleanEmployee() {
  form.value = {
    id: undefined,
    userName: '',
    age: undefined,
    email: '',
  }
}

const authorityList = ref([
  { label: '管理員', value: 'ADMIN' },
  { label: '員工', value: 'USER' },
])
const jobList = ref([
  '經理',
  '員工',
  '實習生',
  '其他',
])
onMounted(() => {
  getEmployeeList()
})
</script>

<template>
  <div class="w-full h-full px-4 flex flex-col gap-4">
    <div class="flex justify-between items-center bg-blueGray-100 p-4 rounded-md mt-1">
      <el-button type="primary" @click="dialogVisible = true">
        新增員工
      </el-button>
    </div>
    <el-table
      class="flex-1"
      :data="employeeList.records"
      style="width: 100%"
      stripe
    >
      <el-table-column prop="userName" label="姓名" width="180" />
      <el-table-column prop="age" label="年齡" />
      <el-table-column prop="email" label="電子郵件">
        <template #header>
          <el-input v-model="searchEmail" size="small" placeholder="電子郵件搜尋" />
        </template>
      </el-table-column>
      <el-table-column prop="job" label="職位" />
      <el-table-column prop="authorities" label="權限">
        <template #default="scope">
          {{ scope.row.authorities.split(',').map(authority => authorityList.find(item => item.value === authority)?.label).join(',') }}
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #default="scope">
          <el-button size="small" @click="getEmployee(scope.row.id)">
            編輯
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            刪除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      class="mx-auto"
      :page-sizes="[1, 10, 20, 30, 40]"
      layout="sizes, prev, pager, next"
      background
      :total="employeeList.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog v-model="dialogVisible" title="新增員工" width="30%" draggable>
      <el-form :model="form" label-width="auto">
        <el-form-item label="姓名">
          <el-input v-model="form.userName" />
        </el-form-item>
        <el-form-item label="年齡">
          <el-input v-model="form.age" />
        </el-form-item>
        <el-form-item label="電子郵件">
          <el-input v-model="form.email" />
        </el-form-item>
        <el-form-item label="職位">
          <el-select v-model="form.job" placeholder="請選擇職位">
            <el-option v-for="item in jobList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="權限">
          <el-select v-model="form.authorities" placeholder="請選擇權限" multiple>
            <el-option v-for="item in authorityList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <div class="flex justify-center gap-2">
          <el-button v-if="!form.id" type="primary" @click="addEmployee">
            新增
          </el-button>
          <el-button v-else type="primary" @click="editEmployee">
            編輯
          </el-button>
          <el-button @click="closeDialog">
            取消
          </el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
