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

//需要导出数据的条数
export function exportedData(number,gas,data) {
    return axios({
        url:'gas/download',
        method:'post',
        data:{
            number:number,
            gas:gas,
            data:data
        }
    })
}

//查询实时数据设备的使用数量
export function getDeviceRunNumber(){
    return axios({
        url:'device/getDeviceRunNumber',
        method:'get',
    })
}

//查询报警信息实时数据
export function getRealTimeAlarmDataer(){
    return axios({
        url:'alarm/getRealTimeAlarmDataer',
        method:'get'
    })
}

//查询初始化有害气体数据
export function getHarmfulGasAvgData(){
    return axios({
        url:'gas/getHarmfulGasAvgData',
        method:'get',
    })
}

//查询初始化报警信息
export function getAlarmInfoData(){
    return axios({
        url:'alarm/getDayAllAlarmInfo',
        method:'get'
    })
}

//初始化设备信息
export function getDeviceInfoData() {
    return axios({
        url:'device/getAllDeviceInfo',
        method:'get'
    })

}

//修改设备开关状态的方法
export function updateDeviceState(state,serviceId) {
    return axios({
        url:'device/updateDeviceState',
        method:'post',
        data:{
            state:state,
            serviceId:serviceId
        }
    })
}

//用户提交反馈
export function submitFeedbackInfo(username,userId,describe) {
    return axios({
        url:'manager/submitFeedbackInfo',
        method:'post',
        data: {
            userId:userId,
            userName:username,
            problemDescribe:describe
        }
    })
}

//获取用户反馈
export function getFeedbackInfoData() {
    return axios({
        url:'manager/getFeedbackInfoData',
        method:'get'
    })
}

//更新用户反馈
export function solvingProblems(id){
    return axios({
        url:'manager/solvingProblems',
        method:'post',
        data:{
            id:id
        }
    })
}

//获取气体列表
export function getGasNameList(){
    return axios({
        url:'statistic/getGasNameList',
        method:'get'
    })
}

//获取统计数据
export  function  getStatisticData(param){
    return axios({
        url:'statistic/getStatisticData',
        method:'post',
        data:param
    })
}

//获取设备阈值信息
export function getGasCriticalInfo(){
    return axios({
        url:'alarm/queryAllAlarmCriticalInfo',
        method:'get',
    })
}

//更新阈值信息
export function updateCriticalValue(data){
    return axios({
        url:`alarm/updateGasAlarmCritical`,
        method:'post',
        data
    })

}
