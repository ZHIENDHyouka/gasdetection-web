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