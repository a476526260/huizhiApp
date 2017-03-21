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
	var email_status = 0
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
	var mobr =  /^[0-9-]{7,18}$/; 
	phone.onblur = function(){
		if(!mobr.test(phone.value)) {
			mui.toast("Incorrect phone number format");
			return;
		};
	}
	email.addEventListener("input",function(){
        if(!Ereg.test(email.value)) { 
			//mui.toast("email error");
			return;
		}else{
	        mui.ajax(domain + "/index.php/Api/api/isRegister",{
				data:{
					key:"",
					ver:ver,
					email:email.value,
					
				},
				dataType: 'json',
				type: 'POST',
				timeout: 2000,
				success: function(result) {
					mui.toast(result.msg) 
					if(result.status==0){
						email_status=1
					}else{
						email_status=0
					};
	
	
				},
				error: function(xhr, type, errorThrown) {
					console.log(type);
				}
			})
		}
		
	})
	email.onblur = function() {
        if(!Ereg.test(email.value)) { 
			mui.toast("Incorrect email format");
			return;
		}
    }
	registerBtn.addEventListener("tap",function(e){
		if(phone.value == "") {
			mui.toast("Incorrect phone number format");
			return;
		};
		if(!mobr.test(phone.value)) {
			mui.toast("Incorrect phone number format");
			return;
		};
		if(email.value == "") {
			mui.toast("Incorrect email format");
			return;
		} else if(!Ereg.test(email.value)) {
			mui.toast("Incorrect email format");
			return;
		}else if(email_status == 0){
			mui.toast("Email is already exist!");
			return;
		}

		if(password.value == "") {
			mui.toast("Incorrect phone number format");
			return;
		};

		if(passwordCon.value != password.value) {
			mui.toast("Please confirm your password");
			return;
		};
		registerPost(e.target)
	})


 
	nextBtn.addEventListener("tap", function(e) {
		if(phone.value == "") {
			mui.toast("Incorrect phone number format");
			return;
		};
		if(!mobr.test(phone.value)) {
			mui.toast("Incorrect phone number format");
			return;
		};
		if(email.value == "") {
			mui.toast("Email cannot be empty");
			return;
		} else if(!Ereg.test(email.value)) {
			mui.toast("Incorrect email format");
			return;
		};

		if(password.value == "") {
			mui.toast("Please input password 6-16 characters");
			return;
		};

		if(passwordCon.value != password.value) {
			mui.toast("Please confirm your password");
			return;
		};
		
		if(email_status == 0){
			mui.toast("Email is already exist!");
			return;
		}
		//registerPost(e.target)
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

	function registerPost(obj){
		mui.ajax(domain + "/index.php/Api/api/register",{
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
					localStorage.setItem("TOKEN_LOGIN",result.data.token);
					localStorage.setItem("TOKEN_UID",result.data.id);
					localStorage.setItem("TIMESTAMP",result.data.timestamp);

					if(obj!=nextBtn){
						mui.toast("Register successfully");
						//一秒后关闭本页面
						setTimeout(function() {
							plus.webview.close(curWindow)
						}, 1000);
						mui.fire(launch,"showindex",{});
						mui.fire(targetPage,"loadData",{"userId":result.data.id});
						mui.fire(signPage,"registerOk",{
							email:email.value,
							pwd:passwordCon.value
						});
					}

				}else{
					mui.toast(result.msg);
				};


			},
			error: function(xhr, type, errorThrown) {
				console.log(type);
			}
		})
	}


});



