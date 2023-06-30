<template>
	<div id="RegisterManage">
		<div>
		<el-table
				:data="tableData"
				style="width: 100%"
				height="650" :cell-style="columnStyle" :header-cell-style="headCellStyle" >
			<el-table-column
					label="编号"
					align="center"
					type="index"
					prop="id"
			>
			</el-table-column>
			<el-table-column
					label="用户名"
					prop="username"
					align="center">
			</el-table-column>
			<el-table-column
					label="申请时间"
					prop="indate"
					align="center">
			</el-table-column>
			<el-table-column
					label="操作"
					align="center">
				<template slot-scope="scope">
					<el-button
							v-if="scope.row.status == 0"
							size="mini"
							type="success"
							@click="handleAgree(scope.row.id)"
							:plain="true">同意
					</el-button>
					
					<el-popconfirm
							title="确定拒绝吗"
							@confirm="handleRefuse(scope.row.id)"
					>
						<el-button
								v-if="scope.row.status == 0"
								size="mini" type="danger"
								slot="reference"
								:plain="true">拒绝
						</el-button>
					</el-popconfirm>
					
					<el-tag type="success" v-if="scope.row.status == 1">已同意</el-tag>
					<el-tag type="danger" v-if="scope.row.status == -1">已拒绝</el-tag>
				</template>
			</el-table-column>
		</el-table>
		</div>
	</div>
</template>

<script>
    import {getAllManagerReviewData, addManagerReview,refuseManagerReview} from "@/utils/api";

    export default {
        name: "RegisterManage",
        data() {
            return {
                tableData: [],
                agree: "审核通过",
                refuse: "已拒绝"
            }
        },
        mounted() {
            this.getAllManagerReviewList()
        },
        methods: {
            getAllManagerReviewList() {
                getAllManagerReviewData().then(res => {
                    console.log(res.data);
                    this.tableData = res.data;
                })
            },
            handleAgree(id) {
                addManagerReview(id).then(res => {
                    if (res.code == 1) {
                        this.$message({
                            message: '已同意',
                            type: 'success'
                        });
                    }
                    this.getAllManagerReviewList();
                });

            },
            handleRefuse(id) {
                refuseManagerReview(id).then(res => {
                    if (res.code == 1) {
                        this.$message({
                            message: '已拒绝',
                            type: 'success'
                        });
                    }
                    this.getAllManagerReviewList();
                });
            },
            columnStyle() {
                return "text-align:center;height:55px";
            },
            headCellStyle() {
                return "text-align:center;height:65px;background:#eef1f6;color:#606266;";
            },   renderHeader(h, {column}) {
                let realWidth = 0;
                let span = document.createElement('span');

                span.innerText = column.label;
                document.body.appendChild(span);

                realWidth = span.getBoundingClientRect().width;
                column.minWidth = realWidth; // 可能还有边距/边框等值，需要根据实际情况加上

                document.body.removeChild(span);
                return h('span', column.label);
            },
        },
   

    }
</script>

<style scoped>

</style>