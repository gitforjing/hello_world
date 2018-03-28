<template>
	<div class="app-container" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)">
		<div class="filter-container">
			<el-input v-model="listQuery.Value" @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="请输入用户名或登录名">
				<i class="el-icon-search el-input__icon" style="cursor: pointer;" slot="suffix" @click="handleFilter"></i>
			</el-input>
		</div>
		<el-table class="table-size" height="100%" :data="Users" fit stripe border highlight-current-row>
			<el-table-column align="center" width="200" label="名称">
				<template slot-scope="scope">
					<span>{{scope.row.Name}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="代码">
				<template slot-scope="scope">
					<span>{{scope.row.Code}}</span>
				</template>
			</el-table-column>
			<el-table-column min-width="300px" align="center" label="登录名">
				<template slot-scope="scope">
					<span>{{scope.row.LogIn}}</span>
				</template>
			</el-table-column>
			<el-table-column min-width="300px" align="center" label="电话">
				<template slot-scope="scope">
					<span>{{scope.row.Tel}}</span>
				</template>
			</el-table-column>
			<el-table-column min-width="300px" align="center" label="邮箱">
				<template slot-scope="scope">
					<span>{{scope.row.Email}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="150" fixed="right">
				<template slot-scope="scope">
					<el-button size="small" type="info" icon="el-icon-search" @click="checkUserRole(scope.row.Id)">
					</el-button>
					<el-button size="small" type="info" icon="el-icon-edit" @click="editRoles(scope.row)">
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination background class="page_wrap" :current-page="currentPage" :page-sizes="[10, 20, 50, 80, 100]" :page-size="pageSize" layout="prev, pager, next, total, sizes" :total="totalRow" style="margin: 10px 0;" @current-change="pagechange" @size-change="sizechange">
		</el-pagination>
		<el-dialog title="角色编辑" :visible.sync="editDialogVisible" width="30%" top="7vh">
			<el-select style="width: 200px;margin-bottom: 10px;" class="filter-item" v-model="applicationindex" @change="handleApplication" placeholder="所属系统">
				<el-option v-for="item in applications" :key="item.Idx" :label="item.Name" :value="item.Idx">
				</el-option>
			</el-select>
			<el-table :data="roles" @selection-change="getSelectRole"  @select-all="getSelectRole" ref="roletable" height="400" border highlight-current-row>
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column property="Name" label="名称"></el-table-column>
				<!--<el-table-column align="center" label="所属系统">
					<template slot-scope="scope">
						<span>{{scope.row.ApplicationName}}</span>
					</template>
				</el-table-column>-->
			</el-table>
			</el-switch>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click.native.prevent="saveEdit">确 定</el-button>
			</div>
		</el-dialog>
		<el-dialog title="已分配角色" :visible.sync="scanDialogVisible" top="10vh">
			<el-table :data="addedRoles" height="400" border>
				<el-table-column property="Name" label="名称" width="250"></el-table-column>
				<el-table-column align="center" label="所属系统">
					<template slot-scope="scope">
						<span>{{scope.row.ApplicationName}}</span>
					</template>
				</el-table-column>
				<el-table-column property="Remark" label="备注"></el-table-column>
			</el-table>
			</el-switch>
		</el-dialog>
	</div>
</template>

<script>
	import { QuickQuery, AddRoleToUser, CheckUserRole, EditUserRoleView } from '@/api/user'
	import { QuickQuery as GetAllApplication } from '@/api/application'
	import { QuickQuery as GetRoles } from '@/api/role'
	export default {
		name: 'user',
		data() {
			return {
				Users: [],
				roles: [],
				addedRoles: [],
				applications: [],
				curUser: null,
				curSelectRolesId: [],
				applicationindex: null,
				total: 0,
				listLoading: false,
				editDialogVisible: false,
				scanDialogVisible: false,
				currentPage: 1,
				pageSize: 10,
				totalRow: 0,
				totalPage: 1,
				listQuery: {
					Value: ''
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
					Value: this.listQuery.Value
				}).then(response => {
					this.Users = response.Data;
					this.totalPage = response.TotalPage;
					this.totalRow = response.Rows;
					this.listLoading = false
				}).catch(() => {
					this.listLoading = false
				})
			},
			getAllApplication() {
				if(this.applications.length == 0) {
					this.listLoading = true;
					GetAllApplication({
						PageIndex: 1,
						PageSize: 30,
						Ordering: "Name"
					}).then(response => {
						this.applications = response.Data;
						this.listLoading = false;
					})
				}
			},
			handleFilter(){
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
			getSelectRole(selec) {
				this.curSelectRolesId = [];
				for(var item of selec) {
					this.curSelectRolesId.push(item.Id);
				}
			},
			handleApplication() {
				this.listLoading = true;
				EditUserRoleView({
					Id: this.curUser.Id,
					ApplicationIndex: this.applicationindex
				}).then(response => {
					this.roles = response.Data;
					this.$nextTick(() => {
						this.toggleSelection();
					});
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false
				})
			},
			toggleSelection() {
				this.curSelectRolesId = [];
				if(this.roles) {
					for(var item of this.roles) {
						this.$refs.roletable.toggleRowSelection(item, item.IsEnable);
						if(item.IsEnable) {
							this.curSelectRolesId.push(item.Id);
						}
					}
				}
			},
			editRoles(row) {
				this.curUser = row;
				this.applicationindex = null;
				this.roles = [];
				this.editDialogVisible = true;
				this.getAllApplication();
			},
			saveEdit() {
				this.listLoading = true;
				AddRoleToUser({
					UserId: this.curUser.Id,
					ApplicationIndex: this.applicationindex,
					RoleList: this.curSelectRolesId
				}).then(response => {
					this.editDialogVisible = false;
					this.listLoading = false;
					this.$notify({
						title: '成功',
						message: '添加成功',
						type: 'success',
						duration: 2000
					});
				}).catch(() => {
					this.listLoading = false
				})
			},
			checkUserRole(Id) {
				this.addedRoles = [];
				this.listLoading = true;
				this.scanDialogVisible = true;
				CheckUserRole({
					Id: Id
				}).then(response => {
					this.listLoading = false;
					this.addedRoles = response;
				}).catch(() => {
					this.listLoading = false;
				})
			}
		}
	}
</script>