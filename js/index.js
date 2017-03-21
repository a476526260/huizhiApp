mui.init({
	subpages:[{
		url:"indexbody.html",
		id:"indexbody",
		styles:{
			top:"0px",
			bottom:"50px"
		}
	}
	]
});
var subpages,subpages_id,activeTab;
var logined=localStorage.getItem("TOKEN_UID");
var subpage_style = [{top: 0,bottom: '50px'}, {top: 0,bottom: '50px'}, {top: 0,bottom: '50px'
}, {top: 0,bottom: '50px'}];
var aniShow = {};
/*var targetPage = mui.preload({
	url: "me-myevent.html",
	id: "me-myevent",
	styles: {
		top: "0px",
		bottom: "50px",
	}
});
*/
//创建子页面，首个选项卡页面显示，其它均隐藏；a
mui.plusReady(function() {
	plus.nativeUI.showWaiting("Loading...");
	var self = plus.webview.currentWebview();
	//未登录过第四选项卡为登录页面
	if(!logined){
		subpages= ['indexbody.html', 'list.html', 'me-myevent.html', 'signIn.html'];
		subpages_id = ['indexbody', 'list', 'me-myevent', 'signIn'];
		activeTab = subpages[3];
		$(".mui-bar-tab .mui-tab-item").eq(3).attr("href",subpages_id[3]);
		$(".mui-bar-tab .mui-tab-item").eq(3).addClass("mui-active").siblings().removeClass("mui-active");
	}else{
		subpages= ['indexbody.html', 'list.html', 'me-myevent.html', 'Myevents-3.html'];
		subpages_id = ['indexbody', 'list', 'me-myevent', 'Myevents-3'];
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
		subpages= ['indexbody.html', 'list.html', 'me-myevent.html', 'Myevents-3.html'];
		subpages_id = ['indexbody', 'list', 'me-myevent', 'Myevents-3'];
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
		subpages= ['indexbody.html', 'list.html', 'me-myevent.html', 'signIn.html'];
		subpages_id = ['indexbody', 'list', 'me-myevent', 'signIn'];
		activeTab = subpages[3];
		$(".mui-bar-tab .mui-tab-item").eq(3).attr("href",subpages_id[3]);
		$(".mui-bar-tab .mui-tab-item").eq(3).addClass("mui-active").siblings().removeClass("mui-active");
		for(var i = 0; i < 4; i++) {
			var sub = plus.webview.create(subpages[i], subpages_id[i], subpage_style[i]);
			self.append(sub);
		}
		plus.webview.show(subpages_id[3]);
	});

	//显示新消息
//	document.addEventListener("showNum",function(e){
//		console.log(JSON.stringify(e))
//		//document.getElementById('message-num').innerText = e
//	})
	document.addEventListener("showNums", function(e) {
		var number = e.detail.number
		if (document.getElementById("message-num")) {
			if (number > 0) {
			//	document.getElementById("message-num").innerText = number
			//	document.getElementById("message-num").style.display = "block"
			} else{
			//	document.getElementById("message-num").innerText = 0
			//	document.getElementById("message-num").style.display = "none"
			}
		}
	});
	//选项卡点击事件
	mui('.mui-bar-tab').on('tap', 'a', function(e) {
		if (!localStorage.getItem("TOKEN_LOGIN")) {
			mui.toast("Please login first!")
			mui.openWindow({
				"url": "signIn.html",
				"id": "signIn",
				show: {
					autoShow: true,
					aniShow: "fade-in", //页面显示动画，默认为”slide-in-right“；
				}
			});
			return false;
		}
		var self = plus.webview.currentWebview();
		var all = plus.webview.all();
		var targetTab = this.getAttribute('href');
		if(targetTab == activeTab) {
			return;
		};
		$(this).addClass("mui-active").siblings().removeClass("mui-active");
		//若为iOS平台或非首次显示，则直接显示
		if(mui.os.ios || aniShow[targetTab]) {
				if (targetTab == 'list') {
					var list = mui.preload({
						url:"list.html",
						id: "list",
						styles: {
							top: "0px",
							bottom: "50px",
						}
					});
					//mui.fire(list,"reloadData")
				}
				plus.webview.show(targetTab);
			
		} else {
			//否则，使用fade-in动画，且保存变量
			var temp = {};
			temp[targetTab] = "true";
			mui.extend(aniShow, temp);
			plus.webview.show(targetTab, "fade-in", 300);
		};
		//隐藏当前;
		//plus.webview.hide(activeTab);
		//alert(plus.webview.getLaunchWebview().id);
		plus.webview.getLaunchWebview().show();

		var webViewArr=[]; //保存所有打开窗口ID

		for(var i=0;i<all.length;i++){
			webViewArr.push(all[i].id);
		};
		for(var i=0;i<webViewArr.length;i++){
			if(webViewArr[i]=="indexbody"||webViewArr[i]=="list"||webViewArr[i]=="me-myevent"||webViewArr[i]=="Myevents-3"||webViewArr[i]=="signIn"||webViewArr[i]==plus.webview.getLaunchWebview().id){
				
				continue;
				
			}else{
				plus.webview.close(webViewArr[i]) //关闭除首页外的所有窗口
			}
		};
		//更改当前活跃的选项卡
		activeTab = targetTab;
	});


	setInterval(function(){
		var msgUid = localStorage.getItem("TOKEN_UID"),msgToken = localStorage.getItem("TOKEN_LOGIN")
		if(parseInt(msgUid) > 0){
			mui.ajax(domain+"/index.php/Api/index/getUreadCount", {
				data: {
					key: key,
					ver: ver,
					uid:msgUid,
					token:msgToken
				},
				dataType: 'json',
				type: 'POST',
				timeout: 2800,
				success: function(result) {
					//console.log("未读消息条数:"+JSON.stringify(result))
					if(parseInt(result.data.unReadMsg)>0){
						number = result.data.unReadMsg
						if (number > 0) {
							document.getElementById("message-num").innerText = number
							document.getElementById("message-num").style.display = "block"
						} else{
							document.getElementById("message-num").innerText = 0
							document.getElementById("message-num").style.display = "none"
						}
					}
				},
				error: function(xhr, type, errorThrown) {
					//mui.toast(type)
			
				}
			});
		}
	},5000)
	
	


	
	/*document.getElementById("reload").addEventListener("tap",function(){
		mui.fire(targetPage,"reload")
	});*/

});





