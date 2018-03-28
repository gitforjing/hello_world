import fetch from '@/utils/fetch'
//用户登录
export function login(Login, Password) {
	return fetch({
		url: '/UserLogin',
		method: 'post',
		data: {
			Login,
			Password
		}
	})
}
//获取用户信息
export function getInfo(token) {
	return fetch({
		url: '/UserInfoForManage',
		method: 'post',
		data: {}
	})
}
//退出登录
export function logout() {
	return fetch({
		url: '/UserLogout',
		method: 'post'
	})
}
