<template>
	<div class="app-container calendar-list-container" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)">
		<div class="filter-container">
			<el-button type="primary" @click="handleCreate" icon="el-icon-circle-plus-outline">添加</el-button>
			<el-input v-model="listQuery.value" @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="请输入用户名或登录名">
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
			<el-table-column align="center" width="150" label="用户名">
				<template slot-scope="scope">
					<span>{{scope.row.UserName}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="150" label="登录名">
				<template slot-scope="scope">
					<span>{{scope.row.LogonName}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="150" label="服务名称" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{scope.row.ServiceName }}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="150" label="所属系统">
				<template slot-scope="scope">
					<span>{{scope.row.ApplicationName }}</span>
				</template>
			</el-table-column>
			<el-table-column min-width="200px" align="center" label="启用时间">
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
			<el-form class="small-space" :model="temp" :rules="submitRules" ref="blackwhiteForm" label-position="left" label-width="100px" size="mini">
				<el-form-item label="用户名" prop="User">
					<el-select value-key="Id" v-model="temp.UserName" @change="setUser" placeholder="请选择用户" @visible-change="getUser" :disabled="dialogStatus == 'update'" filterable :loading="loading">
						<el-option v-for="item in users" :key="item.Id" :label="item.Name" :value="item">
							<span style="float: left">{{ item.Name }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="服务名称" prop="Service">
					<el-select value-key="Name" v-model="temp.ServiceName" @change="setService" placeholder="请选择所属系统" :disabled="dialogStatus == 'update'" filterable>
						<el-option v-for="item in services" :key="item.Id" :label="item.Name" :value="item">
							<span style="float: left">{{ item.Name }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="启用时间" prop="EnableTime">
					<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="temp.EnableTime" align="right" type="datetime" placeholder="选择时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="停止时间" prop="StopTime">
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
	import { AddUserSvc, EditUserSvc, RemoveUserSvc, QueryUserSvc } from '@/api/blackwhite/userService'
	import { QuickQuery as GetAllUser } from '@/api/user'
	import { QuickQueryAll } from '@/api/system'
	import { parseTime } from '@/utils'
	export default {
		name: 'userService',
		data() {
			const validateUser = (rule, value, callback) => {
				if(!this.temp.UserName) {
					callback(new Error('请选择用户'))
				} else {
						callback()
				}
			}
			const validateSvc = (rule, value, callback) => {
				if(!this.temp.ServiceId) {
					callback(new Error('请选择服务'))
				} else {
						callback()
				}
			}
			return {
				list: [],
				users: [],
				services: [],
				total: 0,
				listLoading: false,
				loading: false,
				currentPage: 1,
				pageSize: 10,
				totalRow: 0,
				totalPage: 1,
				listQuery: {
					value: '',
					IsOverdue: false
				},
				temp: {
					Id: undefined,
					UserName : '',
					LogonName : '',
					ServiceId: null,
					ServiceName: '',
					ApplicationId: '',
					ApplicationName: '',
					EnableTime: '',
					StopTime: '',
				},
				submitRules: {
					User: [{
						required: true,
						message: '请选择用户',
						validator: validateUser
					}],
					Service: [{
						required: true,
						message: '请选择服务',
						validator: validateSvc
					}],
					EnableTime: [{
						required: true,
						message: '请选择启用日期',
						trigger: 'change'
					}],
					StopTime: [{
						required: true,
						message: '请选择停止日期',
						trigger: 'change'
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
				QueryUserSvc({
					PageIndex: this.currentPage,
					PageSize: this.pageSize,
					Ordering: "Id",
					Value: this.listQuery.value,
					IsOverdue: this.listQuery.IsOverdue
				}).then(response => {
					console.log(response);
					this.list = response.Data;
					this.totalPage = response.TotalPage;
					this.totalRow = response.Rows;
					this.listLoading = false;
					this.getAllService();
				}).catch(() => {
					this.listLoading = false;
				})
			},
			getUser(visible){
				if(visible && this.users.length == 0) {
					this.loading = true;
					GetAllUser({
						PageIndex: 1,
						PageSize: 100,
						Ordering: "Name",
						Value: ''
					}).then(response => {
						this.users = response.Data;
						this.loading = false;
					}).catch((response) => {
						this.loading = false;
					})
				}
			},
			getAllService() {
				if(this.services.length == 0) {
					this.listLoading = true;
					QuickQueryAll({
						PageIndex: 1,
						PageSize: 100,
						Ordering: "Name"
					}).then(response => {
						console.log(response);
						this.services = response.Data;
						this.listLoading = false;
					}).catch(() => {
						this.listLoading = false;
					})
				}
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
			setService(service) {
				this.temp.ServiceId = service.Id;
				this.temp.ServiceName = service.Name;
				this.temp.ApplicationId = service.ApplicationId;
				this.temp.ApplicationName = service.ApplicationName;
			},
			setUser(user){
				this.temp.UserName = user.Name;
				this.temp.LogonName = user.LogIn;
			},
			create() {
				this.$refs.blackwhiteForm.validate(valid => {
					if(valid) {
						this.listLoading = true;
						AddUserSvc(this.temp)
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
				this.$refs.blackwhiteForm.validate(valid => {
					if(valid) {
						this.listLoading = true;
						EditUserSvc(this.temp)
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
					RemoveUserSvc(data)
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
					Ip: '',
					ServiceId: null,
					ServiceName: '',
					ApplicationId: '',
					ApplicationName: '',
					EnableTime: '',

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