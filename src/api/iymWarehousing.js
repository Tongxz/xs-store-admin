import service from '@/utils/request'

// @Tags Warehousing
// @Summary 创建Warehousing
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Warehousing true "创建Warehousing"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /warehousing/createWarehousing [post]
export const createWarehousing = (data) => {
  return service({
    url: '/warehousing/createWarehousing',
    method: 'post',
    data
  })
}

// @Tags Warehousing
// @Summary 删除Warehousing
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Warehousing true "删除Warehousing"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /warehousing/deleteWarehousing [delete]
export const deleteWarehousing = (data) => {
  return service({
    url: '/warehousing/deleteWarehousing',
    method: 'delete',
    data
  })
}

// @Tags Warehousing
// @Summary 删除Warehousing
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body request.IdsReq true "批量删除Warehousing"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"删除成功"}"
// @Router /warehousing/deleteWarehousing [delete]
export const deleteWarehousingByIds = (data) => {
  return service({
    url: '/warehousing/deleteWarehousingByIds',
    method: 'delete',
    data
  })
}

// @Tags Warehousing
// @Summary 更新Warehousing
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data body model.Warehousing true "更新Warehousing"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"更新成功"}"
// @Router /warehousing/updateWarehousing [put]
export const updateWarehousing = (data) => {
  return service({
    url: '/warehousing/updateWarehousing',
    method: 'put',
    data
  })
}

// @Tags Warehousing
// @Summary 用id查询Warehousing
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data query model.Warehousing true "用id查询Warehousing"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"查询成功"}"
// @Router /warehousing/findWarehousing [get]
export const findWarehousing = (params) => {
  return service({
    url: '/warehousing/findWarehousing',
    method: 'get',
    params
  })
}

// @Tags Warehousing
// @Summary 分页获取Warehousing列表
// @Security ApiKeyAuth
// @accept application/json
// @Produce application/json
// @Param data query request.PageInfo true "分页获取Warehousing列表"
// @Success 200 {string} string "{"success":true,"data":{},"msg":"获取成功"}"
// @Router /warehousing/getWarehousingList [get]
export const getWarehousingList = (params) => {
  return service({
    url: '/warehousing/getWarehousingList',
    method: 'get',
    params
  })
}
export const getWarehousingName = (params) => {
  return service({
    url: '/warehousing/getWarehousingName',
    method: 'get',
    params
  })
}
