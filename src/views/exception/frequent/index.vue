<template>
	<div class="app-container calendar-list-container"
		v-loading="formLoading" 
		element-loading-text="拼命加载中" 
		element-loading-spinner="el-icon-loading"
		element-loading-background="rgba(0, 0, 0, 0.3)">
		<div class="filter-container">
			<el-form :inline="true" class="demo-form-inline">
				<el-select v-model="num8" style="width: 100px" placeholder="请选择" @change="handleChange">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
				<el-tag type="info">小时内流量</el-tag>
				<el-form-item label="Top">
					<el-select v-model="num9" style="width: 100px" placeholder="请选择" @change="handleServiceChange">
						<el-option v-for="item in tops" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<!--<el-input-number v-model="num9" controls-position="right" @change="handleServiceChange" :min="5" :max="20" :step="5"></el-input-number>-->
					<el-form-item label="频繁服务"></el-form-item>
				</el-form-item>		
			</el-form>
		</div>	
		<el-form class="small-space" label-position="left" label-width="90px" size="mini">
			<div id="myChart" style="width: 1150px;height:500px;text-align: center;">
				<img v-if="isshow" src="../../../assets/wsj.png" height="200" width="200"/>
			</div>
		</el-form>
	</div>
</template>

<script>	
	import { GetFrequentChart } from '@/api/exception/frequent'
	import echarts from 'echarts'
	export default {
		name: 'frequentchart',
		data() {
			return {
				options: [],
				tops: [{value: 5,label: 5},{value: 10,label: 10},{value: 15,label: 15},{value: 20,label: 20}],
				isshow: false,
				listLoading: false,
				hourI:1,
				num8: 1,
				num9: 5,
				formLoading:false,
				chartQuery:{
					lineBar:"",
					BeginTime:"",
					Top:5
				}
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
				this.chartQuery.lineBar="line";
				this.chartSeachShow();
			},
			handleChange(value) {
				this.hourI=value;
				this.chartSeachShow();
	     	},
	     	handleServiceChange(value) {
				this.chartQuery.Top = value;
				this.chartSeachShow();
	     	},
			chartSeachShow() {		         
				var date = new Date();
				var hour = date.getHours();
				var hours = this.hourI>hour?"00":(hour-this.hourI).toString();
				var minutes = date.getMinutes().toString();
				this.chartQuery.BeginTime = ('00' + hours).substr(hours.length)+":"+('00' + minutes).substr(minutes.length);	
				this.formLoading=true;				
				GetFrequentChart(this.chartQuery).then(response => {				
					this.drawline("",response);
					this.formLoading=false;
				}).catch(()=>{
					this.formLoading=false;
				});
			},			
			drawline(title,data){
				var g=this;
				if(data==null)
				{
					this.isshow = true;
					return;
				}
		        // 基于准备好的dom，初始化echarts实例
		        let mychart = echarts.init(document.getElementById('myChart'));
		        // 绘制图表
		        mychart.setOption({
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