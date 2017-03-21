mui.init({swipeBack: true});
mui.plusReady(function(){

	var curWindow = plus.webview.currentWebview();
		$('.mui-scroll-wrapper').scroll({
			indicators: true //是否显示滚动条
		});
		var id=curWindow.speakerId;
		document.getElementById("bname").innerText = curWindow.bname||""
		var bname2_t = bname2 = curWindow.bname2||""
		var Nname = bname2_t
		//document.getElementById("mui-title").innerHTML = bname2_t
		//alert(bname2_t+'ccd')
		
		if(localStorage.getItem("TOKEN_UID") == id){
			document.getElementById("send").style.display = 'none'
		}
		mui.ajax(domain + "/index.php/Api/api/networkingBio/", {
			data: {
				key: key,
				ver: ver,
				token:localStorage.getItem("TOKEN_LOGIN"),
				uid:localStorage.getItem("TOKEN_UID"),
				userid:id
			},
			dataType: 'json',
			type: 'get',
			success: function(result) {
				var htmlList = "";
				console.log(JSON.stringify(result))
				if(!result.data){
					return
				}else{
					//document.getElementById("face").src=domain+(result.data.face.length<30?"/Uploads/Face/":"")+result.data.face
					document.getElementById("face").style.background = "url("+(domain+(result.data.face.length<30?"/Uploads/Face/":"")+result.data.face)+") 100%"
					document.getElementById("uname").innerHTML=result.data.uname 
					//document.getElementById("job").innerHTML=(result.data.department?(result.data.pos):"");
					//document.getElementById("title").innerHTML=
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
					document.getElementById("title1").innerHTML=(result.data.pos?(result.data.pos):"");
					document.getElementById("title2").innerHTML=result.data.company
					document.getElementById("content").innerHTML=result.data.contact
					//document.getElementById("position").innerHTML=result.data.position

					//显示简历
					var con='',vv;
					for (pp in result.data.exp) {
						document.getElementById("infor-part").style.display = 'block'
						vv=result.data.exp[pp]
						con+="<li class=\'mui-table-view-cell mui-media \'><img class=\'mui-media-object mui-pull-left\' src=\'images/cv-icon.jpg\'><div class=\'mui-media-body\'><h6>"+vv['department']+":"+vv['pos']+"</h6><p `class=\'mui-ellipsis\'>"+vv['company']+"</p></div></li>"
					}
					//console.log(con)
					document.getElementById("exp").innerHTML=con

				};
			},
			error:function(xhr, type, errorThrown){
				console.log(type);
			}
		});
		//alert(bname2_t+"bcd") 
		document.getElementById("send").addEventListener("tap",function(){
			var _this=this;
			plus.webview.close("im-chat")
			mui.openWindow({
				url:"im-chat.html",
				id:"im-chat",
				styles:{
					top:"0px",
					bottom:"50px",
				},
				show:{
					aniShow:"fade-in",
				},
				extras:{
					bname:bname2_t+"",
					muiTitle:document.getElementById("uname").innerText,
					'from':localStorage.getItem("TOKEN_UID"),
					to:id,
				},
			})
		});

});