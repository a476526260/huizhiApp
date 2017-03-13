mui.init({swipeBack: false});
mui.plusReady(function(){
	var curWindow = plus.webview.currentWebview();
	(function($) {
		$('.mui-scroll-wrapper').scroll({
			indicators: true //是否显示滚动条
		});
		fillTxt(curWindow.aid);
	})(mui);
});

function  fillTxt(aid){
	mui.ajax("http://z.cqboy.com/index.php/Api/api/agenda", {
		data: {
			key: '',
			ver: ver,
			aid: aid,
		},
		dataType: 'json',
		type: 'get',
		success: function(result) {
			var htmlList = "";
			if(!result.data){
				return
			}else{
				document.getElementById("agendaBanner").src=result.base.domain+""+result.data.ext.path
				document.getElementById("sdate").innerHTML=result.data.ext.sdate
				document.getElementById("title").innerHTML=result.data.ext.title
				var con=new Array(),i=0,vv='';
				for(prop in result.data){
					if(prop=='ext')return false;
					//alert(result.data[prop])
					for(pp in result.data[prop]){
						vv=result.data[prop][pp];
						con[prop]=con[prop]||'';
						con[prop]+='<li class="mui-table-view-cell"><h3 class="trip-title"><span class="time">'+vv["stime_d"]+'</span><span class="thing">'+vv["title"]+'</span></h3><div class="speaker"><span class="speaker-icon iconfont icon-wodeicon"></span><span class="speaker-infor"><b class="name">'+vv["uname"]+'</b><b class="company">'+vv["company"]+'<span class=" mui-icon mui-icon-arrowright"></span></b></span></div></li>';
					};
					document.getElementById("content_"+(++i)).innerHTML=con[prop]
				}
			};
		},
		error:function(xhr, type, errorThrown){
			console.log(type);
		}
	});
}
