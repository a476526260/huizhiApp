mui.init();
mui.ajax("http://z.cqboy.com/index.php/Api/api/chat", {
	data: {
		key: "",
		ver: ver,
		aid: 0,
		from: 6,
		page: 1,
		pagenum: 10,
	},
	dataType: 'json',
	type: 'get',
	timeout: 10000,
	success: function(result) {
		console.log(result)
		var chatList = "";
		if(!result.data) {
			return
		} else {
			for(var i = 0; i < result.data.length; i++) {
				if(result.data[i].from == 6) { //自己聊天记录  --待修改
					chatList += '<li class="mui-table-view-cell myself"><div class="chat-content"><div class="chat-infor"><span class="infor"><b>' + result.data[i].uname + '</b><b>' + result.data[i].department + '</b><b>' + result.data[i].company + '</b><b>LTD</b></span><span class="time"><b class="iconfont icon-101"></b>' + transformTime(result.data[i].addtime)+ '</span></div><p class="chat-word">' + result.data[i].msg + '</p></div><span class="user-photo"><img src="' + result.data[i].face + '"/></span> </li>';
				} else {     //他人聊天记录
					chatList += '<li class="mui-table-view-cell other-people"><div class="chat-content"><div class="chat-infor"><span class="infor"><b>' + result.data[i].uname + '</b><b>' + result.data[i].department + '</b><b>' + result.data[i].company + '</b><b>LTD</b></span><span class="time"><b class="iconfont icon-101"></b>' + transformTime(result.data[i].addtime) + '</span></div><p class="chat-word">' + result.data[i].msg + '</p></div><span class="user-photo"><img src="' + result.data[i].face + '"/></span> </li>';
				}
			}
		};
		$(".chatBox").append(chatList);
	},
	error: function(xhr, type, errorThrown) {
		mui.toast(type);
	}
})

function transformTime(timeTemp){
	 return (new Date(timeTemp*1000).getUTCHours()+":"+new Date(timeTemp*1000).getUTCMinutes());
};


var takePhoto = document.getElementById("takePhoto");
var messageText = document.getElementById("messageText");
var sendMessage = document.getElementById("sendMessage");
sendMessage.addEventListener("tap", function() {
	var message = messageText.value;
	//console.log(message);

});

mui.plusReady(function() {

})