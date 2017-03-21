mui.init();
var iii=0;
var index_group,aid;



mui.plusReady(function() {
	//console.log(ntt)
	//document.addEventListener("netchange", onNetChange, false);
    //获取当前网络类型
	//console.log(document.getElementById("past_i").getElementsByTagName("div")[0].getAttribute("data-id"))//getAttribute("data-id")
	$('.mui-slider').each(function(i, e) {
		var page=4,id_list;
		var _this = this;
		var types=["Happening","Upcoming","Past"]
		this.addEventListener('slide', function(event) {
			if(event.detail.slideNumber == jQuery(_this).find(".mui-slider-item").length - 1) {
				//生成已有的活动信息ID列
				id_list=0
				$("#"+types[i].toLowerCase()+"_i .mui-slider-item").each(function(ii,ee){
					id_list+=","+$(this).attr("data-id")
					//alert($(this).attr("data-id"))
				})
				//console.log($("#"+types[i].toLowerCase()+"_i .mui-slider-item").length+"ddd")
				//console.log(id_list)
				mui.ajax(domain + "index.php/Api/api/indexExhibition/?"+(new Date()), {
					data: {
						key: key,
						ver: ver,
						token:localStorage.getItem("TOKEN_LOGIN"),
						uid:localStorage.getItem("TOKEN_UID"),
						id: i,
						i:i,
						page:page,
						pagenum: 2 ,
						idlist:id_list
					},
					dataType: 'json',
					type: 'POST',
					timeout: 10000,
					success: function(result) {
	//					alert(page+"//1//"+i+"//"+result.data[0].id)
						//alert(JSON.stringify(result))
						//console.log(result.data.length)
						var html = "";
						if(result.data || result.data != null) {
							html += '<div class="mui-slider-item" data-id="'+ result.data[0].id + '" data-pic="'+ result.base.domain + result.data[0].path + '"><img src="' + result.base.domain + result.data[0].path + '"  style="height:'+cell_height+'px"/></div>';
						} else {
							mui.toast("No more events");
						};
						$(".mui-table-view li:eq("+i+") .mui-slider-group").append(html);
						++page;
					},
					error: function(xhr, type, errorThrown) {
						console.log(type);
					}
				});
			};
		});
	});



	var launch=plus.webview.getLaunchWebview();

	getDefaultData();
	/*var aa = setInterval(function(){
		console.log(iii)//监测是否获取到数据,如未获取到,重新发起请求,超过5次仍未获取到,则停止
		++iii
		if(!document.getElementById("past_i").getElementsByTagName("div")[0].getAttribute("data-id") || document.getElementById("past_i").getElementsByTagName("div")[0].getAttribute("data-id")!='1.1'){
			console.log('重新请求到数据')
			clearInterval(aa)
		}else if(iii>5){
			mui.alert("无法请求到数据,可能是网络错误,请退出后重试.")
			console.log('无法请求到数据,请退出后重试.')
			clearInterval(aa)
		}
	},2000)*/

	//点击
	var targetPage = mui.preload({
		url: "happening.html",
		id: "happending",
		styles: {
			top: "0px",
			bottom: "50px",
		}
	});
	mui(".mui-table-view").on('tap','.mui-slider-item',function(){
		//获取aid
		aid = this.getAttribute("data-id");
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
				bname:"Home",
				aid:aid,
				pic:this.getAttribute("data-pic")
			}
		});

	})
	mui("body").on("tap",".mui-icon-clear",function(){
		document.getElementById("toggle").innerHTML = ''
		document.getElementById("toggle").style.display="none"
	})
		//搜索功能
	var search = document.getElementById("search_ipt"),keywords = "",html = ""
	search.addEventListener("input",function(event){
		//document.getElementById("toggle").innerHTML = search.value
		//return false;
		if (search.value.length>0 && keywords != search.value) {
			keywords = search.value
			mui.ajax(domain + "index.php/Api/api/indexSearch", {
				data: {
					key: key,
					ver: ver,
					token:localStorage.getItem("TOKEN_LOGIN"),
					uid:localStorage.getItem("TOKEN_UID"),
					keywords:keywords,
					pagenum:5
				},
				dataType: 'json',
				type: 'POST',
				timeout: 10000,
				success: function(result) {
					console.log(JSON.stringify(result))
					html = '';
					if (result.data && result.data != null) {
						console.log(JSON.stringify(result))
						for(var arr in result.data){
							html += '<li data-id="'+result.data[arr].id+'"  class="mui-table-view-cell" data-pic="'+domain+result.data[arr].path+'">'+result.data[arr].title+'['+result.data[arr].city+']</li>'
						}
						document.getElementById("toggle").style.display="block"
					}else{
						html = 'No event';
						document.getElementById("toggle").style.display="none"
					}
					document.getElementById("toggle").innerHTML = html+'<li class="mui-table-view-cell" id="toggle_ecs" data-id="0">Cancel</li>';
				},
				error: function(xhr, type, errorThrown) {
					console.log(type);
				}
			});
		}else if(search.value.length == 0){
			document.getElementById("toggle").innerHTML = ''
			document.getElementById("toggle").style.display="none"
		}
	})

	//点下拉搜索结果
	mui("#toggle").on('tap','.mui-table-view-cell',function(){
		//获取aid
		aid = this.getAttribute("data-id");
		//传值给详情页面，通知加载新数据
		//打开详情
		if (aid == 0) {

		} else{
			mui.openWindow({
				id:'happening',
				url:'happening.html',
				show: {
					aniShow: "fade-in",
				},
				styles:{
					top:"0px",
					bottom:"50px"
				},
				waiting: {
					autoShow: true,
					title: "Loading..."
				},
				extras:{
					//bname:"Home Search:"+search.value,
					bname:"Home",
					aid:aid,
					pic:this.getAttribute("data-pic")
				}
			});
			document.getElementById("toggle").innerHTML = ''
			document.getElementById("toggle").style.display="none"
			document.getElementById("search_ipt").value = ''
		}
	})
	var go_search = document.getElementById("go_search")
	go_search.addEventListener("click",function(event){
		if (search.value.length == 0) {
			mui.toast("Need key word!")
		} else{
			mui.openWindow({
				id:'search',
				url:'search.html',
				show: {
					aniShow: "fade-in",
				},
				styles:{
					top:"0px",
					bottom:"50px"
				},waiting: {
					autoShow: true,
					title: "Loading..."
				},
				extras:{
					bname:"Search:"+search.value,
					keywords:search.value
				}
			});

		}
	})

	//点击回车提交搜索
	var go_search = document.getElementById("go_search")
	search.addEventListener("keyup",function(event){
		if (event.keyCode == 13) {
			go_search.click()
			document.getElementById("toggle").innerHTML = ''
			document.getElementById("toggle").style.display="none"
			document.getElementById("search_ipt").value = ''
			//mui.toast(event.keyCode)
			//go_search.trigger("click")

		} else{

		}
	})

	//滑动
	var muiHappening=document.getElementById("happening_s")
	muiHappening.addEventListener("slide",function(event){
		console.log(muiHappening.getElementsByTagName("mui-slider-item").length)
	});


	//应用重启时再次加载数据

	document.addEventListener("resume", getDefaultData, false);
