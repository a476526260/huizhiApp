mui.init({
	swipeBack: true
});
var li_w = window.screen.width*0.94*0.22
var tokenKey="1234567890";
mui.plusReady(function() {
	var having = 1;
	var logined = localStorage.getItem("TOKEN_UID");

	var currentWindow = plus.webview.currentWebview();
	if(currentWindow.bname != undefined && currentWindow.bname == "Me") {
		//	alert(JSON.stringify(currentWindow))
		document.getElementById("bname").style.display = 'block'
		document.getElementById("bname").innerText = currentWindow.bname
	}


	var style_list = ["block-style", "list-style"],
		style_i = true
	$(".sort-way").on("tap", "span", function() {
		$(this).hide().siblings().show()
		style_i = !style_i
		$(".mui-table-view").addClass(style_list[Number(style_i)]).removeClass(style_list[Number(!style_i)]);
	})
	document.getElementById("lists").innerHTML = "";
	//loadData()
	//查看当前人的资料
	var speakerId
	mui("body").on("tap",".mui-table-view-cell .mui-media-object",function(){
		var _this=this;

		speakerId=_this.getAttribute("data-userId")
		var data_aid = parseInt(_this.getAttribute("data-aid"))
		var ind = _this.getAttribute("data-sp")
		//alert($(".mui-slider-group .mui-active").index())
		if(data_aid>0){
			//打开活动
			//点击
			var targetPage = mui.preload({
				url: "happening.html",
				id: "happending",
				styles: {
					top: "0px",
					bottom: "50px",
				}
			});
			//传值给详情页面，通知加载新数据
			mui.fire(targetPage, "showOut", { 
				"which": $(this).closest(".app-list").attr("id")||"",
				"aid":data_aid
			});
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
					bname:"My contact",
					aid:data_aid,
					pic:_this.getAttribute("src")
				}
			});
		}else{
			mui.openWindow({
				url:"networkingBio.html",
				id:"networkingBio",
				show:{
					aniShow:"fade-in",
				},
				styles:{
					top:"0px",
					bottom:"50px"
				},
				extras:{
					bname2:'',
					speakerId:speakerId,
					bname:"my contact"
				}
			})
		}
	})
	mui("body").on("tap", ".chat", function() {
		var _this = this;
		speakerId=_this.getAttribute("data-userId")
		var data_aid =  parseInt(_this.getAttribute("data-aid"))
		mui.openWindow({
			url: "im-chat.html",
			id: "im-chat",
			styles: {
				top: "0px",
				bottom: "50px",
			},
			show: {
				aniShow: "fade-in",
			},
			extras: {
				bname: "My contact",
				muiTitle:_this.getAttribute("data-uname"),
				from: localStorage.getItem("TOKEN_UID"),
				to: data_aid>0?0:_this.getAttribute("data-userId"),
				aid:data_aid
			},
		})
	});

	//监听登录事件
	document.addEventListener("loadData", function() {
		//loadData()
	});
	getData(); 
	setInterval(function() {
		if(!localStorage.getItem("TOKEN_UID"))return false;
		//getData(); 
	}, 5000)
	function getData(){
		//console.log('获取列表信息:')
		mui.ajax(domain + "/index.php/Api/index/getUnreadMsglist/",{
					data: {
					key: key,
					ver: ver,
					token: localStorage.getItem("TOKEN_LOGIN"),
					uid: localStorage.getItem("TOKEN_UID"),
				},
				dataType: 'json',
				type: 'get',
				timeout: 2000,
				success: function(result){ 
					console.log("获取列表信息:"+JSON.stringify(result))
					var contactsLists = "";
					for(i in result.data) {
						if(JSON.stringify(result.data[i]) != "null") {
							if(parseInt(result.data[i].aid)>0){
								var id = 'aid_'+result.data[i].aid
							}else{
								var id = 'uid_'+result.data[i].from
							}
							if($("#"+id).length > 0 && parseInt($("#"+id).attr("data-time")) < parseInt(result.data[i].addtime)) {
								console.log($("#"+id).attr("data-time")+"//"+parseInt(result.data[i].addtime))
								$("#"+id).attr({
									"data-msgId": result.data[i].chatid,
									"data-status":result.data[i].status||0,
									"data-time":result.data[i].addtime
								})//.find("img.mui-media-object").css({height:li_w})
								$("#"+id+" .company").html(result.data[i].msg);
								$("#"+id+" .name").html(result.data[i].uname);
								$("#"+id+" .job").html(result.data[i].company+(result.data[i].job==""?"":":")+result.data[i].job);
								$("#"+id+" img").attr({"src":(domain +result.data[i].face)});
								$("#lists").prepend($("#"+id+""))
							} else if($("#lists li[data-userId=" + result.data[i].from + "]").length == 0) {
								contactsLists += '<li class="mui-table-view-cell mui-media" id="'+id+'" data-status="' + result.data[i].status + '" data-userId="' + result.data[i].from + '" data-msgId="' + result.data[i].chatid + '"   data-time="' + result.data[i].addtime + '">' +
									'<a href="javascript:;">' +
									'<img class="mui-media-object mui-pull-left" style="" src="' + (domain +result.data[i].face) + '" data-userId="' + result.data[i].from + '" data-aid="' + result.data[i].aid + '">' +
									'<div class="mui-media-body">' +
									'<p class="name">' + result.data[i].uname + '</p>' +
									'<p class="job">' + (result.data[i].company+(result.data[i].job==""?"":":")+result.data[i].job) + '</p>' +
									'<p class="company">' + result.data[i].msg + '</p>' +
									'<p class="time">' + transformTime(result.data[i].addtime) + '</p>' +
									'<span class="chat" data-userId="' + result.data[i].from + '" data-aid="' + result.data[i].aid + '" data-uname="' + result.data[i].uname + '"></span>' +
									'</div>' +
									'</a>' +
									'</li>'
							}
						}
					}
					$("#lists").prepend(contactsLists)
					//console.log($("#lists").html())
				},
				error: function(xhr, type, errorThrown) {
					console.log("获取消息时错误:"+errorThrown+JSON.stringify(xhr));
				}
		})
		
		
	}
	//监听返回到本页事件
	document.addEventListener("reload", function() {
		//获取已有的最新消息ID,避免重复获取
		//loadData()
	});

	//监听帐号退出
	document.addEventListener("exit", function() {
		document.getElementById("lists").innerHTML = "";
	});
	//
	var searcha = document.getElementById("search_ipt"),in_k
	searcha.addEventListener("input", function(event) {
		if(searcha.value.length > 0) {
			$("#lists li").hide()
			$("#lists li").each(function(){
				in_k = "/"+$(this).text().toLowerCase()
				//console.log(in_k.indexOf(searcha.value.toLowerCase()))
				if ( in_k.indexOf(searcha.value.toLowerCase())>0 ) {
					$(this).show()
				}
				//console.log($(this).text())
			})
			
			
			//$("#lists li:contains(" + searcha.value + ")").show()
		} else {
			$("#lists li").show(); 
		}
	})
})
function transformTime(timeTemp) {
		var time = new Date(timeTemp * 1000);
		return((time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + (time.getMinutes().toString().length == 1 ? "0" + time.getMinutes() : time.getMinutes()));
	};
function loadData() {
	window.requestAnimationFrame(function() {
		//获取已有的最新消息ID,避免重复获取
		mui.ajax(domain + "/index.php/Api/index/getUnreadMsglist", {
			data: {
				key: key,
				ver: ver,
				token: localStorage.getItem("TOKEN_LOGIN"),
				uid: localStorage.getItem("TOKEN_UID"),
			},
			dataType: 'json',
			type: 'post',
			success: function(result) {
				console.log("消息列表:"+JSON.stringify(result)) 
				var contactsLists = "";
				//var launch = plus.webview.getLaunchWebview(); //获取启动页
				/*
				"aid_29":{
		            "from":1164,
		            "to":0,
		            "msg":"测试新消息1164",
		            "addtime":1503394135,
		            "status":0,
		            "aid":29,
		            "chatid":754,
		            "uname":"jackhe",
		            "face":"/Uploads/Picture/2017-07/597ae871ed5af.png",
		            "toface":null
		        }
		        "aid_23":{
		            "chatid":"117",
		            "aid":"23",
		            "status":"1",
		            "from":"1164",
		            "to":"0",
		            "msg":"瞅瞅",
		            "face":"/Uploads/Face/599d38de45249.jpg",
		            "addtime":"1496301214",
		            "uname":"Vietnam Footwear Summit 2017"
		        },
		        "uid_1524":{
		            "chatid":"708",
		            "aid":"0",
		            "status":"1",
		            "from":"1524",
		            "to":"1164",
		            "msg":"看下",
		            "face":"/Uploads/Face/59953d083b2d0.jpg",
		            "addtime":"1503292597",
		            "uname":"leeegggg"
		        },
		        
				 * */
				for(i in result.data) {
					if(JSON.stringify(result.data[i]) != "null") {
						if(parseInt(result.data[i].aid)>0){
							var id = 'aid_'+result.data[i].aid
						}else{
							var id = 'uid_'+result.data[i].from
						}
						//console.log(id)
						if($("#"+id).length > 0 && parseInt($("#"+id).attr("data-time")) < parseInt(result.data[i].addtime)) {
							$("#"+id).attr({
								"data-msgId": result.data[i].chatid,
								"data-status":result.data[i].status||0,
								"data-time":result.data[i].addtime
							})//.find("img.mui-media-object").css({height:li_w})
							$("#"+id+" .company").html(result.data[i].msg);
							$("#"+id+" .name").html(result.data[i].uname);
							$("#"+id+" .job").html(result.data[i].company+(result.data[i].job==""?"":":")+result.data[i].job);
							$("#"+id+" img").attr({"src":(domain +result.data[i].face)});
							$("#lists").prepend($("#"+id+""))
						} else if($("#lists li[data-userId=" + result.data[i].from + "]").length == 0) {
							contactsLists += '<li class="mui-table-view-cell mui-media" id="'+id+'" data-status="' + result.data[i].status + '" data-userId="' + result.data[i].from + '" data-msgId="' + result.data[i].chatid + '"   data-time="' + result.data[i].addtime + '">' +
								'<a href="javascript:;">' +
								'<img class="mui-media-object mui-pull-left" style="" src="' + (domain +result.data[i].face) + '" data-userId="' + result.data[i].from + '" data-aid="' + result.data[i].aid + '">' +
								'<div class="mui-media-body">' +
								'<p class="name">' + result.data[i].uname + '</p>' +
								'<p class="job">' + (result.data[i].company+(result.data[i].job==""?"":":")+result.data[i].job) + '</p>' +
								'<p class="company">' + result.data[i].msg + '</p>' +
								'<p class="time">' + transformTime(result.data[i].addtime) + '</p>' +
								'<span class="chat" data-userId="' + result.data[i].from + '" data-aid="' + result.data[i].aid + '" data-uname="' + result.data[i].uname + '"></span>' +
								'</div>' +
								'</a>' +
								'</li>'
						}
					}
				}
				$("#lists").prepend(contactsLists)
				//console.log($("#lists").html())
				//console.log(JSON.stringify(result.data))
//				mui.fire(launch, 'showNums', {
//					'number': status
//				});
				//mui.alert(status)

			}
		});
	})
};