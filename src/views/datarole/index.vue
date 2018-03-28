<template>
	<div class="app-container calendar-list-container" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)">
		<el-container>
			<el-main>
				<div class="layout_title">系统列表</div>
				<el-table :data="application" border style="width: 100%" @row-click="afetrSelect" highlight-current-row>
					<el-table-column prop="Name" label="姓名" width="180">
					</el-table-column>
					<el-table-column prop="Statu" label="是否启用" align="center" width="180">
						<template slot-scope="scope">
							<span :class="scope.row.Statu ? 'el-icon-circle-check-outline':'el-icon-remove-outline'"></span>
						</template>
					</el-table-column>
					<el-table-column prop="Remark" label="备注" show-overflow-tooltip>
					</el-table-column>
				</el-table>
			</el-main>
			<el-aside style="width: 400px; min-height: 300px;position: relative;margin: 5px;">
				<div class="layout_title">组织机构关系</div>
				<el-tree :data="structure" :props="defaultProps" :empty-text="''" :expand-on-click-node="false" :render-content="renderContent">
				</el-tree>
				<el-button v-if="curApplication && structure.length == 0" type="text" class="addtree_btn">暂无数据</el-button>
			</el-aside>
		</el-container>
		<el-dialog title="角色编辑" :visible.sync="editDialogVisible" width="30%" top="7vh">
			<el-table :data="roles" @selection-change="getSelectRole" @select-all="getSelectRole" height="400" ref="roletable" border highlight-current-row>
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column property="Name" label="名称" width="150"></el-table-column>
				<el-table-column align="center" label="所属系统">
					<template slot-scope="scope">
						<span>{{scope.row.ApplicationName}}</span>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editDialogVisible = false">取 消</el-button>
				<el-button type="primary" @click.native.prevent="saveEdit">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { QuickQuery as GetApplication } from '@/api/application'
	import { GetTree } from '@/api/organizationStructure'
	import { getDataRole, editDataRole } from '@/api/datarole'
	export default {
		data() {
			return {
				application: [],
				structure: [],
				roles: [],
				curSelectRolesId: [],
				IsRetain: true,
				curApplication: null,
				addNode: null,
				parentNode: null,
				defaultProps: {
					children: 'Children',
					label: 'Name'
				},
				listLoading: false,
				editDialogVisible: false,
				scanDialogVisible: false,
				currentPage: 1,
				pageSize: 10,
				totalRow: 0,
				totalPage: 1,
				nodes: [],
			}
		},
		created() {
			this.getApplication();
		},
		methods: {
			getApplication() {
				var date = new Date();
				console.log(date);
				this.listLoading = true;
				GetApplication({
					PageIndex: this.currentPage,
					PageSize: this.pageSize,
					Ordering: "Name"
				}).then(response => {
					console.log(response);
					this.application = response.Data;
					this.totalPage = response.TotalPage;
					this.totalRow = response.Rows;
					this.listLoading = false
				}).catch((response) => {
					this.listLoading = false
				})
			},
			afetrSelect(row) {
				this.curApplication = row;
				this.getTree();
			},
			setAddNode(node) {
				this.addNode = node;
			},
			getTree() {
				if(this.curApplication) {
					this.listLoading = true;
					this.structure = [];
					GetTree({
						ApplicationIndex: this.curApplication.Idx
					}).then(response => {
						if(!!response) {
							this.structure.push(response);
						}
						this.listLoading = false
					}).catch((response) => {
						this.listLoading = false
					})
				} else {
					this.$message({
						message: '请选择系统',
						type: 'warning'
					});
				}
			},
			getSelectRole(selec) {
				this.curSelectRolesId = [];
				for(var item of selec) {
					this.curSelectRolesId.push(item.Id);
				}
			},
			getRoles(data) {
				this.listLoading = true;
				getDataRole({
					OrganizationIndex: data.Id,
					ApplicationIndex: this.curApplication.Idx
				}).then(response => {
					this.roles = response.Data;
					this.listLoading = false;
					this.$nextTick(()=>{
						this.toggleSelection();
					})
				}).catch(() => {
					this.listLoading = false;
				})
				this.nodeTableVisible = true;
			},
			edit(node, data) {
				this.parentNode = data;
				this.editDialogVisible = true;
				this.roles = [];
				this.getRoles(data);
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
			saveEdit() {
				if(this.curSelectRolesId.length == 0) {
					this.$confirm('此操作将清空所有角色, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.listLoading = true;
						editDataRole({
							Id: this.parentNode.Id,
							rolelist: this.curSelectRolesId,
							ApplicationIndex: this.curApplication.Idx
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
					}).catch(() => {
						return;
					})
				} else {
					this.listLoading = true;
					editDataRole({
						Id: this.parentNode.Id,
						rolelist: this.curSelectRolesId,
						ApplicationIndex: this.curApplication.Idx
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
				}
			},
			renderContent(h, {
				node,
				data,
				store
			}) {
				return(
					<span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 12px; padding-right: 8px;">
            		<span><span>{node.label}</span></span>
            		<span>
            		<el-button class="add_node_btn" style="font-size: 12px;" type="text" on-click={ () => this.edit(node, data) }>编辑</el-button>
            		</span>
          			</span>);
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	@import "src/styles/mixin.scss";
	.application_wrap {
		margin: 5px;
	}
	
	.layout_title {
		height: 40px;
		line-height: 40px;
		padding: 0 5px;
		background-color: $themeColor;
	}
	
	.addtree_btn {
		position: absolute;
		height: 40px;
		width: 130px;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto auto;
	}
</style>