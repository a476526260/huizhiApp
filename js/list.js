mui.init({});

mui('.mui-scroll-wrapper').scroll({
	//indicators: true //是否显示滚动条
});
var page = [2,2,2];
mui.plusReady(function() {
	var curWindow = plus.webview.currentWebview();
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
		//getdata()
		var current=plus.webview.currentWebview();
		current.reload();
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
	//console.log(JSON.stringify({"device_id": "your_device_id", "mac": "your_device_mac"}))
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
	getdata()
	function getdata(){
		var index_group;
		
		mui.ajax(domain + "index.php/Api/api/myEvent", {
			data: {
				key: key,
				ver: ver,
				token:localStorage.getItem("TOKEN_LOGIN"),
				uid:localStorage.getItem("TOKEN_UID"),
				page: 1,
				pagenum: 30,
			},
			dataType: 'json',
			type: 'POST',
			timeout: 1000,
			success: function(result) {
				//console.log(JSON.stringify(result))
				var html = "";
				$("#happening_s").empty()
				if(result.data) {
					for(var arr in result.data) {
						index_group='';
						for(var arr2 in result.data[arr]) {
							//if($("#list_"+result.data[arr][arr2].aid).length==0){
								$("#happening_s").append('<li class="content" data-id="' + result.data[arr][arr2].aid + '" id="list_'+result.data[arr][arr2].aid+'"  data-pic="'+domain+result.data[arr][arr2]['path']+'">' +
									'<img src="' + result.base.domain + result.data[arr][arr2].path + '" alt="" />' +
									'<div class="bottom-txt">' +
									'<span class="list-tit">' + result.data[arr][arr2].title + '</span>' +
									'<span class="list-date">' + result.data[arr][arr2].sdate + '</span>' +
									'</div>' +
									'</li>')
							//}
						}
						
						//document.getElementById("happening_s").innerHTML = index_group
					}
				};
				setTimeout(function() { 
					//$(ele).find("ul").append(html);
					mui.toast(html)
				}, 1000);
			},
			error: function(xhr, type, errorThrown) {
				console.log(errorThrown);
			}
		});
		
	}
});
