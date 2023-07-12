<template>
<div id="AccountManage">
  <div class="searchBar">
    <div style="display: flex;">
      <span style="margin-left: 10px">数据查询：</span>
      <el-select v-model="searchType"
                 @change="searchBarChange()"
                 placeholder="请选择"
                 size="medium"
                 style="width: 120px;margin-right: 20px">
        <el-option
            v-for="item in searchTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
        </el-option>
      </el-select>
      <el-input
          v-show="searchBarInputShow"
          size="medium"
          style="width: 180px"
          placeholder="请输入查询的用户名"
          prefix-icon="el-icon-search"
          v-model="searchValue">
      </el-input>
      <el-select v-model="searchValue"
                 v-show="searchBarSelectShow"
                 placeholder="请选择"
                 size="medium"
                 style="width: 120px;">
        <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button type="primary" style="margin-left: 20px;height: 40px;width: 85px;margin-top: 8px"
                 icon="el-icon-search"
                 v-show="searchButton"
                 size="medium" @click="searchData">搜索</el-button>
    </div>
  </div>
  <div class="tablePart">
    <el-table
        :data="tableData"
        :render-header="renderHeader"
        :cell-style="columnStyle" :header-cell-style="headCellStyle"
        style="width: 100%"
        height="550">
      <el-table-column
          prop="managerId"
          label="用户id">
      </el-table-column>
      <el-table-column
          prop="username"
          label="用户名">
      </el-table-column>
      <el-table-column
          label="用户等级">
        <template slot-scope="scope">
          <span v-show="scope.row.managerLevel===1">超级管理员</span>
          <span v-show="scope.row.managerLevel!==1">管理员</span>
        </template>
      </el-table-column>
      <el-table-column
          label="账号状态">
        <template slot-scope="scope">
          <span v-show="scope.row.accountStatus===1" style="color: #409EFF">启用状态</span>
          <span v-show="scope.row.accountStatus!==1" style="color: #F56C6C">禁用状态</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              style="margin-left: 10px"
              v-show="scope.row.accountStatus===0&&scope.row.managerLevel!==1"
              @click="changeAcountStatus(scope.row.managerId,1)"
              type="success"
              size="mini" plain>启用</el-button>
          <el-button
              v-show="scope.row.accountStatus===1&&scope.row.managerLevel!==1"
              size="mini"
              @click="changeAcountStatus(scope.row.managerId,0)"
              type="danger" plain>禁用</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</div>
</template>

<script>
import {changeAcountStatus, getAllManagerInfo, searchNameOrStatus} from "@/utils/api";

export default {
  name: "AccountManage",
  data(){
    return{
      tableData:[],
      searchValue:'',
      searchType:3,
      searchTypes:[{
        label:'用户名',
        value:1,
      },{
        label:'账号状态',
        value:2,
      }, {
          label:'全部',
          value:3,
        }],
      searchBarInputShow:false,
      searchBarSelectShow:false,
      statusList:[{
        label:'禁用',
        value:'0',
      },{
        label:'启用',
        value:'1',
      }],
      searchButton:false,
    }
  },
  mounted() {
    this.getAllManagerList();
  },
  methods:{
    getAllManagerList(){
      getAllManagerInfo().then((res)=>{
        this.tableData=res.data;
      })
    },
    changeAcountStatus(id,status){
      changeAcountStatus(id,status).then((res)=>{
        const code = res.code;
        const msg = res.msg;
        const options={
          showClose: true,
          message: msg,
          duration:2000
        }
        if (code===1) {
          this.$message.success(options);
          this.getAllManagerList();
        }
        else {
          this.$message.error(options);
        }
      })
    },
    //表格样式函数
    renderHeader(h, {column}) {
      let realWidth = 0;
      let span = document.createElement('span');

      span.innerText = column.label;
      document.body.appendChild(span);

      realWidth = span.getBoundingClientRect().width;
      column.minWidth = realWidth; // 可能还有边距/边框等值，需要根据实际情况加上

      document.body.removeChild(span);
      return h('span', column.label);
    },
    //表格样式函数
    columnStyle() {
      return "text-align:center;height:55px";
    },
    //表格样式函数
    headCellStyle() {
      return "text-align:center;height:65px;background:#eef1f6;color:#606266;";
    },
    searchBarChange(){
      this.searchValue='';
      if (this.searchType===3){
        this.searchBarInputShow=false;
        this.searchBarSelectShow=false;
        this.searchButton=false;
        this.getAllManagerList();
      }else if (this.searchType===1){
        this.searchBarInputShow=true;
        this.searchBarSelectShow=false
        this.searchButton=true;
      }else if (this.searchType===2){
        this.searchBarSelectShow=true;
        this.searchBarInputShow=false;
        this.searchButton=true;
      }

    },
    searchData(){
        if (this.searchValue==='') {
          this.$message.warning({
            showClose: true,
            message: '请输入查询信息',
            duration:2000
          });
          }else {
          const param={
            type:this.searchType,
            value:this.searchValue,
          }
          searchNameOrStatus(param).then((res)=>{
            console.log(res.data);
            if (res.data) this.tableData=res.data;

          })
        }
    }
  }

}
</script>

<style scoped>
.tablePart{
  /*margin-top: 2px;*/
  /*margin-top: 60px;*/
  border-top: 1px solid #DCDFE6;
}
.searchBar{
  height: 60px;
  line-height: 55px;
}
</style>