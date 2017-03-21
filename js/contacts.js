mui.init({
	swipeBack: true
});
var page=1
mui.plusReady(function() {
	var having = 1;
	var logined = localStorage.getItem("TOKEN_UID");

	var currentWindow = plus.webview.currentWebview();
	if(currentWindow.bname != undefined && currentWindow.bname == "Me") {
		//	alert(JSON.stringify(currentWindow))
		document.getElementById("bname").style.display = 'block'
		document.getElementById("bname").innerText = currentWindow.bname
	}
	$(function() {
		var style_list = ["block-style", "list-style"],
			style_i = true
		$(".sort-way").on("tap", "span", function() {
			$(this).hide().siblings().show()
			style_i = !style_i
			$(".mui-table-view").addClass(style_list[Number(style_i)]).removeClass(style_list[Number(!style_i)]);
		})

	});

	if(logined) {
		loadData();
	} else {
		document.getElementById("lists").innerHTML = "";
	};

	mui("body").on("tap", ".chat", function() {
		var _this = this;
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
				bname:"my contact", 
				muiTitle:_this.getAttribute("data-uname"),
				from: localStorage.getItem("TOKEN_UID"),
				to: _this.getAttribute("data-userId"),
			},
		})
	});
	//查看当前人的资料
	var speakerId
	mui("body").on("tap",".mui-table-view-cell .mui-media-object",function(){
		var _this=this;

		speakerId=_this.getAttribute("data-userId")
		var ind = _this.getAttribute("data-sp")
		//alert($(".mui-slider-group .mui-active").index())
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
	})
	//监听登录事件
	document.addEventListener("loadData", function() {
		loadData()
	});

	setInterval(function() {
		loadData();
	}, 60000)
	//监听返回到本页事件
	document.addEventListener("reload", function() {
		//获取已有的最新消息ID,避免重复获取
		loadData()
	});
	//监听networking关注变化
	document.addEventListener("changeFav",function(){
		console.log(123456)
		loadData()
	})
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
				console.log(in_k.indexOf(searcha.value.toLowerCase()))
				if ( in_k.indexOf(searcha.value.toLowerCase())>0 ) {
					$(this).show()
				}
				//console.log($(this).text())
			}) 
			//$("#lists li:contains(" + searcha.value + ")").show()
			
						
		} else {
			$("#lists li").show()
		}
	})
	//点击关注,实为 取消关注
	mui("body").on("tap",".heart",function(){
		var _this=this;
		speakerId=_this.getAttribute("data-userId")
		mui.confirm("Are you sure of removing the favorite?","",['Cancel','OK'],function(e){
			if (e.index == 1) {
				mui.ajax(domain + "/index.php/Api/api/favorites",{
					data:{
						key: key,
						ver: ver,
						token:localStorage.getItem("TOKEN_LOGIN"),
						uid:localStorage.getItem("TOKEN_UID"),
						fuid:speakerId
					},
					dataType:"json",
					type:"post",
					success:function(result){
						//mui.toast(result.msg)
						if(result.data.id>0){
							_this.setAttribute("class",'heart cur')
						}else{
							_this.setAttribute("class",'heart')
							//取消关注时,删除当前节点
							if($("#U_"+speakerId).length>0){
								$("#U_"+speakerId).remove()
							}
							var delFav = (localStorage.getItem("delFav")||1)+","+speakerId
							localStorage.setItem("delFav",delFav)
						}
//						var e = JSON.parse( localStorage.getItem("data-"+curWindow.aid) );
//						for (i=0;i<e.data.networking.length;i++) {
//							if(parseInt(e.data.networking[i].userid) == parseInt(speakerId) ){
//								e.data.networking[i].fav = result.data.id?1:0
//							}
//						}
						//localStorage.setItem("data-"+curWindow.aid,JSON.stringify(e))
					}
				})
				
			}
		})
	})

})

function loadData() {
	window.requestAnimationFrame(function() {
		//查找是否有被取消关注的人
		var delFav = localStorage.getItem("delFav")
		if(delFav){
			var delArr=delFav.split(",")
			var _node;
			for(i=0;i<delArr.length;i++){
				console.log("ddddddd"+delArr[i])
				_node = document.getElementById("U_"+delArr[i])
				if(_node){
					_node.parentNode.removeChild(_node)
				}
			}
			localStorage.removeItem("delFav")
		}
		//获取已有的fav userID,避免重复获取
		var having = 1;
		mui(".mui-table-view-cell").each(function() {
			if(!this.getAttribute("data-Id")) {
				this.remove()
			} else {
				having += ("," + this.getAttribute("data-Id"));
			}
		});
		//localStorage.setItem("contact_having", having);

		mui.ajax(domain + "/index.php/Api/api/Myfav", {
			data: {
				key: key,
				ver: ver,
				token: localStorage.getItem("TOKEN_LOGIN"),
				uid: localStorage.getItem("TOKEN_UID"),
				having: having,
				page:page
			},
			dataType: 'json',
			type: 'post',
			success: function(result) {
				console.log(JSON.stringify(result))
				var contactsLists = "";
				if(result.data != null) {
					for(var i = 0; i < result.data.length; i++) {
						//alert(JSON.stringify(result.data))

							if($("#lists li[data-userId=" + result.data[i].uid + "]").length > 0) {
								$("#lists li[data-userId=" + result.data[i].uid + "]").attr({
									"data-msgId": result.data[i].chatid
								})
								$("#lists li[data-userId=" + result.data[i].uid + "] .company").html(result.data[i].contact);
								$("#lists").prepend($("li[data-userId=" + result.data[i].uid + "]"))
							} else { 

								contactsLists += '<li id="U_'+result.data[i].uid+'" class="mui-table-view-cell mui-media" data-userId="'+result.data[i].uid+'" data-Id="' + result.data[i].id + '"><a href="javascript:;"><img data-userId="'+result.data[i].uid+'" class="mui-media-object mui-pull-left" src="'+domain +(result.data[i].face.length<30?"/Uploads/Face/":"")+ result.data[i].face+'"><div class="mui-media-body"><p class="name" >' + result.data[i].uname + '&nbsp;</p><p class="job">' + result.data[i].position + '&nbsp;</p><p class="company">' + result.data[i].company + '</p><span class="chat" data-userId="'+result.data[i].uid+'" data-uname="'+result.data[i].uname+'"></span></div><span class="heart cur" data-userId="'+result.data[i].uid+'"></span></a></li>'

							}
					}
					console.log(contactsLists)
				}
				$("#lists").prepend(contactsLists)


			}
		});
	})
};