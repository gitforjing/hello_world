import fetch from '@/utils/fetch'

//新增服务
export function getDataRole(params) {
	return fetch({
		url: '/GetRoleByOrganization',
		method: 'post',
		data: params
	})
}
//新增服务
export function editDataRole(params) {
	return fetch({
		url: '/AddOrganizationPermission',
		method: 'post',
		data: params
	})
}