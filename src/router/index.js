import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout'

Vue.use(Router)

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will not redirct in the levelbar
 * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
 * meta : `{ role: ['admin'] }`  will control the page role
 **/
export const constantRouterMap = [{
		path: '/login',
		component: _import('login/newindex'),
		hidden: true
	},
	{
		path: '/regist',
		component: _import('regist/index'),
		hidden: true
	},
	{
		path: '/404',
		component: _import('404'),
		hidden: true
	},
	{
		path: '/',
		component: Layout,
		redirect: '/dashboard',
		name: '介绍',
		hidden: true,
		children: [{
			path: 'dashboard',
			component: _import('dashboard/index')
		}]
	}
]

export default new Router({
	// mode: 'history', //后端支持可开
	scrollBehavior: () => ({
		y: 0
	}),
	routes: constantRouterMap
})

export const asyncRouterMap = [
	//	{
	//  path: '/application',
	//  component: Layout,
	//  icon: 'el-icon-menu',
	//  noDropdown: true,
	//  children: [{ path: 'index', component: _import('application/index'), name: '系统注册',Code: 'Application' }]
	//},
	{
		path: '/registsystem',
		component: Layout,
		icon: 'el-icon-menu',
		noDropdown: true,
		children: [{
			path: 'index',
			component: _import('registsystem/index'),
			name: '服务注册',
			Code: 'System'
		}]
	},
	{
		path: '/module',
		component: Layout,
		icon: 'el-icon-menu',
		noDropdown: true,
		children: [{
			path: 'index',
			component: _import('module/index'),
			name: '模块',
			Code: 'Module'
		}]
	},
	{
		path: '/environmentVariable',
		component: Layout,
		icon: 'el-icon-menu',
		noDropdown: true,
		children: [{
			path: 'index',
			component: _import('environmentVariable/index'),
			name: '环境变量',
			Code: 'environmentVariable'
		}]
	},
	{
		path: '/organization',
		component: Layout,
		redirect: 'noredirect',
		name: '组织机构',
		icon: 'el-icon-menu',
		children: [{
				path: 'organizationNode',
				component: _import('organizationNode/index'),
				name: '组织机构节点',
				Code: 'OrganizationNode'
			},
			{
				path: 'organizationStructure',
				component: _import('organizationStructure/index'),
				name: '组织机构关系',
				Code: 'OrganizationStructure'
			}
		]
	},
	{
		path: '/roleManage',
		component: Layout,
		redirect: 'noredirect',
		name: '角色管理',
		icon: 'el-icon-menu',
		children: [{
				path: 'roles',
				component: _import('roles/index'),
				name: '角色',
				Code: 'Role'
			},
			{
				path: 'user',
				component: _import('user/index'),
				name: '用户角色',
				Code: 'User'
			}
		]
	},
	{
		path: '/dataauthority',
		component: Layout,
		redirect: 'noredirect',
		name: '数据权限',
		icon: 'el-icon-menu',
		children: [{
			path: 'authorityallot',
			component: _import('datarole/index'),
			name: '数据权限分配',
			Code: 'DataRole'
		}]
	},
	{
		path: '/functionPermission',
		component: Layout,
		redirect: 'noredirect',
		name: '功能权限',
		icon: 'el-icon-menu',
		children: [{
				path: 'dictionary',
				component: _import('dictionary/index'),
				name: '字典表',
				Code: 'Dictionary'
			},
			{
				path: 'authorityManage',
				component: _import('authorityManage/index'),
				name: '权限分配',
				Code: 'AuthorityManage'
			}
		]
	},
	{
		path: '/systemMonitor',
		component: Layout,
		redirect: 'noredirect',
		name: '系统监测',
		icon: 'el-icon-menu',
		children: [{
				path: '/blackwhite',
				redirect: 'noredirect',
				name: '黑白名单',
				//				Code: 'Blackwhite',
				component: _import('index'),
				children: [{
					path: 'iplist',
					component: _import('blackwhite/iplist'),
					name: 'IP黑名单',
					Code: 'IpBlackwhite'
				}, {
					path: 'ipService',
					component: _import('blackwhite/ipService'),
					name: 'IP-服务黑名单',
					Code: 'IP_Service'
				}, {
					path: 'UserService',
					component: _import('blackwhite/userService'),
					name: '用户-服务黑名单',
					Code: 'User_Service'
				}]
			},
			{
				path: 'warning',
				component: _import('warning/index'),
				name: '服务状态',
				Code: 'Warning'
			},
			{
				path: '/systemMonitor/behavior',
				redirect: 'noredirect',
				name: '行为日志',
				//				Code: 'BehavorLog',
				component: _import('index'),
				children: [{
						path: 'behavorlog',
						component: _import('behavorLog/index'),
						name: '运行日志',
						Code: 'BehavorLogList'
					}, {
						path: 'ipuserchart',
						component: _import('behavior/ipuserchart/index'),
						name: 'IP/用户',
						Code: 'Ipuserchart'
					},
					{
						path: 'applicationchart',
						component: _import('behavior/applicationchart/index'),
						name: '应用',
						Code: 'Applicationchart'
					},
					{
						path: 'frequent',
						component: _import('behavior/frequent/index'),
						name: '高频服务',
						Code: 'Frequent'
					}
				]
			},
			{
				path: '/systemMonitor/exception',
				redirect: 'noredirect',
				component: _import('index'),
				name: '异常日志',
				//				Code: 'ErrorLog',
				children: [{
						path: 'errorlog',
						component: _import('errorLog/index'),
						name: '错误日志',
						Code: 'ErrorlogList'
					}, {
						path: 'ipuserchart/index',
						component: _import('exception/ipuserchart/index'),
						name: 'IP/用户',
						Code: 'E_Ipuser'
					},
					{
						path: 'applicationchart/index',
						component: _import('exception/applicationchart/index'),
						name: '应用',
						Code: 'E_Application'
					},
					{
						path: 'frequent/index',
						component: _import('exception/frequent/index'),
						name: '高频服务',
						Code: 'E_Service'
					}
				]
			}
		]
	},
	{
		path: '/organization',
		component: Layout,
		redirect: 'noredirect',
		name: 'BASI日志',
		icon: 'el-icon-menu',
		children: [{
			path: 'logRepost',
			component: _import('logRepost/index'),
			name: '日志报表',
			Code: 'LogRepost'
		}]
	},
	//{
	//  path: '/error',
	//  component: Layout,
	//  redirect: 'noredirect',
	//  name: '错误页面',
	//  icon: 'el-icon-question',
	//  children: [
	//    { path: '404', component: _import('404'), name: '404' }
	//  ]
	//},
	{
		path: '*',
		redirect: '/404',
		hidden: true
	}
]