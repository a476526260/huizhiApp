mui.init({swipeBack: false});
//mui.plusReady(function(){
	//var curWindow = 12//plus.webview.currentWebview();
	$('.mui-scroll-wrapper').scroll({
		indicators: true //是否显示滚动条
	});
	/*
	 "id":"12",
        "status":"0",
        "industry":"",
        "email":"972980756@qq.com",
        "company":"上海浦东国际机场佳美航空食品配餐有限公司4",
        "position":"wer2",
        "department":" 市场",
        "telphone":"",
        "uname":"测试账号",
        "regtime":"1487053840",
        "logintime":"1487053840",
        "face":"12_58ae55c91e514.jpg",
        "sex":"2",
        "contact":"围正在逐步扩大
     */
    var item=['sex','email','telphone','position','department','company','uname','face']
    /*登录*/
   if ((localStorage.getItem('TOKEN_ID') && localStorage.getItem('TOKEN_LOGIN')) || (Date.parse(new Date())/1000-localStorage.getItem('stime'))<604800) {
   		//已登录
   		mui.ajax("http://z.cqboy.com/index.php/Api/Api/getProfile/", {
			data: {
				key: '',
				ver: ver,
				tid:localStorage.getItem('TOKEN_ID'),
				tog:localStorage.getItem('TOKEN_LOGIN'),
			},
			dataType: 'json',
			type: 'post',
			success: function(result) {
				if(result.data.logout == 1){
					//alert('测试清除本地数据')
					//localStorage.clear()
				}else if(!result.data.id){
					return;
				}else{
					for(pp in item){
						if(item[pp]=='face'){
							document.getElementById(item[pp]).src=result.base.domain+""+result.data[item[pp]]
						}else{
							document.getElementById(item[pp]).innerHTML=result.data[item[pp]]
							document.getElementById(item[pp]).title = result.data[item[pp]]
						}
					}
					
					switch(result.data.sex){
						case "1":
							document.getElementById("sex").innerHTML='Female ♂'
						break;
						case "2":
							document.getElementById("sex").innerHTML='Male ♀'
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
   } else{
   		//未登录
	   	mui.ajax("http://z.cqboy.com/index.php/Api/Api/login/", {
			data: {
				key: '',
				ver: ver,
				email:'972980756@qq.com',
				'password':'admin123456'
			},
			dataType: 'json',
			type: 'post',
			success: function(result) {
				// 保存token，以便于下次自动登录  
				 localStorage.setItem('stime',Date.parse(new Date())/1000)
			      localStorage.setItem('TOKEN_ID', result.data.id );  
			      localStorage.setItem('TOKEN_LOGIN', result.data.token);  
				mui.ajax("http://z.cqboy.com/index.php/Api/Api/getProfile/", {
					data: {
						key: '',
						ver: ver,
						id:localStorage.getItem('TOKEN_ID'),
						token:localStorage.getItem('TOKEN_LOGIN')
					},
					dataType: 'json',
					type: 'post',
					headers:{'Content-Type':'application/json'},
					success: function(result) {
						if(!result.data.id){
							return;
						}else{
							for(pp in item){
								if(item[pp]=='face'){
									document.getElementById(item[pp]).src=result.base.domain+""+result.data[item[pp]]
								}else{
									document.getElementById(item[pp]).innerHTML=result.data[item[pp]]
								}
							}
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
							
						};
					},
					error:function(xhr, type, errorThrown){
						console.log(type);
					}
				});
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
	
	modify.onclick=function(){
		if (edit == 0) {
			//转为编辑状态
			edit=1
			sex_click = document.getElementById("sex").getElementsByTagName('input')
			for(pp in item){
				//item=['sex','telphone','email','position','department','company','uname','face']
				switch(item[pp]){
					case "sex":
						//变为单选框
						document.getElementById(item[pp]).innerHTML='<label><input type="radio" name="sex" value="1" id="sex_1" >♂Female</label><label><input type="radio" name="sex" value="2" id="sex_2" >♀   Male</label>'
						document.getElementById("sex_"+document.getElementById(item[pp]).title).checked = true
					break;
					case "email":
						
					break;
					default:
						document.getElementById(item[pp]).contentEditable = true;
						document.getElementById(item[pp]).style='border: #ccc 1px solid; outline: none;';
					break;
				}
			}
			modify.innerHTML='save'
		} else{
			//保存
			var radio = document.getElementsByName("sex");  
			for (i=0; i<radio.length; i++) {  
				if (radio[i].checked) {  
					sexVal=radio[i].value
					document.getElementById('sex').title=sexVal
					switch(sexVal){
						case "1":
							document.getElementById("sex").innerHTML='Female ♂'
						break;
						case "2":
							document.getElementById("sex").innerHTML='Male ♀'
						break;
						default:
							document.getElementById("sex").innerHTML='Unknown'
						break;
					}
				}
			}
			mui.ajax("http://z.cqboy.com/index.php/Api/Api/updateMe/", {
				//item=['sex','telphone','email','position','department','company','uname','face']
				data: {
					key: '',
					ver: ver,
					tid:localStorage.getItem('TOKEN_ID'),
					tog:localStorage.getItem('TOKEN_LOGIN'),
					telphone:document.getElementById('telphone').innerHTML,
					position:document.getElementById('position').innerHTML,
					department:document.getElementById('department').innerHTML,
					company:document.getElementById('company').innerHTML,
					uname:document.getElementById('uname').innerHTML,
					sex:sexVal
				},
				dataType: 'json',
				type: 'post',
				success: function(result) {
					if(result.status == 1){
						alert('修改失败')
					}else{
						alert('修改成功')
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
						
					break;
					default:
						document.getElementById(item[pp]).contentEditable = false;
						document.getElementById(item[pp]).style='';
					break;
				}
			}
			modify.innerHTML='Modify Data'
			edit=0
		}
		
	}
    //重新上传头像
	var pen = document.getElementById("pen")
	//点击添加图片 
	pen.addEventListener('tap', function() {
		//打开相册（这里之前很多小伙伴问我，为什么打不开，因为我用的是H5+的方式，不适用于纯web页面）
		plus.gallery.pick(
			function(path) {
				pen.src = path; //设置img的路径
	
				//把图片base64编码  注意：这里必须在onload事件里执行！这给我坑的不轻
				pen.onload = function() {
					var data = getBase64Image(pen);    //base64编码
					var newImgbase = data.split(",")[1];  //通过逗号分割到新的编码
					imgArray.push(newImgbase);            //放到imgArray数组里面
					pen.off('load');                   //关闭加载
					}
				},
				function(e) {
					mui.toast('取消选择');
					});
				});
	
	//base64编码    
	function getBase64Image(img) {
		var canvas = document.createElement("canvas");   //创建canvas DOM元素，并设置其宽高和图片一样
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0, img.width, img.height); //使用画布画图
		var ext = img.src.substring(img.src.lastIndexOf(".") + 1).toLowerCase();  //动态截取图片的格式
		var dataURL = canvas.toDataURL("image/" + ext);  //返回的是一串Base64编码的URL并指定格式
		return dataURL;
	}

//})