// 处理404异常
(function (l, d) {
	setInterval(handle404, 100);

	function handle404() {
		try {
			if (!l.hash.endsWith("/")
				&& d.getElementById("main").children[0].innerText === "404 - Not found") {
				l.hash += "/";
			}
		} catch (t) {
		}
	}
})(location, document);
