<template>
	<div class="app-container calendar-list-container" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)">
		<div class="filter-container">
			<el-button type="primary" @click="handleCreate" icon="el-icon-circle-plus-outline">添加</el-button>
			<el-input v-model="listQuery.IP" @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="请输入Ip">
				<i class="el-icon-search el-input__icon" style="cursor: pointer;" slot="suffix" @click="handleFilter"></i>
			</el-input>
			<el-checkbox class="filter-item" style='margin-left:15px;' @change='getList' v-model="listQuery.IsOverdue">是否过期</el-checkbox>
		</div>

		<el-table class="table-size" height="100%" :key='tableKey' :data="list" element-loading-text="拼命加载中" fit stripe border highlight-current-row>
			<el-table-column align="center" label="序号" width="65">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="150" label="IP">
				<template slot-scope="scope">
					<span>{{scope.row.Ip}}</span>
				</template>
			</el-table-column>
			<el-table-column min-width="200px" align="center" label="启用时间" class-name='test'>
				<template slot-scope="scope">
					<span>{{scope.row.EnableTime| formaTime}}</span>
				</template>
			</el-table-column>
			<el-table-column min-width="200px" align="center" label="停止时间">
				<template slot-scope="scope">
					<span>{{scope.row.StopTime| formaTime}}</span>
				</template>
			</el-table-column>
			<el-table-column min-width="150px" align="center" label="创建人">
				<template slot-scope="scope">
					<span>{{scope.row.Creator}}</span>
				</template>
			</el-table-column>
			<el-table-column width="200px" align="center" label="创建时间">
				<template slot-scope="scope">
					<span>{{scope.row.CreateTime| parseTime}}</span>
				</template>
			</el-table-column>

			<el-table-column align="center" label="操作" width="150" fixed="right">
				<template slot-scope="scope">
					<el-button size="small" type="info" icon="el-icon-edit" @click="handleUpdate(scope.row)">
					</el-button>
					<el-button size="small" type="info" icon="el-icon-delete" @click="deleterow(scope.row)">
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination class="page_wrap" background :current-page="currentPage" :page-sizes="[10, 20, 50, 80, 100]" :page-size="pageSize" layout="prev, pager, next, total, sizes" :total="totalRow" style="margin: 10px 0;" @current-change="pagechange" @size-change="sizechange">
		</el-pagination>

		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
			<el-form class="small-space" :model="temp" :rules="submitRules" ref="blackwhiteForm" label-position="left" label-width="70px" size="mini">
				<el-form-item label="IP" prop="Ip">
					<el-input v-model="temp.Ip" :disabled="dialogStatus == 'update'"></el-input>
				</el-form-item>

				<el-form-item label="启用时间">
					<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="temp.EnableTime" align="right" type="datetime" placeholder="选择时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="停止时间">
					<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="temp.StopTime" align="right" type="datetime" placeholder="选择时间">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button v-if="dialogStatus=='create'" type="primary" @click.native.prevent="create">确 定</el-button>
				<el-button v-if="dialogStatus=='update'" type="primary" @click.native.prevent="update">确 定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import { addService, eidtService, deleteSerivce, QuickQuery } from '@/api/blackwhite'
	import { Verify } from '@/utils/validate'
	import { parseTime } from '@/utils'
	export default {
		name: 'iplist',
		data() {
			const validateIP = (rule, value, callback) => {
				if(Verify.isNull(value)) {
					callback(new Error('IP不能为空'))
				} else {
					if(!Verify.isIP(value)) {
						callback(new Error('IP不正确'))
					} else {
						callback()
					}
				}
			}
			return {
				list: [],
				applications: [],
				total: 0,
				listLoading: false,
				isloading: false,
				currentPage: 1,
				pageSize: 10,
				totalRow: 0,
				totalPage: 1,
				listQuery: {
					Ip: '',
					IsOverdue: false
				},
				temp: {
					Id: undefined,
					Ip: '',
					EnableTime: '',
					StopTime: '',
				},
				submitRules: {
					Ip: [{
						required: true,
						trigger: 'blur',
						validator: validateIP
					}]
				},
				dialogFormVisible: false,
				dialogStatus: '',
				textMap: {
					update: '编辑',
					create: '创建'
				},
				pvData: [],
				showAuditor: false,
				tableKey: 0,
				value6: ''
			}
		},
		created() {
			this.getList();
		},
		methods: {
			getList() {
				this.listLoading = true
				this.list = [];
				QuickQuery({
					PageIndex: this.currentPage,
					PageSize: this.pageSize,
					Ordering: "Id",
					IP: this.listQuery.IP,
					IsOverdue: this.listQuery.IsOverdue
				}).then(response => {
					console.log(response);
					this.list = response.Data;
					this.totalPage = response.TotalPage;
					this.totalRow = response.Rows;
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
				})
			},
			//过滤-筛选
			handleFilter() {
				this.currentPage = 1;
				this.getList();
			},
			handleApplication(id) {
				this.currentPage = 1;
				this.getList();
			},
			handleCreate() {
				this.resetTemp();
				this.dialogStatus = 'create'
				this.dialogFormVisible = true
			},
			handleUpdate(row) {
				this.temp = Object.assign({}, row)
				console.log(this.temp)
				this.dialogStatus = 'update'
				this.dialogFormVisible = true
			},
			pagechange(index) {
				this.currentPage = index;
				this.getList();
			},
			sizechange(num) {
				this.pageSize = num;
				this.getList();
			},
			create() {
				this.$refs.blackwhiteForm.validate(valid => {
					if(valid) {
						this.listLoading = true;
						addService({
								Ip: this.temp.Ip,
								EnableTime: this.temp.EnableTime,
								StopTime: this.temp.StopTime
							})
							.then(response => {
								this.$notify({
									title: '成功',
									message: '创建成功',
									type: 'success',
									duration: 2000
								});
								this.resetTemp();
								this.listLoading = false;
								this.dialogFormVisible = false;
								this.getList();
							})
							.catch(() => {
								this.listLoading = false
							})
					} else {
						return false;
					}
				})
			},
			update() {
				console.log(this.temp);
				this.$refs.blackwhiteForm.validate(valid => {
					if(valid) {
						this.listLoading = true;
						eidtService(this.temp)
							.then(response => {
								this.$notify({
									title: '成功',
									message: '编辑成功',
									type: 'success',
									duration: 2000
								});
								this.resetTemp();
								this.listLoading = false;
								this.dialogFormVisible = false;
								this.getList();
							})
							.catch(() => {
								this.listLoading = false
							})
					} else {
						return false;
					}
				})
			},
			deleterow(data) {
				this.$confirm('您确定要删除该角色?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					deleteSerivce({
							Id: data.Id,
							IP: data.Ip
						})
						.then(response => {
							this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success',
								duration: 2000
							})
							this.listLoading = false;
							this.getList();
						})
						.catch(() => {
							this.listLoading = false
						})
				})
			},
			resetTemp() {
				this.temp = {
					id: undefined,
					IP: '',
					EnableTime: '',
					StopTime: '',
				}
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.filter-container {
		margin-bottom: 10px;
	}
	.test:hover{
		cursor: pointer;
	}
</style>