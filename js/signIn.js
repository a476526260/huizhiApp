mui.init();

mui.plusReady(function() {
	//登陆点击
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

		mui.ajax("http://z.cqboy.com/index.php/Api/api/login", {
			data: {
				email: email.value,
				password: passwords.value
			},
			dataType: 'json',
			type: 'POST',
			timeout: 10000,
			success: function(result) {
				if(result.status == 0) {
					mui.toast("登陆成功");
					localStorage.setItem("userEmail",email.value);
					localStorage.setItem("userId",result.data.id);
					mui.fire(launch,"showindex",{});
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
		console.log(event.detail.email+"---"+event.detail.pwd);
		setTimeout(function(){
			$("#email").val(event.detail.email);
			$("#password").val(event.detail.pwd);
		},1000)

	})

})