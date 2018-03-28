import fetch from '@/utils/fetch'
//历史流量查询
export function GetFrequentChart(params) {
	return fetch({
		url: '/BehaviorFrequentServiceChartService',
		method: 'post',
		data: params
	})
}