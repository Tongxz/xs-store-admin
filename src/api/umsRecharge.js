import service from '@/utils/request'

// @Tags Recharge
// @Summary 创建Recharge
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Recharge true "创建Recharge"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /recharge/createRecharge [post]
export const createRecharge = (data) => {
  return service({
    url: '/recharge/createRecharge',
    method: 'post',
    data
  })
}

// @Tags Recharge
// @Summary 删除Recharge
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Recharge true "删除Recharge"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /recharge/deleteRecharge [delete]
export const deleteRecharge = (data) => {
  return service({
    url: '/recharge/deleteRecharge',
    method: 'delete',
    data
  })
}

// @Tags Recharge
// @Summary 删除Recharge
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除Recharge"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /recharge/deleteRecharge [delete]
export const deleteRechargeByIds = (data) => {
  return service({
    url: '/recharge/deleteRechargeByIds',
    method: 'delete',
    data
  })
}

// @Tags Recharge
// @Summary 更新Recharge
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Recharge true "更新Recharge"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /recharge/updateRecharge [put]
export const updateRecharge = (data) => {
  return service({
    url: '/recharge/updateRecharge',
    method: 'put',
    data
  })
}

// @Tags Recharge
// @Summary 用id查询Recharge
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data query model.Recharge true "用id查询Recharge"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /recharge/findRecharge [get]
export const findRecharge = (params) => {
  return service({
    url: '/recharge/findRecharge',
    method: 'get',
    params
  })
}

// @Tags Recharge
// @Summary 分页获取Recharge列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取Recharge列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /recharge/getRechargeList [get]
export const getRechargeList = (params) => {
  return service({
    url: '/recharge/getRechargeList',
    method: 'get',
    params
  })
}
