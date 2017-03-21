mui.init({swipeBack: true});
mui.plusReady(function() {
	var current = plus.webview.currentWebview();
	var aid = current.aid;
	var type = current.type;
	document.getElementById("bname").innerText = current.bname||"Back"
	var Nname = 'Information'
	//document.getElementById("mui-title").innerHTML = Nname 
	var result = JSON.parse( localStorage.getItem("data-"+aid) );
	document.getElementById("h2_title").innerText = result.data.exhibition.title
	document.getElementById("in_con").innerHTML = result.data.exhibition.Information
	document.getElementById("in_pic").src = current.pic
	$(".logos").each(function(index, ele) {
		var _this = $(this);
		initSopnsorInfor(aid,index+1, _this);
	});

	$('.mui-slider').each(function(i, e) {
		var _this = this;
		var page = 3;
		this.addEventListener('slide', function(event) {
			if(event.detail.slideNumber == $(_this).find(".mui-slider-item").length - 1) {
				mui.ajax(domain + "index.php/Api/api/sponsor", {
					data: {
						key: key,
						ver: ver,
						token:localStorage.getItem("TOKEN_LOGIN"),
						uid:localStorage.getItem("TOKEN_UID"),
						aid: aid,
						level: (i + 1),
						page: page,
						pagenum: 3,
					},
					dataType: 'json',
					type: 'get',
					success: function(result) {
						var html = "",
							li = "";
						if(result.data) {
							for(var k = 0; k < result.data.length; k++) {
								li += '<li class="mui-table-view-cell mui-media mui-col-xs-4">' +
									'<div class="company-logo">' +
									(result.data[k].path?'<img src="images/blank.gif" data-src="' + result.base.domain + result.data[k].path + '" class="logo" style="background-image:url(' + result.base.domain + result.data[k].path +') center center ;">':result.data[k].com)+

									//'<img src="' + result.base.domain + result.data[k].path + '" class="logo">' +
									'<img src="images/level-' + (parseInt(result.data[k].star) + 1) + '.png" class="level">' +
									'</div>' +
									'<span>' + result.data[k].com + '</span>' +
									'</li>'
							};
							html += '<div class="mui-slider-item">' +
								'<ul class="mui-table-view mui-grid-view">' + li + '</ul>' +
								'</div>';
						} else {
							//mui.toast("当前显示为最后一张");
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
});

//初始化赞助商信息
function initSopnsorInfor(id, level, ele) {
	mui.ajax(domain + "index.php/Api/api/sponsor", {
		data: {
			key: key,
			ver: ver,
			token:localStorage.getItem("TOKEN_LOGIN"),
			uid:localStorage.getItem("TOKEN_UID"),
			aid: id,
			level: level,
			page: 1,
			pagenum: 6,
		},
		dataType: 'json',
		type: 'get',
		success: function(result) {
			if(result.data == null){
			}else if(result.data.length<4){
				ele.find(".mui-slider-item:gt(0)").remove();
				for(var i=result.data.length-1;i<4;i++){
					ele.find(".mui-table-view-cell").eq(i).remove();
				}
			}else if(result.data.length>3&&result.data.length<6){
				for(var i=result.data.length-1;i<6;i++){
					ele.find(".mui-table-view-cell").eq(i).remove();
				}
			};
			ele.find(".mui-table-view-cell").each(function(index, element) {
				if(result.data[index].id){
					$(this).attr("data-id",result.data[index].id)
				};
				$(this).attr({
					"data-path":result.base.domain+result.data[index].path,
					"data-name":result.data[index].company,
					"data-content":result.data[index].content,
					"data-tel":result.data[index].tel,
					"data-website":result.data[index].website,
				})
				//$(element).find(".logo").attr("src", result.base.domain + result.data[index].path)

				//<img src="images/blank.gif" data-src="' + result.base.domain + result.data[k].path + '" class="logo" style="background-image:url(' + result.base.domain + result.data[k].path +') center center ;">
				$(element).find(".logo").attr("style", 'background:url('+ result.base.domain + result.data[index].path +') center center  no-repeat;background-size: 90%;')
				$(element).find(".level").attr("src", "images/level-" + (parseInt(result.data[index].star)) + ".png")
				$(element).find("span").html(result.data[index].com);
				//alert($(element).html())
			});
			console.log($(".company-logos").html())
		},
		show:{
			aniShow:"fade-in"
		},
		error: function(xhr, type, errorThrown) {
			console.log(type);
		}
	});
}

mui("body").on("tap",".mui-table-view-cell",function(){
	var _this=this;
	if(_this.getAttribute("data-website").length>10){
		mui.confirm(""+_this.getAttribute("data-website")+"","",["Cancel","Next"],function(e){
			//console.log(JSON.stringify(e))
			if (e.index == 1) {
				plus.runtime.openURL(_this.getAttribute("data-website"))
			}
		})
		//plus.runtime.openURL(_this.getAttribute("data-website"))

	}else{

		mui.openWindow({
			url:"companyProfile.html",
			id:"companyProfile",
			styles:{
				top:"0px",
				bottom:"50px"
			},
			show:{
				aniShow:"fade-in"
			},
			extras:{
				bname:"Information",
				companyName:_this.getAttribute("data-name"),
				companyBanner:_this.getAttribute("data-path"),
				companyContent:_this.getAttribute("data-content"),
				companyTel:_this.getAttribute("data-tel"),
		    },
		});
	}
})


