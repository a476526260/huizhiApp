mui.init({swipeBack: true});
mui.plusReady(function(){
	var curWindow = plus.webview.currentWebview();
	$('.mui-scroll-wrapper').scroll({
		indicators: true //是否显示滚动条
	});
	document.getElementById("bname").innerText = curWindow.bname
	var userid=localStorage.getItem("TOKEN_UID");
	mui.ajax(domain+"/index.php/Api/Api/aboutUs/", {
		data: {
			key: '',
			ver: ver
		},
		dataType: 'json',
		type: 'post',
		success: function(result) {
			if(!result.data && result.data  != null){
				return
			}else{
				console.log(result.data.weblogo)
				document.getElementById("logo").src=domain+result.data.weblogo
				document.getElementById("contact").innerHTML=result.data.aboutus
			};
		},
		error:function(xhr, type, errorThrown){
			console.log(type);
		}
	});
})