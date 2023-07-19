<template>
	<div id="GasData">
		<div class="queryBar">
			<span class="demonstration">数据筛选：</span>
			<div>
				<el-select
						v-model="queryGas" placeholder="请选择查询的数据" filterable style="margin-right: 20px"
						@change="getConditionTableDate">
					<el-option-group
							v-for="group in gasOptions"
							:key="group.label"
							:label="group.label">
						<el-option
								v-for="item in group.options"
								:key="item.value"
								:label="item.label"
								:value="item.value">
						</el-option>
					</el-option-group>
				</el-select>
			</div>
			<div class="block">
				<span class="demonstration">时间范围：</span>
				<el-date-picker
						@change="getConditionTableDate"
						v-model="queryDateTime"
						type="datetimerange"
						value-format="yyyy-MM-dd HH:mm:ss"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						style="margin-right: 20px;width: 360px">
				</el-date-picker>
			</div>
			<div>
				<span class="demonstration">设备选择：</span>
				<el-select
						v-model="queryDevice" clearable placeholder="请选择"
						@change="getConditionTableDate">
					<el-option
							v-for="item in deviceList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
					</el-option>
				</el-select>
			</div>
			<div class="left">
				<el-button type="primary" round @click="open">导出</el-button>
			</div>
		</div>
		<div class="tablePart">
			<el-table
					:data="this.tableData.slice((this.currentPage-1)*this.pageSize,this.pageSize*this.currentPage)"
					:cell-style="columnStyle" :header-cell-style="headCellStyle" height="475"
					:render-header="renderHeader">
				<!-- <el-table-column type="index"></el-table-column> -->
				<el-table-column
						v-for="(item,key) in this.tableHead" :key="key" :property="item.proper"
						:label="item.label">
				</el-table-column>
			</el-table>
			<div class="page">
				<el-pagination
						@size-change="handleSizeChange" @current-change="handleCurrentChange"
						:current-page="currentPage" :page-sizes="[10, 50, 100, 500]" :page-size="5"
						layout="total, sizes, prev, pager, next, jumper" :total="this.tableData.length">
				</el-pagination>
			</div>
		</div>
	</div>
</template>

<script>
    import {getAllDeviceName, getAllTemperatureData, getConditionData, exportedData} from "@/utils/api";

    export default {
        name: "GasData",
        data() {
            return {
                tableHead: [],
                tableData: [],
                currentPage: 1,
                pageSize: 10,
                gasOptions: [{
                    label: '常规',
                    options: [{
                        value: '温度',
                        label: '温度'
                    }, {
                        value: '湿度',
                        label: '湿度'
                    }, {
                        value: '报警信息',
                        label: '报警信息'
                    }]
                }, {
                    label: '有害气体',
                    options: [
                        {
                            value: '全部',
                            label: '全部'
                        }, {
                            value: 'PM2.5',
                            label: 'PM2.5'
                        }, {
                            value: 'PM10',
                            label: 'PM10'
                        }, {
                            value: 'SO2',
                            label: 'SO2'
                        }, {
                            value: 'NO2',
                            label: 'NO2'
                        }, {
                            value: 'CO',
                            label: 'CO'
                        }, {
                            value: 'O3',
                            label: 'O3'
                        }]
                }],
                queryGas: '温度',
                queryDateTime: '',
                queryDevice: '',
                deviceList: [],
            }
        },
        mounted() {
            this.getAllTemperatureList();
            this.getDeviceNameList();
        },
        methods: {
            // connectWebSocket(){
            //   this.webSocket.onopen();//开始连接
            // },
            handleSizeChange(val) {
                this.pageSize = val;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
            },
            columnStyle() {
                return "text-align:center;height:55px";
            },
            headCellStyle() {
                return "text-align:center;height:65px;background:#eef1f6;color:#606266;";
            },
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
            getAllTemperatureList() {
                getAllTemperatureData().then(res => {
                    console.log(res.data);
                    this.tableData = res.data.dataList;
                    this.tableHead = res.data.headList;
                    if (this.tableData.length === 0) {
                        this.$message.warning("暂无数据!");
                    }
                    console.log("数据获取!");
                })
            },
            getConditionTableDate() {
                if (this.queryDateTime || this.queryGas || this.queryDevice) {
                    const condition = {
                        datetime: this.queryDateTime,
                        gas: this.queryGas,
                        device: this.queryDevice
                    };
                    getConditionData(condition).then(res => {
                        this.tableData = res.data.dataList;
                        this.tableHead = res.data.headList;
                        if (this.tableData.length === 0) {
                            this.$message.warning("暂无数据!");
                        }
                        console.log("数据获取!");
                    })
                }
            },
            getDeviceNameList() {
                getAllDeviceName().then(res => {
                    // console.log(res);
                    this.deviceList = res.data;
                })
            },
            open() {
                this.$prompt('请输入要导出数据的条数', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^\+?[1-9][0-9]*$/,
                    inputErrorMessage: '数据格式不正确'
                }).then(({value}) => {
                    console.log(value,this.queryGas, this.tableData.length);
                    console.log(this.tableData)
                    let total = this.tableData.length
                    if (value > total) {
                        this.$message({
                            type: 'error',
                            message: '数据超过最大总数，请重新输入!'
                        });
                    }
                    //导出方法
                    exportedData(value, this.queryGas, this.tableData).then(res => {
                        console.log(res);
                        if (res.code > 0) {
                            this.$message({
                                type: 'success',
                                message: '导出成功!'
                            });
                        }else {
                            this.$message({
                                type: 'error',
                                message: '导出失败请联系管理员'
                            });
                        }
                    })


                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消输入'
                    });
                });
            }

        }
    }
</script>

<style scoped>
	.queryBar {
		margin-left: 150px;
		margin-top: 10px;
		display: flex;
		width: auto;
		height: 55px;
	}
	
	.tablePart {
		border-top: 1px solid #eae6e6;
		margin-left: 50px;
		width: 1350px;
    display: flex;
    flex-direction: column;
    height: 475px;
	}
  .tablePart >>> .el-table__header-wrapper {
    height: 90px;
  }
  .tablePart >>> .el-table__body-wrapper {
    height: calc(100% - 90px) !important;
  }
	
	.el-pagination {
		width: 80%;
		height: 60px;
		position: fixed;
		bottom: 0;
	}
	
	.queryBar span {
		line-height: 40px;
	}
	
	.left {
		margin-left: 50px;
	}
</style>