//	document.addEventListener("resume", function(){
//		var current=plus.webview.currentWebview();
//		current.reload();
//	}, false);
	document.addEventListener("reload",function(){
		var current=plus.webview.currentWebview();
		current.reload();
	})


})


function getDefaultData(){
		mui.ajax(domain + "index.php/Api/api/indexExhibition", {
			data: {
				key: key,
				ver: ver,
				token:localStorage.getItem("TOKEN_LOGIN"),
				uid:localStorage.getItem("TOKEN_UID"),
			},
			dataType: 'json',
			type: 'POST',
			timeout: 2000,
			success: function(result) {
				//alert("abc"+JSON.stringify(result))
				//console.log(JSON.stringify(result))
				if(result.data){
					for(var arr in result.data) {
						index_group='';
						for(var arr2 in result.data[arr]) {
							index_group+='<div class="mui-slider-item" data-id="'+result.data[arr][arr2]['id']+'" data-pic="'+domain+result.data[arr][arr2]['path']+'"><img style="width:100%; height:101%;" src="'+domain+result.data[arr][arr2]['path']+'"/></div>';
						}
						document.getElementById(arr+"_i").innerHTML = index_group
					}
				}
				console.log($("#indexbody").html())
			},
			error: function(xhr, type, errorThrown) {
				console.log(xhr);
			}
		});
	}
