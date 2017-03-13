mui.init({swipeBack: false});
//mui.plusReady(function(){
	//var curWindow = 12//plus.webview.currentWebview();
	$('.mui-scroll-wrapper').scroll({
		indicators: true //是否显示滚动条
	});
	/*
	var btn = document.getElementById("get-more")
	btn.onclick=function(){
		document.getElementById("exp").getElementsByTagName('li').style.display="block";
	}*/	
	var userid=12
	mui.ajax("http://z.cqboy.com/index.php/Api/Api/getMe/", {
		data: {
			key: '',
			ver: ver,
			userid:userid
		},
		dataType: 'json',
		type: 'get',
		success: function(result) {
			if(!result.data){
				return
			}else{
				document.getElementById("face").src=result.base.domain+""+result.data.face
				document.getElementById("uname").innerHTML=result.data.uname
				document.getElementById("job").innerHTML=result.data.pos
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
				var con='',vv
				/*{
	                "company":"广州华多网络科技有限公司",
	                "pos":"财务经理",
	                "department":"财务部",
	                "sdate":"2017-02-15",
	                "edate":"2017-03-25"
	            }*/
				for (pp in result.data.exp) {
					vv=result.data.exp[pp]
					con+="<li class=\'mui-table-view-cell mui-media\'><img class=\'mui-media-object mui-pull-left\' src=\'images/cv-icon.jpg\'><div class=\'mui-media-body\'><h6>"+vv['department']+":"+vv['pos']+"</h6><p class=\'mui-ellipsis\'>"+vv['company']+"</p></div></li>"
				}
				document.getElementById("exp").innerHTML=con 
				document.getElementById("contact").innerHTML=result.data.contact||''
			};
		},
		error:function(xhr, type, errorThrown){
			console.log(type);
		}
	});

//})