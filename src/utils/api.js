import {axios} from './request'

//管理员登陆
export function login(param) {
    return axios({
        url: "user/managerLogin",
        method: 'post',
        data: param,
    })
}

//注册
export function register(param) {
    return axios({
        url: "user/managerRegister",
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

//查询所有待审核用户
export function getAllManagerReviewData() {
    return axios({
        url: 'user/getAllManagerReviewList',
        method: 'get'
    })
}

//同意审核用户
export function addManagerReview(uid) {
    return axios({
        url: 'user/addManagerReview',
        method: 'post',
        data: {
            id:uid
        }
    })
}

//拒绝审核用户
export function refuseManagerReview(uid) {
    return axios({
        url: 'user/refuseManagerReview',
        method: 'post',
        data: {
            id:uid
        }
    })
}
