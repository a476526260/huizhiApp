mui.init({
	pullRefresh: {
		container: '#pullrefresh',
		up: {
			contentrefresh: '正在加载...',
			callback: pullupRefresh
		}
	}
});
var aid;
var count = 0;
var page=1;
//计算pullrefresh距离顶部距离
$("#pullrefresh").css({"top":44+$(".material-title").innerHeight()+parseInt($(".material-title").css("margin-top"))+$(".sort").innerHeight(),"bottom":50});


mui.plusReady(function(){
	var curWin=plus.webview.currentWebview();
	aid=curWin.aid
});

/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	setTimeout(function() {
		getAjax(aid,page++,4,0);
		mui('#pullrefresh').pullRefresh().endPullupToRefresh((++count > 2)); //参数为true代表没有更多数据了。
	}, 1500);
}
if(mui.os.plus) {
	mui.plusReady(function() {
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().pullupLoading();
		}, 1000);
	});
} else {
	mui.ready(function() {
		mui('#pullrefresh').pullRefresh().pullupLoading();
	});
}


function getAjax(aid,page,pagenum,sort){
	var html = ""
	mui.ajax("http://z.cqboy.com/index.php/Api/api/documentation", {
		data: {
			key: '',
			ver: ver,
			aid: aid,
			page: page,
			pagenum: pagenum,
			sort: sort,
		},
		dataType: 'json',
		type: 'get',
		success: function(result) {
			if(result.data){
				for(var i = 0; i < result.data.length; i++) {
					if(result.data[i].ext == "zip" || result.data[i].ext == "rar") {
						html += "<li class='mui-table-view-cell border-left" + (i % 4 + 1) + "'><div class='icon-1'><img src='images/material-icon1.png'/></div><h2>" + (result.data[i].title) + "</h2><p class='name'><span class='speaker-icon iconfont icon-wodeicon'></span>" + result.data[i].id + "</p><p class='job'>" + result.data[i].department + "</p><p class='company'>" + result.data[i].company + "</p></li>"
					} else {
						html += "<li class='mui-table-view-cell border-left" + (i % 4 + 1) + "'><div class='icon-2'><img src='images/material-icon2.png'/></div><h2>" + (result.data[i].title) + "</h2><p class='name'><span class='speaker-icon iconfont icon-wodeicon'></span>" + result.data[i].id + "</p><p class='job'>" + result.data[i].department + "</p><p class='company'>" + result.data[i].company + "</p></li>"
					}
				};
			};
			$("#documents").append(html);
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
		}
	})
}

