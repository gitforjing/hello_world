/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

const Verify = {
	//身份证
	isIdCardNo(num) {
		num = num.toUpperCase();
		// 身份证号码18位前17位为数字，最后一位是校验位，可能为数字或字符X。
		if(idCardNoUtil.checkIdCardNo(num)) {
			return true;
		} else {
			return false;
		}
	},
	//电话号码
	isPhone(phoneNo) {
		if((/^1[3|4|5|7|8]\d{9}$/.test(phoneNo))) {
			return true;
		} else {
			return false;
		}
	},
	//邮件
	isEmail(data) {
		if((/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(data))) {
			return true;
		} else {
			return false;
		}
	},
	//密码
	isPassword(password) {
		if(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(password)) {
			return true;
		} else {
			return false;
		}
	},
	//数字
	isNum(data) {
		if((/^\d+(\.\d+)?$/.test(data))) {
			return true;
		} else {
			return false;
		}
	},
	//是否为空
	isNull(str) {
		if(str == "" || str == null) return true;
		var regu = "^[ ]+$";
		var re = new RegExp(regu);
		return re.test(str);
	},
	isIP(data) {
		if((/^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/.test(data))) {
			return true;
		} else {
			return false;
		}
	}

}

export {
	Verify
}
