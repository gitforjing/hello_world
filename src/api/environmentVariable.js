import fetch from '@/utils/fetch'

//新增服务
export function Create(params) {
	return fetch({
		url: '/RegisterEnvironmentVariable',
		method: 'post',
		data: params
	})
}
//修改服务
export function Update(params) {
	return fetch({
		url: '/EditEnvironmentVariable',
		method: 'post',
		data: params
	})
}
//删除环境变量
export function Delete(params) {
	return fetch({
		url: '/DeleteEnvironmentVariable',
		method: 'post',
		data: params
	})
}
//查询服务
export function QuickQuery(params) {
	return fetch({
		url: '/QueryEnvironmentVariable',
		method: 'post',
		data: params
	})
}

