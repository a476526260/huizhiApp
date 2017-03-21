mui.init({swipeBack: false});
(function($) {
	$('.mui-scroll-wrapper').scroll({
		indicators: true //是否显示滚动条
	});

	jQuery(".mui-control-content").css("min-height", jQuery(window).height() - jQuery(".search-box").innerHeight() - jQuery("#sliderSegmentedControl").innerHeight() - 44);
	//切换显示方式--块级显示
//	$("body").on("tap", ".icon-th-large-copy", function() {
//		jQuery(".mui-slider .mui-slider-group .mui-slider-item").each(function(i, e) {
//			jQuery(e).find(".mui-table-view").addClass("block-style").removeClass("list-style")
//		})
//	});
//	//切换显示方式--列表显示
//	$("body").on("tap", ".icon-fenlei", function() {
//		jQuery(".mui-slider .mui-slider-group .mui-slider-item").each(function(i, e) {
//			jQuery(e).find(".mui-table-view").addClass("list-style").removeClass("block-style")
//		})
//	});



})(mui);
//networking--待修改需添加下拉加载功能，暂时填写每页加在条数为20000，
var curWindow,type=0,htmlList=['','']
var li_w = window.screen.width*0.94*0.22
mui.plusReady(function() {
	curWindow = plus.webview.currentWebview();
	var page=page||1;
	document.getElementById("bname").innerText = curWindow.bname||""
	var Nname = 'Networking'
	//document.getElementById("mui-title").innerHTML = Nname 
	fillTxt(curWindow.aid,1,20000,0);
	document.getElementById('slider').addEventListener('slide', function(e) {
		type = e.detail.slideNumber
		$("#sliderSegmentedControl a").eq(type).addClass("active").siblings().removeClass("active");
		//$("#item" + (type + 1) + "mobile").find("ul").html(htmlList[type]);
	});
	var style_list = ["block-style","list-style"],style_i=true
	$(".sort-way").on("tap","span",function(){
		$(this).hide().siblings().show()
		style_i = !style_i
		$(".mui-table-view").addClass(style_list[Number(style_i)]).removeClass(style_list[Number(!style_i)]);
		//console.log(Number(style_i)+"//"+Number(!style_i))
	})
	
	//搜索
	mui("body").on("tap",".mui-icon-clear",function(){
		$("#lists li").show();
	})
	var searcha = document.getElementById("search_ipt"),in_k
	searcha.addEventListener("input", function(event) {
		if(searcha.value.length > 0) {
			$("#lists li").css({display:"none"})
			$("#lists li").each(function(){
				in_k = "/"+$(this).text().toLowerCase()
				//console.log(in_k.indexOf(searcha.value.toLowerCase()))
				if ( in_k.indexOf(searcha.value.toLowerCase())>0 ) {
					$(this).css({display:"block"})
				}
				//console.log($(this).text())
			})
		
		
			//$("#lists li:contains(" + searcha.value + ")").show()
		} else {
			$("#lists li").show();
		}
	})
	//点击对话
	mui("body").on("tap",".mui-table-view-cell .chat",function(){
		var _this=this;
		var ind = _this.getAttribute("data-sp")
		mui.openWindow({
			url:"im-chat.html",
			id:"im-chat",
			styles:{
				top:"0px",
				bottom:"50px",
			},
			show:{
				aniShow:"fade-in",
			},
			extras:{
				bname:"Networking",
				bname2:ind,
				muiTitle:_this.getAttribute("data-uname"),
				from:localStorage.getItem("TOKEN_UID"),
				to:_this.getAttribute("data-userId"),
			},
		})
		return false;
	});
	//查看当前人的资料
	var speakerId
	mui("body").on("tap",".mui-table-view-cell .mui-media-object",function(){
		var _this=this;
		
		speakerId=_this.getAttribute("data-userId")
		var ind = _this.getAttribute("data-sp")
		//alert($(".mui-slider-group .mui-active").index())
		//alert('Speaker'?'Speakers':"networkingBio")
		mui.openWindow({
			url:ind=='Speaker'?'Speakers.html':"networkingBio.html",
			id:'Speaker'?'Speakers':"networkingBio",
			show:{
				aniShow:"fade-in",
			},
			styles:{
				top:"0px",
				bottom:"50px"
			},
			extras:{
				aid:curWindow.aid,
				bname2:ind,
				speakerId:speakerId,
				bname:"Networking"
			}
		})
	})
	//点击关注
	mui("body").on("tap",".heart",function(){
		var _this=this;
		speakerId=_this.getAttribute("data-userId")
		mui.ajax(domain + "/index.php/Api/api/favorites",{
			data:{
				key: key,
				ver: ver,
				token:localStorage.getItem("TOKEN_LOGIN"),
				uid:localStorage.getItem("TOKEN_UID"),
				fuid:speakerId,
				aid:curWindow.aid
			},
			dataType:"json",
			type:"post",
			success:function(result){
				//mui.toast(result.msg)
				if(result.data.id>0){
					_this.setAttribute("class",'heart cur')
				}else{
					//取消关注时,将被取消关注人的ID存入本地,用于删除my contact列表的人
					_this.setAttribute("class",'heart')
					var delFav = (localStorage.getItem("delFav")||1)+","+speakerId
					localStorage.setItem("delFav",delFav)
					//alert(localStorage.getItem("delFav"))
				}
				var e = JSON.parse( localStorage.getItem("data-"+curWindow.aid) );
				for (i=0;i<e.data.networking.length;i++) {
					if(parseInt(e.data.networking[i].userid) == parseInt(speakerId) ){
						e.data.networking[i].fav = result.data.id?1:0
						//mui.toast(parseInt(e.data.networking[i].userid) +"//"+ parseInt(speakerId) +"//"+ result.data.id)
						//break;
					}
				}
				//console.log(JSON.stringify(result))
				localStorage.setItem("data-"+curWindow.aid,JSON.stringify(e))
				//操作关注时,通知my contact更新
				
				var targetPage = mui.preload({
					url: "my-contact.html",
					id: "my-contact",
					styles: {
						top: "0px",
						bottom: "50px",
					}
				});
				//传值给详情页面，通知加载新数据
				mui.fire(targetPage, "changeFav", {
					
				});
				
			}
		})
	})

});


