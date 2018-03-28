import fetch from '@/utils/fetch'

//新增服务
export function Create(params) {
	return fetch({
		url: '/RegistFunctionDictionary',
		method: 'post',
		data: params
	})
}
//修改服务
export function Update(params) {
	return fetch({
		url: '/EditFunctionDictionary',
		method: 'post',
		data: params
	})
}
//查询服务
export function QuickQuery(params) {
	return fetch({
		url: '/QueryFunctionDictionary',
		method: 'post',
		data: params
	})
}
//获取模块权限接口registModulePermission
export function GetModulePermission(params){
	return fetch({
		url: '/GetModulePermission',
		method: 'post',
		data: params
	})
}
//设置功能权限接口
export function RegistModulePermission(params){
	return fetch({
		url: '/RegistModulePermission',
		method: 'post',
		data: params
	})
}
//获取某个模板下的功能权限
export function FillModulePermission(params){
	return fetch({
		url: '/FillModulePermission',
		method: 'post',
		data: params
	})
}

