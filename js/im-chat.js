var uid = logined = localStorage.getItem("TOKEN_UID");
var classList
mui.init({
	beforeback:function(){
		mui.fire(myevent,"reload");
		mui.fire(contact,"reload");
	},
	pullRefresh : { 
	    container:"#pullrefresh",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
	    down : {
			height:50,//可选,默认50.触发下拉刷新拖动距离,
			auto: true,//可选,默认false.首次加载自动下拉刷新一次
			contentrefresh: '正在加载...',
			contentdown : "下拉刷新111",
			contentover : "释放立即刷新222",
			contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
			callback :goda //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
	    }
	}
});
function goda(){
	//mui.toast(23412341234123)
	//$("#mui-title").trigger("dblclick")
	//mui.trigger(document.getElementById("mui-title"),'tap'); 
	mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
	//return false;
}
mui.plusReady(function() {
	var curWindow = plus.webview.currentWebview();
	var aid = curWindow.aid||0;
	var to= curWindow.to||0 
	var maxMsgid=0,minMsgid = 0
	var timeFor = 0//获取消息失败时,超过3次,则将停顿5秒一次再发起.
	var messageKeyword = ''
	var uname = '',sender='zs'
	var face_class = "";
	getData(aid,to, 0, 0) 
	//mui.alert(aid)

	//监听发送消息
	document.addEventListener("showSendMsg",function(e){
		var result=e.detail
		console.log(JSON.stringify(e))
		var con_new = '<li class="msg-item msg-item-self" style="background:#f00; min-height:100px;" msg-type="text" data-id="'+result.chatid+'" id="chat_'+result.chatid+'">'
			+'<img class="msg-user goBio" src="'+ domain + result.face+'" data-uid="'+uid+'" alt="" />'
				+'<div class="msg-content" style="">'
					+'<div class="msg-content-inner">' 
					+'<div class="chat-infor" style="white-space: nowrap; overflow: inherit; position: relative;">'
					+'		<span class="infor" style="margin-right: 120px;">'+result.chatid+"/"+aid+'Me</span>'
					+'		<span class="time" style="height: 20px; position: absolute; top: 0; right: -5px;">'
					+'			<b class="iconfont icon-101"></b>'+transformTime(result.addtime)+''
					+'		</span>'
					+'	</div>'
					+'	<p class="chat-word">'
					+'		'+result.msg+''
					+'	</p>'
					
					+'</div>'
				+'</div>' 
			+'<div class="mui-item-clear"></div>'
		+'</li>'
		$("#msg-list").append(con_new);
		console.log($("body").html())
		//document.getElementById('message-num').innerText = e
	})
	//查看对方资料
	
	//查看当前人的资料
	//<div class="msg-item msg-item-self" msg-type="text" data-id="'+result.data.chatid+'" id="chat_'+result.data.chatid+'">
	//data-uid
	mui("body").on("tap",".goBio",function(){
		var _this=this;
		
		var dataUid=_this.getAttribute("data-uid")
		var ind = muiTitle
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
				bname2:'',
				speakerId:dataUid,
				bname:muiTitle
			}
		})
	})
	var scrTop = 0
	function getData(aid,to, maxMsgid, minMsgid) {
		//document.querySelector("#pullrefresh").scrollTop = document.querySelector("#msg-list").offsetHeight;
		scrTop = document.querySelector("#msg-list").offsetHeight;
		console.log(aid)
		if(aid == 0 && to == 0)return false;
		//
		mui.ajax(domain + "/index.php/Api/Msg/getMsg/", {
			data: {
				key: "",
				ver: ver,
				aid: aid,
				maxMsgid: maxMsgid,
				minMsgid: minMsgid,
				uid:uid,
				to:to
			},
			dataType: 'json',
			type: 'get',
			timeout: 60000,
			success: function(result) { 
				console.log("聊天时获取到的消息:"+JSON.stringify(result))
				//console.log("聊天时获取到的消息:"+result.data.msg)
				console.log(domain + "/index.php/Api/Msg/getMsg/"+'aid/'+ aid +'/maxMsgid/'+maxMsgid +'/minMsgid/'+minMsgid +'/uid/'+uid+'/to/'+to)
				//console.log(result.base.timestamp)
				if(maxMsgid == 0){ 
					setTimeout(function(){
						maxMsgid = parseInt($("#msg-list .msg-item:last").attr("data-id"))||0
						getData(aid,to,maxMsgid,0)
						console.log("maxMsgid=0触发"+maxMsgid)
					},3000)
				}else if (minMsgid == 0 ) {
					setTimeout(function(){
						console.log("minMsgid=0触发")
						maxMsgid = parseInt($("#msg-list .msg-item:last").attr("data-id"))||0
						getData(aid,to, maxMsgid, 0)
					},200)
				}
				var con_a='';
				if(result.status == 0){
					for( var i in result.data){
						if($("#chat_"+result.data[i].chatid).length == 0){
							var face = result.data[i].face
							var job=company=''
							if(parseInt(uid) == parseInt(result.data[i].from)){
								uname = "Me"
								sender = 'msg-item-self'
								face_class = "msg-user"
							}else{
								uname = result.data[i].uname
								sender = ''
								face_class = "msg-other"
								if(result.data[i].job.length > 0){
									job = " ("+result.data[i].job+")"
								} 
								if(result.data[i].company.length > 0){
									company = "<br>"+result.data[i].company
								}
							}
							var con_new = '<li class="msg-item '+sender+'" msg-type="text" data-id="'+result.data[i].chatid+'" id="chat_'+result.data[i].chatid+'">'
								+'<img class="'+face_class+' goBio" src="'+ domain + result.data[i].face+'" data-uid="'+result.data[i].from+'" alt="" />'
									+'<div class="msg-content" style="">'
										+'<div class="msg-content-inner">' 
										+'<div class="chat-infor" style="white-space: nowrap; overflow: inherit; position: relative;">'
										+'		<span class="infor" style="margin-right: 120px;">'+uname+job+company+'</span>'
										+'		<span class="time" style="height: 20px; position: absolute; top: 0; right: -5px;">'
										+'			<b class="iconfont icon-101"></b>'+transformTime(result.data[i].addtime)+''
										+'		</span>'
										+'	</div>'
										+'	<p class="chat-word">'
										+'		'+result.data[i].msg+''
										+'	</p>'
										
										+'</div>'
									+'</div>'
								+'<div class="mui-item-clear"></div>'
								+'</li>'
								con_a += con_new;
						}
					};
					if(minMsgid>0){
						$("#msg-list").prepend(con_a);
					}else{
						$("#msg-list").append(con_a);
						//mui('#pullrefresh').pullRefresh().refresh();
						//mui('#pullrefresh').pullRefresh().scrollToBottom();
						  //mui('#pullrefresh').pullRefresh().scrollTo(0,scrTop,100) 
						//forBottom
					}
					if(minMsgid == 0 ){
						var ii= 0
						var ii_int = setInterval(function(){
							++ii;
							if(ii > 10){
								clearInterval(ii_int)
							}
							forBottom
						},100)
					}
				}
				console.log($("#pullrefresh").html())
				if(minMsgid > 0 && result.status == 1){
					mui.toast('no more than message')
				}
				
				forBottom
				//mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
			},
			error: function(xhr, type, errorThrown) {
				console.log("请求错误时:再次请求")
				console.log(domain + "/index.php/Api/Msg/getMsg/"+'aid/'+ aid +'/maxMsgid/'+maxMsgid +'/minMsgid/'+minMsgid +'/uid/'+uid+'/to/'+to)
				if( minMsgid == 0 ){
					setTimeout(function(){
						maxMsgid = parseInt($("#msg-list .msg-item:last").attr("data-id"))||0
						getData(aid,to, maxMsgid, 0)
					},3000)
				}else{
					console.log("当前时间:"+new Date())
				}
				forBottom
			}
		}); 
	};
	function transformTime(timeTemp) {
		var time = new Date(timeTemp * 1000);
		return((time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + (time.getMinutes().toString().length == 1 ? "0" + time.getMinutes() : time.getMinutes()));
	};


	plus.webview.currentWebview().setStyle({
		softinputMode: "adjustResize",
		scrollIndicator: 'none'
	});
	
	var showKeyboard = function() {
		if($.os.ios) {
			var webView = plus.webview.currentWebview().nativeInstanceObject();
			webView.plusCallMethod({
				"setKeyboardDisplayRequiresUserAction": false
			});
		} else {
			var Context = plus.android.importClass("android.content.Context");
			var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
			var main = plus.android.runtimeMainActivity();
			var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
			imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
			imm.showSoftInput(main.getWindow().getDecorView(), InputMethodManager.SHOW_IMPLICIT);
		}
	};

	
});
function forBottom() {
	//document.querySelector("#pullrefresh").scrollTop = document.querySelector("#msg-list").offsetHeight;
	mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
};