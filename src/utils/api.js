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
export function getAllTemperatureData(){
    return axios({
        url:"temperature/getAllTemperatureList",
        method:'get',
    })
}

//获取所有设备名称
export function getAllDeviceName(){
    return axios({
        url:'device/getDeviceNameList',
        method:'get'
    })
}