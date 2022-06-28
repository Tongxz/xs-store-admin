import service from '@/utils/request'

// @Tags Expenses
// @Summary 创建Expenses
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Expenses true "创建Expenses"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /expenses/createExpenses [post]
export const createExpenses = (data) => {
  return service({
    url: '/expenses/createExpenses',
    method: 'post',
    data
  })
}

// @Tags Expenses
// @Summary 删除Expenses
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Expenses true "删除Expenses"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /expenses/deleteExpenses [delete]
export const deleteExpenses = (data) => {
  return service({
    url: '/expenses/deleteExpenses',
    method: 'delete',
    data
  })
}

// @Tags Expenses
// @Summary 删除Expenses
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除Expenses"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /expenses/deleteExpenses [delete]
export const deleteExpensesByIds = (data) => {
  return service({
    url: '/expenses/deleteExpensesByIds',
    method: 'delete',
    data
  })
}

// @Tags Expenses
// @Summary 更新Expenses
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Expenses true "更新Expenses"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /expenses/updateExpenses [put]
export const updateExpenses = (data) => {
  return service({
    url: '/expenses/updateExpenses',
    method: 'put',
    data
  })
}

// @Tags Expenses
// @Summary 用id查询Expenses
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data query model.Expenses true "用id查询Expenses"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /expenses/findExpenses [get]
export const findExpenses = (params) => {
  return service({
    url: '/expenses/findExpenses',
    method: 'get',
    params
  })
}

// @Tags Expenses
// @Summary 分页获取Expenses列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取Expenses列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /expenses/getExpensesList [get]
export const getExpensesList = (params) => {
  return service({
    url: '/expenses/getExpensesList',
    method: 'get',
    params
  })
}
