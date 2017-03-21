mui.init({swipeBack: false});
var pic,result 
mui.plusReady(function(){
	var list = mui.preload({
		url:"list.html",
		id: "list",
		styles: {
			top: "0px",
			bottom: "50px",
		}
	});
	var curWindow = plus.webview.currentWebview();
	result = JSON.parse(localStorage.getItem("data-"+curWindow.aid))
	pic = curWindow.pic;
	var bname = curWindow.bname||"Back"
	document.getElementById("bname").innerText = bname
	var Nname = 'Agenda'
	//document.getElementById("mui-title").innerHTML = Nname 
	fillTxt(curWindow.aid);
	//加入我们
	var  join=document.getElementById("join");
	//console.log(result)
	if (parseInt(result.data.exhibition.joinnow) > 1) {
		join.innerText = 'Added to my events'
		mui.fire(list,"reloadData")
	} else{
		join.innerText = 'Add to my events'
		mui.fire(list,"reloadData")
	}
	if(result.data.exhibition.edate < result.base.timestamp){
		//结束后
		join.style.display = "none"
	}else{
		join.style.display = "block"
	}
	$("body").on("tap",".wirte-down",function(){
		if(result.data.exhibition.survey.length < 6 ){
			mui.toast('Currently no survey for this event!')
		}else{
			//mui.openWindow(result.data.exhibition.survey)
			//mui.toast("Opening browser...");
			mui.confirm("Will open survey","",["Cancel","Next"],function(e){
				if (e.index == 1) {
					plus.runtime.openURL(result.data.exhibition.survey);
				}
			})
			
		}
	})
	
	join.addEventListener("tap",function(){
		var res = result
		mui.ajax(domain+"/index.php/Api/api/joinNow",{
			data: {
				key: key,
				ver: ver,
				token:localStorage.getItem("TOKEN_LOGIN"),
				uid:localStorage.getItem("TOKEN_UID"),
				aid: curWindow.aid,
				joined:res.data.exhibition.joinnow||0
			},
			dataType: 'json',
			type: 'post',
			success:function(result){
				if (result.data.id > 0) {
					var txt = 'Added to my events'
				} else{
					var txt = 'Add to my events'
				}
				join.innerText = txt
				res.data.exhibition.joinnow = result.data.id
				localStorage.setItem("data-"+curWindow.aid,JSON.stringify(res))
				mui.fire(list,"reloadData")
			},
			error:function(xhr, type, errorThrown){
				console.log(type);
			}
		})
	});

	mui("body").on("tap",".mui-slider .mui-table-view-cell",function(){
		var _this=this;
		var speakerId=_this.getAttribute("data-userid");
		mui.openWindow({
			url:"Speakers.html",
			id:"Speakers",
			show:{
				aniShow:"fade-in",
			},
			styles:{
				top:"0px",
				bottom:"50px"
			},
			extras:{
				aid:curWindow.aid,
				speakerId:speakerId,
				bname:"Agenda"
			}
		})
	})
}); 

function fillTxt(aid){
	
	if (localStorage.getItem("data-"+aid)) {
		//var result = JSON.parse( localStorage.getItem("data-"+aid) ); 
		var htmlList = "";
		if(!result.data){
			return
		}else{
			document.getElementById("agendaBanner").src=pic; 
			document.getElementById("sdate").innerHTML=result.data.agenda.ext.sdate;
			document.getElementById("title").innerHTML=result.data.agenda.ext.title;
			var con=[],vv='',k=0;
			var count=0;    //保存活动天数
			for(var prop in result.data.agenda){
				if(prop=='ext'){
					continue;
				}
				count++;
			};
			if(count<2){
				//如果活动天数小于两天,则移除第二个mui-slider-item
				$("#slide-box .mui-slider-item:gt(0)").remove();
			}else{
				//如果活动天数大于两天,则增加相应数量mui-slider-item
				var newHtmlList="";
				for(var i=2;i<count;i++){
					newHtmlList+='<div class="mui-slider-item">'
						+'<div class="sort-title">Day'+(i+1)+'<span class="mui-icon mui-icon-arrowright arrowright"></span></div>'
						+'<ul class="mui-table-view sort-content-list" id="content_'+(i+1)+'">'
						+'</ul>'
						+'<div class="wirte-down"><img src="images/write-down.png"/></div>'
					+'</div>';
				};
				$("#slide-box").append(newHtmlList);
			};
			for(prop in result.data.agenda){
				if(prop=='ext')return false;
				for(pp in result.data.agenda[prop]){
					vv=result.data.agenda[prop][pp];
					con[prop]=con[prop]||'';
					con[prop]+='<li class="mui-table-view-cell" data-userId="'+vv["userid"]+'"  data-file="'+vv["file"]+'"><h3 class="trip-title"><span class="time">'+vv["stime_d"]+'</span><span class="thing">'+vv["title"]+'</span></h3><div class="speaker"><span class="speaker-icon iconfont icon-wodeicon"></span><span class="speaker-infor"><b class="name">'+vv["uname"]+'</b><b class="company">'+vv["company"]+'<span class=" mui-icon mui-icon-arrowright"></span></b></span></div></li>';
				};
				document.getElementById("content_"+(++k)).innerHTML=con[prop]
			};
		};
	} else{
		mui.ajax(domain + "/index.php/Api/api/agenda", {
			data: {
				key: key,
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
					document.getElementById("agendaBanner").src=result.base.domain+result.data.ext.path;
					document.getElementById("sdate").innerHTML=result.data.ext.sdate;
					document.getElementById("title").innerHTML=result.data.ext.title;
					var con=[],vv='',k=0;
					var count=0;    //保存活动天数
					for(var prop in result.data){
						if(prop=='ext'){
							continue;
						}
						count++;
					};
					if(count<2){
						//如果活动天数小于两天,则移除第二个mui-slider-item
						$("#slide-box .mui-slider-item:gt(0)").remove();
					}else{
						//如果活动天数大于两天,则增加相应数量mui-slider-item
						var newHtmlList="";
						for(var i=2;i<count;i++){
							newHtmlList+='<div class="mui-slider-item">'
								+'<div class="sort-title">Day'+(i+1)+'<span class="mui-icon mui-icon-arrowright arrowright"></span></div>'
								+'<ul class="mui-table-view sort-content-list" id="content_'+(i+1)+'">'
								+'</ul>'
								+'<div class="wirte-down"><img src="images/write-down.png"/></div>'
							+'</div>';
						};
						$("#slide-box").append(newHtmlList);
					};
					for(prop in result.data){
						if(prop=='ext')return false;
						for(pp in result.data[prop]){
							vv=result.data[prop][pp];
							con[prop]=con[prop]||'';
							con[prop]+='<li class="mui-table-view-cell" data-userId="'+vv["userid"]+'"  data-file="'+vv["file"]+'"><h3 class="trip-title"><span class="time">'+vv["stime_d"]+'</span><span class="thing">'+vv["title"]+'</span></h3><div class="speaker"><span class="speaker-icon iconfont icon-wodeicon"></span><span class="speaker-infor"><b class="name">'+vv["uname"]+'</b><b class="company">'+vv["company"]+'<span class=" mui-icon mui-icon-arrowright"></span></b></span></div></li>';
						};
						document.getElementById("content_"+(++k)).innerHTML=con[prop]
					};
				};
			},
			error:function(xhr, type, errorThrown){
				console.log(type);
			}
		});

	}
};







