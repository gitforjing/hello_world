import fetch from '@/utils/fetch'

//新增服务
export function AddUserSvc(params) {
	return fetch({
		url: '/AddUserSvc',
		method: 'post',
		data: params
	})
}
//编辑服务
export function EditUserSvc(params) {
	return fetch({
		url: '/EditUserSvc',
		method: 'post',
		data: params
	})
}
//删除服务
export function RemoveUserSvc(params) {
	return fetch({
		url: '/RemoveUserSvc',
		method: 'post',
		data: params
	})
}
//查询服务
export function QueryUserSvc(params) {
	return fetch({
		url: '/QueryUserSvc',
		method: 'post',
		data: params
	})
}