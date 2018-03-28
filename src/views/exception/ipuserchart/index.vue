<template>
	<div class="app-container calendar-list-container" 
		v-loading="formLoading" 
		element-loading-text="拼命加载中" 
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(0, 0, 0, 0.3)">
		<div class="filter-container">
			<el-form :inline="true" class="demo-form-inline">
				<el-select v-model="num8" style="width: 100px" placeholder="请选择" @change = "handleChange" >
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				<el-tag type="info">小时内流量</el-tag>			
			</el-form>
		</div>	
		<el-form class="small-space" label-position="left" label-width="90px" size="mini">
			<template>
			  <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
			    <el-tab-pane label="IP流量" name="first">
			    	<div id="myIpChart" style="width: 1150px;height:450px;text-align: center;">
						<img v-if="isipshow" src="../../../assets/wsj.png" height="200" width="200"/>
					</div>
			    </el-tab-pane>
			    <el-tab-pane label="用户流量" name="second">
			    	<div id="myUserChart" style="width: 1150px;height:450px;text-align: center;">
						<img v-if="isusershow" src="../../../assets/wsj.png" height="200" width="200"/>
					</div>
			    </el-tab-pane>
			  </el-tabs>
			</template>			
		</el-form>
		
	</div>
</template>

<script>	
	import { GetUserChart,GetIPChart } from '@/api/exception/ipuserchart'
	import echarts from 'echarts'
	export default {
		name: 'ipuserchart',
		data() {
			return {
				options: [],
				isipshow: false,
				isusershow: false,
				listLoading: false,
				hourI:1,
				issecondload:true,
				num8: 1,
				activeName2: 'first',
				formLoading:false,
				chartQuery:{
					lineBar:"",
					BeginTime:""
				}
			}
		},
		created() {
			this.initoptions();
			this.getOld();			
		},
		methods: {	
			initoptions(){
				for(var i=1; i<=12; i++){
					this.options.push({
						value: i,
						label: i
					})
				}
			},
			handleClick(tab, event) {
	        	var date = new Date();
				var hour = date.getHours();
				var hours = this.hourI>hour?"00":(hour-this.hourI).toString();
				var minutes = date.getMinutes().toString();
				this.chartQuery.BeginTime = ('00' + hours).substr(hours.length)+":"+('00' + minutes).substr(minutes.length);				
	        	if(tab.name=="second" && this.issecondload)
	        	{
        			this.formLoading=true;
	        		GetUserChart(this.chartQuery).then(response => {
						this.drawLineUser("",response);	
						this.issecondload=false;
						this.formLoading=false;
					}).catch(()=>{
						this.formLoading=false;
					});
	        	}
	      	},
			getOld() {
				this.chartQuery.lineBar="line";
				this.chartSeachShow();
			},
			handleChange(value) {
				this.hourI=value;
				this.issecondload=true;
				this.activeName2='first';
				this.chartSeachShow();
	     	},
			chartSeachShow() {
				var date = new Date();
				var hour = date.getHours();
				var hours = this.hourI>hour?"00":(hour-this.hourI).toString();
				var minutes = date.getMinutes().toString();
				this.chartQuery.BeginTime = ('00' + hours).substr(hours.length)+":"+('00' + minutes).substr(minutes.length);	
				this.formLoading=true;
				GetIPChart(this.chartQuery).then(response => {				
					this.drawLineIp("",response);
					this.formLoading=false;
				}).catch(()=>{
					this.formLoading=false;
				});				
			},			
			drawLineIp(title,data){
				if(data==null)
				{
					this.isipshow = true;
					return;
				}
		        // 基于准备好的dom，初始化echarts实例
		        let ipChart = echarts.init(document.getElementById('myIpChart'));
		        // 绘制图表
		        ipChart.setOption({
		            title: { text: title },
		            tooltip: {},
		            xAxis: {
		                data: data.xAxisDatas,
		                axisLabel: {
	                        interval: 5 * this.hourI
		            	},
		            },
		            legend:{
		            	data:data.legendDatas
	                },
		            yAxis: {},
		            series: data.seriesDatas
		        });
		    },
			drawLineUser(title,data){
				if(data==null)
				{
					this.isusershow = true;
					return;
				}
		        // 基于准备好的dom，初始化echarts实例
		        let userChart = echarts.init(document.getElementById('myUserChart'));
		        // 绘制图表
		        userChart.setOption({
		            title: { text: title },
		            tooltip: {},
		            xAxis: {
		                data: data.xAxisDatas,
		                axisLabel: {
	                        interval: 5 * this.hourI
		            	},
		            },
		            legend:{
		            	data:data.legendDatas
	                },
		            yAxis: {},
		            series: data.seriesDatas
		        });
		    }
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.el-input-number {
    	width: 100px;
  	}
</style>