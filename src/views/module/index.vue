<template>
	<div class="app-container calendar-list-container"
		v-loading="listLoading" 
		element-loading-text="拼命加载中" 
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(0, 0, 0, 0.3)">
		<div class="filter-container">
			<el-button type="primary" @click="handleCreate" icon="el-icon-circle-plus-outline">添加</el-button>
			<el-select clearable style="width: 200px" class="filter-item" v-model="listQuery.applicationindex" @change="handleApplication" placeholder="所属系统">
				<el-option v-for="item in applications" :key="item.Idx" :label="item.Name" :value="item.Idx">
				</el-option>
			</el-select>
			<el-checkbox class="filter-item" style='margin-left:15px;' @change='getList' v-model="listQuery.isfrozen">包括已冻结</el-checkbox>
		</div>
		<el-table class="table-size" height="100%" :data="module" fit stripe border highlight-current-row>
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
			<el-table-column align="center" width="200" label="代码">
				<template slot-scope="scope">
					<span>{{scope.row.Code}}</span>
				</template>
			</el-table-column>
			<el-table-column min-width="300px" align="center" label="所属系统">
				<template slot-scope="scope">
					<span>{{scope.row.ApplicationName}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="是否启用">
				<template slot-scope="scope">
					<span :class="scope.row.Statu ? 'el-icon-circle-check-outline':'el-icon-remove-outline'"></span>
				</template>
			</el-table-column>
			<el-table-column min-width="300px" align="center" label="备注">
				<template slot-scope="scope">
					<span>{{scope.row.Remark}}</span>
				</template>
			</el-table-column>
			<el-table-column width="250px" align="center" label="创建时间">
				<template slot-scope="scope">
					<span>{{scope.row.CreateTime | parseTime}}</span>
				</template>
			</el-table-column>

			<el-table-column align="center" label="操作" width="150" fixed="right">
				<template slot-scope="scope">
					<el-button size="small" type="success" @click="handleUpdate(scope.row)">编辑
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
				<el-form-item label="Code" prop="Code">
					<el-input v-model="temp.Code"></el-input>
				</el-form-item>
				<el-form-item label="所属系统">
					<el-select v-model="temp.ApplicationIndex" placeholder="请选择所属系统">
						<el-option v-for="item in applications" :key="item.Idx" :label="item.Name" :value="item.Idx">
							<span style="float: left">{{ item.Name }}</span>
							<!--<span style="float: right; color: #8492a6; font-size: 13px">{{ item.Num }}</span>-->
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否可用">
					<el-switch v-model="temp.Statu">
					</el-switch>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="temp.Remark"></el-input>
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
	import { Create, Update, Delete, QuickQuery } from '@/api/module'
	import { QuickQuery as GetAllApplication } from '@/api/application'
	import { Verify } from '@/utils/validate'
//	import { parseTime } from '@/utils'
	export default {
		name: 'module',
		data() {
			const validateName = (rule, value, callback) => {
				if(Verify.isNull(value)) {
					callback(new Error('名称不能为空'))
				} else {
					callback()
				}
			}
			const validateCode = (rule, value, callback) => {
				if(Verify.isNull(value)) {
					callback(new Error('代码不能为空'))
				} else {
					callback()
				}
			}
			return {
				module: [],
				applications: [],
				total: 0,
				listLoading: false,
				currentPage: 1,
				pageSize: 10,
				totalRow: 0,
				totalPage: 1,
				temp: {
					Id: undefined,
					Name: '',
					ApplicationIndex: '',
					Code: '',
					Statu: true,
					Remark: ''
				},
				listQuery: {
					applicationindex: null,
					isfrozen: false,
				},
				submitRules: {
					Name: [{
						required: true,
						trigger: 'blur',
						validator: validateName
					}],
					Code: [{
						required: true,
						trigger: 'blur',
						validator: validateCode
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
				this.listLoading = true
				this.module = [];
				QuickQuery({
					PageIndex: this.currentPage,
					PageSize: this.pageSize,
					Ordering: "Name",
					IsFrozen: this.listQuery.isfrozen,
					ApplicationIndex: this.listQuery.applicationindex
				}).then(response => {
					console.log(response);
					this.module = response.Data;
					this.totalPage = response.TotalPage;
					this.totalRow = response.Rows;
					this.listLoading = false;
					this.getAllApplication();
				})
				.catch(()=>{
						this.listLoading = false;
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
					}).catch(()=>{
						this.listLoading = false;
					})
				}
			},
			handleApplication(id){
				this.currentPage = 1;
				this.getList();
			},
			handleCreate() {
				this.resetTemp()
				this.getAllApplication()
				this.dialogStatus = 'create'
				this.dialogFormVisible = true
			},
			handleUpdate(row) {
				this.temp = Object.assign({}, row)
				this.getAllApplication()
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
			},
			resetTemp() {
				this.temp = {
					id: undefined,
					Name: '',
					Code: '',
					ApplicationIndex: '',
					Statu: true,
					Remark: ''
				}
			}
		}
	}
</script>