function  fillTxt(aid,page,pagenum,type){
	var isSelf_1 = '',isSelf_2 = '';
	var result = JSON.parse( localStorage.getItem("data-"+aid) );
	//console.log(JSON.stringify(result.data.networking)) 
	if(result.data.networking && page == 1){
		for(var i = 0; i < result.data.networking.length; i++) {
			if (result.data.networking[i].uname.length<2) {
				continue;
			}
			if (parseInt(result.data.networking[i].userid) == parseInt(localStorage.getItem('TOKEN_UID'))) {
				isSelf_1 = '';
				isSelf_2 = '';
			} else{
				isSelf_1 = '<span class="chat" data-userId="'+result.data.networking[i].userid+'" data-uname="'+result.data.networking[i].uname+'">&nbsp;</span>';
				isSelf_2 = '<span class="heart '+(result.data.networking[i].fav==1?"cur":"")+'" data-userId="'+result.data.networking[i].userid+'">&nbsp;</span>';
			}
			htmlList[result.data.networking[i].types] += '<li class="mui-table-view-cell mui-media" data-userId="'+result.data.networking[i].userid+'"><a href="javascript:;"><img  data-sp="'+(result.data.networking[i].types==0?"Speaker":"Delegates")+'" data-userId="'+result.data.networking[i].userid+'" class="mui-media-object mui-pull-left" src="'+(domain+result.data.networking[i].face)+'"><div class="mui-media-body"><p class="name" >' + result.data.networking[i].uname + '</p><p class="job">' + result.data.networking[i].position + '</p><p class="company">' + result.data.networking[i].company + '&nbsp;</p>'+isSelf_1+'</div>'+isSelf_2+'</a></li>'
		};
		//$("#item2mobile").find("ul").html(htmlList[1]);
		$("#item1mobile").find("ul").html(htmlList[0]+htmlList[1]);
		$("#item2mobile").find("ul").html(htmlList[0]);
		$(".slider .mui-slider-item .block-style li a img").height(li_w)
		//alert(li_w)
		console.log(htmlList[0]+htmlList[1])
	}else{
		mui.ajax(domain+"/index.php/Api/api/networking", {
			data: {
				key: key,
				ver: ver,
				token:localStorage.getItem("TOKEN_LOGIN"),
				uid:localStorage.getItem("TOKEN_UID"),
				aid: aid,
				page: page,
				pagenum: pagenum,
				types: type
			},
			dataType: 'json',
			type: 'get',
			success: function(result) {
				//alert(JSON.stringify(result))
				var htmlList = "";
				if(!result.data){
					return
				}else{
					for(var i = 0; i < result.data.length; i++) { 
						htmlList[result.data[i].types] += '<li class="mui-table-view-cell mui-media" data-userId="'+result.data[i].userid+'"><a href="javascript:;"><img data-sp="'+(result.data[i].types==0?"Speaker":"Delegates")+'" class="mui-media-object mui-pull-left" data-userId="'+result.data[i].userid+'" src="" style="height:'+li_w+'px;background:url('+(domain +(result.data[i].face.length<30?"/Uploads/Face/":"")+ result.data[i].face)+') 100%"><div class="mui-media-body"><p class="name" >' + result.data[i].uname + '</p><p class="job">' + result.data[i].position + '</p><p class="company">' + result.data[i].company + '</p><span class="chat" data-userId="'+result.data[i].userid+'" data-uname="'+result.data[i].uname+'"></span></div><span class="heart '+(result.data[i].fav==1?"cur":"")+'"  data-userId="'+result.data[i].userid+'"></span></a></li>'
					};
				};
				$("#item1mobile").find("ul").html(htmlList[0]);
				//$("#item2mobile").find("ul").html(htmlList[1]);
				$("#item2mobile").find("ul").html(htmlList[0]+htmlList[1]);
				$(".block-style li").height(li_w)
				alert($(".block-style li").length)
				console.log(htmlList[0])
			},
			error:function(xhr, type, errorThrown){
				console.log(type);
			}
		});
	}
	//return;


}


