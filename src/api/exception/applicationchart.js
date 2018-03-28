import fetch from '@/utils/fetch'
//历史流量查询
export function GetApplicationChart(params) {
	return fetch({
		url: '/ExceptionApplicationChartService',
		method: 'post',
		data: params
	})
}
//历史流量查询
export function GetServiceChart(params) {
	return fetch({
		url: '/ExceptionServiceChartService',
		method: 'post',
		data: params
	})
}