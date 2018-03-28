import fetch from '@/utils/fetch'

//新增服务
export function Create(params) {
	return fetch({
		url: '/RegisterListOrganizationStructure',
		method: 'post',
		data: params
	})
}
//删除服务
export function Delete(params) {
	return fetch({
		url: '/DeleteOrganizationStructure',
		method: 'post',
		data: params
	})
}
//拉取树
export function GetTree(params) {
	return fetch({
		url: '/GetTree',
		method: 'post',
		data: params
	})
}
//拉取可分配的节点
export function GetRestOfNode(params){
	return fetch({
		url: '/GetRestOfNode',
		method: 'post',
		data: params
	})
}
