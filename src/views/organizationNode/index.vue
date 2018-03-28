<template>
	<div class="app-container calendar-list-container" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)">
		<div class="filter-container">
			<el-button type="primary" @click="handleCreate" icon="el-icon-circle-plus-outline">添加</el-button>
			<el-input v-model="listQuery.Name" @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="请输入名称">
				<i class="el-icon-search el-input__icon" style="cursor: pointer;" slot="suffix" @click="handleFilter"></i>
			</el-input>
			<el-checkbox class="filter-item" style='margin-left:15px;' @change='getList' v-model="listQuery.isfrozen">包括已冻结</el-checkbox>
		</div>
		<el-table class="table-size" height="100%" :data="organizationNode" fit stripe border highlight-current-row>
			<el-table-column align="center" label="序号" width="65">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="500" label="名称">
				<template slot-scope="scope">
					<span>{{scope.row.Name}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="是否启用">
				<template slot-scope="scope">
					<span :class="scope.row.Statu ? 'el-icon-circle-check-outline':'el-icon-remove-outline'"></span>
				</template>
			</el-table-column>
			<!--<el-table-column min-width="300px" align="center" label="组织机构代码">
				<template slot-scope="scope">
					<span>{{scope.row.OrganizationCode}}</span>
				</template>
			</el-table-column>-->
			<el-table-column align="center" label="操作" width="150" fixed="right">
				<template slot-scope="scope">
					<!--<i class="el-icon-edit"></i>
					<i class="el-icon-delete"></i>-->
					<el-button size="small" type="info" icon="el-icon-edit" @click="handleUpdate(scope.row)">
					</el-button>
					<el-button size="small" type="info" icon="el-icon-delete" @click="deleterow(scope.row)">
					</el-button>
				</template>
			</el-table-column>

		</el-table>

		<el-pagination background class="page_wrap" :current-page="currentPage" :page-sizes="[10, 20, 50, 80, 100]" :page-size="pageSize" layout="prev, pager, next, total, sizes" :total="totalRow" style="margin: 10px 0;" @current-change="pagechange" @size-change="sizechange">
		</el-pagination>

		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
			<el-form class="small-space" :model="temp" :rules="submitRules" ref="systemForm" label-position="left" label-width="70px" size="mini">
				<el-form-item label="名称" prop="Name">
					<el-input v-model="temp.Name"></el-input>
				</el-form-item>
				<el-form-item label="是否启用">
					<el-switch v-model="temp.Statu">
					</el-switch>
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
	import { Create, Update, Delete, QuickQuery } from '@/api/organizationNode'
	import { Verify } from '@/utils/validate'
	export default {
		name: 'role',
		data() {
			const validateName = (rule, value, callback) => {
				if(Verify.isNull(value)) {
					callback(new Error('名称不能为空'))
				} else {
					callback()
				}
			}
			return {
				organizationNode: [],
				total: 0,
				isfrozen: false,
				listLoading: false,
				currentPage: 1,
				pageSize: 10,
				totalRow: 0,
				totalPage: 1,
				listQuery: {
					isfrozen: false,
					Name: ''
				},
				temp: {
					Id: undefined,
					Name: '',
					Statu: true
				},
				submitRules: {
					Name: [{
						required: true,
						trigger: 'blur',
						validator: validateName
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
		mounted(){
			 window.vue = this;
		},
		methods: {
			getList() {
				this.listLoading = true;
				QuickQuery({
					PageIndex: this.currentPage,
					PageSize: this.pageSize,
					Ordering: "Name",
					isfrozen: this.listQuery.isfrozen,
					Name: this.listQuery.Name
				}).then(response => {
					console.log(response);
					this.organizationNode = response.Data;
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
				this.$refs.systemForm.validate(valid => {
					if(valid) {
						this.listLoading = true;
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
					} else {
						return false;
					}
				})
			},
			deleterow(data) {
				this.$confirm('您确定要删除该节点?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					Delete({
							Id: data.Id
						})
						.then(response => {
							this.listLoading = false;
							this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success',
								duration: 2000
							})
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
					Statu: true
				}
			}
		}
	}
</script>