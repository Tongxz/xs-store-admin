import service from '@/utils/request'

export const upLoad = (data) => {
    return service({
        url: '/fileUploadAndDownload/upload',
        method: 'post',
        headers: { 'Content-Type': 'multipart/form-data' },
        data
    })
}
