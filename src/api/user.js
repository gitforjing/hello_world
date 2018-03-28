import fetch from '@/utils/fetch'

//用户查询
export function QuickQuery(params) {
	return fetch({
		url: '/QueryUser',
		method: 'post',
		data: params
	})
}
//编辑用户角色
export function AddRoleToUser(params) {
	return fetch({
		url: '/AddRoleToUser',
		method: 'post',
		data: params
	})
}
//查询用户角色
export function CheckUserRole(params) {
	return fetch({
		url: '/CheckUserRole',
		method: 'post',
		data: params
	})
}
//编辑查看用户角色
export function EditUserRoleView(params){
	return fetch({
		url: '/EditUserRoleView',
		method: 'post',
		data: params
	})
}
