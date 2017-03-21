mui.init({swipeBack: true});
var pic_height
mui.plusReady(function() {
	var curWindow = plus.webview.currentWebview();
	var aid=curWindow.aid,pic = curWindow.pic;
	//document.getElementById("pic").height = window.width*2/3

	var bname = curWindow.bname||"";
	document.getElementById("bname").innerText = bname;
	localStorage.removeItem("data-"+aid);
	localStorage.removeItem("time"+aid);
	//加载时,获取当前信息
	var type,nowtime,startdate,edate;  //0为happening,1为upcoming,2为past
	var muiTitle
	$(function(){
		pic_height = $(window).width()*2/3;
		//$(".happening-banner ,.upcoming-banner,.past-banner").height(pic_height)
	});
	mui.ajax(domain+"/index.php/Api/Api/allExhibition/", {
		data: {
			key: key,
			ver: ver,
			token:localStorage.getItem("TOKEN_LOGIN"),
			uid:localStorage.getItem("TOKEN_UID"),
			aid:aid,
		},
		dataType: 'json',
		type: 'get',
		success: function(result) {
			//console.log(JSON.stringify(result))
			document.getElementById("box-0").style.display = "none"
			document.getElementById("box-1").style.display = "none"
			document.getElementById("box-2").style.display = "none"
			if(result.status == 0 && result.data.exhibition){ 
				localStorage.setItem("time"+aid,result.base.date)
				localStorage.setItem("data-"+curWindow.aid,JSON.stringify(result))
				nowtime = result.base.timestamp||0;
				startdate = result.data.exhibition.startdate||0;
				edate = result.data.exhibition.edate||0;
				muiTitle = result.data.exhibition.title
				
				//2592000  1个月内的就算happening
				if(parseInt(nowtime) > (parseInt(edate)+86400)) {
					//past
					type = 2
				}else if ((nowtime < startdate) && (edate <= (parseInt(nowtime)+2592000)) ) {
					//happening
					type = 0;
				}else{
					//upcoming
					type = 1
				}
				//console.log(parseInt(nowtime) +"/"+ startdate +"/"+ edate +"/" + type)
				document.getElementById("box-"+type).style.display = "block";
				document.getElementById("pic-"+type).src = pic;
				var o_height = $(window).outerHeight() - $("header").innerHeight() - $(".mui-input-row.mui-input-group.search").innerHeight();
				$(".content-box").css({height:o_height})
				$("."+hup[type]+"-banner ").css({height:(o_height - $("."+hup[type]+"-lists").height()*1.05)})
				//console.log((o_height - $("."+hup[type]+"-lists").height()*1.05)+hup[type])

			}else{
				mui.toast(result.msg)
			}
		},
		error:function(xhr, type, errorThrown){
			console.log(type);
		}
	});

	mui(".mui-content").on('tap','.item',function(){
	//获取aid
		var itemName = this.getAttribute("data-name");
		//传值给详情页面，通知加载新数据
		mui.openWindow({
			url:itemName+".html",
			id:itemName,
			show: {
				aniShow: "fade-in",
			},
			styles:{
				top:"0px",
				bottom:"50px"
			},waiting: {
				autoShow: true,
				title: "loading..."
			},
			extras:{
				type:type,
				muiTitle:muiTitle,
				bname: "Conference",
				aid:aid,
				pic:pic
			}
		});
	})
	
	//点击图片放大
	mui(".content-box").on("tap","#pic-0,#pic-1,#pic-2",function(){
		//mui.toast(this.getAttribute("src"))
		
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
					keywords:search.value,
					pagenum:5
				},
				dataType: 'json',
				type: 'POST',
				timeout: 10000,
				success: function(result) {
					html = '';
					if (result.data && result.data != null) {
						console.log(JSON.stringify(result))
						for(var arr in result.data){
							html += '<li data-id="'+result.data[arr].id+'"  class="mui-table-view-cell" data-pic="'+domain+result.data[arr].path+'">'+result.data[arr].title+'['+result.data[arr].city+']</li>'
						}
						document.getElementById("toggle").style.display="block"
					}else{
						html = 'No more data';
						document.getElementById("toggle").style.display="none"
					}
					document.getElementById("toggle").innerHTML = html+'<li class="mui-table-view-cell" id="toggle_ecs" data-id="0">Cancel</li>';
				},
				error: function(xhr, type, errorThrown) {
					console.log(type);
				}
			});
		}
	})
	mui("body").on("tap",".mui-icon-clear",function(){
		document.getElementById("toggle").innerHTML = ''
		document.getElementById("toggle").style.display="none" 
	})
	//点下拉搜索结果
	mui("#toggle").on('tap','.mui-table-view-cell',function(){
		//获取aid
		aid = this.getAttribute("data-id");
		//传值给详情页面，通知加载新数据
		//打开详情
		document.getElementById("toggle").innerHTML = ''
		document.getElementById("toggle").style.display="none"
		document.getElementById("search_ipt").value = ''
		if (aid == 0) {
		} else{
			mui.openWindow({
				id:'happening'+aid,
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
					title: "loading..."
				},
				extras:{
					bname:"Search:"+search.value,
					aid:aid,
					pic:this.getAttribute("data-pic")
				}
			});

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
					title: "loading..."
				},
				extras:{
					bname:"Search:"+search.value,
					keywords:search.value
				}
			});
		}
	})

	//点击回车提交搜索
	search.addEventListener("keyup",function(event){
		if (event.keyCode == 13) {
			go_search.click()
			//mui.toast(event.keyCode)
			//go_search.trigger("click")

		} else{

		}
	})



});



