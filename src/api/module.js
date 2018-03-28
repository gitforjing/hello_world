import fetch from '@/utils/fetch'

//新增服务
export function Create(params) {
	return fetch({
		url: '/RegisterModule',
		method: 'post',
		data: params
	})
}
//修改服务
export function Update(params) {
	return fetch({
		url: '/EditModule',
		method: 'post',
		data: params
	})
}
//删除服务
export function Delete(params) {
	return fetch({
		url: '/DeleteModule',
		method: 'post',
		data: params
	})
}
//查询服务
export function QuickQuery(params) {
	return fetch({
		url: '/QueryModuleForManager',
		method: 'post',
		data: params
	})
}