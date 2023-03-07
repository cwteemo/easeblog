import {ElMessage, ElMessageBox} from 'element-plus'

const confirm = (message, okfun) => {
    ElMessageBox.confirm(message, '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info',
        }
    )
        .then(() => {
            okfun();
            ElMessage({
                type: 'success',
                message: 'Delete completed',
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: 'Delete canceled',
            })
        })
}
export default confirm;
