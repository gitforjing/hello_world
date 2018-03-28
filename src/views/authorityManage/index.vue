<template>
	<div class="app-container calendar-list-container" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)">
		<div class="filter-container">
			<el-select style="width: 200px" class="filter-item" v-model="listQuery.applicationindex" @visible-change="getApplication" @change="handleApplication" placeholder="所属系统" :loading="loading">
				<el-option v-for="item in application" :key="item.Idx" :label="item.Name" :value="item.Idx">
				</el-option>
			</el-select>
			<el-select style="width: 300px" v-model="curRole" value-key="Id" @change="selectRole" @visible-change="showRole" placeholder="角色" filterable :loading="loading">
				<el-option v-for="item in roles" :key="item.Id" :label="item.Name" :value="item">
					<span style="float: left">{{ item.Name }}</span>
				</el-option>
			</el-select>
			<el-input v-model="listQuery.ModuleName" @keyup.enter.native="handleFilter" style="width: 200px;position: absolute;right: 10px;" placeholder="请输入模板名称">
				<i class="el-icon-search el-input__icon" style="cursor: pointer;" slot="suffix" @click="handleFilter"></i>
			</el-input>
		</div>
		<el-table class="table-size" height="100%" :data="module" element-loading-text="拼命加载中" @expand-change="getPermissionByModule" fit stripe border highlight-current-row>
			<el-table-column type="expand">
				<template slot-scope="scope">
					<el-form label-position="left" inline class="demo-table-expand">
						<el-form-item>
							<el-checkbox v-for="checkitem in scope.row.FunctionList" :key="checkitem.Id" v-model="checkitem.Possess">{{checkitem.Name}}</el-checkbox>
						</el-form-item>
						<el-form-item style="display: block;">
							<el-button type="primary" @click="registModulePermission(scope.row)" size="mini">保存</el-button>
						</el-form-item>
					</el-form>
				</template>
			</el-table-column>
			<el-table-column align="center" width="200px" label="名称">
				<template slot-scope="scope">
					<span>{{scope.row.Name}}</span>
				</template>
			</el-table-column>
			<el-table-column min-width="200px" align="center" label="备注">
				<template slot-scope="scope">
					<span>{{scope.row.Remark}}</span>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination class="page_wrap" background :current-page="currentPage" :page-sizes="[10, 20, 50, 80, 100]" :page-size="pageSize" layout="prev, pager, next, total, sizes" :total="totalRow" style="margin: 10px 0;" @current-change="pagechange" @size-change="sizechange">
		</el-pagination>
	</div>
</template>

<script>
	import { QuickQuery as GetApplication } from '@/api/application'
	import { GetModulePermission, RegistModulePermission, FillModulePermission } from '@/api/dictionary'
	import { QuickQuery as GetModule } from '@/api/module'
	import { QueryRoleWithApplication } from '@/api/role'
	export default {
		data() {
			return {
				application: [],
				roles: [],
				module: [],
				permission: [],
				curRole: null,
				curModule: null,
				listLoading: false,
				loading: false,
				currentPage: 1,
				pageSize: 10,
				totalRow: 0,
				totalPage: 1,
				listQuery: {
					applicationindex: null,
					isfrozen: false,
					ModuleName: ''
				}
			}
		},
		created() {
			//			this.getList();
		},
		methods: {
			getPermissionByModule(module){
				console.log(module);
				if(module.clicknum > 0){
					return;
				}
				this.listLoading = true
				FillModulePermission({
					ApplicationIndex: this.curRole.ApplicationIndex,
					RoleIndex: this.curRole.Idx,
					ModuleIndex: module.Idx,
					FunctionList: module.FunctionList
				}).then(response => {
					module.FunctionList = response;
					module.clicknum ++;
					this.listLoading = false;
				}).catch((response) => {
					this.listLoading = false
				})
			},
			getList() {
				this.loading = true;
				QueryRoleWithApplication({
					PageIndex: 1,
					PageSize: 100,
					Ordering: "Name",
					IsFrozen: false,
					ApplicationIndex: this.listQuery.applicationindex
				}).then(response => {
					this.roles = response.Data;
					this.loading = false;
				}).catch(() => {
					this.loading = false
				})
			},
			getApplication(visible) {
				if(visible && this.application.length == 0) {
					this.loading = true;
					GetApplication({
						PageIndex: 1,
						PageSize: 100,
						Ordering: "Name"
					}).then(response => {
						this.application = response.Data;
						this.loading = false;
					}).catch((response) => {
						this.loading = false;
					})
				}
			},

			selectRole(row) {
				this.curRole = row;
				this.getModule(row);
			},
			showRole(visible) {
				if(visible && this.listQuery.applicationindex == null) {
					this.$message({
						message: '请选择所属系统',
						type: 'warning'
					});
					return false;
				} else if(this.roles.length == 0) {
					this.getList();
				}
			},
			getModule() {
				if(!this.curRole) {
					this.$message({
						message: '请选择角色',
						type: 'warning'
					});
					return false;
				}
				this.listLoading = true
				this.module = [];
				GetModulePermission({
					PageIndex: this.currentPage,
					PageSize: this.pageSize,
					Ordering: "Name",
					ApplicationIndex: this.curRole.ApplicationIndex,
					ModuleName: this.listQuery.ModuleName,
					RoleIndex: this.curRole.Idx,
				}).then(response => {
					this.module = response.Data;
					//添加点击计数字段，非0时去加载
					for(var item of this.module){
						item.clicknum = 0;
					}
					this.totalPage = response.TotalPage;
					this.totalRow = response.Rows;
					this.listLoading = false;
				}).catch((response) => {
					this.listLoading = false
				})
			},
			registModulePermission(module) {
				this.listLoading = true
				RegistModulePermission({
					ApplicationIndex: this.curRole.ApplicationIndex,
					RoleIndex: this.curRole.Idx,
					ModuleIndex: module.Idx,
					FunctionList: module.FunctionList
				}).then(response => {
					this.listLoading = false;
					this.$notify({
						title: '成功',
						message: '保存成功',
						type: 'success',
						duration: 2000
					});
				}).catch((response) => {
					this.listLoading = false
				})
			},
			handleApplication(id) {
				this.roles = [];
				this.module = [];
				this.curRole = null;
			},
			handleFilter() {
				this.getModule();
			},
			pagechange(index) {
				this.currentPage = index;
				this.getModule();
			},
			sizechange(num) {
				this.pageSize = num;
				this.getModule();
			},
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/mixin.scss";
	.application_wrap {
		position: relative;
		margin: 5px;
	}
	
	.table_height {
		position: absolute;
		top: 40px;
		bottom: 0;
	}
	
	.layout_title {
		height: 40px;
		line-height: 40px;
		padding: 0 5px;
		color: #FFF;
		background-color: $themeColor;
	}
</style>