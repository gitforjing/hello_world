<template>
	<div class="app-container calendar-list-container" v-loading="formLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)">
		<el-container>
			<el-aside width="50%">
				<div class="filter-container">
					<el-form :inline="true" class="demo-form-inline">
						<el-select v-model="num8" style="width: 100px" placeholder="请选择" @change="handleChange">
							<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
						<el-tag type="info">小时内流量</el-tag>
					</el-form>
				</div>
				<el-form class="small-space" label-position="left" label-width="90px" size="mini">
					<div id="myChart" style="width: 100%;height:380px;text-align: center;">
						<img v-if="isshow" src="../../../assets/wsj.png" height="200" width="200" />
					</div>
				</el-form>
			</el-aside>
			<el-main>
				<el-form :inline="true" class="demo-form-inline">
				<el-form-item label="Top">
					<el-input-number v-model="num9" controls-position="right" @change="handleServiceChange" :min="5" :max="20" :step="5"></el-input-number>
					<el-form-item label="频繁服务"></el-form-item>
				</el-form-item>
			</el-form>
			<el-form class="small-space" label-position="left" label-width="90px" size="mini" v-loading="dialogChartLoading">
				<div id="myServiceChart" style="width: 100%;height:380px;text-align: center;">
					<img v-if="isserviceshow" src="../../../assets/wsj.png" height="200" width="200" />
				</div>
			</el-form>
			</el-main>
		</el-container>
		<v-serviceflow v-if="dialogService" :data="curService" @closeDiolog="closeDiolog" ref="svcflow"></v-serviceflow>
	</div>
</template>

<script>	
	import { GetApplicationChart ,GetServiceChart} from '@/api/exception/applicationchart'
	import serviceFlow from '@/components/Serviceflow/index'
	import echarts from 'echarts'
	export default {
		name: 'applicationchart',
		components: {
			"v-serviceflow":serviceFlow
		},
		data() {
			return {
				options: [],
				isshow: false,
				isserviceshow: false,
				listLoading: false,
				hourI: 1,
				num8: 1,
				num9: 5,
				formLoading: false,
				curService: null,
				chartQuery: {
					lineBar: "",
					BeginTime: "",
				},
				chartServiceQuery: {
					lineBar: "",
					BeginTime: "",
					Top: 5,
					ApplicationId: undefined
				},
				dialogService: false,
				dialogChartLoading: false
			}
		},
		created() {
			this.initoptions();
			this.getOld();
		},
		methods: {
			initoptions() {
				for(var i = 1; i <= 12; i++) {
					this.options.push({
						value: i,
						label: i
					})
				}
			},
			getOld() {
				this.listLoading = true;
				this.chartQuery.lineBar = "pie";
				this.listLoading = false;
				this.chartSeachShow();
			},
			handleChange(value) {
				this.hourI = value;
				this.chartSeachShow();
			},
			handleServiceChange(value) {
				this.chartServiceQuery.Top = value;
				this.chartServiceSeachShow();
			},
			chartSeachShow() {
				var date = new Date();
				var hour = date.getHours();
				var hours = this.hourI > hour ? "00" : (hour - this.hourI).toString();
				var minutes = date.getMinutes().toString();
				this.chartQuery.BeginTime = ('00' + hours).substr(hours.length) + ":" + ('00' + minutes).substr(minutes.length);
				this.formLoading = true;
				GetApplicationChart(this.chartQuery).then(response => {
					this.drawPie("应用统计", response);
					this.formLoading = false;
				}).catch(() => {
					this.formLoading = false;
				});
			},
			drawPie(title, data) {
				var g = this;
				if(data == null) {
					this.isshow = true;
					return;
				}
				// 基于准备好的dom，初始化echarts实例
				let mychart = echarts.init(document.getElementById('myChart'));
				// 绘制图表
				mychart.setOption({
					title: {
						text: '应用统计',
						x: 'center'
					},
					tooltip: {
						trigger: 'item',
						formatter: "{d}%"
					},
					series: [{
						type: 'pie',
						radius: '70%',
						center: ['50%', '50%'],
						selectedMode: 'single',
						data: data.totalDatas,
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
				});
				mychart.on('click', function(param) {
					g.chartServiceQuery.ApplicationId = param.data.id;
					g.chartServiceSeachShow();
				});
			},
			chartServiceSeachShow() {
				this.chartServiceQuery.BeginTime = this.chartQuery.BeginTime;
				this.dialogChartLoading = true;
				GetServiceChart(this.chartServiceQuery).then(response => {
					this.drawServicePie("服务统计", response);
					this.dialogChartLoading = false;
				}).catch(() => {
					this.dialogChartLoading = false;
				});
			},
			drawServicePie(title, data) {
				let g = this;
				if(data == null) {
					this.isserviceshow = true;
					return;
				}
				// 基于准备好的dom，初始化echarts实例
				let mychart = echarts.init(document.getElementById('myServiceChart'));
				// 绘制图表
				mychart.setOption({
					title: {
						text: title,
						x: 'center'
					},
					tooltip: {
						trigger: 'item',
						formatter: "{d}%"
					},
					series: [{
						type: 'pie',
						radius: '70%',
						center: ['50%', '50%'],
						selectedMode: 'single',
						data: data.totalDatas,
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}]
				});
				mychart.on('click', function(param) {
					if(param.data.name!='其他'){
						g.curService = param.data;
						g.dialogService = true;
					}
				});
			},
			closeDiolog(){
				this.dialogService = false;
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.filter-container {
		margin-bottom: 10px;
	}
	
	.el-input-number {
		width: 100px;
	}
</style>