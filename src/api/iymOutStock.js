import service from '@/utils/request'

// @Tags OutStock
// @Summary 创建OutStock
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.OutStock true "创建OutStock"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /stock/createOutStock [post]
export const createOutStock = (data) => {
  return service({
    url: '/stock/createOutStock',
    method: 'post',
    data
  })
}

// @Tags OutStock
// @Summary 删除OutStock
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.OutStock true "删除OutStock"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /stock/deleteOutStock [delete]
export const deleteOutStock = (data) => {
  return service({
    url: '/stock/deleteOutStock',
    method: 'delete',
    data
  })
}

// @Tags OutStock
// @Summary 删除OutStock
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除OutStock"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /stock/deleteOutStock [delete]
export const deleteOutStockByIds = (data) => {
  return service({
    url: '/stock/deleteOutStockByIds',
    method: 'delete',
    data
  })
}

// @Tags OutStock
// @Summary 更新OutStock
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.OutStock true "更新OutStock"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /stock/updateOutStock [put]
export const updateOutStock = (data) => {
  return service({
    url: '/stock/updateOutStock',
    method: 'put',
    data
  })
}

// @Tags OutStock
// @Summary 用id查询OutStock
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data query model.OutStock true "用id查询OutStock"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /stock/findOutStock [get]
export const findOutStock = (params) => {
  return service({
    url: '/stock/findOutStock',
    method: 'get',
    params
  })
}

// @Tags OutStock
// @Summary 分页获取OutStock列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取OutStock列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /stock/getOutStockList [get]
export const getOutStockList = (params) => {
  return service({
    url: '/stock/getOutStockList',
    method: 'get',
    params
  })
}
