<template>
	<div class="app-container calendar-list-container" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)">
		<div class="filter-container">
			<el-select clearable style="width: 200px" class="filter-item" v-model="listQuery.ApplicationId" @change="handleApplication" placeholder="所属系统">
				<el-option v-for="item in applications" :key="item.Id" :label="item.Name" :value="item.Id">
				</el-option>
			</el-select>
			<el-input v-model="listQuery.Value" @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="请输入服务名称">
				<i class="el-icon-search el-input__icon" style="cursor: pointer;" slot="suffix" @click="handleFilter"></i>
			</el-input>
		</div>
		<el-table class="table-size" height="100%" :data="logs" @sort-change="sortChange" fit stripe border highlight-current-row>
			<el-table-column sortable="custom" align="center" label="系统" prop="ApplicationName">
				<template slot-scope="scope">
					<span>{{scope.row.ApplicationName}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="服务">
				<template slot-scope="scope">
					<span>{{scope.row.ServiceName}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="200" label="操作人">
				<template slot-scope="scope">
					<span>{{scope.row.Operator}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="200" label="请求IP">
				<template slot-scope="scope">
					<span>{{scope.row.Ip}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" sortable="custom" width="200" label="请求时间" prop="ResponseBeginTime">
				<template slot-scope="scope">
					<span>{{scope.row.ResponseBeginTime | formaTime}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" sortable="custom" width="200" label="响应时间" prop="OperationTime">
				<template slot-scope="scope">
					<span>{{scope.row.OperationTime}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="150" fixed="right">
				<template slot-scope="scope">
					<el-button size="small" @click="showParams(scope.row)">请求参数
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-pagination background class="page_wrap" :current-page="listQuery.PageIndex" :page-sizes="[10, 20, 50, 80, 100]" :page-size="listQuery.PageSize" layout="prev, pager, next, total, sizes" :total="totalRow" style="margin: 10px 0;" @current-change="pagechange" @size-change="sizechange">
		</el-pagination>
		<el-dialog title="请求参数" :visible.sync="dialogFormVisible">
			<el-form>
				<el-form-item>
					<el-input type="textarea" :rows="15" disabled v-model="params"></el-input>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import { QuickQuery } from '@/api/behavorlog'
	import { QuickQuery as GetAllApplication } from '@/api/application'
	import { Verify } from '@/utils/validate'
	import { parseTime } from '@/utils'
	export default {
		name: 'behavorlog',
		data() {
			return {
				logs: [],
				applications: [],
				total: 0,
				listLoading: false,
				dialogFormVisible: false,
				totalRow: 0,
				totalPage: 1,
				QueryServiceName: '',
				params: '',
				listQuery: {
					PageIndex: 1,
					PageSize: 10,
					Value: '',
					Ordering: "ResponseBeginTime",
					ApplicationId: null,
					IsDesc: true
				}
			}
		},
		created() {
			this.getList();
		},
		methods: {
			getList() {
				this.listLoading = true
				this.logs = [];
				QuickQuery({
					Value: this.listQuery.Value,
					PageIndex: this.listQuery.PageIndex,
					PageSize: this.listQuery.PageSize,
					Ordering: this.listQuery.Ordering,
					ApplicationId: this.listQuery.ApplicationId,
					IsDesc: this.listQuery.IsDesc
				})
					.then(response => {
						this.logs = response.Data;
						this.totalPage = response.TotalPage;
						this.totalRow = response.Rows;
						this.listLoading = false;
						this.getAllApplication();
					})
					.catch(() => {
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
					})
				}
			},
			handleApplication() {
				this.listQuery.PageIndex = 1;
			},
			handleFilter(){
				this.listQuery.PageIndex = 1;
				this.getList();
			},
			pagechange(index) {
				this.listQuery.PageIndex = index;
			},
			sizechange(num) {
				this.listQuery.PageSize = num;
			},
			sortChange(column) {
				console.log(column);
				this.listQuery.Ordering = column.prop ? column.prop : this.listQuery.Ordering;
				switch (column.order){
					case "ascending":
						this.listQuery.IsDesc = false;
						break;
					case "descending":
						this.listQuery.IsDesc = true;
						break;
					default:
						this.listQuery.IsDesc = false;
						break;
				}
			},
			showParams(data){
				this.params = data.OperatingData;
				this.dialogFormVisible = true;
			}
		},
		watch: {
			listQuery: {　　　　　
				handler() {　　　　　　　　　　　　
					this.getList();　　　　　　　　　　
				},
				deep: true　　　　　　　　
			}
		}
	}
</script>