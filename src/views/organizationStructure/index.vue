<template>
	<div class="app-container calendar-list-container" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)">
		<el-container>
			<el-main>
				<div class="layout_title">系统列表</div>
				<el-table :data="application" border style="width: 100%" @row-click="afetrSelect" highlight-current-row>
					<el-table-column prop="Name" label="姓名" width="180">
					</el-table-column>
					<el-table-column prop="Statu" label="是否启用" align="center" width="100">
						<template slot-scope="scope">
							<span :class="scope.row.Statu ? 'el-icon-circle-check-outline':'el-icon-remove-outline'"></span>
						</template>
					</el-table-column>
					<el-table-column prop="Remark" label="备注"  show-overflow-tooltip>
					</el-table-column>
				</el-table>
			</el-main>
			<el-aside style="width: 400px;min-height: 300px;position: relative;margin: 5px;">
				<div class="layout_title">组织机构关系</div>
				<el-tree :data="structure" :props="defaultProps" :empty-text="''" :expand-on-click-node="false" :render-content="renderContent">
				</el-tree>
				<el-button v-if="curApplication && structure.length == 0" type="primary" icon="el-icon-plus" class="addtree_btn" @click="getNodes">添加结构树</el-button>
			</el-aside>
		</el-container>
		<el-dialog title="选择节点" top="10vh" :visible.sync="nodeTableVisible">
			<el-input placeholder="请输入名称" v-model="QueryName" class="filter-item" style="width: 250px;margin-bottom: 10px;" clearable>
				<el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
			</el-input>
			<el-table :data="nodes" @selection-change="getSelectRow" height="400" border highlight-current-row>
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column property="Name" label="名称"></el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click="nodeTableVisible = false">取 消</el-button>
				<el-button type="primary" @click="goAddNode">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { QuickQuery as GetApplication } from '@/api/application'
	import { QuickQuery as GetNodes } from '@/api/organizationNode'
	import { GetTree, Create, Delete, GetRestOfNode } from '@/api/organizationStructure'
	export default {
		data() {
			return {
				application: [],
				structure: [],
				curApplication: null,
				addNode: [],
				parentNode: null,
				QueryName: '',
				defaultProps: {
					children: 'Children',
					label: 'Name'
				},
				listLoading: false,
				nodeTableVisible: false,
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
			getSelectRow(selec) {
				this.addNode = [];
				for(var item of selec) {
					this.addNode.push(item.OrganizationCode);
				}
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
			getNodes() {
				this.listLoading = true;
				GetRestOfNode({
					ApplicationIndex: this.curApplication.Idx,
					Name: this.QueryName
				}).then(response => {
					console.log(response);
					this.nodes = response.Data;
					this.listLoading = false
				}).catch(() => {
					this.listLoading = false
				})
				this.nodeTableVisible = true;
			},
			handleFilter(){
				this.getNodes();
			},
			goAddNode() {
				if(this.addNode.length == 0) {
					this.$message({
						message: '请选择节点',
						type: 'warning'
					});
					return;
				};
				if(!this.parentNode && this.addNode.length > 1) {
					this.$message({
						message: '只能添加一个根节点',
						type: 'warning'
					});
					return;
				};
				this.listLoading = true
				Create({
					OrganizationList: this.addNode,
					ApplicationIndex: this.curApplication.Idx,
					ParentIndex: this.parentNode ? this.parentNode.Id : null
				}).then(response => {
					this.listLoading = false;
					this.addNode = null;
					this.parentNode = null;
					this.nodeTableVisible = false;
					this.$notify({
						title: '成功',
						message: '添加成功',
						type: 'success',
						duration: 2000
					});
					this.getTree();
				}).catch(response => {
					console.log(response);
					this.listLoading = false;
				})
			},
			append(node, data) {
				this.parentNode = data;
				this.getNodes();
			},
			remove(node, data) {
				if(this.curApplication) {
					this.$confirm('此操作将删除该节点和节点下的所有子节点, 是否继续?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.listLoading = true
						Delete({
							OrganizationIndex: data.Id,
							ApplicationIndex: this.curApplication.Idx
						}).then(response => {
							this.listLoading = false
							this.$notify({
								title: '成功',
								message: '删除成功',
								type: 'success',
								duration: 2000
							});
							this.getTree();
						}).catch(response => {
							this.listLoading = false
							console.log(response);
						})
					}).catch(() => {
					});
				}
			},
			renderContent(h, {
				node,
				data,
				store
			}) {
				return(
					<span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 10px; padding-right: 8px;">
            		<span><span>{node.label}</span></span>
            		<span>
            		<el-button class="add_node_btn" style="font-size: 12px;" type="text" on-click={ () => this.append(node, data) }>+</el-button>
              		<el-button class="delet_node_btn" style="font-size: 12px;" type="text" on-click={ () => this.remove(node, data) }>-</el-button>
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