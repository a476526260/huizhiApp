mui.init();



mui.plusReady(function() {
	var signPage=mui.preload({
		url:"signIn.html",
		id:"signIn"
	});
	var curWindow = plus.webview.currentWebview();
	var nextBtn = document.getElementById("next")||"";
	var phone = document.getElementById("phone");
	var email = document.getElementById("email");
	var password = document.getElementById("password")
	var passwordCon = document.getElementById("conpassword");
	var registerBtn=document.getElementById("register");
	var launch=plus.webview.getLaunchWebview(); //获取启动页

	registerBtn.addEventListener("tap",function(){
		if(phone.value == "") {
			mui.toast("Phone cannot be empty");
			return;
		};
		if(email.value == "") {
			mui.toast("Email cannot be empty");
			return;
		} else if(!Ereg.test(email.value)) {
			mui.toast("email error");
			return;
		};

		if(password.value == "") {
			mui.toast("Password cannot be empty");
			return;
		};

		if(passwordCon.value != password.value) {
			mui.toast("Please confirm your password");
			return;
		}
		mui.ajax("http://z.cqboy.com/index.php/Api/api/register",{
			data:{
				key:"",
				ver:ver,
				industry:"",
				email:email.value,
				pwd:passwordCon.value,
				company:"",
				position:"",
				department:"",
				telphone:phone.value,
				uname:""
			},
			dataType: 'json',
			type: 'POST',
			timeout: 10000,
			success: function(result) {
				if(result.status==0){
					//注册成功
					mui.toast("注册成功");
					localStorage.setItem("userEmail",email.value);
					localStorage.setItem("userId",result.data.id);
					mui.fire(signPage,"registerOk",{
						email:email.value,
						pwd:passwordCon.value
					});


					//一秒后关闭本页面
					setTimeout(function() {
						plus.webview.close(curWindow)
					}, 1000);
					
					
					mui.fire(launch,"showindex",{});

				}else{
					mui.toast(result.msg);
				};


			},
			error: function(xhr, type, errorThrown) {
				console.log(type);
			}
		})
	})



	nextBtn.addEventListener("tap", function() {
		if(phone.value == "") {
			mui.toast("Phone cannot be empty");
			return;
		};
		if(email.value == "") {
			mui.toast("Email cannot be empty");
			return;
		} else if(!Ereg.test(email.value)) {
			mui.toast("email error");
			return;
		};

		if(password.value == "") {
			mui.toast("Password cannot be empty");
			return;
		};

		if(passwordCon.value != password.value) {
			mui.toast("Please confirm your password");
			return;
		}

		mui.openWindow({
			url: "register_2.html",
			id: "register_2",
			extras: {
				phone: phone.value,
				email: email.value,
				password: passwordCon.value,
			}
		})
		//一秒后关闭本页面
		setTimeout(function() {
			plus.webview.close(curWindow)
		}, 1000);
	})
});



