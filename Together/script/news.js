function initSlide() {
	var slide = $api.byId('slide');
	var pointer = $api.domAll('#pointer a');
	window.mySlide = Swipe(slide, {
		// startSlide: 4,
		auto : 5000,
		continuous : true,
		disableScroll : true,
		stopPropagation : true,
		callback : function(index, element) {
			var actPoint = $api.dom('#pointer a.active');
			$api.removeCls(actPoint, 'active');
			$api.addCls(pointer[index], 'active');
		},
		transitionEnd : function(index, element) {

		}
	});
}

function act_details(id) {
	api.openWin({
		name : 'act-details',
		url : './act-details.html',
		pageParam : {
			id : id
		}
	});
}

function getBanner(id) {
	api.showProgress({
		title : '加载中...',
		modal : false
	});
	var getTabBarBannerUrl = '/tabBar?filter=';
	var urlParam = {
		include : ["banner"],
		where : {
			id : id
		}
	};
	ajaxRequest(getTabBarBannerUrl + JSON.stringify(urlParam), 'GET', '', function(ret, err) {
		if (ret) {
			var content = $api.byId('banner-content');
			var tpl = $api.byId('banner-template').text;
			var tempFn = doT.template(tpl);
			content.innerHTML = tempFn(ret[0].banner);
			initSlide();
		} else {
			api.toast({
				msg : err.msg,
				location : 'middle'
			})
		}
	})
}

function openNews(el, type) {
	type = type || 't';

	var newsId = $api.attr(el, 'newsId');
	//text news
	if (type === 't') {
		api.openWin({
			name : 'news-text',
			url : 'news-text.html',
			pageParam : {
				newsId : newsId
			},
			opaque : true,
			vScrollBarEnabled : false
		});
	} else if (type === 'p') {//picture news
		api.openWin({
			name : 'news-pic',
			url : 'news-pic.html',
			pageParam : {
				newsId : newsId
			},
			opaque : true,
			vScrollBarEnabled : false
		});

	} else if (type === 'v') {//video news

		api.openWin({
			name : 'news-video',
			url : 'news-video.html',
			opaque : true,
			vScrollBarEnabled : false,
			pageParam : {
				newsId : newsId
			}
		});

		event.preventDefault();
	}

}

function initPage(id) {
	var getTabBarActivityUrl = '/tabBar?filter=';
	var urlParam = {
		include : ["news"],
		where : {
			id : id
		}
	};
	ajaxRequest(getTabBarActivityUrl + JSON.stringify(urlParam), 'GET', '', function(ret, err) {
		if (ret) {
			var obj = $api.byId('txtNewsList');
			var html = '';
			for (var i = 0, len = ret[0].news.length; i < len; i++) {
				var thisItem = ret[0].news[i];
				var nType = thisItem.type;
				if (nType === 'p') {
					var pic = thisItem.pics;
					var picArr = pic.split(',');
					html += '<li class="pic"><h2>' + thisItem.title + '</h2><div class="p">';
					for (var j = 0; j < 3; j++) {
						html += '<a tapmode="" style="background-image:url(' + picArr[j] + ')" newsId="' + thisItem.id + '" onclick="openNews(this, \'p\');">';
						html += '</a>';
					}
					html += '</div></li>';
				} else {
					html += '<li class="' + nType + '"><a tapmode="active" newsId="' + thisItem.id + '" onclick="openNews(this, \'' + nType + '\');"><img src="' + thisItem.img.url + '" />';
					html += '<div class="content"><h2>' + thisItem.title + '</h2><p>' + thisItem.summary + '</p></div></a></li>';
				}
			}
			$api.html(obj, html);
			api.hideProgress();
			//init tapmode
			api.parseTapmode();
		} else {
			api.toast({
				msg : err.msg,
				location : 'middle'
			})
		}
		api.hideProgress();
	})
}

