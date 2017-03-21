(function($, doc) {
	var MIN_SOUND_TIME = 800;
	var logined = localStorage.getItem("TOKEN_UID");
	template.config('escape', false);
	$.plusReady(function() {
		var curWindow = plus.webview.currentWebview();
		document.getElementById("bname").innerText = curWindow.bname||""
		var aid = curWindow.aid;
		var to= curWindow.to, uid = localStorage.getItem('TOKEN_UID');
		//alert(curWindow.muiTitle)
		if(parseInt(to) == parseInt(uid)){
			mui.toast('cannt chat whith self!')
			mui.back(-1)
			return false;
		}
		document.getElementById("mui-title").innerText = curWindow.muiTitle||''
		if(parseInt(aid)>0) {
			getData(aid, 1, 80);
		} else {
			getData(curWindow.to, 1, 80);
		}

		setInterval(function(){
			if(aid) {
				getData(aid, 1, 80);
			} else {
				getData(curWindow.to, 1, 80);
			}
		},60000)
		//解决安卓双击输入框才有效的bug
		var msg_text_btn = document.getElementById("msg-text")
		msg_text_btn.addEventListener("tap",function(e){
			msg_text_btn.focus()
		})
		
		
		function getData(id, page, pagenum) {
			//获取已有的最新消息ID,避免重复获取
			var having = 1;
			mui("#msg-list .msg-item").each(function() {
				if(!this.getAttribute("data-id")) {
					this.remove()
				} else {
					having += ("," + this.getAttribute("data-id"));
				}
			});

			if(parseInt(aid)>0) {
					mui.ajax(domain + "/index.php/Api/api/chat", {
						data: {
							key: "",
							ver: ver,
							aid: id,
							page: page,
							pagenum: pagenum,
							having:having
						},
						dataType: 'json',
						type: 'get',
						timeout: 1000,
						success: function(result) {
							console.log("555"+JSON.stringify(result))
							if(result.data){
								for(var i = 0; i < result.data.length; i++) {
									//console.log(parseInt(result.data[i].uid) +"//"+ parseInt(uid))
									record.unshift({
										sender: parseInt(result.data[i].uid) == parseInt(uid)?"self":'zs',
										type: 'text',
										content: result.data[i].msg,
										uname: parseInt(result.data[i].uid) == parseInt(uid)?"Me":result.data[i].uname,
										time: transformTime(result.data[i].addtime),
										photo: result.base.domain + '/Uploads/Face/' + result.data[i].face,
									})
								};
								var chatContent = template('msg-template', {
									"record": record
								});
								jQuery("#msg-list").html(chatContent);
								console.log(chatContent)
								forBottom();
							}
						},
						error: function(xhr, type, errorThrown) {
							console.log("ddd"+errorThrown); 
						}
					});
			} else {
				mui.ajax(domain + "/index.php/Api/api/chat", {
					data: {
						key: "",
						ver: ver,
						from: id,
						page: page,
						pagenum: pagenum,
						having:having
					},
					dataType: 'json',
					type: 'get',
					timeout: 1000,
					success: function(result) {
						console.log("444"+JSON.stringify(result))
						if(result.data){
							for(var i = 0; i < result.data.length; i++) {
								if(result.data[i].uid == id) {
									record.unshift({
										sender: 'zs',
										type: 'text',
										content: result.data[i].msg,
										id: result.data[i].id,
										uname: parseInt(result.data[i].uid) == parseInt(uid)?"Me":result.data[i].uname,
										time: transformTime(result.data[i].addtime),
										photo: result.base.domain + '/Uploads/Face/' + result.data[i].face,
									})
								} else if(result.data[i].uid == logined) {
									record.unshift({
										sender: 'self',
										type: 'text',
										id: result.data[i].id,
										content: result.data[i].msg,
										uname: parseInt(result.data[i].uid) == parseInt(uid)?"Me":result.data[i].uname,
										time: transformTime(result.data[i].addtime),
										photo: result.base.domain + '/Uploads/Face/' + result.data[i].face,
									})
								}

							};
							var chatContent = template('msg-template', {
								"record": record
							}); 
							console.log(chatContent)
							document.getElementById("msg-list").innerHTML = chatContent
							//jQuery("#msg-list").html(chatContent);
							console.log(chatContent)
							forBottom();
						}
					},
					error: function(xhr, type, errorThrown) {
						console.log(errorThrown);
					}
				});

			}

		};
		var dropload = jQuery('#pullrefresh').dropload({
			scrollArea: this,
			domUp: {
				domClass: 'dropload-up',
				domRefresh: '<div class="dropload-refresh">↓下拉刷新</div>',
				domUpdate: '<div class="dropload-update">↑释放更新</div>',
				domLoad: '<div class="dropload-load">loading...</div>'
			},
			domDown: {
				domClass: 'dropload-down',
				domRefresh: '',
				domLoad: '',
				domNoData: ''
			},
			autoLoad: false,
			loadDownFn: function(me) {
				//alert("dfa")
				//getData(2,1,8);
			},
			loadUpFn: function() {
				if(aid) {
					pulldownRefresh(aid, 8);
				} else {
					pulldownRefresh(curWindow.to, 8);
				}

			}
		});

		var count = 2;
		var record = [],
			newrecord = [];
		
		function pulldownRefresh(id, pagenum) {
			setTimeout(function() {
				//有活动id为留言 
				if(aid) {
					mui.ajax(domain + "/index.php/Api/api/chat", {
						data: {
							key: "",
							ver: ver,
							aid: id,
							page: count,
							pagenum: pagenum,
						},
						dataType: 'json',
						type: 'get',
						timeout: 1000,
						success: function(result) {
							console.log("111"+JSON.stringify(result))
							if(result.data) {
								for(var i = 0; i < result.data.length; i++) {
									newrecord.unshift({
										sender: result.data[i].uid == id?"self":"zs",
										type: 'text',
										content: result.data[i].msg,
										uname: parseInt(result.data[i].uid) == parseInt(uid)?"Me":result.data[i].uname,
										time: transformTime(result.data[i].addtime),
										photo: result.base.domain + '/Uploads/Face/' + result.data[i].face,
									})
								};
								var chatContent = template('msg-template', {
									"record": newrecord
								});
								newrecord = [];
								jQuery("#msg-list").prepend(chatContent);
								count++;
								dropload.resetload();
							} else {
								mui.toast("No more message");
								dropload.resetload();
							};
						},
						error: function(xhr, type, errorThrown) {
							console.log(errorThrown);
						}
					});
				} else {
					//没有活动id为聊天
					mui.ajax(domain + "/index.php/Api/api/chat", {
						data: {
							key: "",
							ver: ver,
							from: id,
							page: count,
							pagenum: pagenum,
						},
						dataType: 'json',
						type: 'get',
						timeout: 1000,
						success: function(result) {
							console.log("ddd4=="+JSON.stringify(result))
							console.log("222"+JSON.stringify(result))
							if(result.data) {
								for(var i = 0; i < result.data.length; i++) {
									if(result.data[i].uid == id) {
										newrecord.unshift({
											sender: 'zs',
											type: 'text',
											content: result.data[i].msg,
											uname: parseInt(result.data[i].uid) == parseInt(uid)?"Me":result.data[i].uname,
											time: transformTime(result.data[i].addtime),
											photo: result.base.domain + '/Uploads/Face/' + result.data[i].face,
										})
									} else if(result.data[i].uid == logined) {
										newrecord.unshift({
											sender: 'self',
											type: 'text',
											content: result.data[i].msg,
											uname: parseInt(result.data[i].uid) == parseInt(uid)?"Me":result.data[i].uname,
											time: transformTime(result.data[i].addtime),
											photo: result.base.domain + '/Uploads/Face/' + result.data[i].face,
										})
									}

								};
								var chatContent = template('msg-template', {
									"record": newrecord
								});
								newrecord = [];
								jQuery("#msg-list").prepend(chatContent);
								count++;
								dropload.resetload();
							} else {
								mui.toast("No more message222");
								dropload.resetload();
							};
						},
						error: function(xhr, type, errorThrown) {
							console.log(errorThrown);
						}
					});
				}

				/*var list = template('msg-template', {
					"record": newrecord
				});
				jQuery("#msg-list").prepend(list);*/
			}, 1500);
		};

		function transformTime(timeTemp) {
			var time = new Date(timeTemp * 1000);
			return((time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + (time.getMinutes().toString().length == 1 ? "0" + time.getMinutes() : time.getMinutes()));
		};

		function forBottom() {
			document.querySelector("#pullrefresh").scrollTop = document.querySelector("#msg-list").offsetHeight;
		};

		plus.webview.currentWebview().setStyle({
			softinputMode: "adjustResize",
			scrollIndicator: 'none'
		});

		var showKeyboard = function() {
			if($.os.ios) {
				var webView = plus.webview.currentWebview().nativeInstanceObject();
				webView.plusCallMethod({
					"setKeyboardDisplayRequiresUserAction": false
				});
			} else {
				var Context = plus.android.importClass("android.content.Context");
				var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
				var main = plus.android.runtimeMainActivity();
				var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
				imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
				imm.showSoftInput(main.getWindow().getDecorView(), InputMethodManager.SHOW_IMPLICIT);
			}
		};
		var ui = {
			body: doc.querySelector('body'),
			footer: doc.querySelector('footer'),
			footerRight: doc.querySelector('.footer-right'),
			footerLeft: doc.querySelector('.footer-left'),
			btnMsgType: doc.querySelector('#msg-type'),
			boxMsgText: doc.querySelector('#msg-text'),
			boxMsgSound: doc.querySelector('#msg-sound'),
			btnMsgImage: doc.querySelector('#msg-image'),
			areaMsgList: doc.querySelector('#msg-list'),
			boxSoundAlert: doc.querySelector('#sound-alert'),
			h: doc.querySelector('#h'),
			content: doc.querySelector('.mui-content')
		};
		ui.h.style.width = ui.boxMsgText.offsetWidth + 'px';
		var footerPadding = ui.footer.offsetHeight - ui.boxMsgText.offsetHeight;
		var msgItemTap = function(msgItem, event) {
			var msgType = msgItem.getAttribute('msg-type');
			var msgContent = msgItem.getAttribute('msg-content')
			if(msgType == 'sound') {
				player = plus.audio.createPlayer(msgContent);
				var playState = msgItem.querySelector('.play-state');
				playState.innerText = '正在播放...';
				player.play(function() {
					playState.innerText = '点击播放';
				}, function(e) {
					playState.innerText = '点击播放';
				});
			}
		};
		var imageViewer = new $.ImageViewer('.msg-content-image', {
			dbl: false
		});
		var bindMsgList = function() {
			ui.areaMsgList.innerHTML = template('msg-template', {
				"record": record,
			});
			var msgItems = ui.areaMsgList.querySelectorAll('.msg-item');
			[].forEach.call(msgItems, function(item, index) {
				item.addEventListener('tap', function(event) {
					msgItemTap(item, event);
				}, false);
			});
			imageViewer.findAllImage();
			forBottom();

		};
		window.addEventListener('resize', function() {
			forBottom();
		}, false);

		var send = function(msg) {
			record.push(msg);
			bindMsgList();
		};

		function msgTextFocus() {
			ui.boxMsgText.focus();
			setTimeout(function() {
				ui.boxMsgText.focus();
			}, 150);
		}
		//解决长按“发送”按钮，导致键盘关闭的问题；
		ui.footerRight.addEventListener('touchstart', function(event) {
			if(ui.btnMsgType.classList.contains('icon-sendemail1')) {
				msgTextFocus();
				event.preventDefault();
			}
		});
		//解决长按“发送”按钮，导致键盘关闭的问题；
		ui.footerRight.addEventListener('touchmove', function(event) {
			if(ui.btnMsgType.classList.contains('icon-sendemail1')) {
				msgTextFocus();
				event.preventDefault();
			}
		});
		msg_text_btn.addEventListener("keyup",function(event){
			if (event.keyCode == 13) {
				mui.trigger(ui.footerRight,"release")
			} else{
	
			}
		})
		ui.footerRight.addEventListener('release', function(event) {
			var val = ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '<br/>');
			if(logined) {
				if(ui.btnMsgType.classList.contains('icon-sendemail1')) {
					if(ui.boxMsgText.value == "") {
						mui.toast("No more message3333");
						return;
					}
					ui.boxMsgText.focus();
					setTimeout(function() {
						ui.boxMsgText.focus();
					}, 150);
					if(aid) {
						window.requestAnimationFrame(function(){
							mui.ajax(domain + "/index.php/Api/api/sendMsg", {
								data: {
									key: "",
									ver: ver,
									'from':uid,
									uid:uid,
									aid: aid,
									msg: val,
								},
								dataType: 'json',
								type: 'post',
								timeout: 1000,
								success: function(result) {
									
									send({
										sender: 'self',
										type: 'text',
										content: val,
										uname: "Me",
										time: transformTime(result.data.addtime),
										photo: result.base.domain + (localStorage.getItem("userFace").length<30?"/Uploads/Face/":"") + localStorage.getItem("userFace"),
									});
								},
								error: function(xhr, type, errorThrown) {
									console.log(errorThrown);
								}
							});
						})
					} else {
						window.requestAnimationFrame(function(){
							mui.ajax(domain + "/index.php/Api/api/sendMsg", {
								data: {
									key: "",
									ver: ver,
									uid: uid,
									'from':uid,
									to: curWindow.to,
									msg: val,
								},
								dataType: 'json',
								type: 'post',
								timeout: 1000,
								success: function(result) {
									send({
										sender: 'self',
										type: 'text',
										content: val,
										time: transformTime(result.data.addtime),
										photo: result.base.domain + '/Uploads/Face/' + localStorage.getItem("userFace"),
									});
								},
								error: function(xhr, type, errorThrown) {
									console.log(errorThrown);
								}
							});
						})

					};

					ui.boxMsgText.value = '';
					$.trigger(ui.boxMsgText, 'input', null);
				} else if(ui.btnMsgType.classList.contains('mui-icon-mic')) {
					ui.btnMsgType.classList.add('mui-icon-compose');
					ui.btnMsgType.classList.remove('mui-icon-mic');
					ui.boxMsgText.style.display = 'none';
					ui.boxMsgSound.style.display = 'block';
					ui.boxMsgText.blur();
					document.body.focus();
				} else if(ui.btnMsgType.classList.contains('mui-icon-compose')) {
					ui.btnMsgType.classList.add('mui-icon-mic');
					ui.btnMsgType.classList.remove('mui-icon-compose');
					ui.boxMsgSound.style.display = 'none';
					ui.boxMsgText.style.display = 'block';
					ui.boxMsgText.focus();
					setTimeout(function() {
						ui.boxMsgText.focus();
					}, 150);
				}
			} else {
				mui.toast("Pleasd login first");
			}
		}, false);
		ui.footerLeft.addEventListener('tap', function(event) {
			var btnArray = [{
				title: "拍照"
			}, {
				title: "从相册选择"
			}];
			plus.nativeUI.actionSheet({
				title: "选择照片",
				cancel: "取消",
				buttons: btnArray
			}, function(e) {
				var index = e.index;
				switch(index) {
					case 0:
						break;
					case 1:
						var cmr = plus.camera.getCamera();
						cmr.captureImage(function(path) {
							if(aid) {
								window.requestAnimationFrame(function(){
									mui.ajax(domain + "/index.php/Api/api/sendMsg", {
										data: {
											key: "",
											ver: ver,
											'from':uid,
											uid:uid,
											aid: aid,
											msg: path,
										},
										dataType: 'json',
										type: 'post',
										timeout: 1000,
										success: function(result) {
											send({
												sender: 'zs',
												type: 'image',
												content: val,
												time: transformTime(result.data.addtime),
												photo: result.base.domain + '/Uploads/Face/' + localStorage.getItem("userFace"),
											});
										},
										error: function(xhr, type, errorThrown) {
											console.log(errorThrown);
										}
									});
								})
							} else {
								window.requestAnimationFrame(function(){
									mui.ajax(domain + "/index.php/Api/api/sendMsg", {
										data: {
											key: "",
											ver: ver,
											uid: uid,
											'from':uid,
											to: curWindow.to,
											msg: path,
										},
										dataType: 'json',
										type: 'post',
										timeout: 1000,
										success: function(result) {
											send({
												sender: 'zs',
												type: 'image',
												content: "file://" + plus.io.convertLocalFileSystemURL(path),
												time: transformTime(result.data.addtime),
												photo: result.base.domain + '/Uploads/Face/' + localStorage.getItem("userFace"),
											});
										},
										error: function(xhr, type, errorThrown) {
											console.log(errorThrown);
										}
									});
								})
							};
						}, function(err) {});
						break;
					case 2:
						plus.gallery.pick(function(path) {
							if(aid) {
								window.requestAnimationFrame(function(){
									mui.ajax(domain + "/index.php/Api/api/sendMsg", {
										data: {
											key: "",
											ver: ver,
											'from':uid,
											uid:uid,
											aid: aid,
											msg: path,
										},
										dataType: 'json',
										type: 'post',
										timeout: 1000,
										success: function(result) {
											send({
												sender: 'zs',
												type: 'image',
												content: val,
												time: transformTime(result.data.addtime),
												photo: result.base.domain + '/Uploads/Face/' + localStorage.getItem("userFace"),
											});
										},
										error: function(xhr, type, errorThrown) {
											console.log(errorThrown);
										}
									});
								})
							} else {
								window.requestAnimationFrame(function(){
									mui.ajax(domain + "/index.php/Api/api/sendMsg", {
										data: {
											key: "",
											ver: ver,
											uid: uid,
											'from':uid,
											to: curWindow.to,
											msg: path,
										},
										dataType: 'json',
										type: 'post',
										timeout: 1000,
										success: function(result) {
											send({
												sender: 'zs',
												type: 'image',
												content: "file://" + plus.io.convertLocalFileSystemURL(path),
												time: transformTime(result.data.addtime),
												photo: result.base.domain + '/Uploads/Face/' + localStorage.getItem("userFace"),
											});
										},
										error: function(xhr, type, errorThrown) {
											console.log(errorThrown);
										}
									});
								})
							};
						}, function(err) {}, null);
						break;
				}
			});
		}, false);
		var setSoundAlertVisable = function(show) {
			if(show) {
				ui.boxSoundAlert.style.display = 'block';
				ui.boxSoundAlert.style.opacity = 1;
			} else {
				ui.boxSoundAlert.style.opacity = 0;
				//fadeOut 完成再真正隐藏
				setTimeout(function() {
					ui.boxSoundAlert.style.display = 'none';
				}, 200);
			}
		};
		var recordCancel = false;
		var recorder = null;
		var audio_tips = document.getElementById("audio_tips");
		var startTimestamp = null;
		var stopTimestamp = null;
		var stopTimer = null;
		ui.boxMsgSound.addEventListener('hold', function(event) {
			recordCancel = false;
			if(stopTimer) clearTimeout(stopTimer);
			audio_tips.innerHTML = "手指上划，取消发送";
			ui.boxSoundAlert.classList.remove('rprogress-sigh');
			setSoundAlertVisable(true);
			recorder = plus.audio.getRecorder();
			if(recorder == null) {
				plus.nativeUI.toast("不能获取录音对象");
				return;
			}
			startTimestamp = (new Date()).getTime();
			recorder.record({
				filename: "_doc/audio/"
			}, function(path) {
				if(recordCancel) return;
				send({
					sender: 'zs',
					type: 'sound',
					content: path
				});
			}, function(e) {
				plus.nativeUI.toast("录音时出现异常: " + e.message);
			});
		}, false);
		ui.body.addEventListener('drag', function(event) {
			if(Math.abs(event.detail.deltaY) > 50) {
				if(!recordCancel) {
					recordCancel = true;
					if(!audio_tips.classList.contains("cancel")) {
						audio_tips.classList.add("cancel");
					}
					audio_tips.innerHTML = "松开手指，取消发送";
				}
			} else {
				if(recordCancel) {
					recordCancel = false;
					if(audio_tips.classList.contains("cancel")) {
						audio_tips.classList.remove("cancel");
					}
					audio_tips.innerHTML = "手指上划，取消发送";
				}
			}
		}, false);
		ui.boxMsgSound.addEventListener('release', function(event) {
			if(audio_tips.classList.contains("cancel")) {
				audio_tips.classList.remove("cancel");
				audio_tips.innerHTML = "手指上划，取消发送";
			}
			//
			stopTimestamp = (new Date()).getTime();
			if(stopTimestamp - startTimestamp < MIN_SOUND_TIME) {
				audio_tips.innerHTML = "录音时间太短";
				ui.boxSoundAlert.classList.add('rprogress-sigh');
				recordCancel = true;
				stopTimer = setTimeout(function() {
					setSoundAlertVisable(false);
				}, 800);
			} else {
				setSoundAlertVisable(false);
			}
			recorder.stop();
		}, false);
		ui.boxMsgSound.addEventListener("touchstart", function(e) {
			//console.log("start....");
			e.preventDefault();
		});
		ui.boxMsgText.addEventListener('input', function(event) {
			ui.btnMsgType.classList = "";
			ui.btnMsgType.setAttribute("class", "iconfont icon-sendemail1")
			ui.btnMsgType.setAttribute("for", ui.boxMsgText.value == '' ? '' : 'msg-text');
			ui.h.innerText = ui.boxMsgText.value.replace(new RegExp('\n', 'gm'), '\n-') || '-';
			ui.footer.style.height = (ui.h.offsetHeight + footerPadding) + 'px';
			ui.content.style.paddingBottom = ui.footer.style.height;
		});
		var focus = false;
		ui.boxMsgText.addEventListener('tap', function(event) {
			ui.content.style.paddingBottom = 50 + 'px';
			ui.boxMsgText.focus();
			setTimeout(function() {
				ui.boxMsgText.focus();
			}, 0);
			focus = true;
			setTimeout(function() {
				focus = false;
			}, 1000);
			event.detail.gesture.preventDefault();
		}, false);
		//点击消息列表，关闭键盘
		ui.areaMsgList.addEventListener('tap', function(event) {
			if(!focus) {
				ui.boxMsgText.blur();
				ui.content.style.paddingBottom = 0 + "px";
			}
		});
	});
}(mui, document));