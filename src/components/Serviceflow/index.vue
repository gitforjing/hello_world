<template>
	<div>
		<el-dialog :title="'服务:'+data.name" :visible.sync="dialogVisible" width="900px" top="3vh" @close="closeFlowDiolog" :close-on-click-modal="False" center>
			<div class="filter-container">
				<el-form :inline="true" class="demo-form-inline">
					<el-select v-model="num8" style="width: 100px" placeholder="请选择" @change="handleChange">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<el-tag type="info">小时内流量</el-tag>
				</el-form>
			</div>
			<el-form class="small-space" label-position="left" label-width="90px" size="mini" v-loading="dialogFormLoading">
				<template>
					<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
						<el-tab-pane label="IP流量" name="first">
							<div id="myIpChart" style="width: 900px;height:400px;text-align: center;">
								<img v-if="isipshow" src="../../assets/wsj.png" height="200" width="200" />
							</div>
						</el-tab-pane>
						<el-tab-pane label="用户流量" name="second">
							<div id="myUserChart" style="width: 900px;height:400px;text-align: center;">
								<img v-if="isusershow" src="../../assets/wsj.png" height="200" width="200" />
							</div>
						</el-tab-pane>
						<el-tab-pane label="即时流量" name="three">
							<div id="curFlowChart" style="width: 900px;height:400px;text-align: center;">
							</div>
						</el-tab-pane>
					</el-tabs>
				</template>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleLimitSpeed">限流设置</el-button>
				<el-button @click="closeFlowDiolog">关闭</el-button>
			</div>
		</el-dialog>
		<el-dialog title="限流设置" :visible.sync="limitSpeedFormVisible" width="30%" @close="closeLimitiolog" :close-on-click-modal="False">
			<el-form class="small-space" :model="temp" :rules="submitRules" ref="limitSpeedForm" label-position="left" label-width="120px" size="mini" v-loading="dialogFormLoading">
				<el-form-item label="限流服务名" prop="Name">
					<el-input v-model="temp.Name" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="限速(次/分钟)">
					<el-input v-model="temp.LimitSpeed"></el-input>
				</el-form-item>
				<el-form-item label="令牌桶大小">
					<el-input v-model="temp.TokenBucket"></el-input>
				</el-form-item>
				<!--<el-form-item label="滴水时间">
					<el-input v-model="temp.DrippingTime"></el-input>
				</el-form-item>-->
				<el-form-item label="限流结束日期" prop="LimitEndTime">
					<el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="temp.LimitEndTime" align="right" type="datetime" placeholder="选择日期">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="limitSpeedFormVisible = false">取 消</el-button>
				<el-button @click="createLimitSpeed">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import { GetUserChart, GetIPChart, addLimitSpeedService, GetLimitService } from '@/api/warning'
	import echarts from 'echarts'
	export default {
		name: 'serviceFlow',
		props: ['data'],
		data() {
			return {
				options: [],
				dialogVisible: true,
				limitSpeedFormVisible: false,
				False: false,
				dialogFormLoading: false,
				isipshow: false,
				isusershow: false,
				iscurshow: false,
				activeName: 'first',
				num8: 1,
				hourI: 1,
				issecondload: true,
				chartQuery: {
					ServiceId: this.data.id,
					Name: this.data.name,
					lineBar: "line",
					BeginTime: ""
				},
				temp: {
					Id: undefined,
					Name: '',
					LimitSpeed: '',
					TokenBucket: '',
					DrippingTime: 1,
					LimitEndTime: ''
				},
				submitRules: {
					Name: [{
						required: true,
						message: '请输入活动名称',
						trigger: 'blur'
					}],
					LimitEndTime: [{
						required: true,
						message: '请输入限制结束时间',
						trigger: 'blur'
					}]
				},
				webSocket: null
			}
		},
		created() {
			this.initoptions();
			this.chartSeachShow();
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
			chartSeachShow() {
				var date = new Date();
				var hour = date.getHours();
				var hours = this.hourI > hour ? "00" : (hour - this.hourI).toString();
				var minutes = date.getMinutes().toString();
				this.chartQuery.BeginTime = ('00' + hours).substr(hours.length) + ":" + ('00' + minutes).substr(minutes.length);
				this.dialogFormLoading = true;
				switch(this.activeName) {
					case 'first':
						GetIPChart(this.chartQuery).then(response => {
							this.drawLineIp("服务流量", response);
							this.dialogFormLoading = false;
						}).catch(() => {
							this.dialogFormLoading = false;
						});
						break;
					case 'second':
						GetUserChart(this.chartQuery).then(response => {
							this.drawLineUser("", response);
							this.issecondload = false;
							this.dialogFormLoading = false;
						}).catch(() => {
							this.dialogFormLoading = false;
						});
						break;
					case 'three':
						this.drawCurFlow();
						this.dialogFormLoading = false;
						break;
					default:
						break;
				}

			},
			drawLineIp(title, data) {
				if(data == null) {
					this.isipshow = true;
					return;
				}
				// 基于准备好的dom，初始化echarts实例
				let myChart = echarts.init(document.getElementById('myIpChart'))
				// 绘制图表
				myChart.setOption({
//					title: {
//						text: title
//					},
					tooltip: {},
					xAxis: {
						data: data.xAxisDatas,
						axisLabel: {
							interval: 2 * this.hourI
						},
					},
					legend: {
						data: data.legendDatas
					},
					yAxis: {},
					series: data.seriesDatas
				});
			},
			drawLineUser(title, data) {
				if(data == null) {
					this.isusershow = true;
					return;
				}
				// 基于准备好的dom，初始化echarts实例
				let myChart = echarts.init(document.getElementById('myUserChart'))
				// 绘制图表
				myChart.setOption({
					title: {
						text: title
					},
					tooltip: {},
					xAxis: {
						data: data.xAxisDatas,
						axisLabel: {
							interval: 2 * this.hourI
						},
					},
					legend: {
						data: data.legendDatas
					},
					yAxis: {},
					series: data.seriesDatas
				});
			},
			drawCurFlow() {
				let g = this;
				this.$nextTick(() => {
					// 基于准备好的dom，初始化echarts实例
					let myChart = echarts.init(document.getElementById('curFlowChart'));
					let option = {
						tooltip: {
							formatter: "{a}:{c}"
						},
						toolbox: {},
						series: [{
							name: '当前访问量',
							type: 'gauge',
							min: 0,
							max: 200,
							detail: {
								formatter: '{value}'
							},
							data: [{
								value: 0,
								name: '访问量'
							}]
						}]
					};
					// 绘制图表
					myChart.setOption(option);
					this.webSocket = new WebSocket("ws://10.4.68.141:50002/Rcsit.CM.DynamicMonitoringChartService?Id=" + this.data.id);
					this.webSocket.onerror = function(event) {
						g.$notify({
							title: '警告',
							message: '连接已断开',
							type: 'success',
							duration: 2000
						});
					};
					//与WebSocket建立连接  
					this.webSocket.onopen = function(event) {

					};
					this.webSocket.onclose = function(event) {
//						g.$notify({
//							title: '警告',
//							message: '连接已断开',
//							type: 'success',
//							duration: 2000
//						});
					};
					//处理服务器返回的信息  
					this.webSocket.onmessage = function(event) {
						console.log(event);
						option.series[0].data[0].value = event.data;
						myChart.setOption(option, true);
					};
				});
			},
			closeFlowDiolog() {
				if(!this.limitSpeedFormVisible) {
					this.$emit("closeDiolog");
				}
				if(this.webSocket){
					this.webSocket.close();
				}
			},
			closeLimitiolog() {
				this.dialogVisible = true;
			},
			handleChange(value) {
				this.hourI = value;
				this.issecondload = true;
				this.chartSeachShow();
			},
			handleLimitSpeed() {
				this.limitSpeedFormVisible = true;
				this.dialogVisible = false;
				this.dialogFormLoading = true;
				GetLimitService({
					Name: this.data.name
				}).then(response => {
					this.temp = response;
					this.dialogFormLoading = false;
				}).catch(() => {
					this.dialogFormLoading = false;
				});
			},
			handleClick(tab, event) {
				this.activeName = tab.name;
				this.chartSeachShow();
			},
			createLimitSpeed() {
				this.$refs.limitSpeedForm.validate(valid => {
					if(valid) {
						this.dialogFormLoading = true;
						addLimitSpeedService(this.temp)
							.then(response => {
								this.dialogFormLoading = false;
								this.resetTemp();
								this.limitSpeedFormVisible = false;
								this.dialogVisible = true;
								this.$notify({
									title: '成功',
									message: '编辑成功',
									type: 'success',
									duration: 2000
								})
							})
							.catch(() => {
								this.dialogFormLoading = false
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
					LimitSpeed: '',
					TokenBucket: '',
					DrippingTime: '',
					LimitEndTime: '',
				}
			}
		}
	}
</script>

<style>

</style>