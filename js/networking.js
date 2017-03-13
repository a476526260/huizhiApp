mui.init({swipeBack: false});
(function($) {
	$('.mui-scroll-wrapper').scroll({
		indicators: true //是否显示滚动条
	});

	jQuery(".mui-control-content").css("min-height", jQuery(window).height() - jQuery(".search-box").innerHeight() - jQuery("#sliderSegmentedControl").innerHeight() - 44);
	//切换显示方式--块级显示
	$("body").on("tap", ".icon-th-large-copy", function() {
		jQuery(".mui-slider .mui-slider-group .mui-slider-item").each(function(i, e) {
			jQuery(e).find(".mui-table-view").addClass("block-style").removeClass("list-style")
		})
	});
	//切换显示方式--列表显示
	$("body").on("tap", ".icon-fenlei", function() {
		jQuery(".mui-slider .mui-slider-group .mui-slider-item").each(function(i, e) {
			jQuery(e).find(".mui-table-view").addClass("list-style").removeClass("block-style")
		})
	});
})(mui);

mui.plusReady(function() {
	var curWindow = plus.webview.currentWebview();
	fillTxt(curWindow.aid,1,20,0);
	document.getElementById('slider').addEventListener('slide', function(e) {
		jQuery("#sliderSegmentedControl a").eq(e.detail.slideNumber).addClass("active").siblings().removeClass("active");
		fillTxt(curWindow.aid,1,20,e.detail.slideNumber);
	});
});


function  fillTxt(aid,page,pagenum,type){
	mui.ajax("http://z.cqboy.com/index.php/Api/api/networking", {
		data: {
			key: '',
			ver: ver,
			aid: aid,
			page: page,
			pagenum: pagenum,
			types: type
		},
		dataType: 'json',
		type: 'get',
		success: function(result) {
			var htmlList = "";
			if(!result.data){
				return
			}else{
				for(var i = 0; i < result.data.length; i++) {
					htmlList += '<li class="mui-table-view-cell mui-media"><a href="javascript:;"><img class="mui-media-object mui-pull-left" src="http://placehold.it/40x30"><div class="mui-media-body"><p class="name">' + result.data[i].uname + '</p><p class="job">' + result.data[i].department + '</p><p class="company">' + result.data[i].company + '</p><span class="chat"></span><span class="heart"></span></div></a></li>'
				};
			};
			$("#item" + (type + 1) + "mobile").find("ul").html(htmlList);
		},
		error:function(xhr, type, errorThrown){
			console.log(type);
		}
	});
}

