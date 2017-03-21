mui.init({});
var deceleration = mui.os.ios ? 0.003 : 0.0009;
mui('.mui-scroll-wrapper').scroll({
	bounce: false,
	indicators: true, //是否显示滚动条
	deceleration: deceleration
});
var page = [2,2,2]
var keywords;
mui.plusReady(function() {
	var curWindow = plus.webview.currentWebview();
	keywords = curWindow.keywords
	document.getElementById("bname").innerText = curWindow.bname
	document.getElementById("keyid").innerText="Search:" + keywords
	var targetPage = mui.preload({
		url: "happening.html",
		id: "happending",
		styles: {
			top: "0px",
			bottom: "50px",
		}
	});
	document.addEventListener("reloadData",function(){
		//plus.webview.currentWebview().reload()
		getdata(keywords)
	})
	
	//点击
	var targetPage = mui.preload({
		url: "happening.html",
		id: "happending",
		styles: {
			top: "0px",
			bottom: "50px",
		}
	});
	
	var aid,pic
	mui("#happening_s").on('tap','.content',function(){
		//获取aid
		aid = this.getAttribute("data-id");
		pic = this.getAttribute("data-pic");
		//打开详情
		mui.openWindow({
			id:'happening',
			url:'happening.html',
			show: {
				aniShow: "fade-in",
			},
			waiting: {
				autoShow: true,
				title: "Loading..."
			},
			styles:{
				top:"0px",
				bottom:"50px"
			},
			extras:{
				bname:"My Events",
				aid:aid,
				pic:pic
			}
		});

	})
	
	//拉默认数据
	getData(0, 30, '', keywords,"defalut");
	function getData(id, pagenum, ele, keywords, action) {
		var ele = ele ? ele : "#item1mobile";
		if(!keywords || keywords == undefined) {
			return;
		};
		if(action == "slide" || action=="defalut") {
			mui.ajax(domain + "index.php/Api/api/indexSearchList", {
				data: {
					key: key, 
					ver: ver,
					token: localStorage.getItem("TOKEN_LOGIN"),
					uid: localStorage.getItem("TOKEN_UID"),
					keywords: keywords || '',
					page: 1, 
					pagenum:30,
					ii: id
				},
				dataType: 'json',
				type: 'POST',
				timeout: 1000,
				success: function(result) {
					console.log("dddd"+JSON.stringify(result))
					var html=''
					if(result.data && result.data != null) {
						for(var arr2 in result.data) {
							html += '<li class="content" data-id="' + result.data[arr2].id + '" data-pic="' + domain + result.data[arr2]['path'] + '">' +
								'<img src="' + result.base.domain + result.data[arr2].path + '" alt="" />' +
								'<div class="bottom-txt">' +
								'<span class="list-tit">' + result.data[arr2].title + '</span>' +
								'<span class="list-date">' + result.data[arr2].sdate + '</span>' +
								'</div>' +
								'</li>';
						};
						document.getElementById(hup[id] + "_s").innerHTML = html;
						$(".mui-control-item").eq(id).attr("data-have","1");
						$("#"+hup[id] + "_s").nextUntil().show() 
					} else {
						document.getElementById(hup[id] + "_s").innerHTML = "<li class='content' style='text-align:center; height:50px !important; line-height:50px; color:red; min-height:auto;'>"+document.getElementById("mui-title").innerText+", No event</li>"
						$("#"+hup[id] + "_s").nextUntil().hide()
						console.log("#"+hup[id] + "_s .mui-pull-bottom-tips");
					}
				},
				error: function(xhr, type, errorThrown) {
					console.log(errorThrown);
				}
			});
		}else if(action=="pullRefresh"){
			page[id]++;
			mui.ajax(domain + "index.php/Api/api/indexSearchList", {
				data: {
					key: key, 
					ver: ver,
					token: localStorage.getItem("TOKEN_LOGIN"),
					uid: localStorage.getItem("TOKEN_UID"),
					keywords: keywords || '',
					page: page[id],
					pagenum: pagenum || 3,
					ii: id
				},
				dataType: 'json',
				type: 'POST',
				timeout: 1000,
				success: function(result) {
					if(result.data && result.data != null) {
						var html=""
						for(var arr2 in result.data) {
							html += '<li class="content" data-id="' + result.data[arr2].id + '" data-pic="' + domain + result.data[arr2]['path'] + '">' +
								'<img src="' + result.base.domain + result.data[arr2].path + '" alt="" />' +
								'<div class="bottom-txt">' +
								'<span class="list-tit">' + result.data[arr2].title + '</span>' +
								'<span class="list-date">' + result.data[arr2].sdate + '</span>' +
								'</div>' +
								'</li>';
						};
						document.getElementById(hup[id] + "_s").innerHTML = html;
						$("#"+hup[id] + "_s").nextUntil().show()
					} else {
						document.getElementById(hup[id] + "_s").innerHTML = "<li class='content' style='text-align:center; height:50px !important; line-height:50px; color:red; min-height:auto;'>"+document.getElementById("mui-title").innerText+", No event</li>"
					}
				},
				error: function(xhr, type, errorThrown) {
					console.log(errorThrown);
				}
			});
		}
	
	};
});