mui.init({swipeBack: false});
//mui.plusReady(function(){

	//var curWindow = 12//plus.webview.currentWebview();
		$('.mui-scroll-wrapper').scroll({
			indicators: true //是否显示滚动条
		});
		var aid=5,userid=12
		//http://z.cqboy.com/index.php/Api/api/speaker/aid/5/userid/12
		mui.ajax("http://z.cqboy.com/index.php/Api/api/speaker/", {
			data: {
				key: '',
				ver: ver,
				aid: aid,
				userid:userid
			},
			dataType: 'json',
			type: 'get',
			success: function(result) {
				var htmlList = "";
				if(!result.data){
					return
				}else{
					document.getElementById("face").src=result.base.domain+""+result.data.face
					document.getElementById("uname").innerHTML=result.data.uname
					document.getElementById("job").innerHTML=result.data.pos
					document.getElementById("title").innerHTML=result.data.title
					switch(result.data.sex){
						case "1":
							document.getElementById("sex").innerHTML='♂'
						break;
						case "2":
							document.getElementById("sex").innerHTML='♀'
						break;
						default:
							document.getElementById("sex").innerHTML=''
						break;
					}
					document.getElementById("company").innerHTML=result.data.company
					document.getElementById("content").innerHTML=result.data.content
				};
			},
			error:function(xhr, type, errorThrown){
				console.log(type);
			}
		});
	
//});