mui.init({swipeBack: true});
mui.plusReady(function(){
	var curWindow = plus.webview.currentWebview();
	document.getElementById("bname").innerText = curWindow.bname
	$('.mui-scroll-wrapper').scroll({
		indicators: true //是否显示滚动条
	});
    var item=['sex','email','telphone','position','department','company','uname','face']
   	/*登录*/
   	if ((localStorage.getItem('TOKEN_UID') && localStorage.getItem('TOKEN_LOGIN')) || (Date.parse(new Date())/1000-localStorage.getItem('stime'))<604800) {
   		//已登录

   		mui.ajax(domain+"/index.php/Api/Api/getProfile/", {
			data: {
				key: key,
				ver: ver,
				token:localStorage.getItem("TOKEN_LOGIN"),
				uid:localStorage.getItem("TOKEN_UID"),
			},
			dataType: 'json',
			type: 'post',
			success: function(result) {
				console.log("个人属性:"+JSON.stringify(result))
				if(result.data.logout == 1){
					localStorage.clear();
				}else if(!result.data.id){
					return;
				}else{
					for(pp in item){
						if(item[pp]=='face'){
							document.getElementById(item[pp]).src=result.base.domain+(result.data[item[pp]]);
							//console.log(result.base.domain+'/Uploads/Face/'+(result.data[item[pp]]||""))
						}else{
							document.getElementById(item[pp]).innerHTML=(result.data[item[pp]]||"");
							document.getElementById(item[pp]).title = (result.data[item[pp]]||"");
						}
					}

					switch(result.data.sex){
						case "1":
							document.getElementById("sex").innerHTML='Male ♂'
						break;
						case "2":
							document.getElementById("sex").innerHTML='Female ♀'
						break;
						default:
							document.getElementById("sex").innerHTML='Unknown'
						break;
					}

				};
			},
			error:function(xhr, type, errorThrown){
				console.log(type);
			}
		});
   }
    /*
    点击编辑
    */
	var modify=document.getElementById("modify"),edit=0,sex_click,sexVal//编辑初始状态

	modify.addEventListener("tap",function(){
		if (edit == 0) {
			//转为编辑状态
			edit=1
			sex_click = document.getElementById("sex").getElementsByTagName('input')
			for(pp in item){
				//item=['sex','telphone','email','position','department','company','uname','face']
				switch(item[pp]){
					case "sex":
						//变为单选框
						document.getElementById(item[pp]).innerHTML='<label><input type="radio" name="sex" value="1" id="sex_1" >♂Male</label><label><input type="radio" name="sex" value="2" id="sex_2" >♀   Female</label>'
						document.getElementById("sex_"+document.getElementById(item[pp]).title).checked = true
					break;
					case "email":

					break;
					default:
						document.getElementById(item[pp]).innerHTML = '<input style="" type="text" name="'+item[pp]+'" id="'+item[pp]+'_2" value="'+(document.getElementById(item[pp]).innerText||"")+'" />'
						//document.getElementById(item[pp]).contentEditable = true;
						//document.getElementById(item[pp]).style='border: #ccc 1px solid; outline: none;-webkit-user-select: auto;-webkit-user-select:text';
					break;
				}
			}
			modify.innerHTML='save'
		} else{
			//保存
			var radio = document.getElementsByName("sex");
			for (i=0; i<radio.length; i++) {
				if (radio[i].checked) {
					sexVal=radio[i].value||1
					document.getElementById('sex').title=sexVal
					switch(sexVal){
						case "1":
							document.getElementById("sex").innerHTML='Male ♂'
						break;
						case "2":
							document.getElementById("sex").innerHTML='Female ♀'
						break;
						default:
							document.getElementById("sex").innerHTML='Unknown'
						break;
					}
				}
			};
			mui.ajax(domain + "/index.php/Api/Api/updateMe/", {
				//item=['sex','telphone','email','position','department','company','uname','face']
				data: {
					key: key,
					ver: ver,
					token:localStorage.getItem("TOKEN_LOGIN"),
					uid:localStorage.getItem("TOKEN_UID"),
					telphone:document.getElementById('telphone_2').value,
					position:(document.getElementById('position_2').value),
					department:document.getElementById('department_2').value,
					company:document.getElementById('company_2').value,
					uname:document.getElementById('uname_2').value,
					sex:sexVal
				},
				dataType: 'json',
				type: 'post',
				success: function(result) {
					if(result.status == 1){
						mui.toast('Modify false!'+result.msg)
					}else{
						mui.toast('Modify success!')
					};
				},
				error:function(xhr, type, errorThrown){
					console.log(type);
				}
			});
			for(pp in item){
				//item=['sex','telphone','email','position','department','company','uname','face']
				switch(item[pp]){
					case "sex":
					case "face":
					case "email":

					break;
					default:
						document.getElementById(item[pp]).innerText = document.getElementById(item[pp]+'_2').value
						//document.getElementById(item[pp]).contentEditable = false;
						//document.getElementById(item[pp]).style='';
					break;
				}
			}
			modify.innerHTML='Modify Data'
			edit=0
		}

	});
    //重新上传头像
	var pen = document.getElementById("pen");
	var face=document.getElementById("edit_face");
	var server=domain+"/index.php/Api/Api/upPhoto/";
	var files=[];
	//点击添加图片
	mui("body").on("tap", "#edit_face", function(e) {
		var a = [{
			title: "拍照"
		}, {
			title: "从手机相册选择"
		}];
		plus.nativeUI.actionSheet({
			title: "修改头像",
			cancel: "取消",
			buttons: a
		}, function(b) {
			switch (b.index) {
				case 0:
					break;
				case 1:
					getImage();
					break;
				case 2:
					galleryImg();
					break;
				default:
					break
			}
		})
	});
    function getImage() {
			var c = plus.camera.getCamera();
			c.captureImage(function(e) {
				plus.io.resolveLocalFileSystemURL(e, function(entry) {
					var path = entry.toLocalURL()  ;
					var fname=path.substring(path.lastIndexOf('/')+1);
					compressImage(path,fname,'head-img1');
			    	openw('cutimg.html?img='+path,'common','图片裁剪');
					//变更大图预览的src
					//目前仅有一张图片，暂时如此处理，后续需要通过标准组件实现
					//document.querySelector("#__mui-imageview__group .mui-slider-item img").src = s + "?version=" + new Date().getTime();
				}, function(e) {
					console.log("读取拍照文件错误：" + e.message);
				});
			}, function(s) {
				console.log("error" + s);
			}, {
				//filename: "_doc/head.jpg"
			})
		}

		function galleryImg() {
		 	// 从相册中选择图片
			    plus.gallery.pick( function(path){
			    	var fname=path.substring(path.lastIndexOf('/')+1);
			    	//mui.openWindow( );
			    	compressImage(path);
			    	//compressImage(path,fname,'head-img1');
			    	//document.getElementById('face').src=path;
					upload()
			    }, function ( e ) {
			    	plus.nativeUI.toast("取消选择图片" );
			    }, {filter:"image"} );
		};
		//随机字符串
		function randomString(len) {
		　　len = len || 32;
		　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
		　　var maxPos = $chars.length;
		　　var pwd = '';
		　　for (i = 0; i < len; i++) {
		　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
		　　}
		　　return pwd;
		}
		function compressImage(path){
			var filename=randomString(12)+".jpg";
				plus.nativeUI.showWaiting();
				plus.zip.compressImage({
					src:path,
					dst:"_doc/"+filename,
					quality:100,
					overwrite:true,
					width:'650px',
				},function(i){
					plus.nativeUI.closeWaiting();
					files.push({name:"uploadkey",path:i.target});
					upload(); //上传图片
				},function(e){
					plus.nativeUI.closeWaiting();
					plus.nativeUI.toast("压缩图片失败: "+JSON.stringify(e));
				});
			}
			// 上传文件
			function upload(){
				var wt=plus.nativeUI.showWaiting();
				var task=plus.uploader.createUpload(server,
					{method:"POST"},
					function(t,status){ //上传完成
						console.log(t.responseText.face)
						if(status==200){
							mui.toast("Upload success！");
							var faceAa =JSON.parse(t.responseText)
							console.log(faceAa.face)
							localStorage.setItem("userFace",faceAa.face)
							
//							mui.ajax(domain + "/index.php/Api/api/getFace",{
//								data:{
//									key: key,
//									ver: ver,
//									token:localStorage.getItem("TOKEN_LOGIN"),
//									uid:localStorage.getItem("TOKEN_UID"),
//								},
//								dataType:"json",
//								type:"post",
//								success:function(result){
//									localStorage.setItem("userFace",t.responseText.face)
//									alert(localStorage.getItem("userFace"))
//								}
//							})
							
							for(var i=0;i<files.length;i++){
								var f=files[i];
								document.getElementById('face').src=f.path;
								
								localStorage.setItem("photo",f.path)
								plus.io.resolveLocalFileSystemURL(f.path, function( entry ) {
								    entry.remove( function ( e ) {
								       console.log( "删除成功" );
								    }, function ( e ) {
								       console.log( "删除失败" );
								    });
								});
							}
							files=[];
							wt.close();
						}else{
							mui.toast("Upload false："+status);
							 files=[];
							wt.close();
						}

					}
				);
				task.addData("client","个人信息上传");
				task.addData("uid",localStorage.getItem("TOKEN_UID"));
				for(var i=0;i<files.length;i++){
					var f=files[i];
					task.addFile(f.path,{key:f.name});
				}
				task.start();
			};
})