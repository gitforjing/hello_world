<template>
	<div class="login_container">
		<div class="login_head">
			<div class="login_title">虹信软件 · 微服务云</div>
			<div class="logo"></div>
		</div>
		<div class="content">
			<div class="content_left">
				<span>随时随地</br>
				您的云办公平台
				</span>
			</div>
			<div class="content_right">
				<div class="login_panel">
					<div class="login_panel_head">账号登录</div>
					<el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" class="demo-ruleForm">
						<el-form-item prop="Login">
							<span class="svg-container svg-container_login">
          					<icon-svg icon-class="yonghuming" />
        					</span>
							<el-input name="Login" type="text" v-model="loginForm.Login" autoComplete="on" placeholder="帐号" />
						</el-form-item>
						<el-form-item prop="Password">
							<span class="svg-container">
          					<icon-svg icon-class="mima" />
        					</span>
							<el-input name="Password" type="password" v-model="loginForm.Password" @keyup.enter.native="handleLogin" autoComplete="on" placeholder="密码" />
						</el-form-item>
						<el-button type="primary" class="login_btn" :loading="loading" @click.native.prevent="handleLogin">
							登录
						</el-button>
						<el-row>
							<el-col :span="24">
								<div class="grid-content bg-purple-dark bottom_tip" @click="goRegist">注册</div>
							</el-col>
						</el-row>
					</el-form>
				</div>
			</div>
		</div>
		<div class="login_footer">
			<span style="font-family:宋体;">
				四川长虹电器股份有限公司 版权所有 &copy 2018 www.changhong.com All Rights Reserved 蜀ICP备09001737号-7
			</span>
		</div>
	</div>
</template>

<script>
	import { isvalidUsername } from '@/utils/validate'
	export default {
		name: 'newlogin',
		data() {
			const validateUsername = (rule, value, callback) => {
				if(!isvalidUsername(value)) {
					callback(new Error('请输入正确的用户名'))
				} else {
					callback()
				}
			}
			const validatePass = (rule, value, callback) => {
				if(value.length < 6) {
					callback(new Error('密码不能小于6位'))
				} else {
					callback()
				}
			}
			return {
				loginForm: {
					Login: '',
					Password: ''
				},
				loginRules: {
					Login: [{
						required: true,
						trigger: 'blur',
						message: '请输入账号',
						trigger: 'change'
					}],
					Password: [{
						required: true,
						trigger: 'blur',
						validator: validatePass
					}]
				},
				loading: false
			}
		},
		methods: {
			handleLogin() {
				this.$refs.loginForm.validate(valid => {
					if(valid) {
						this.loading = true
						this.$store.dispatch('Login', this.loginForm).then(() => {
							this.loading = false
							this.$router.push({
								path: '/'
							})
						}).catch(() => {
							this.loading = false
						})
					} else {
						console.log('error submit!!')
						return false
					}
				})
			},
			goRegist() {
				this.$router.push({
					path: '/regist'
				})
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped="scoped">
	@import "src/styles/mixin.scss";
	$bg:#fff;
	$dark_gray:#777;
	$light_gray:#eee;
	.login_container {
		@include relative;
		height: 100vh;
		background-color: $bg;
		input:-webkit-autofill {
			-webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
			-webkit-text-fill-color: #fff !important;
		}
	}
	
	.login_head {
		height: 50px;
		.login_title {
			height: 100%;
			width: 300px;
			line-height: 50px;
			text-align: center;
			display: inline-block;
			font-family: 华文新魏;
			font-size: 18px;
			margin-left: 125px;
			color: #555555;
		}
		.logo {
			display: inline-block;
			height: 100%;
			width: 200px;
			margin-right: 10px;
			background-image: url(../../assets/logo-changhong.png);
			background-position: center;
			background-size: contain;
			background-repeat: no-repeat;
			float: right;
		}
	}
	
	.content {
		position: absolute;
		top: 50px;
		bottom: 100px;
		left: 0;
		right: 0;
		box-sizing: border-box;
		background: #b4e0f9;
		/* 旧语法，带前缀并且已经废弃，以支持老版本的浏览器 */
		background: -prefix-linear-zgradient(bottom, #a7d9fa, #bbe3fb);
		/* 新语法，不带前缀，以支持标准兼容的浏览器（Opera 12.1， IE 10， Firefox 16， Chrome 26， Safari 6.1） */
		background: linear-gradient(#a7d9fa, #bbe3fb);
		.content_left {
			position: absolute;
			left: 20%;
			height: 100%;
			width: 300px;
			span {
				position: absolute;
				/*text-align: center;*/
				height: 100px;
				width: 100%;
				top: 0;
				bottom: 0;
				margin: auto;
				line-height: 50px;
				font-size: 30px;
				font-family: 华文中宋;
				color: #5C5C5C;
				;
			}
		}
		.content_right {
			position: absolute;
			right: 16%;
			height: 100%;
			width: 30%;
			.login_panel {
				position: absolute;
				height: 80%;
				width: 80%;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
				margin: auto;
				background: #fff;
				.login_panel_head {
					height: 100px;
					text-align: center;
					line-height: 100px;
					color: #f56600;
					font-family: "Microsoft YaHei";
				}
				.el-form-item {
					width: 80%;
					margin-left: 10%;
					border: 1px solid rgba(255, 255, 255, 0.1);
					background: rgba(0, 0, 0, 0.1);
					border-radius: 5px;
					color: #454545;
				}
				.el-input {
					display: inline-block;
					height: 47px;
					width: 85%;
				}
				.svg-container {
					padding: 6px 5px 6px 15px;
					color: $dark_gray;
					vertical-align: middle;
					width: 30px;
					display: inline-block;
					&_login {
						font-size: 20px;
					}
				}
				.login_btn {
					width: 80%;
					margin: 0 10%;
					margin-bottom: 5px;
					background-color: #f56600;
					border-color: #f56600;
				}
			}
		}
	}
	
	.login_footer {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 100px;
		text-align: center;
		line-height: 100px;
		color: $dark_gray;
		font-size: 12px;
	}
	
	.bottom_tip {
		padding: 0 10%;
		text-align: right;
		color: #9e9c90;
		font-size: 12px;
		&:hover {
			color: #1482F0;
			cursor: pointer;
		}
	}
</style>