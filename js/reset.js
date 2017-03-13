mui.init();
mui.plusReady(function() {
	var code = document.getElementById("code"); //验证码
	var password = document.getElementById("password1"); //密码
	var conpassword = document.getElementById("password2"); //确认密码
	var sign = document.getElementById("sign");     //登录按钮
	var curWindow=plus.webview.currentWebview();   //获取本窗口对象
	sign.addEventListener("tap", function() {
		if(code.value==""){     //验证码为空或不正确
			$(".error-tip").eq(0).show();
			return false;
		};
		if(password.value==''){
			$(".error-tip").eq(1).show();
			return false;
		};
		if(conpassword.value==''){
			$(".error-tip").eq(2).show();
			return false;
		};


		if(conpassword.value!=password.value){
			$(".error-tip").eq(2).show();
			return false;
		};
		mui.ajax("", {
			data: {

			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				mui.openWindow({
					url: "reset.html",
					id: "reset",
					extras: {
						code: "",
					},
					show: {
						autoShow: true,
						aniShow: "fade-in",
					}
				})
				$(".pop,.pop-content").fadeIn(300);
			},
			error: function(xhr, type, errorThrown) {
				//异常处理；
				mui.toast(type);
			}
		});
	});

	//关闭错误提示
	mui("body").on("tap", ".mui-input-row .error-tip i", function() {
		$(this).closest(".error-tip").hide();
	});


});