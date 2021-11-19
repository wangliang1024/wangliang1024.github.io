const communityName = 'easyj-projects'; // 项目组名
const communityHomePageProjectName = communityName + '.github.io'; // 当前官网项目名
const branchName = 'docsify'; // 项目分支名

// DocSify初始化
window.$docsify = {
	name: 'EasyJ开源社区',
	repo: 'https://github.com/' + communityName,

	// 封面
	coverpage: false,

	// 侧边导航栏
	loadSidebar: true,
	subMaxLevel: 2,

	// 插件：全文检索
	search: {
		paths: 'auto',
		placeholder: '搜索',
		noData: '<span style="color:red">未找到任何结果</span>'
	},

	// 插件：代码复制
	copyCode: {
		buttonText: '复制',
		successText: '已复制'
	},


	// 插件：字数统计
	count: {
		language: 'chinese'
	},


	// 插件：分页导航
	pagination: {
		previousText: '上一章节',
		nextText: '下一章节',
		crossChapter: true,
		crossChapterText: true
	},

	// 其他插件
	plugins: [
		// 插件：在GitHub上编辑
		EditOnGithubPlugin.create(
			'https://github.com/' + communityName + '/' + communityHomePageProjectName + '/blob/' + branchName + location.pathname,
			null,
			function () {
				return '内容有问题？立即提交修改！'
			}
		)
	]
}
