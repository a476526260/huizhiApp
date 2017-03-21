mui.init();
var targetPage = mui.preload({
	url: "me-myevent.html",
	id: "me-myevent",
	styles: {
		top: "0px",
		bottom: "50px",
	}
});
mui.plusReady(function() {
	var signPage = mui.preload({
		url: "signIn.html",
		id: "signIn"
	});
	var thisWindow = plus.webview.currentWebview(),
		phone = thisWindow.phone, //保存手机号
		email = thisWindow.email, //保存邮箱
		password = thisWindow.password, //保存密码
		launch = plus.webview.getLaunchWebview(),
		lNameTxt = document.getElementById("lname"),
		fNameTxt = document.getElementById("fname"),
		titleTxt = document.getElementById("title"),
		companyTxt = document.getElementById("company");
	var submit = document.getElementById("submit");

	submit.addEventListener("tap", function(e) {
		mui.ajax(domain + "/index.php/Api/api/register", {
			data: {
				key: "",
				ver: ver,
				industry: "",
				email: email,
				pwd: password,
				company: companyTxt.value,
				position: titleTxt.value,
				department: "",
				telphone: phone,
				uname: lNameTxt.value + fNameTxt.value
			},
			dataType: 'json',
			type: 'POST',
			timeout: 10000,
			success: function(result) {
				if(result.status == 0) {
					//注册成功
					mui.toast("Register successfully");
					/*
					 'status'       => 0,
                 'industry'     => $industry,
                 'email'        => $email,
                 'pwd'          => md5($pwd),
                 'company'      => $company,
                 'position'     => $position,
                 'department'   => $department,
                 'telphone'     => $telphone,
                 'uname'        => $uname,
                 'regtime'      => time(),
                 'face'         => $face,
				 'sex'         => 1
				 
				 
				 'token'         => $token,
				 'id'         => $fid,
				 'face'         => timestamp,
				 'face'         => face,
				 'face'         => $face,
				 'face'         => $face,
				 :
				 
					 * */
					localStorage.setItem("TOKEN_LOGIN",result.data.token);
					localStorage.setItem("TOKEN_UID",result.data.id);
					localStorage.setItem("TIMESTAMP",result.data.timestamp);
					localStorage.setItem("USER_INFO",JSON.stringify(result.data));
					localStorage.setItem("userFace",result.data.face||"/images/photo.png");
					
					console.log(JSON.stringify(result))
					localStorage.setItem("TOKEN_UID", result.data.id);

					mui.fire(signPage, "registerOk", {
						email: thisWindow.email,
						pwd: thisWindow.password
					});

					//一秒后关闭本页面
					setTimeout(function() {
						plus.webview.close(thisWindow)
					}, 1000);

					mui.fire(launch, "showindex", {});
					mui.fire(targetPage, "loadData", {
						"userId": result.data.id
					});
				} else {
					mui.toast(result.msg);
				}
			},
			error: function(xhr, type, errorThrown) {
				console.log(type);
			}
		})
	});
	var server = domain + "/index.php/Api/api/register";
	var files = [];
	//点击添加图片
	mui("body").on("tap", "#uploadImg", function(e) {
		var a = [{
			title: "拍照"
		}, {
			title: "从手机相册选择"
		}];
		plus.nativeUI.actionSheet({
			title: "修改头像",
			cancel: "取消",
			buttons: a
		}, function(b) {
			switch(b.index) {
				case 0:
					break;
				case 1:
					getImage();
					break;
				case 2:
					galleryImg();
					break;
				default:
					break
			}
		})
	});

	function getImage() {
		var c = plus.camera.getCamera();
		c.captureImage(function(e) {
			plus.io.resolveLocalFileSystemURL(e, function(entry) {
				var path = entry.toLocalURL();
				var fname = path.substring(path.lastIndexOf('/') + 1);
				compressImage(path, fname, 'head-img1');
			}, function(e) {
				console.log("读取拍照文件错误：" + e.message);
			});
		}, function(s) {
			console.log("error" + s);
		}, {
			//filename: "_doc/head.jpg"
		})
	}

	function galleryImg() {
		// 从相册中选择图片
		plus.gallery.pick(function(path) {
			var fname = path.substring(path.lastIndexOf('/') + 1);
			compressImage(path);
			upload()
		}, function(e) {
			plus.nativeUI.toast("取消选择图片");
		}, {
			filter: "image"
		});
	};
	//随机字符串
	function randomString(len) {
		len = len || 32;
		var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
		var maxPos = $chars.length;
		var pwd = '';
		for(i = 0; i < len; i++) {
			pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
		}
		return pwd;
	}

	function compressImage(path) {
		var filename = randomString(12) + ".jpg";
		plus.nativeUI.showWaiting();
		plus.zip.compressImage({
			src: path,
			dst: "_doc/" + filename,
			quality: 100,
			overwrite: true,
			width: '150px',
		}, function(i) {
			plus.nativeUI.closeWaiting();
			files.push({
				name: "uploadkey",
				path: i.target
			});
			upload(); //上传图片
		}, function(e) {
			plus.nativeUI.closeWaiting();
			plus.nativeUI.toast("压缩图片失败: " + JSON.stringify(e));
		});
	}
	// 上传文件
	function upload() {
		var wt = plus.nativeUI.showWaiting();
		var task = plus.uploader.createUpload(server, {
				method: "POST"
			},
			function(t, status) { //上传完成
				if(status == 200) {
					mui.toast("upload success！");
					for(var i = 0; i < files.length; i++) {
						var f = files[i];
						document.getElementById('photo').src = f.path;
						plus.io.resolveLocalFileSystemURL(f.path, function(entry) {
							entry.remove(function(e) {
								console.log("删除成功");
							}, function(e) {
								console.log("删除失败");
							});
						});
					}
					files = [];
					wt.close();
				} else {
					mui.toast("upload false：" + status);
					files = [];
					wt.close();
				}

			}
		);
		task.addData("client", "个人信息上传");
		/*task.addData("uid",localStorage.getItem("TOKEN_UID"));*/
		for(var i = 0; i < files.length; i++) {
			var f = files[i];
			task.addFile(f.path, {
				key: f.name
			});
		}
		task.start();
	};

})