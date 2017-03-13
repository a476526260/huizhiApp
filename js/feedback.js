mui.init();
mui.plusReady(function() {
	$(".text-area textarea").each(function() { 
        var thisVal = $(this).val();
        //判断文本框的值是否为空，有值的情况就隐藏提示语，没有值就显示
        if (thisVal != "") {
            $(this).siblings(".tip").hide();
        } else {
            $(this).siblings(".tip").show();
        };
        //聚焦型文本框验证
        $(this).focus(function() { 
            $(this).siblings(".tip").hide();
        }).blur(function() {
            var val = $(this).val();
            if (val != "") {
                $(this).siblings(".tip").hide();
            } else {
                $(this).siblings(".tip").show();
            };
        });

        $(this).on("input",function(){
        	var len=$(this).val().length; 
        	len>200?200:len;
        	$(".total").text(200-len)
        });
    });
	//登陆提交
	var btn = document.getElementById("submit"),radio_d=-1
	btn.addEventListener("tap", function() {
		$.each($(".iconfont"), function(k,v) {
			if(v.checked){
				radio_d = k
			}
		});
		if (document.getElementById("feedback-word").value.length<10) {
			alert('字数不能小于10')
		} else{
			mui.ajax("http://z.cqboy.com/index.php/Api/api/feedback", {
				data: {
					tid:localStorage.getItem('TOKEN_ID'),
					tog:localStorage.getItem('TOKEN_LOGIN'),
					content:document.getElementById("feedback-word").value,
					types:radio_d
				},
				dataType: 'json',
				type: 'POST',
				timeout: 10000,
				success: function(result) {
					if(result.status == 0) {
						mui.toast(result.msg)
						document.getElementById("feedback-word").value=''
					}
				},
				error: function(xhr, type, errorThrown) {
					mui.toast(xhr)
				}
			});
		}
	})
})
