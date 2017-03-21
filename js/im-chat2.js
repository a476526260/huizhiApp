var uid,aid,to,pageNum=1
mui.init({
	pullRefresh : {
	    container:"#msg-list",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
	    down : {
	      style:'circle',//必选，下拉刷新样式，目前支持原生5+ ‘circle’ 样式
	      color:'#2BD009', //可选，默认“#2BD009” 下拉刷新控件颜色
	      height:'50px',//可选,默认50px.下拉刷新控件的高度,
	      range:'100px', //可选 默认100px,控件可下拉拖拽的范围
	      offset:'0px', //可选 默认0px,下拉刷新控件的起始位置
	      auto: true,//可选,默认false.首次加载自动上拉刷新一次
	      callback :console.log(12345) //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
	    }
	}
});
mui.plusReady(function() {
	var curWindow = plus.webview.currentWebview();
	//document.getElementById("bname").innerText = curWindow.bname||""
	aid = curWindow.aid;
	to= curWindow.to, uid = localStorage.getItem('TOKEN_UID');
	var muiTitle=curWindow.muiTitle
	//alert(curWindow.muiTitle)
	if(parseInt(to) == parseInt(uid)){
		mui.toast('cannt chat whith self!')
		mui.back(-1)
		return false; 
	}
	if(curWindow.muiTitle && curWindow.muiTitle.length > 15){
		var _uname = curWindow.muiTitle.split(" "),_muiTitle='',k=0
		for(i=0;i<_uname.length;i++){
			_muiTitle = _muiTitle+" " + _uname[i]
			if(++k>=3){
				break; 
			}
		}
		muiTitle = _muiTitle+" " +"..."
	}
	document.getElementById("mui-title").innerText = muiTitle||''
	getData(1);
	setInterval(function(){
		if(aid) {
			//getData(1,1);
		} else {
			//getData(1,1);
		}
	},3000)
})
function getNew(){
	console.log(1234)
//	return ;
//		
//	var  maxId = $("#msg-list .msg-item:last").attr("data-id")
//	console.log($("#msg-list .msg-item:last").attr("data-id"))
//	mui("#msg-list .msg-item").each(function() {
//		if(!this.getAttribute("data-id")) {
//			this.remove()
//		} else {
//			having += ("," + this.getAttribute("data-id"));
//		}
//		mui.ajax(domain + "/index.php/Api/api/getNewmsg", {
//			data: {
//				key: "",
//				ver: ver,
//				uid: uid,
//				minMsgid: minMsgid,
//				maxMsgid: maxMsgid
//			},
//			dataType: 'json',
//			type: 'post',
//			timeout: 1000,
//			success: function(result) {
//					
//			}
//		})
//	})
}
	function getData(page,news) {
		//获取已有的最新消息ID,避免重复获取
		var having = 1;
		console.log(23423)
		mui("#msg-list .msg-item").each(function() {
			if(!this.getAttribute("data-id")) {
				this.remove() 
			} else {
				having += ("," + this.getAttribute("data-id"));
			}
		});
		mui.ajax(domain + "/index.php/Api/api/chat", {
			data: {
				key: "",
				ver: ver,
				from: uid,
				aid: aid,
				to:to,
				having:having,
				pgae:(news?1:(page?page:pageNum))
			},
			dataType: 'json',
			type: 'get',
			timeout: 1000,
			success: function(result) { 
							/*
							 {
		            "uname": "Jocob Zhu",
		            "position": "CEO",
		            "department": "CEO office",
		            "company": "Jocob Column",
		            "face": "593fc6939942a.jpg",
		            "id": "370",
		            "uid": "1166",
		            "msg": "Hi",
		            "addtime": "1497354948",
		            "status": "1",
		            "to": "1048"
		        },
				 * 
				 * */
				console.log(pageNum)
				if(result.data.length>0){
					++pageNum
					for(var i = 0; i < result.data.length; i++) {
						if($("#chat_"+result.data[i].id).length == 0){
							var face = result.data[i].face.length>25?result.data[i].face:("/Uploads/Face/" + result.data[i].face)
							if(uid == result.data[i].uid){
								var uname = "Me"
								var classMe="msg-item-self"
							}else{
								var uname = result.data[i].uname
								var classMe=''
							}
								
							var aa= '<div class="msg-item '+classMe+'" msg-type="text" id="chat_'+result.data[i].id+'" data-id="'+result.data[i].id+'">'+
							'	<img class="msg-user" src="'+(domain + face)+'" alt="">'+
							'	<div class="msg-content" style="">'+
							'		<div class="msg-content-inner">'+
							'			<div class="chat-infor" style="white-space: nowrap; overflow: inherit; position: relative;">'+
							'				<span class="infor" style="margin-right: 120px;">'+uname+'</span>'+
							'				<span class="time" style="height: 20px; position: absolute; top: 0; right: -5px;">'+
							'				<b class="iconfont icon-101"></b>'+transformTime(result.data[i].addtime)+''+
							'				</span>'+
							'			</div>'+
							'			<p class="chat-word">'+result.data[i].msg+result.data[i].id+'</p>'+
							'		</div>'+
							'		<div class="msg-content-arrow"></div>'+
							'	</div>'+
							'	<div class="mui-item-clear"></div>'+
							'</div>'
							if(!news){
								$("#msg-list").prepend(aa)
							}else{
								$("#msg-list").append(aa)
							}
							//console.log("6666"+aa)
						}
					}
					
				}
				console.log(pageNum)
			},
			error: function(xhr, type, errorThrown) {
				console.log("ddd"+errorThrown); 
			}
		});
	}
	function transformTime(timeTemp) {
		var time = new Date(timeTemp * 1000);
		return((time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + (time.getMinutes().toString().length == 1 ? "0" + time.getMinutes() : time.getMinutes()));
	};
