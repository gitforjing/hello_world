import fetch from '@/utils/fetch'
//历史流量查询
export function GetApplicationChart(params) {
	return fetch({
		url: '/BehaviorApplicationChartService',
		method: 'post',
		data: params
	})
}
//历史流量查询
export function GetServiceChart(params) {
	return fetch({
		url: '/BehaviorServiceChartService',
		method: 'post',
		data: params
	})
}