var curWindow = plus.webview.currentWebview();
var aid = curWindow.aid,
	page = 0,
	to, uid = localStorage.getItem('TOKEN_UID')
var server = domain + "/index.php/Api/api/chatPic",
	files = []
mui.init({
	pullRefresh: {
		container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
		down: {
			height: 50, //可选,默认50.触发下拉刷新拖动距离,
			auto: false, //可选,默认false.自动下拉刷新一次
			contentdown: "drop down refresh", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
			contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
			contentrefresh: "Loading...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
			callback: getnewchat //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
		}
	}
});

var takePhoto = document.getElementById("takePhoto");
var messageText = document.getElementById("messageText");
var sendMessage = document.getElementById("sendMessage");
mui.plusReady(function() {
	document.getElementById("bname").innerText = curWindow.bname||""
	//setTimeout(getnewchat,2000)
	sendMessage.addEventListener("tap", function() {
		//发送消息
		if(messageText.value.length < 1) {
			mui.toast('Need message input');
			return false;
		}
		//{"status":0,"msg":"","base":{"ver":"201702151","date":"20170331","domain":"http://z.cqboy.com"},"ext":[],"data":{"from":12,"to":0,"msg":"子承ccbbdeee","addtime":1490938413,"status":0,"aid":2,"chatid":55}}

		mui.ajax(domain + "/index.php/Api/api/sendMsg", {
			data: {
				uid: uid,
				aid: aid,
				to: to || 0,
				msg: messageText.value
			},
			dataType: 'json',
			type: 'post',
			timeout: 1000,
			success: function(result) {
				console.log(JSON.stringify(result))
//				"data":{
//      "from":1164,
//      "to":0,
//      "msg":"vghjjkkkk",
//      "addtime":1501225924,
//      "status":1,
//      "aid":29,
//      "chatid":488
//  }
				document.getElementById("chatBox").innerHTML += '<li class="mui-table-view-cell myself "><div class="chat-content"><div class="chat-infor"><span class="infor"><b>Me</b><b></b></span><span class="time"><b class="iconfont icon-101"></b>' + transformTime(result.data.addtime) + '</span></div><p class="chat-word">' + result.data.msg + '</p></div><span class="user-photo"><img src="' + ((result.data.face)?(result.data.face):(localStorage.getItem("face"))) + '"/></span> </li>';

			},
			error: function(xhr, type, errorThrown) {
				console.log(JSON.stringify(xhr)+type+errorThrown);
			}
		});
	});
	takePhoto.addEventListener("tap", function() {
		var btnArray = [{ title: "Camera" }, { title: "photo Album" }]; //选择按钮  1 2 3
		plus.nativeUI.actionSheet({
				title: "",
				cancel: "cancel", // 0
				buttons: btnArray
			},
			function(e) {
				var index = e.index; //
				switch(index) {
					case 1:
						//Camera
						var cmr = plus.camera.getCamera();
						cmr.captureImage(function(p) {
							//成功
							plus.io.resolveLocalFileSystemURL(p, function(entry) {
								var img_name = entry.name; //获得图片名称
								var img_path = entry.toLocalURL(); //获得图片路径
								//alert(img_path)
								files = [img_path]; //图片存放的数组 可以上传一个，或者多个图片
								upload_img(img_path);
							}, function(e) {
								console.log("读取拍照文件错误：" + e.message);
							});
						}, function(e) {
							console.log("失败：" + e.message);
						}, { filename: '_doc/camera/', index: 1 }); //  “_doc/camera/“  为保存文件名

						break;
					case 2:
						//打开相册（这里之前很多小伙伴问我，为什么打不开，因为我用的是H5+的方式，不适用于纯web页面）
						plus.gallery.pick(
							function(path) {
								takePhoto.src = path; //设置img的路径

								//把图片base64编码  注意：这里必须在onload事件里执行！这给我坑的不轻
								takePhoto.onload = function() {
									var data = getBase64Image(takePhoto); //base64编码
									var newImgbase = data.split(",")[1]; //通过逗号分割到新的编码
									imgArray.push(newImgbase); //放到imgArray数组里面
									takePhoto.off('load'); //关闭加载
								}
							},
							function(e) {
								mui.toast('Selection cancelled');
							});
						break;
				}
			});
	})

})

function getnewchat() {
	//获取留言记录,触发
	mui.ajax(domain + "/index.php/Api/api/chat", {
		data: {
			key: "",
			ver: ver,
			aid: aid,
			from: uid,
			page: ++page,
			pagenum: 2,
		},
		dataType: 'json',
		type: 'get',
		timeout: 1000,
		success: function(result) {
			console.log(result)
			var chatList = "";
			if(!result.data) {
				mui.toast('No more message444!')
				return
			} else {
				for(var i = 0; i < result.data.length; i++) {
					chatList = '<li class="mui-table-view-cell ' + (result.data[i].from == uid ? "myself" : "other-people") + ' "><div class="chat-content"><div class="chat-infor"><span class="infor"><b>' + result.data[i].uname + '</b><b>' + result.data[i].department + '</b><b>' + result.data[i].company + '</b><b>LTD</b></span><span class="time"><b class="iconfont icon-101"></b>' + transformTime(result.data[i].addtime) + '</span></div><p class="chat-word">' + result.data[i].msg + '</p></div><span class="user-photo"><img src="' + result.data[i].face + '"/></span> </li>' + chatList;
				}
			};
			document.getElementById("muilist").innerHTML +=chatList
			//$(".chatBox").append(chatList);
		},
		error: function(xhr, type, errorThrown) {
			mui.toast(type);
		}
	})
	mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
}

function transformTime(timeTemp) {
	return(new Date(timeTemp * 1000).getUTCHours() + ":" + new Date(timeTemp * 1000).getUTCMinutes());
};

//上传图片
function upload_img(p) {
	//单个上传,如果一次上传多个，就不要在写这一行
	files = [];
	var n = p.substr(p.lastIndexOf('\/') + 1);
	files.push({ name: "uploadkey", path: p });
	//开始上传
	start_upload();

}
//开始上传
function start_upload() {
	if(files.length <= 0) {
		plus.nativeUI.alert("没有添加上传文件！");
		return;
	}
	//原生的转圈等待框
	var wt = plus.nativeUI.showWaiting();
	//console.log(server);
	var task = plus.uploader.createUpload(server, { method: "POST" },
		function(result, status) { //上传完成
			//console.log(result);
			//alert(status);
			if(status == 200) {

				//资源
				// var responseText = result.responseText;

				//转换成json
				//var json = eval('(' + result + ')');
				//上传文件的信息
				//var files = json.files;

				//上传成功以后的保存路径
				//var img_url = files.uploadkey.url;

				//ajax 写入数据库

				//关闭转圈等待框
				wt.close();
			} else {
				console.log("上传失败：" + status);
				//关闭原生的转圈等待框
				wt.close();
			}
		});

	task.addData("client", "");
	task.addData("uid", getUid());
	for(var i = 0; i < files.length; i++) {
		var f = files[i];
		task.addFile(f.path, { key: f.name });
	}
	task.start();

}

// 产生一个随机数
function getUid() {
	return Math.floor(Math.random() * 100000000 + 10000000).toString();
}