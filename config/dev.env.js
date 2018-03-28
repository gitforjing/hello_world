var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
	BASE_API: '"http://10.4.68.141:50001"',
//BASE_API: '"https://easy-mock.com/mock/5a2dfa05f28b1456235eede9/smallplate"'
})
