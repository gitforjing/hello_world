<template>
	<div class="login-container">
		<el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
			<h3 class="title">系统登录</h3>
			<el-form-item prop="username">
				<span class="svg-container svg-container_login">
          <icon-svg icon-class="yonghuming" />
        </span>
				<el-input name="Login" type="text" v-model="loginForm.Login" autoComplete="on" placeholder="帐号" />
			</el-form-item>
			<el-form-item prop="password">
				<span class="svg-container">
          <icon-svg icon-class="mima" ></icon-svg>
        </span>
				<el-input name="Password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.Password" autoComplete="on" placeholder="密码"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
					登录
				</el-button>
			</el-form-item>
			<el-row>
				<el-col :span="12">
					<div class="grid-content bg-purple modify_regist">忘记密码</div>
				</el-col>
				<el-col :span="12">
					<div style="text-align: right;" class="grid-content bg-purple-light modify_regist" @click="goRegist">注册</div>
				</el-col>
			</el-row>
		</el-form>
	</div>
</template>

<script>
	import { isvalidUsername } from '@/utils/validate'

	export default {
		name: 'login',
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
					Login: 'admin',
					Password: '123456'
				},
				loginRules: {
					Login: [{
						required: true,
						trigger: 'blur',
						validator: validateUsername
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
	$bg:#2d3a4b;
	$dark_gray:#889aa4;
	$light_gray:#eee;
	.login-container {
		@include relative;
		height: 100vh;
		background-color: $bg;
		input:-webkit-autofill {
			-webkit-box-shadow: 0 0 0px 1000px #293444 inset !important;
			-webkit-text-fill-color: #fff !important;
		}
		input {
			background: transparent;
			border: 0px;
			-webkit-appearance: none;
			border-radius: 0px;
			padding: 12px 5px 12px 15px;
			color: $light_gray;
			height: 47px;
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
		.title {
			font-size: 26px;
			font-weight: 400;
			color: $light_gray;
			margin: 0px auto 40px auto;
			text-align: center;
			font-weight: bold;
		}
		.login-form {
			position: absolute;
			left: 0;
			right: 0;
			width: 400px;
			padding: 35px 35px 15px 35px;
			margin: 120px auto;
		}
		.el-form-item {
			border: 1px solid rgba(255, 255, 255, 0.1);
			background: rgba(0, 0, 0, 0.1);
			border-radius: 5px;
			color: #454545;
		}
	}
	
	.modify_regist {
		color: #FFF;
		font-size: 12px;
		&:hover {
			color: #1482F0;
			cursor: pointer;
		}
	}
</style>