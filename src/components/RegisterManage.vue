<template>
	<div id="RegisterManage">
		<el-table
				:data="tableData"
				style="width: 100%">
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
                console.log(id);
                addManagerReview(id).then(res => {
                    console.log(res)
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
                console.log(id);
                refuseManagerReview(id).then(res => {
                    console.log(res)
                    if (res.code == 1) {
                        this.$message({
                            message: '已拒绝',
                            type: 'success'
                        });
                    }
                    this.getAllManagerReviewList();
                });
            }
        },

    }
</script>

<style scoped>

</style>