function getData(id) {

	api.showProgress({});
	var testData;
	var username = $api.getStorage('uid');
	;

	if (id == 1) {

		var getdataUrl = "/get_act_list_halfFriend/"
		api.ajax({
			url : serverAddr + getdataUrl + username,
			method : 'get',
			cache : false,
			timeout : 30,
			dataType : 'json',
			returnAll : false
		}, function(ret, err) {
			//coding...
			testData = ret;
			var evalText = doT.template($("#act-template").text());
			$("#act-content").html(evalText(testData));
		});
	} else {
		var getdataUrl = "/get_act_list?username="
		api.ajax({
			url : serverAddr + getdataUrl + username,
			method : 'get',
			cache : false,
			timeout : 30,
			dataType : 'json',
			returnAll : false
		}, function(ret, err) {
			//coding...
			testData = ret;
			var evalText = doT.template($("#act-template").text());
			$("#act-content").html(evalText(testData));
		});

	}
	//coding...

	api.hideProgress();

	//	var testData = {"array":
	//					[{"username":"jackshen","act_name":"斯诺克","location":"绅士俱乐部","details":"一起来斯诺克吧！我等你哟","time":"2014-04-04","type":"娱乐"},
	//					{"username":"jackshen","act_name":"篮球","location":"第一运动场","details":"性别不限！但求实力对手！","time":"2014-04-04","type":"运动"},
	//					{"username":"北哥","act_name":"约么？","location":"某个Hotel！你选","details":"你懂的！哈哈~~","time":"2014-04-04","type":"学习"},
	//					{"username":"北哥","act_name":"吃货，走起！","location":"必胜客","details":"吃个饱饱哒，便宜实惠！","time":"2014-04-04","type":"拼桌"},
	//					{"username":"jackshen","act_name":"看个电影吧！","location":"男主白血病影院","details":"失恋求安慰！","time":"2014-04-04","type":"电影"},
	//					{"username":"北哥","act_name":"K歌","location":"宝龙","details":"谁能与我一 觉 高下！","time":"2014-04-04","type":"娱乐"},
	//					{"username":"jackshen","act_name":"露天桌游！","location":"钱塘江泮","details":"性别不限！但求实力对手！","time":"2014-04-04","type":"娱乐"},
	//					]
	//					};
	//
	//	var onlyMine = {"array":[]};
	//	for ( var i=0;i < testData.array.length;i++)
	//	{
	//			if(testData.array[i].username === '北哥')
	//			{
	//				onlyMine.array.push(testData.array[i]);
	//			}
	//	}
	//	if (id==1)
	//	{
	//		var evalText = doT.template($("#act-template").text());
	//		$("#act-content").html(evalText(onlyMine));
	//	}else
	//	{
	//		var evalText = doT.template($("#act-template").text());
	//		$("#act-content").html(evalText(testData));
	//	}

}

function setTimeMemo() {
	var username = $api.getStorage("uid");
	var get_memorandumURL = "/get_memorandum_0?"
	api.ajax({
		url : serverAddr + get_memorandumURL + "username=" + username,
		method : 'get',
		cache : false,
		timeout : 30,
		dataType : 'json',
		returnAll : false,
	}, function(ret, err) {
		//coding...

		for (var i = 0; i < ret.array.length; i++) {
			//alert(ret.array[i].location);
			var myDate = new Date()
			var myMonth = myDate.getMonth() + 1;
			var myDay = myDate.getDate();
			if (myMonth < 10) {
				myMonth = "0" + myMonth;
			}
			if (myDay < 10) {
				myDay = "0" + myDay;
			}
			var nowTime = myDate.getFullYear() + "-" + myMonth + "-" + myDay;
			//alert(nowTime);
			if (nowTime == ret.array[i].day) {
				//alert(ret.array[i].day+"ok");
				api.notification({
					notify : {
						title : "Together",
						content : ret.array[i].location + " " + ret.array[i].details,
						extra : ret.array[i].location + " " + ret.array[i].details,
					},
					alarm : {
						hour : ret.array[i].hour,
						minutes : ret.array[i].min,
						daysOfWeek : [1, 2, 3, 4, 5, 6, 7]
					}
				}, function(ret, err) {
				});
			}
		}

	});

}

