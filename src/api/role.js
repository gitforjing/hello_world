import fetch from '@/utils/fetch'

//新增角色
export function Create(params) {
	return fetch({
		url: '/RegisterRole',
		method: 'post',
		data: params
	})
}
//修改角色
export function Update(params) {
	return fetch({
		url: '/EditRole',
		method: 'post',
		data: params
	})
}
//删除角色
export function Delete(params) {
	return fetch({
		url: '/DeleteRole',
		method: 'post',
		data: params
	})
}
//查询角色
export function QuickQuery(params) {
	return fetch({
		url: '/QueryRole',
		method: 'post',
		data: params
	})
}
//根据系统查询用户角色
export function QueryRoleWithApplication(params) {
	return fetch({
		url: '/QueryRoleWithApplication',
		method: 'post',
		data: params
	})
}

//查询角色下已分配的用户
export function CheckUserWithRole(params){
	return fetch({
		url: '/CheckUserWithRole',
		method: 'post',
		data: params
	})
}
//删除角色下的用户
export function RemoveUserRole(params){
	return fetch({
		url: '/RemoveUserRole',
		method: 'post',
		data: params
	})
}
