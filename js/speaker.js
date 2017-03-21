mui.init({swipeBack: true});
mui.plusReady(function(){

	var curWindow = plus.webview.currentWebview();
		$('.mui-scroll-wrapper').scroll({
			indicators: true //是否显示滚动条
		});
		var aid=curWindow.aid,userid=localStorage.getItem("TOKEN_UID");
		var id=curWindow.speakerId;
		document.getElementById("bname").innerText = curWindow.bname||""
		var Nname = 'Speaker'
		//document.getElementById("mui-title").innerHTML = Nname 
		var bname2 = curWindow.bname2||""
		switch(bname2){
			case '0':
				var bname2_t = "Speaker"
			break;
			case "1":
				var bname2_t = "Delegates"
			break;
			case "2":
				var bname2_t = "Attendees"
			break;
		}
		if(userid == id){
			document.getElementById("send").style.display = 'none'
		}
		var progressbar1 = mui('#dp');
		mui.ajax(domain + "/index.php/Api/api/speaker/", {
			data: {
				key: key,
				ver: ver,
				token:localStorage.getItem("TOKEN_LOGIN"),
				uid:localStorage.getItem("TOKEN_UID"),
				aid: aid,
				userid:id
			},
			dataType: 'json',
			type: 'get',
			success: function(result) {
				var htmlList = "";
				if(!result.data){
					return
				}else{
					/*document.getElementById("face").src=result.base.domain+(result.data.face.length<30?"/Uploads/Face/":"")+result.data.face*/
					//console.log("演讲者信息:"+JSON.stringify(result))
					if(result.data.face){
						//document.getElementById("face").src=result.base.domain+(result.data.face.length<30?"/Uploads/Face/":"")+result.data.face
					document.getElementById("face").style.background = ("url("+(domain+(result.data.face.length<30?"/Uploads/Face/":"")+result.data.face)+") 100%")
					}else{
						document.getElementById("face").src=result.base.domain+'/face_full.png'
					}

					document.getElementById("uname").innerHTML=result.data.uname
					document.getElementById("job").innerHTML=result.data.pos
					document.getElementById("title").innerHTML=result.data.title
					document.getElementById("title").setAttribute("data-file",result.data.file)
					document.getElementById("title").setAttribute("data-id",result.data.fileid)
					switch(result.data.sex){
						case "1":
							document.getElementById("sex").innerHTML=',♂'
						break;
						case "2":
							document.getElementById("sex").innerHTML=',♀'
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
		document.getElementById("title").addEventListener("tap",function(){
			//快速打开演讲者的材料
			//mui.alert(document.getElementById("title").getAttribute("data-file"))
			var _this = this
			var file = _this.getAttribute("data-file"),file_id = _this.getAttribute("data-id")
			if ( plus.os.name != "iOS" ) {
				mui.openWindow({
					id:'getPdf',
					//url:domain + "/pdf/web/viewer.html?name="+file,
					url:"getPdf.html",
					show: {
						aniShow: "fade-in",
					},
					styles:{
						top:"0px",
						bottom:"50px"
					},waiting: {
						autoShow: true,
						title: "Loading..."
					},
					extras:{
						bname:"Material",
						url:domain + "/pdf/web/viewer.html?name="+file
						//keywords:search.value
					}
				});
				return false;
			}
			if(localStorage.getItem("downFile_"+file_id) !=null){
				 	plus.runtime.openFile(localStorage.getItem("downFile_"+file_id))
				return false;
			}
			if (_this.getAttribute("data-file").length>10) {
				document.getElementById("downMask").style.display = 'block'
				document.getElementById("dp").style.display = 'block'
			    mui(progressbar1).progressbar().setProgress(0);
				
	//			plus.downloader.createDownload(domain + _this.getAttribute("data-file"),{"description": "管理下载任务"},function(d,status){
	//				//console.log(JSON.stringify(d)+status)
	//			})
				dtask = plus.downloader.createDownload( domain + _this.getAttribute("data-file"), {}, function ( d, status ) {
					
			        // 下载完成
			        if ( status == 200 ) {
			        	localStorage.setItem("downFile_"+file_id,d.filename)
			        	clearInterval(timerDown)
			        	document.getElementById("dp").style.display = 'none'
			        	document.getElementById("downMask").style.display = 'none'
			        	mui(progressbar1).progressbar().setProgress(100);
			            if ( plus.os.name == "iOS" ) {
			            	plus.runtime.openFile(localStorage.getItem("downFile_"+file_id))
			            	//console.log("downFile_"+file_id+d.filename)
						}
			        } else {
			            mui.alert( "Download failed: " + status );
			        }
			    });
			    timerDown = setInterval(function(){
			    	console.log(dtask.totalSize+"/"+dtask.downloadedSize)
			    	mui(progressbar1).progressbar().setProgress(dtask.downloadedSize/dtask.totalSize*100);
			    },50)
			    dtask.start();
			    return false;
				
				
				
				//plus.runtime.openURL(domain + this.getAttribute("data-file"));
	
			}else{
				mui.toast('no file!')
			}
		})

		document.getElementById("send").addEventListener("tap",function(){
			var _this=this;
			if(userid == id){
				return false;
			}
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
					bname:"Speaker", 
					muiTitle:document.getElementById("uname").innerText,
					'from':userid,
					to:id,
				},
			})
		});

});