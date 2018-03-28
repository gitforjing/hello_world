import fetch from '@/utils/fetch'
//历史流量查询
export function GetIPChart(params) {
	return fetch({
		url: '/BehaviorIPChartService',
		method: 'post',
		data: params
	})
}
export function GetUserChart(params) {
	return fetch({
		url: '/BehaviorUserChartService',
		method: 'post',
		data: params
	})
}