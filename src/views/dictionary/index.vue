<template>
	<div class="app-container calendar-list-container" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)">
		<div class="filter-container">
			<el-button type="primary" @click="handleCreate" icon="el-icon-circle-plus-outline">添加</el-button>
			<el-checkbox class="filter-item" style='margin-left:15px;' @change='getList' v-model="isfrozen">包括未启用</el-checkbox>
		</div>
		<el-table class="table-size" height="100%" :data="dictionary" fit stripe border highlight-current-row>
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
			<el-table-column align="center" label="是否启用">
				<template slot-scope="scope">
					<span :class="scope.row.Statu ? 'el-icon-circle-check-outline':'el-icon-remove-outline'"></span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="200" label="备注">
				<template slot-scope="scope">
					<span>{{scope.row.Remark}}</span>
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
				<el-form-item label="代码" prop="Code">
					<el-input v-model="temp.Code"></el-input>
				</el-form-item>
				<el-form-item label="是否启用">
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
	import { Create, Update, QuickQuery } from '@/api/dictionary'
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
			const validateCode = (rule, value, callback) => {
				if(Verify.isNull(value)) {
					callback(new Error('代码不能为空'))
				} else {
					callback()
				}
			}
			return {
				dictionary: [],
				total: 0,
				isfrozen: false,
				listLoading: false,
				currentPage: 1,
				pageSize: 10,
				totalRow: 0,
				totalPage: 1,
				temp: {
					Id: undefined,
					Name: '',
					Code: '',
					Statu: true,
					Remark: ''
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
				this.listLoading = true;
				QuickQuery({
					PageIndex: this.currentPage,
					PageSize: this.pageSize,
					Ordering: "Name",
					isfrozen: this.isfrozen
				}).then(response => {
					console.log(response);
					this.dictionary = response.Data;
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
				this.$refs.systemForm.validate(valid => {
					if(valid) {
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
			resetTemp() {
				this.temp = {
					Id: undefined,
					Name: '',
					Statu: true,
					Remark: ''
				}
			}
		}
	}
</script>