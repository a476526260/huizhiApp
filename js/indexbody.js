mui.init();
(function($) {
	$(".mui-table-view-cell").each(function() {
		this.style.height = (document.documentElement.clientHeight - document.querySelector(".search").offsetHeight - 44) / 3 + "px";
	});
	jQuery('.mui-slider').each(function(i, e) {
		var _this = this;
		var page=4;
		this.addEventListener('slide', function(event) {
			if(event.detail.slideNumber == jQuery(_this).find(".mui-slider-item").length - 1) {
				mui.ajax(domain + "index.php/Api/api/exhibition", {
					data: {
						key: key,
						ver: ver,
						id: i,
						page:page,
						pagenum: 1
					},
					dataType: 'json',
					type: 'POST',
					timeout: 10000,
					success: function(result) {
						var html = "";
						console.log(result)
						if(result.data) {
							for(var k = 0; k < result.data.length; k++) {
								html += '<div class="mui-slider-item" data-id="' + result.data[k].id + '"><img src="' + result.base.domain + result.data[k].path + '"/></div>';
							};
						} else {
							mui.toast("当前显示为最后一张");
						};
						jQuery("#slide-" + (i + 1)).append(html);
						page++;
					},
					error: function(xhr, type, errorThrown) {
						console.log(type);
					}
				});
			};
		});
	});
})(mui);

mui(".app-list").each(function(index, item) {
	//初始化三个活动
	var _this = $(this);
	init(_this, index);
})

mui.plusReady(function() {
	var targetPage = mui.preload({
		url: "happening.html",
		id: "happending",
		styles: {
			top: "0px",
			bottom: "50px",
		}
	});
	mui(".mui-slider").each(function(index, item) {
		mui(this).on("tap",".mui-slider-item",function(){
			mui.fire(targetPage, "showOut", {
				"which": $(this).closest(".app-list").attr("id"),
				"aid":$(this).attr("data-id")
			});
			mui.openWindow({
				url: "happening.html",
				id: "happending",
				show: {
					aniShow: "fade-in",
				},
				waiting: {
					autoShow: true,
					title: "正在加载..."
				},
			})
		})
		/*this.addEventListener("tap", function() {
			mui.fire(targetPage, "showOut", {
				"which": $(this).closest(".app-list").attr("id"),
				"aid":$(this).attr("data-id")
			});
			mui.openWindow({
				url: "happening.html",
				id: "happending",
				show: {
					aniShow: "fade-in",
				},
				waiting: {
					autoShow: true,
					title: "正在加载..."
				},
			})
		});*/
	});
})

function init(ele, i) {
	mui.ajax(domain + "index.php/Api/api/exhibition", {
		data: {
			key: key,
			ver: ver,
			id: i,
			page: 1,
			pagenum: 3,
		},
		dataType: 'json',
		type: 'POST',
		timeout: 10000,
		success: function(result) {
			if(result.data){
				for(var i = 0; i < result.data.length; i++) {
					ele.find(".mui-slider-item").eq(i).attr("data-id", result.data[i].id)
					if(result.data[i].path){
						ele.find(".mui-slider-item").eq(i).find("img").attr("src", result.base.domain + result.data[i].path);
					}
				}
			}
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
		}
	});
};