function setLocationMemo() {
	mstartLocation();
	var username = $api.getStorage("uid");
	var get_memorandumURL = "/get_memorandum_0?"
	api.ajax({
		url : serverAddr + get_memorandumURL + "username=" + username,
		method : 'get',
		cache : false,
		timeout : 30,
		dataType : 'json',
		returnAll : false,
	}, function(ret, err) {
		//coding...

		for (var i = 0; i < ret.array.length; i++) {
			//alert(ret.array[i].location);
			var myDate = new Date()
			var myHours = myDate.getHours();
			var myMinutes = myDate.getMinutes();
			

			//alert(nowTime);
			var lat2 = parseFloat($api.byId('lat').innerHTML);
			var lon2 = parseFloat($api.byId('lon').innerHTML);
			
			var distance = getGreatCircleDistance(ret.array[i].lat, ret.array[i].lon, lat2, lon2);
			//alert(distance);
			if ( distance < 1000 ) {
				//alert(ret.array[i].day+"ok");
				api.notification({
					notify : {
						title : "Together",
						content : "你离 " + ret.array[i].location + "约 "+distance+" 米，你可以顺便 " + ret.array[i].details,
						extra : ret.array[i].id,
					},
					alarm : {
						hour : myHours,
						minutes : myMinutes+1,
						daysOfWeek : [1, 2, 3, 4, 5, 6, 7]
					}
				}, function(ret, err) {
				});
			}
		}

	});
}

function mstartLocation() {
	api.startLocation({
		accuracy : '100m',
		filter : 1,
		autoStop : true
	}, function(ret, err) {
		if (ret.status) {
			var lat = ret.latitude;
			var lon = ret.longitude;
			var time = ret.timestamp;
			$api.byId('lat').innerHTML = lat;
			$api.byId('lon').innerHTML = lon;

		} else {
			api.alert({
				msg : err.msg
			});
		}
	});
}

function memo_details(id){
            api.openWin({
        name : 'memo-details',
        url : './Memorandum-details.html',
        pageParam : {
            id : id
        }
    });
        }
apiready = function() {

	setTimeMemo();
	setLocationMemo();
	
	api.addEventListener({
		name : 'noticeclicked'
	}, function(ret, err) {
		var value = ret.value;
		if (ret.type == 0) {
			//APICloud推送内容
			memo_details(value);
		} else if (ret.type == 1) {
			//开发者自定义消息
		}
	})
	//  getBanner(api.pageParam.tid);
	//  initPage(api.pageParam.tid);

	//pull to refresh

	var navigationBar = api.require("navigationBar");
	var params = {
		x : 0,
		y : 0,
		w : api.frameWidth,
		//h: 49,
		//style: "up_to_down",

		style : "left_to_right",
		fixedOn : api.frameName,
		itemSize : {
			w : api.frameName / 2,
			h : 60
		},
		items : [{
			title : "好友动态",
			titleSelected : "好友动态",
			bg : "#898BA4",
			alpha : 0.8,
			bgSelected : "#6870C4"
		}, {
			title : "半个陌生人",
			titleSelected : "半个陌生人",
			bg : "#898BA4",
			alpha : 0.8,
			bgSelected : "#6870C4"
		}],
		font : {
			//size:           //导航项字体大小.数字.默认系统字号，可为空
			sizeSelected : 20,   // 选中时,导航项字体大小.默认size大小，可为空
			//color:         ,   // 导航条字体颜色.字符串.默认#FFFFFF,可为空
			//colorSelected:  ,// 导航条字体颜色.字符串.默认与 color 相同.可为空
			//alpha:   ,// 背景透明度. 数字.取值范围0-1，默认1，可为空
		},
		selectedIndex : 0
	};
	var index = 0;
	function callback(ret, err) {
		if (!ret) {
			api.alert({
				title : "出错了",
				msg : err["msg"]
			});
			return;
		}
		getData(ret.index);
		window.index = ret.index;
		//	alert(window.index);
		//api.alert({title: "提示", msg: "您点击了 "+ret.id+"   " +ret.index+ "导航项!"});
	}


	navigationBar.open(params, callback);

	api.setRefreshHeaderInfo({
		visible : true,
		// loadingImgae: 'wgt://image/refresh-white.png',
		bgColor : '#f2f2f2',
		textColor : '#4d4d4d',
		textDown : '下拉刷新...',
		textUp : '松开刷新...',
		showTime : true
	}, function(ret, err) {

		//getBanner(api.pageParam.tid);
		//initPage(api.pageParam.tid);
		//alert("刷新完成！\n不过现在数据是死的！");
		setTimeMemo();
		setLocationMemo();
		getData(window.index);
		//      alert(window.index);
		api.refreshHeaderLoadDone();
	});
	api.addEventListener({
		name : 'scrolltobottom'
	}, function(ret, err) {
		api.toast({
			msg : '已经没有啦！'
		});
		//getBanner(api.pageParam.tid);
		//initPage(api.pageParam.tid);
	});

};
