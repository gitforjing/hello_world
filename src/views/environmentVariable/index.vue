<template>
	<div class="app-container calendar-list-container" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)">
		<div class="filter-container">
			<el-input placeholder="请输入内容" v-model="listQuery.Name" @keyup.enter.native="handleFilter" class="filter-item" style="width: 250px;" clearable>
				<el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
			</el-input>
			<el-button type="primary" @click="handleCreate" icon="el-icon-circle-plus-outline">添加</el-button>
		</div>
		<el-table class="table-size" height="100%" :data="environmentVariable" fit stripe border highlight-current-row>
			<el-table-column align="center" label="序号" width="65">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="200" label="名称">
				<template slot-scope="scope">
					<span>{{scope.row.Name}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="变量名">
				<template slot-scope="scope">
					<span>{{scope.row.Variable}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="150" fixed="right">
				<template slot-scope="scope">
					<el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑
					</el-button>
					<el-button size="small" type="danger" @click="deleterow(scope.row)">删除
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-pagination background class="page_wrap" :current-page="currentPage" :page-sizes="[10, 20, 50, 80, 100]" :page-size="pageSize" layout="prev, pager, next, jumper, ->, total, sizes" :total="totalRow" style="margin: 10px 0;" @current-change="pagechange" @size-change="sizechange">
		</el-pagination>

		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
			<el-form class="small-space" :model="temp" :rules="submitRules" ref="systemForm" label-position="left" label-width="70px" size="mini">
				<el-form-item label="名称" prop="Name">
					<el-input v-model="temp.Name"></el-input>
				</el-form-item>
				<el-form-item label="代码" prop="Variable">
					<el-input v-model="temp.Variable"></el-input>
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
	import { Create, Update, Delete, QuickQuery } from '@/api/environmentVariable'
	import { Verify } from '@/utils/validate'
	export default {
		name: 'environmentVariable',
		data() {
			const validateName = (rule, value, callback) => {
				if(Verify.isNull(value)) {
					callback(new Error('名称不能为空'))
				} else {
					callback()
				}
			}
			const validateVariable = (rule, value, callback) => {
				if(Verify.isNull(value)) {
					callback(new Error('代码不能为空'))
				} else {
					callback()
				}
			}
			return {
				environmentVariable: [],
				total: 0,
				listLoading: false,
				currentPage: 1,
				pageSize: 10,
				totalRow: 0,
				totalPage: 1,
				temp: {
					Id: undefined,
					Name: '',
					Variable: ''
				},
				listQuery: {
					Name: ''
				},
				submitRules: {
					Name: [{
						required: true,
						trigger: 'blur',
						validator: validateName
					}],
					Variable: [{
						required: true,
						trigger: 'blur',
						validator: validateVariable
					}]
				},
				dialogFormVisible: false,
				dialogStatus: '',
				textMap: {
					update: '编辑',
					create: '创建'
				}
			}
		},
		created() {
			this.getList();
		},
		methods: {
			getList() {
				this.listLoading = true;
				QuickQuery({
					PageIndex: this.currentPage,
					PageSize: this.pageSize,
					Ordering: "Name",
					Name: this.listQuery.Name
				}).then(response => {
					this.environmentVariable = response.Data;
					this.totalPage = response.TotalPage;
					this.totalRow = response.Rows;
					this.listLoading = false
				}).catch(() => {
					this.listLoading = false
				})
			},
			handleCreate() {
				this.resetTemp()
				this.dialogStatus = 'create'
				this.dialogFormVisible = true
			},
			handleUpdate(row) {
				this.temp = Object.assign({}, row)
				this.dialogStatus = 'update'
				this.dialogFormVisible = true
			},
			handleFilter() {
				this.currentPage = 1;
				this.getList();
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
				console.log(this.temp);
				this.$refs.systemForm.validate(valid => {
					if(valid) {
						this.listLoading = true;
						Create(this.temp)
							.then(response => {
								this.resetTemp();
								this.listLoading = false;
								this.dialogFormVisible = false;
								this.$notify({
									title: '成功',
									message: '创建成功',
									type: 'success',
									duration: 2000
								});
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
				this.listLoading = true;
				Update(this.temp)
					.then(response => {
						this.listLoading = false;
						this.resetTemp();
						this.dialogFormVisible = false;
						this.$notify({
							title: '成功',
							message: '编辑成功',
							type: 'success',
							duration: 2000
						});
						this.getList();
					})
					.catch(() => {
						this.listLoading = false
					})
			},
			deleterow(data) {
				this.$confirm('确定删除此条数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					Delete({
							Id: data.Id
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
					Id: undefined,
					Name: '',
					Variable: ''
				}
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.filter-container {
		margin-bottom: 10px;
	}
</style>