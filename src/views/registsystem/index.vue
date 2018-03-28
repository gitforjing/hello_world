<template>
	<div class="app-container calendar-list-container"
		v-loading="listLoading" 
		element-loading-text="拼命加载中" 
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(0, 0, 0, 0.3)">
		<div class="filter-container">
			<el-input placeholder="请输入名称" v-model="listQuery.Name" @keyup.enter.native="handleFilter" class="filter-item" style="width: 250px;" clearable>
				<el-button slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
			</el-input>
			<el-select clearable style="width: 200px" class="filter-item" v-model="listQuery.applicationindex" @change="handleApplication" placeholder="所属系统">
				<el-option v-for="item in applications" :key="item.Id" :label="item.Name" :value="item.Id">
				</el-option>
			</el-select>
			<el-button type="primary" @click="handleCreate" icon="el-icon-circle-plus-outline">添加</el-button>
		</div>

		<el-table class="table-size" :data="list" element-loading-text="拼命加载中" height="100%" fit stripe border highlight-current-row>
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
			<el-table-column min-width="300px" align="center" label="Url">
				<template slot-scope="scope">
					<span>{{scope.row.Url}}</span>
				</template>
			</el-table-column>
			<el-table-column min-width="300px" align="center" label="IP">
				<template slot-scope="scope">
					<span>{{scope.row.Address}}</span>
				</template>
			</el-table-column>
			<el-table-column min-width="200px" align="center" label="端口">
				<template slot-scope="scope">
					<span>{{scope.row.Port}}</span>
				</template>
			</el-table-column>
			<el-table-column min-width="200px" align="center" label="所属系统">
				<template slot-scope="scope">
					<span>{{scope.row.ApplicationName}}</span>
				</template>
			</el-table-column>
			<el-table-column min-width="200px" align="center" label="限制时间">
				<template slot-scope="scope">
					<span>{{scope.row.LimitTime}}</span>
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
					<el-button size="small" type="danger" @click="deleterow(scope.row)">删除
					</el-button>
				</template>
			</el-table-column>

		</el-table>

		<el-pagination background class="page_wrap" :current-page="currentPage" :page-sizes="[10, 20, 50, 80, 100]" :page-size="pageSize" layout="prev, pager, next, jumper, ->, total, sizes" :total="totalRow" style="margin: 10px 0;" @current-change="pagechange" @size-change="sizechange">
		</el-pagination>

		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" top="10hv" width="30%">
			<el-form class="small-space" :model="temp" :rules="submitRules" ref="systemForm" label-position="left" label-width="70px" size="mini">
				<el-form-item label="名称" prop="Name">
					<el-input v-model="temp.Name"></el-input>
				</el-form-item>
				<el-form-item label="地址" prop="Url">
					<el-input v-model="temp.Url"></el-input>
				</el-form-item>
				<el-form-item label="端口">
					<el-input v-model="temp.Port"></el-input>
				</el-form-item>
				<el-form-item label="IP">
					<el-input v-model="temp.Address"></el-input>
				</el-form-item>
				<el-form-item label="所属系统">
					<el-select v-model="temp.ApplicationId" @change="setApplicationName"  placeholder="请选择所属系统">
						<el-option v-for="item in applications" :key="item.Id" :label="item.Name" :value="item.Id">
							<span style="float: left">{{ item.Name }}</span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="参数格式">
					<el-input v-model="temp.ParamFormat"></el-input>
				</el-form-item>
				<el-form-item label="限制时间">
					<el-input v-model="temp.LimitTime"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="temp.Remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button v-if="dialogStatus=='create'" type="primary" @click.native.prevent="create">确 定</el-button>
				<el-button v-if="dialogStatus=='update'" type="primary" @click.native.prevent="create">参考创建</el-button>
				<el-button v-if="dialogStatus=='update'" type="primary" @click.native.prevent="update">保存</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import { addService, updateSerivce, deleteSerivce, QuickQuery } from '@/api/system'
	import { QuickQuery as GetAllApplication } from '@/api/application'
	import { Verify } from '@/utils/validate'
	import { parseTime } from '@/utils'
	export default {
		name: 'table_demo',
		data() {
			const validateName = (rule, value, callback) => {
				if(Verify.isNull(value)) {
					callback(new Error('名称不能为空'))
				} else {
					callback()
				}
			}
			const validateUrl = (rule, value, callback) => {
				if(Verify.isNull(value)) {
					callback(new Error('Url不能为空'))
				} else {
					callback()
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
					Name: '',
					applicationindex: null
				},
				temp: {
					Id: undefined,
					Name: '',
					Url: '',
					Address: '',
					Port: '',
					Remark: '',
					ParamFormat: '',
					LimitTime: 100,
					ApplicationId: null,
					ApplicationName: ''
				},
				submitRules: {
					Name: [{
						required: true,
						trigger: 'blur',
						validator: validateName
					}],
					Url: [{
						required: true,
						trigger: 'blur',
						validator: validateUrl
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
					Name: this.listQuery.Name,
					applicationindex: this.listQuery.applicationindex
				}).then(response => {
					this.list = response.Data;
					this.totalPage = response.TotalPage;
					this.totalRow = response.Rows;
					this.listLoading = false;
					this.getAllApplication();
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
			//过滤-筛选
			handleFilter() {
				this.currentPage = 1;
				this.getList();
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
			setApplicationName(row){
				
			},
			create() {
				this.$refs.systemForm.validate(valid => {
					if(valid) {
						this.listLoading = true;
						addService(this.temp)
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
				this.listLoading = true;
				updateSerivce(this.temp)
					.then(response => {
						this.listLoading = false;
						this.resetTemp();
						this.dialogFormVisible = false;
						this.getList();
						this.$notify({
							title: '成功',
							message: '编辑成功',
							type: 'success',
							duration: 2000
						})
					})
					.catch(() => {
						this.listLoading = false
					})
			},
			deleterow(data) {
				this.listLoading = true;
				deleteSerivce({
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
			},
			resetTemp() {
				this.temp = {
					id: undefined,
					Name: '',
					Url: '',
					Address: '',
					Port: '',
					Remark: '',
					ParamFormat: '',
					ApplicationId: null
				}
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped="scoped">
</style>