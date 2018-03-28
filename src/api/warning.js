import fetch from '@/utils/fetch'
//历史流量查询
export function GetIPChart(params) {
	return fetch({
		url: '/HistoricalIPChartService',
		method: 'post',
		data: params
	})
}
export function GetUserChart(params) {
	return fetch({
		url: '/HistoricalUserChartService',
		method: 'post',
		data: params
	})
}
//查询服务
export function QuickQuery(params) {
	return fetch({
		url: '/GetWarningService',
		method: 'post',
		data: params
	})
}
//限流新增服务
export function addLimitSpeedService(params) {
	return fetch({
		url: '/SetLimitSpeedService',
		method: 'post',
		data: params
	})
}
//查看单个服务的限流情况
export function GetLimitService(params){
	return fetch({
		url: '/GetLimitService',
		method: 'post',
		data: params
	})
}
