<template>
	<div id="echartContainer" style="width:500px; height:500px"></div>
</template>

<script>
	import echarts from 'echarts'
	export default {
		name: 'echart',
		data() {
			return {
				myChart: null,
				data: [5, 20, 36, 10, 10, 20]
			}
		},
		created() {
			this.$nextTick(() => {
				let $this = this;
				window.setInterval(function() {
					for(var i=0; i<6; i++){
						let random = parseInt(Math.random()*100);
						$this.data[i] = random;
					}
					$this.refreshData();
				}, 2000);
			})
		},
		methods: {
			refreshData() {
				if(!this.myChart) {
					return;
				}
				//更新数据
				var option = this.myChart.getOption();
				option.series[0].data = this.data;
				this.myChart.setOption(option);
			}
		},
		mounted() {
			// 基于准备好的dom，初始化echarts实例
			this.myChart = echarts.init(document.getElementById('echartContainer'));
			// 绘制图表
			this.myChart.setOption({
				title: {
					text: 'ECharts 入门示例'
				},
				tooltip: {},
				xAxis: {
					data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
				},
				yAxis: {},
				series: [{
					name: '销量',
					type: 'bar',
					data: this.data
				}]
			});
		}
	}
</script>

<style lang="scss" scoped>

</style>