mui.init({});
var aid;
var count = 0;
var page=1;
var result,html,html_uname='';
var sort_uname=[];


//计算pullrefresh距离顶部距离
$("#pullrefresh").css({"top":44+$(".material-title").innerHeight()+parseInt($(".material-title").css("margin-top"))+$(".sort").innerHeight(),"bottom":0});


mui.plusReady(function(){
	var curWin=plus.webview.currentWebview();
	document.getElementById("bname").innerText = curWin.bname||"Back"
	aid=curWin.aid;
	var Nname = 'Documentation' 
	
	//document.getElementById("mui-title").innerHTML = Nname 
	result = JSON.parse( localStorage.getItem("data-"+aid) );
	html='',openICON=''
	if(result.data.material){
		for(var i = 0; i < result.data.material.length; i++) {
			if(localStorage.getItem("downFile_"+result.data.material[i].id) !=null){
				openICON="<img src='images/open.png' class='icon-22' id='iconId_"+result.data.material[i].id+"'/>"
			}else{
				openICON="<img src='images/Downloads.png' class='icon-22' id='iconId_"+result.data.material[i].id+"'/>"
			}
			console.log("ffffffdownFile_"+result.data.material[i].id+localStorage.getItem("downFile_"+result.data.material[i].id))
			sort_uname.push(result.data.material[i].uname);
			//获取文件扩展名
			var ext = result.data.material[i].file.split(".")
			ext = 'ext_'+ext[ext.length-1]+'.png'
			if(result.data.material[i].ext == "zip" || result.data.material[i].ext == "rar") {
				html += "<li class='mui-table-view-cell border-left" + (i % 4 + 1) + "'  data-id='"+result.data.material[i].id+"' data-title='"+result.data.material[i].title+"' data-uname='" + result.data.material[i].uname + "' data-file='" + result.data.material[i].file + "'><div class='icon-1'><img src='images/"+ext+"'/> "+openICON+"</div><h2>" + (result.data.material[i].title) + "</h2><p class='name'><span class='speaker-icon iconfont icon-wodeicon'></span>" + result.data.material[i].uname + "</p><p class='job'>" + result.data.material[i].department + "</p><p class='company'>" + result.data.material[i].company + "</p></li>"
			} else {
				html += "<li class='mui-table-view-cell border-left" + (i % 4 + 1) + "'  data-id='"+result.data.material[i].id+"' data-title='"+result.data.material[i].title+"' data-uname='" + result.data.material[i].uname + "' data-file='" + result.data.material[i].file + "'><div class='icon-2'><img src='images/"+ext+"'/> "+openICON+"</div><h2>" + (result.data.material[i].title) + "</h2><p class='name'><span class='speaker-icon iconfont icon-wodeicon'></span>" + result.data.material[i].uname + "</p><p class='job'>" + result.data.material[i].department + "</p><p class='company'>" + result.data.material[i].company + "</p></li>"
			}
		};
		sort_uname = sort_uname.sort() 
	};
	//console.log(html)
	$("#documents").html(html);
	mui("#sort").on("tap","#DelFile",function(){
		mui.confirm("Are sure clear all files?","",["Cancel","Clear file"],function(e){
			if (e.index == 1) {
				//plus.downloader.clear();
				//document.getElementById("downMask")
				//var aaa = searchFiles()
				//searchFiles()
				//console.log(aaa)
				mui("#documents li").each(function(index, item){
					if(localStorage.getItem("downFile_"+this.getAttribute("data-id")) != null ){
						console.log(localStorage.getItem("downFile_"+this.getAttribute("data-id")))
						
						localStorage.removeItem("downFile_"+this.getAttribute("data-id"))
						//var abf = localStorage.getItem("downFile_"+this.getAttribute("data-id"))
						//abf.remove()
					}
				})
				
			}
		})
	})
	var sort = document.getElementById("sortEle")
	sort.addEventListener("change",function(){
		switch (sort.value){
			case '1':
				$("#documents").html(html);
			break;
			case '2':
				if(html_uname.length<10){
					html_uname = ''
					for(i=0;i<sort_uname.length;i++){

						html_uname+=$("#documents li[data-uname='"+(sort_uname[i])+"']").prop("outerHTML")
					}
				}
				//console.log(sort_uname+html_uname)
				$("#documents").html(html_uname);
			break;
		}
	}, false)
	mui("#sort").on("tap","select",function(){


	})

	var timerDown;
	var progressbar1 = mui('#dp');
	
	mui("#documents").on("tap",".mui-table-view-cell",function(){
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
					title: "loading..."
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
		        	document.getElementById("iconId_"+file_id).setAttribute("src","images/open.png")
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
			if(_this.getAttribute("data-file").length>10){
				mui.confirm(""+_this.getAttribute("data-title")+"","",["Cancel","Download"],function(e){
					var ru = JSON.parse(localStorage.getItem("USER_INFO"))
					
					if (e.index == 1) {
						//plus.runtime.openURL(domain+_this.getAttribute("data-file"))
						
						mui.ajax(domain+"/index.php/Api/api/openFile", {
							data: {
								uid:localStorage.getItem("TOKEN_UID"),
								email: ru.email,
								file:file 
							},
							dataType: 'json',
							type: 'get',
							timeout: 5000,
							success: function(result) {
								
							},
							error: function(xhr, type, errorThrown) {
								mui.toast(type)
								
							}
						});
						plus.runtime.openURL(domain + file);
						//plus.runtime.openURL(domain + "/index.php/Api/api/openFile/?uid="+localStorage.getItem("TOKEN_UID")+"&email="+ru.email+"&file=" +_this.getAttribute("data-file"))
					}
				})
			}
			
			
			//plus.runtime.openURL(domain + this.getAttribute("data-file"));

		}else{
			mui.toast('no file!')
		}
	})
	function delFile(file){
		
	}
	function searchFiles(file) {
		plus.io.requestFileSystem( plus.io.PUBLIC_DOWNLOADS, function(fs){
			// 创建读取目录信息对象 
			var directoryReader = fs.root.createReader();
			directoryReader.readEntries( function( entries ){
				var i;
				for( i=0; i < entries.length; i++ ) {
					var aa= "_downloads/"+entries[i].name
					//console.log(entries[i].name)
					if(file.indexOf(entries[i].name)>0){
						file.remove()
					}
				}
			}, function ( e ) {
				alert( "Read entries failed: " + e.message );
			} );
		} );
	}

});

function showPdf(f){
	var container = document.getElementById("container");
	container.style.display = "block";
	var url = "web/595b0bfb9d6a3.pdf";
	PDFJS.workerSrc = 'build/pdf.worker.js';
	PDFJS.getDocument(url).then(function getPdfHelloWorld(pdf) {
	    //
	    // Fetch the first page
	    //
	    pdf.getPage(1).then(function getPageHelloWorld(page) {
	      var scale = 1.5;
	      var viewport = page.getViewport(scale);

	      //
	      // Prepare canvas using PDF page dimensions
	      //
	      var canvas = document.getElementById('the-canvas');
	      var context = canvas.getContext('2d');
	      canvas.height = viewport.height;
	      canvas.width = viewport.width;

	      //
	      // Render PDF page into canvas context
	      //
	      var renderContext = {
	        canvasContext: context,
	        viewport: viewport
	      };
	      page.render(renderContext);
	    });
  });
}