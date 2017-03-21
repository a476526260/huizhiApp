mui.init();
mui.plusReady(function() {
	var targetPage = mui.preload({
		url: "me-myevent.html",
		id: "me-myevent",
		styles: {
			top: "0px",
			bottom: "50px",
		}
	});

	var index=mui.preload({
		url: "indexbody.html",
		id: "indexbody",
		styles: {
			top: "0px",
			bottom: "50px",
		}
	});
	var list = mui.preload({
		url:"list.html",
		id: "list",
		styles: {
			top: "0px",
			bottom: "50px",
		}
	});
	//登陆点击
	document.getElementById("email").value = localStorage.getItem("email")
	var btn = document.getElementById("submit");
	var email = document.getElementById("email");
	var passwords = document.getElementById("password");
	var launch=plus.webview.getLaunchWebview(); //获取启动页
	btn.addEventListener("tap", function() {
		if(email.value == "" || !(Ereg.test(email.value))) {
			$(".error-tip").eq(0).show();
			return false;
		};

		if(passwords.value == "") {
			$(".error-tip").eq(1).show();
			return false;
		};

		mui.ajax(domain+"/index.php/Api/api/login", {
			data: {
				email: email.value,
				password: passwords.value
			},
			dataType: 'json',
			type: 'POST',
			timeout: 5000,
			success: function(result) {
				console.log(JSON.stringify(result))
				if(result.status == 0) {
					//mui.toast("Signin success!");
					localStorage.setItem("TOKEN_LOGIN",result.data.token);
					localStorage.setItem("TOKEN_UID",result.data.id);
					localStorage.setItem("TIMESTAMP",result.data.timestamp);
					localStorage.setItem("USER_INFO",JSON.stringify(result.data));
					localStorage.setItem("userFace",result.data.face||"/images/photo.png");
					localStorage.setItem("photo",result.data.face||"/images/photo.png");


//
//
//					localStorage.setItem("userEmail",email.value);
//					localStorage.setItem("userId",result.data.id);
//					localStorage.setItem("token",result.data.token);
//					localStorage.setItem("TOKEN_LOGIN",result.data.token);
//					localStorage.setItem("TOKEN_UID",result.data.id);
//					localStorage.setItem("stime",Date.parse(new Date())/1000);
					mui.fire(launch,"showindex",{});
					mui.fire(targetPage,"loadData",{"userId":result.data.id});
					mui.fire(index,"reload",{})
					mui.fire(list,"reloadData",{})
				}else{
					mui.toast(result.msg);
				}
			},
			error: function(xhr, type, errorThrown) {
				mui.toast(type)

			}
		});
		return false;
	});

	//关闭错误提示
	mui("body").on("tap", ".mui-input-row .error-tip i", function() {
		$(this).closest(".error-tip").hide();
	});

	//忘记密码
	var forgot = document.getElementById("forgot");
	forgot.addEventListener("tap", function() {
		mui.openWindow({
			"url": "resetPassword.html",
			"id": "resetPassword",
			show: {
				autoShow: true,
				aniShow: "fade-in", //页面显示动画，默认为”slide-in-right“；
			},
		});
	});

	//点击注册
	var register = document.getElementById("register");
	register.addEventListener("tap", function() {
		mui.openWindow({
			"url": "register.html",
			"id": "register",
			show: {
				autoShow: true,
				aniShow: "fade-in", //页面显示动画，默认为”slide-in-right“；
			}
		});
	});

	//监听注册完成事件
	window.addEventListener("registerOk", function(event) {
		setTimeout(function(){
			$("#email").val(event.detail.email);
			$("#password").val(event.detail.pwd);
		},1000)

	})

})