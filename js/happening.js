mui.init();
mui.plusReady(function() {
	var aid;

	document.addEventListener("showOut", function(event) {
		var id = event.detail.which;
		aid=event.detail.aid;
		$("." + id).show().siblings().hide();
	});


	var type;  //0为happening,1为upcoming,2为past

	$(".content-box .item").each(function(index,ele){
		this.addEventListener("tap",function(){
			if($(this).parent().parent().hasClass("happening")){
				type=0;
			}else if($(this).parent().parent().hasClass("upcoming")){
				type=1;
			}else{
				type=2;
			};
			var itemName=$(this).attr("data-name");    //
			mui.openWindow({
				url:itemName+".html",
				id:itemName,
				styles:{
					top:"0px",
					bottom:"50px"
				},
				extras:{
					type:type,
					aid:aid
				}
			})
		})
	});
});



