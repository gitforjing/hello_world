import fetch from '@/utils/fetch'

//用户注册
export function RegisterUser(params) {
	return fetch({
		url: '/RegisterUser',
		method: 'post',
		data: params
	})
}