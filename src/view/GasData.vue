<template>
<div id="GasData">
  <div class="queryBar">
    <span>数据筛选</span>
  </div>
  <div class="tablePart">
    <el-table
        :data="this.tableData.slice((this.currentPage-1)*this.pageSize,this.pageSize*this.currentPage)"
        style="width: 100%" :cell-style="columnStyle" :header-cell-style="{'text-align':'center'}">
      <!-- <el-table-column type="index"></el-table-column> -->
      <el-table-column v-for="(item,key) in this.tableHead" :key="key" :property="item.proper"
                       :label="item.label" width="110px">
      </el-table-column>
    </el-table>
    <div class="page">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="currentPage" :page-sizes="[5, 10, 20, 50]" :page-size="5"
                     layout="total, sizes, prev, pager, next, jumper" :total="this.tableData.length">
      </el-pagination>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "GasData",
  data(){
    return{
      tableHead:[{
        label: '日期',
        proper: "date",
      }, {
        label: '姓名',
        proper: "name",
      }, {
        label: '地址',
        pro: "address",
      }],
      tableData:[{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      currentPage: 1,
      pageSize: 5,
    }
  },
  mounted() {
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    columnStyle() {
      return "text-align:center;"
    },
  }
}
</script>

<style scoped>
.queryBar{
  width: 100px;
}
.tablePart{
}
.page{

}
.el-pagination{
  width: 80%;
  height: 60px;
  position: fixed;
  bottom: 0;
}
</style>