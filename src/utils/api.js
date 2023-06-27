import {axios} from './request'
//管理员登陆
export function login(param) {
    return axios({
        url: "manager/managerLogin",
        method: 'post',
        data: param,
    })
}

//注册
export function register(param) {
    return axios({
        url: "manager/managerRegister",
        method: 'post',
        data: param,
    })
}

//获取所有温度数据
export function getAllTemperatureData() {
    return axios({
        url: "gas/getAllTemperatureList",
        method: 'get',
    })
}

//获取所有设备名称
export function getAllDeviceName() {
    return axios({
        url: 'device/getDeviceNameList',
        method: 'get'
    })
}

//根据条件查询数据
export function getConditionData(param) {
    return axios({
        url: 'gas/getConditionTableData',
        method: 'post',
        data: param
    })
}

//获取所有管理员用户的信息
export function getAllManagerInfo(){
    return axios({
        url:'manager/getAllManagerInfo',
        method:'get'
    });
}

//根据用户id禁用启用账号
export function changeAcountStatus(id,status){
    return axios({
        url:`manager/changeManagerAcountStatus?id=${id}&&status=${status}`,
        method:'get',
    })
}

//根据用户名或者账号状态查询
export function searchNameOrStatus(param){
    return axios({
        url:'manager/searchNameOrStatusData',
        method:'post',
        data:param
    })
}

//查询所有待审核用户
export function getAllManagerReviewData() {
    return axios({
        url: 'manager/getAllManagerReviewList',
        method: 'get'
    })
}

//同意审核用户
export function addManagerReview(uid) {
    return axios({
        url: 'manager/addManagerReview',
        method: 'post',
        data: {
            id:uid
        }
    })
}

//拒绝审核用户
export function refuseManagerReview(uid) {
    return axios({
        url: 'manager/refuseManagerReview',
        method: 'post',
        data: {
            id:uid
        }
    })
}
