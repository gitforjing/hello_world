import fetch from '@/utils/fetch'

//新增服务
export function AddIpService(params) {
	return fetch({
		url: '/AddIpService',
		method: 'post',
		data: params
	})
}
//编辑服务
export function EditIpService(params) {
	return fetch({
		url: '/EditIpService',
		method: 'post',
		data: params
	})
}
//删除服务
export function RemoveIpService(params) {
	return fetch({
		url: '/RemoveIpService',
		method: 'post',
		data: params
	})
}
//查询服务
export function QueryIpService(params) {
	return fetch({
		url: '/QueryIpService',
		method: 'post',
		data: params
	})
}