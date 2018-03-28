import fetch from '@/utils/fetch'

//新增服务
export function addService(params) {
	return fetch({
		url: '/RegisterService',
		method: 'post',
		data: params
	})
}
//修改服务
export function updateSerivce(params) {
	return fetch({
		url: '/EditService',
		method: 'post',
		data: params
	})
}
//删除服务
export function deleteSerivce(params) {
	return fetch({
		url: '/DeleteService',
		method: 'post',
		data: params
	})
}
//查询服务--分页
export function QuickQuery(params) {
	return fetch({
		url: '/QueryService',
		method: 'post',
		data: params
	})
}
//查询服务(运维)
export function QuickQueryAll(params){
	return fetch({
		url: '/QueryServiceForManager',
		method: 'post',
		data: params
	})
}
