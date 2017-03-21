mui.init({swipeBack: true});
mui.plusReady(function(){
	var curWindow = plus.webview.currentWebview();
	$('.mui-scroll-wrapper').scroll({
		indicators: true //是否显示滚动条
	});
	document.getElementById("bname").innerText = curWindow.bname
	var userid=localStorage.getItem("TOKEN_UID");
	var bio = document.getElementById("edit_bio")
	bio.addEventListener("tap",function (event) {
		document.getElementById("add_bio_form").style.display = "block"
		mui("#exp li .mui-icon-trash").each(function(index,item){

			item.style.display = "block"
		})
	})
	var bio_esc = document.getElementById("sub_bio_esc")
	bio_esc.addEventListener("tap",function(){
		document.getElementById("add_bio_form").style.display = "none"
		mui("#exp li .mui-icon-trash").each(function(index,item){
			item.style.display = "none"
		})
	})
	var sub_bio = document.getElementById("sub_bio")
	sub_bio.addEventListener("tap",function () {
		if(document.getElementById("add_company").value.length<2){
			mui.toast('Please input your full company name!')
			document.getElementById("add_company").focus()
			return false;
		}
		if(document.getElementById("add_department").value.length<2){
			mui.toast('Please input your department!')
			document.getElementById("add_department").focus()
			return false;
		}
		if(document.getElementById("add_position").value.length<2){
			mui.toast('Please input your job!')
			document.getElementById("add_position").focus()
			return false;
		}
		if(document.getElementById("add_sdate").value.length<2){
			mui.toast('No onboard date!')
			document.getElementById("add_sdate").focus()
			return false;
		}
		if(document.getElementById("add_edate").value.length<2){
			//mui.toast('No separation date!')
			//document.getElementById("add_edate").focus()
			//return false;
		}
		mui.ajax(domain + "/index.php/Api/Api/InsrtBio/",{
			data: {
				key: key,
				ver: ver,
				token:localStorage.getItem("TOKEN_LOGIN"),
				uid:localStorage.getItem("TOKEN_UID"),
				userid:userid,
				company:document.getElementById("add_company").value,
				department:document.getElementById("add_department").value,
				position:document.getElementById("add_position").value,
				sdate:document.getElementById("add_sdate").value,
				edate:document.getElementById("add_edate").value||"",
				biocon:document.getElementById("biocon").value
			},
			dataType: 'json',
			type: 'post',
			success: function(result) {
				//console.log(JSON.stringify(result))
				if(!result.data){
					return false;
				}else{
					var vv = result.data
					var con="<li class=\'mui-table-view-cell mui-media\'><img class=\'mui-media-object mui-pull-left\' src=\'images/cv-icon.jpg\'><div class=\'mui-media-body\'><h6>"+vv['department']+":"+vv['pos']+"</h6><p class=\'mui-ellipsis\'>"+vv['company']+"</p></div></li>"
					document.getElementById("exp").innerHTML=con+document.getElementById("exp").innerHTML
					document.getElementById("add_company").value = ''
					department:document.getElementById("add_department").value = ''
					position:document.getElementById("add_position").value = ''
					sdate:document.getElementById("add_sdate").value = ''
					edate:document.getElementById("add_edate").value = ''
					biocon:document.getElementById("biocon").value = ''

				}

			},
			error:function(xhr, type, errorThrown){
				console.log(type);
			}
		})
		return false;
	})
	var contact = document.getElementById("edit_contact")
	contact.addEventListener("tap",function (event) {
		document.getElementById("contact_textarea").style.display = "block"
	})

	mui("#exp").on("tap","li .mui-icon-trash",function(){
		//console.log(this.getAttribute("data-id"))
		//删除
		var dataid=this.getAttribute("data-id")
		if(!dataid) return false;
		mui.ajax(domain + "/index.php/Api/Api/delBio/",{
			data:{
				key: key,
				ver: ver,
				token:localStorage.getItem("TOKEN_LOGIN"),
				uid:localStorage.getItem("TOKEN_UID"),
				id:dataid,
				userid:userid
			},
			dataType: 'json',
			type: 'post',
			success:function(result){

				//console.log(JSON.stringify(result));
				if (result.status == 0) {
					//document.getElementById("exp_"+dataid)
					mui.toast(result.msg)
					$("#exp_"+dataid).remove()
				}
			},
			error:function(xhr, type, errorThrown){
				console.log(type);
			}
		})
	})
	mui.ajax(domain + "/index.php/Api/Api/getMe/", {
		data: {
			key: key,
			ver: ver,
			token:localStorage.getItem("TOKEN_LOGIN"),
			uid:localStorage.getItem("TOKEN_UID"),
			userid:userid
		},
		dataType: 'json',
		type: 'get',
		success: function(result) {
			console.log(JSON.stringify(result))
			if(!result.data){
				return
			}else{
				document.getElementById("face").src=result.base.domain+(result.data.face.length<30?"/Uploads/Face/":"")+result.data.face
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
				var con='',vv;
				for (pp in result.data.exp) {
					vv=result.data.exp[pp]
					con+="<li id='exp_"+vv['id']+"' class=\'mui-table-view-cell mui-media \'><img class=\'mui-media-object mui-pull-left\' src=\'images/cv-icon.jpg\'><div class=\'mui-media-body\'><h6>"+vv['department']+":"+vv['pos']+"<span style=' display:none;' data-id='"+vv['id']+"' class='mui-icon mui-icon-trash mui-pull-right'></span></h6><p `class=\'mui-ellipsis\'>"+vv['company']+"</p></div></li>"
				}
				//console.log(con)
				document.getElementById("exp").innerHTML=con
				document.getElementById("contact").innerHTML=result.data.contact||''
				document.getElementById("contact_textarea").value = result.data.contact||''
			};
		},
		error:function(xhr, type, errorThrown){
			console.log(type);
		}
	});

	$(function() {
		$("body").on("tap","#edit_contact,#sub_con_esc",function(){
			$("#edit_con_form,#contact").toggle()
			$("#contact_textarea").height($("#contact").height()<60?100:$("#contact").height());
			//$("html,body").scrollTop($(document).height())
		})
		$("#contact_textarea").on("keyup keydown", function(){
		    $(this).height(this.scrollHeight);
		})

	});
	var sub_con = document.getElementById("sub_con")
	sub_con.addEventListener("tap",function () {
		mui.ajax(domain + "/index.php/Api/Api/upContact/",{
			data: {
				key: key,
				ver: ver,
				token:localStorage.getItem("TOKEN_LOGIN"),
				uid:localStorage.getItem("TOKEN_UID"),
				userid:userid,
				contact:document.getElementById("contact_textarea").value
			},
			dataType: 'json',
			type: 'post',
			success: function(result) {
				console.log(JSON.stringify(result))

				document.getElementById("contact").innerHTML = document.getElementById("contact_textarea").value
				document.getElementById("contact").style.display = 'block'
				//document.getElementById("contact_textarea").style.display = 'none'
				document.getElementById("edit_con_form").style.display = 'none'
			},
			error:function(xhr, type, errorThrown){
				console.log(type);
			}
		})
		return false;
	})

})