import fetch from '@/utils/fetch'

//查询错误日志
export function QuickQuery(params) {
	return fetch({
		url: '/QueryBehaviorLogForManage',
		method: 'post',
		data: params
	})
}