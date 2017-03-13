mui.init({
	//swipeBack: false,
});

mui('.mui-scroll-wrapper').scroll({
	//indicators: true //是否显示滚动条
});

mui.plusReady(function() {
	var curWindow = plus.webview.currentWebview();
	document.getElementById('slider').addEventListener('slide', function(e) {
		$(".conference-status li").eq(e.detail.slideNumber).addClass("mui-active").siblings().removeClass("mui-active");
	});
});
$(function() {

	var dropload = $('.pullUpDown').dropload({
		domUp: {
			domClass: 'dropload-up',
			domRefresh: '<div class="dropload-refresh">↓下拉刷新</div>',
			domUpdate: '<div class="dropload-update">↑释放更新</div>',
			domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
		},
		domDown: {
			domClass: 'dropload-down',
			domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
			domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
			domNoData: '<div class="dropload-noData">暂无数据</div>'
		},
		loadDownFn: function(me) {
			var result = '';
			for(var i = 0; i < 10; i++) {
				result += '<a class="item opacity" href="dadasd">' +
					'<img src="dadasdas" alt="">' +
					'<h3>dasdasdas</h3>' +
					'<span class="date">dasdasda</span>' +
					'</a>';
			}
			console.log(result)
			// 为了测试，延迟1秒加载
			setTimeout(function() {
				$('.pullUpDown').find("ul").append(result);
				// 每次数据加载完，必须重置
				dropload.resetload();
			}, 1000);
		}
	});

})