import fetch from '@/utils/fetch'

//新增服务
export function addApplication(params) {
	return fetch({
		url: '/RegisterApplication',
		method: 'post',
		data: params
	})
}
//修改服务
export function updateApplication(params) {
	return fetch({
		url: '/EditApplication',
		method: 'post',
		data: params
	})
}
//删除服务
export function deleteApplication(params) {
	return fetch({
		url: '/DeleteApplication',
		method: 'post',
		data: params
	})
}
//查询服务
export function QuickQuery(params) {
	return fetch({
		url: '/QueryApplicationForManager',
		method: 'post',
		data: params
	})
}
//
export function GetAllApplication(params) {
	return fetch({
		url: '/GetAllApplication',
		method: 'post',
		data: params
	})
}