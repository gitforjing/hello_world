<template>
	<div class="app-container calendar-list-container" v-loading="listLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)">
		<div class="filter-container">
			<el-select clearable style="width: 200px" class="filter-item" v-model="listQuery.applicationindex" @change="handleApplication" placeholder="所属系统">
				<el-option v-for="item in applications" :key="item.Id" :label="item.Name" :value="item.Id">
				</el-option>
			</el-select>
			<el-input v-model="listQuery.Name" @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="请输入名称">
				<i class="el-icon-search el-input__icon" style="cursor: pointer;" slot="suffix" @click="handleFilter"></i>
			</el-input>
		</div>

		<el-table class="table-size" height="100%" :data="list" element-loading-text="拼命加载中" fit stripe border highlight-current-row>
			<el-table-column align="center" label="序号" width="55">
				<template slot-scope="scope">
					<span>{{scope.$index+1}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="200px" label="名称">
				<template slot-scope="scope">
					<span>{{scope.row.Name}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="240px" label="所属系统">
				<template slot-scope="scope">
					<span>{{scope.row.ApplicationName}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="80px" label="运行状态">
				<template slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="scope.row.RunTimeStatu=='Warning' ? '响应时间过长' : scope.row.RunTimeStatu=='Error' ? '报错' :'正常'" placement="top-start">
						<span :class="scope.row.RunTimeStatu=='Warning' ? 'warningLog' : scope.row.RunTimeStatu=='Error' ? 'errorLog' :'normalLog'"></span>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column align="center" width="80px" label="限制时间">
				<template slot-scope="scope">
					<span>{{scope.row.LimitTime}}</span>
				</template>
			</el-table-column>
			<!--<el-table-column align="center" width="80px" label="滴水时间">
				<template slot-scope="scope">
					<span>{{scope.row.IsLimit ? scope.row.DrippingTime:'/'}}</span>
				</template>
			</el-table-column>-->
			<el-table-column align="center" width="150px" label="限速(次/分钟)">
				<template slot-scope="scope">
					<span>{{scope.row.IsLimit ? scope.row.LimitSpeed: '/'}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="100px" label="令牌桶大小">
				<template slot-scope="scope">
					<span>{{scope.row.IsLimit ? scope.row.TokenBucket:'/'}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="180px" label="限制结束时间">
				<template slot-scope="scope">
					<span>{{scope.row.LimitEndTime | formaTime}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" width="100px" label="是否被限流">
				<template slot-scope="scope">
					<span :class="scope.row.IsLimit ? 'el-icon-circle-check-outline':'el-icon-remove-outline'"></span>
				</template>
			</el-table-column>
			<el-table-column align="center" min-width="300px" label="注释" show-overflow-tooltip>
				<template slot-scope="scope">
					<span>{{scope.row.Remark}}</span>
				</template>
			</el-table-column>
			<el-table-column align="center" label="操作" width="120" fixed="right">
				<template slot-scope="scope">
					<el-button size="small" @click="handleOld(scope.row)">流量监控</el-button>
					<!--<el-button size="small" type="success" @click="handleCur(scope.row)">即时流量</el-button>-->
				</template>
			</el-table-column>
		</el-table>
		<el-pagination class="page_wrap" background :current-page="currentPage" :page-sizes="[10, 20, 50, 80, 100]" :page-size="pageSize" layout="prev, pager, next, total, sizes" :total="totalRow" style="margin: 10px 0;" @current-change="pagechange" @size-change="sizechange">
		</el-pagination>
		<v-serviceflow v-if="dialogService" :data="curService" @closeDiolog="closeDiolog" ref="svcflow"></v-serviceflow>
	</div>
</template>

<script>
	import { GetUserChart, GetIPChart, QuickQuery, addLimitSpeedService } from '@/api/warning'
	import { QuickQuery as GetAllApplication } from '@/api/application'
	import serviceFlow from '@/components/Serviceflow/index'
	import { Verify } from '@/utils/validate'
	import { parseTime } from '@/utils'
	import echarts from 'echarts'
	export default {
		name: 'warning',
		components: {
			"v-serviceflow":serviceFlow
		},
		data() {
			return {
				list: [],
				applications: [],
				curService: null,
				total: 0,
				isipshow: false,
				isusershow: false,
				listLoading: false,
				currentPage: 1,
				pageSize: 10,
				num8: 1,
				totalRow: 0,
				totalPage: 1,
				hourI: 1,
				issecondload: true,
				activeName2: 'first',
				listQuery: {
					Name: '',
					applicationindex: null
				},
				temp: {
					Id: undefined,
					Name: '',
					LimitSpeed: '',
					TokenBucket: '',
					DrippingTime: '',
					LimitEndTime: '',
				},
				chartQuery: {
					ServiceId: undefined,
					Name: "",
					lineBar: "",
					BeginTime: ""
				},
				limitSpeedFormVisible: false,
				dialogService: false,
				dialogFormVisible: true,
				dialogFormLoading: false,
				curSpeedFormVisible: false,
				webSocket: null
			}
		},
		created() {
			this.getList();
		},
		methods: {
			getList() {
				this.listLoading = true;
				this.dialogFormVisible = false;
				this.list = [];
				QuickQuery({
					PageIndex: this.currentPage,
					PageSize: this.pageSize,
					Ordering: "Id",
					Name: this.listQuery.Name,
					applicationindex: this.listQuery.applicationindex
				}).then(response => {
					console.log(response);
					this.list = response.Data;
					this.totalPage = response.TotalPage;
					this.totalRow = response.Rows;
					this.listLoading = false;
					this.getAllApplication();
				}).catch(() => {
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
			handleOld(data) {
				this.curService = {
					id: data.Id,
					name: data.Name
				};
				this.dialogService = true;
			},
			pagechange(index) {
				this.currentPage = index;
				this.getList();
			},
			sizechange(num) {
				this.pageSize = num;
				this.getList();
			},
			closeDiolog(){
				this.dialogService = false;
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.errorLog {
		display: inline-block;
		width: 20px;
		height: 20px;
		border-radius: 10px;
		background-color: red;
	}
	
	.warningLog {
		display: inline-block;
		width: 20px;
		height: 20px;
		border-radius: 10px;
		background-color: orange;
	}
	
	.normalLog {
		display: inline-block;
		width: 20px;
		height: 20px;
		border-radius: 10px;
		background-color: darkgreen;
	}
	
	.el-input-number {
		width: 100px;
	}
</style>