mui.init();
mui.plusReady(function(){
	var thisWindow=plus.webview.currentWebview();
	var phone=thisWindow.phone;    //保存手机号
	var email=thisWindow.email;    //保存邮箱
	var password=thisWindow.password;    //保存密码

	var lNameTxt=document.getElementById("lname");
	var fNameTxt=document.getElementById("fname");
	var titleTxt=document.getElementById("title");
	var companyTxt=document.getElementById("company");
	var submit=document.getElementById("submit");

	submit.addEventListener("tap",function(){
		mui.ajax("http://z.cqboy.com/index.php/Api/api/register",{
			data:{
				key:"",
				ver:ver,
				industry:"",
				email:email,
				pwd:password,
				company:companyTxt.value,
				position:"",
				department:"",
				telphone:phone,
				uname:lNameTxt.value+fNameTxt.value
			},
			dataType: 'json',
			type: 'POST',
			timeout: 10000,
			success: function(result) {

				if(result.status==0){
					//注册成功
					mui.toast("注册成功");
					localStorage.setItem("userEmail",email);
					localStorage.setItem("userId",result.data.id);

					mui.openWindow({
						url:"signIn.html",
						id:"signIn",
						extras: {
							email: email,
							password: password,
						},
					});

					//一秒后关闭本页面
					setTimeout(function() {
						plus.webview.close(thisWindow)
					}, 1000);
				}else{
					mui.toast(result.msg);
				}
			},
			error: function(xhr, type, errorThrown) {
				console.log(type);
			}
		})
	});




})


