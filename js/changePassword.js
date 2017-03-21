mui.init({swipeBack: true});
mui.plusReady(function(){
	var targetPage = mui.preload({
				url: "me-myevent.html",
				id: "me-myevent",
				styles: {
					top: "0px",
					bottom: "50px",
				}
			});
	var curWindow = plus.webview.currentWebview();
	$('.mui-scroll-wrapper').scroll({
		indicators: true //是否显示滚动条
	});
	document.getElementById("bname").innerText = curWindow.bname
	var userid=localStorage.getItem("TOKEN_UID");
	mui.ajax(domain+"/index.php/Api/Api/getface/", {
		data: {
			key: key,
			ver: ver,
			token:localStorage.getItem("TOKEN_LOGIN"),
			uid:localStorage.getItem("TOKEN_UID"),
		},
		dataType: 'json',
		type: 'post',
		success: function(result) {
			//console.log("获取的头像信息:"+JSON.stringify(result))
			document.getElementById("logo").style.backgroundImage = "url("+(domain + result.data.face)+")";
		},
		error:function(xhr, type, errorThrown){
			console.log(type);
		}
	});
	document.getElementById("sub_bio").addEventListener("tap",function(){
		console.log(document.getElementById("oldPassword").value)
		if(document.getElementById("oldPassword").value.length<6 || document.getElementById("oldPassword").value.length>20){
			mui.alert("Incorrect old password!")
			return false;
		}
		if(document.getElementById("newPassword").value.length<6 || document.getElementById("newPassword").value.length>20){
			mui.alert("new password lenght is error!")
			return false;
		}
		if(document.getElementById("newPassword").value != document.getElementById("rePassword").value){
			mui.alert("Confirm password is different from new password!")
			return false;
		}
		mui.ajax(domain+"/index.php/Api/Api/editPwd/", {
			data: {
				key: key,
				ver: ver,
				token:localStorage.getItem("TOKEN_LOGIN"),
				uid:localStorage.getItem("TOKEN_UID"),
				oldPwd:document.getElementById("oldPassword").value,
				newPwd:document.getElementById("newPassword").value,
				rePwd:document.getElementById("rePassword").value
			},
			dataType: 'json',
			type: 'post',
			success: function(result) {
				console.log(JSON.stringify(result))
				mui.alert(result.msg)
				if(result.status == 0){
					document.getElementById("oldPassword").value=''
					document.getElementById("newPassword").value=''
					document.getElementById("rePassword").value=''
					var launch=plus.webview.getLaunchWebview();
					var ru = JSON.parse(localStorage.getItem("USER_INFO"))
					localStorage.setItem("email",ru.email)
					//localStorage.clear()
				
					localStorage.removeItem("TOKEN_LOGIN")
					localStorage.removeItem("TOKEN_UID")
					localStorage.removeItem("TIMESTAMP")
					localStorage.removeItem("USER_INFO")
					//mui.toast("is sigin out!");
					mui.fire(launch,"exit",{});
					mui.fire(targetPage,"exit",{});
					setTimeout(function(){
						mui.back()
					},500)
				}
			},
			error:function(xhr, type, errorThrown){
				console.log(type);
			}
		});
	})
})