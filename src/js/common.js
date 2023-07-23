// 获取search参数
function getUrlParam(paramName) {
	let search = location.search;
	if (search.startsWith("?")) {
		search = search.substring(1);
	}
	if (!search) {
		return null;
	}

	try {
		let reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");
		let r = search.match(reg);
		if (r != null) return decodeURIComponent(r[2]);
	} catch (e) {
		//console.warn("通过正则，获取url参数失败，尝试使用字符串匹配找到参数。");
		//console.warn(e);
	}

	let pattern = null;
	if (search.startsWith(encodeURIComponent(paramName) + "=")) {
		pattern = encodeURIComponent(paramName) + "=";
	}
	if (pattern == null && search.startsWith(paramName + "=")) {
		pattern = encodeURIComponent(paramName) + "=";
	}
	if (pattern == null && search.indexOf("&" + encodeURIComponent(paramName) + "=") > 0) {
		pattern = "&" + encodeURIComponent(paramName) + "=";
	}
	if (pattern == null && search.indexOf("&" + paramName + "=") > 0) {
		pattern = "&" + paramName + "=";
	}
	if (pattern != null) {
		let value = search.substring(search.indexOf(pattern) + pattern.length);
		if (value.startsWith("&")) {
			return "";
		}
		if (value.indexOf("&") > 0) {
			value = value.substring(0, value.indexOf("&"));
		}
		return value;
	}

	return null;
}

// JSON转URL参数
function toUrlParams(obj) {
	let params = [];
	for (let key in obj) {
		let value = obj[key];
		params.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
	}
	return params.join("&");
}
