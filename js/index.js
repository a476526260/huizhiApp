mui.init();
var subpages,subpages_id,activeTab;
var logined=localStorage.getItem("userId");
var subpage_style = [{top: 0,bottom: '50px'}, {top: 0,bottom: '50px'}, {top: 0,bottom: '50px'
}, {top: 0,bottom: '50px'}];
var aniShow = {};


//创建子页面，首个选项卡页面显示，其它均隐藏；a
mui.plusReady(function() {
	plus.nativeUI.showWaiting("加载中...");
	var self = plus.webview.currentWebview();
	//未登录过第四选项卡为登录页面
	if(!logined){
		subpages= ['indexbody.html', 'list.html', 'groupChat.html', 'signIn.html'];
		subpages_id = ['indexbody', 'list', 'groupChat', 'signIn'];
		activeTab = subpages[3];
		$(".mui-bar-tab .mui-tab-item").eq(3).attr("href",subpages_id[3]);
		$(".mui-bar-tab .mui-tab-item").eq(3).addClass("mui-active").siblings().removeClass("mui-active");
	}else{
		subpages= ['indexbody.html', 'list.html', 'groupChat.html', 'Myevents-3.html'];
		subpages_id = ['indexbody', 'list', 'groupChat', 'Myevents-3'];
		activeTab = subpages[0];
		$(".mui-bar-tab .mui-tab-item").eq(3).attr("href",subpages_id[3]);
		$(".mui-bar-tab .mui-tab-item").eq(0).addClass("mui-active").siblings().removeClass("mui-active");
		plus.webview.show(subpages_id[0]);
	}
	for(var i = 0; i < 4; i++) {
		var temp = {};
		var sub = plus.webview.create(subpages[i], subpages_id[i], subpage_style[i]);
		if(logined){
			if(i!=0) {
				sub.hide();
			} else {
				temp[subpages_id[i]] = "true";
				mui.extend(aniShow, temp);
			}
		}else{
			if(i <3) {
				sub.hide();
			} else {
				temp[subpages_id[i]] = "true";
				mui.extend(aniShow, temp);
			}
		}
		self.append(sub);
	}
	plus.nativeUI.closeWaiting();


	//监听登录后跳转到首页事件
	document.addEventListener("showindex",function(){
		subpages= ['indexbody.html', 'list.html', 'groupChat.html', 'Myevents-3.html'];
		subpages_id = ['indexbody', 'list', 'groupChat', 'Myevents-3'];
		activeTab = subpages[0];
		$(".mui-bar-tab .mui-tab-item").eq(3).attr("href",subpages_id[3]);
		$(".mui-bar-tab .mui-tab-item").eq(0).addClass("mui-active").siblings().removeClass("mui-active");
		for(var i = 0; i < 4; i++) {
			var sub = plus.webview.create(subpages[i], subpages_id[i], subpage_style[i]);
			self.append(sub);
		}
		plus.webview.show(subpages_id[0]);
	});
	//监听退出账号事件
	document.addEventListener("exit",function(){
		subpages= ['indexbody.html', 'list.html', 'groupChat.html', 'signIn.html'];
		subpages_id = ['indexbody', 'list', 'groupChat', 'signIn'];
		activeTab = subpages[3];
		$(".mui-bar-tab .mui-tab-item").eq(3).attr("href",subpages_id[3]);
		$(".mui-bar-tab .mui-tab-item").eq(3).addClass("mui-active").siblings().removeClass("mui-active");
		for(var i = 0; i < 4; i++) {
			var sub = plus.webview.create(subpages[i], subpages_id[i], subpage_style[i]);
			self.append(sub);
		}
		plus.webview.show(subpages_id[3]);
	});

	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		var self = plus.webview.currentWebview();
		var all = plus.webview.all();
		var targetTab = this.getAttribute('href');
		if(targetTab == activeTab) {
			return;
		};
		$(this).addClass("mui-active").siblings().removeClass("mui-active");
		//若为iOS平台或非首次显示，则直接显示
		if(mui.os.ios || aniShow[targetTab]) {
			plus.webview.show(targetTab);
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetTab] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetTab, "fade-in", 300);
		};

		//隐藏当前;
		plus.webview.hide(activeTab);
		for(var i = 0; i < all.length; i++) {
			if(all[i] != activeTab) {
				plus.webview.getLaunchWebview().show();
			} else {
				plus.webview.close(all[i])
			}
		};
		//更改当前活跃的选项卡
		activeTab = targetTab;
	});

});





