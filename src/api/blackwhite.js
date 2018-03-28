import fetch from '@/utils/fetch'

//新增服务
export function addService(params) {
	return fetch({
		url: '/AddBlackIp',
		method: 'post',
		data: params
	})
}
//编辑服务
export function eidtService(params) {
	return fetch({
		url: '/EditBlackIp',
		method: 'post',
		data: params
	})
}
//删除服务
export function deleteSerivce(params) {
	return fetch({
		url: '/RemoveBlackIp',
		method: 'post',
		data: params
	})
}
//查询服务
export function QuickQuery(params) {
	return fetch({
		url: '/QueryBlackIp',
		method: 'post',
		data: params
	})
}