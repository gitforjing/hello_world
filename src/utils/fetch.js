import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
	baseURL: process.env.BASE_API, // api的base_url
	timeout: 60000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
	if(store.getters.token) {
		config.headers['UserToKen'] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
	}
	return config
}, error => {
	// Do something with request error
	console.log(error) // for debug
	Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
	response => {
		const res = response.data;
		if(res.StateCode == 200) {
			return response.data.Data;
		} else if(res.StateCode == 400) {
			Message({
				message: res.ErrorMessage,
				type: 'error',
				duration: 2 * 1000,
				showClose: true
			});
			store.dispatch('FedLogOut').then(() => {
				location.reload() // 为了重新实例化vue-router对象 避免bug
			});
			return Promise.reject('error')
		} else {
			Message({
				message: res.ErrorMessage,
				type: 'error',
				duration: 2 * 1000,
				showClose: true
			})
			return Promise.reject(error)
		}
	},
	error => {
		console.log('err' + error) // for debug
		Message({
			message: error.message,
			type: 'error',
			duration: 2 * 1000,
			showClose: true
		})
		return Promise.reject(error)
	}
)

export default service