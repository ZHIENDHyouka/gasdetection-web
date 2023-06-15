import { axios } from './request'
//随便写的
export function login(param) {
    return axios({
        url: "login/user",
        method: 'post',
        data: param,
    })
}