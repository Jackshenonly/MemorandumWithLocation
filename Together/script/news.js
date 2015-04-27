function initSlide() {
    var slide = $api.byId('slide');
    var pointer = $api.domAll('#pointer a');
    window.mySlide = Swipe(slide, {
        // startSlide: 4,
        auto: 5000,
        continuous: true,
        disableScroll: true,
        stopPropagation: true,
        callback: function (index, element) {
            var actPoint = $api.dom('#pointer a.active');
            $api.removeCls(actPoint, 'active');
            $api.addCls(pointer[index], 'active');
        },
        transitionEnd: function (index, element) {

        }
    });
}

function getBanner(id) {
    api.showProgress({
        title: '加载中...',
        modal: false
    });
    var getTabBarBannerUrl = '/tabBar?filter=';
    var urlParam = {
        include: ["banner"],
        where: {
            id: id
        }
    };
    ajaxRequest(getTabBarBannerUrl + JSON.stringify(urlParam), 'GET', '', function (ret, err) {
        if (ret) {
            var content = $api.byId('banner-content');
            var tpl = $api.byId('banner-template').text;
            var tempFn = doT.template(tpl);
            content.innerHTML = tempFn(ret[0].banner);
            initSlide();
        } else {
            api.toast({msg: err.msg, location: 'middle'})
        }
    })
}

function openNews(el, type) {
    type = type || 't';

    var newsId = $api.attr(el, 'newsId');
    //text news
    if (type === 't') {
        api.openWin({
            name: 'news-text',
            url: 'news-text.html',
            pageParam: {newsId: newsId},
            opaque: true,
            vScrollBarEnabled: false
        });
    } else if (type === 'p') {	//picture news
        api.openWin({
            name: 'news-pic',
            url: 'news-pic.html',
            pageParam: {newsId: newsId},
            opaque: true,
            vScrollBarEnabled: false
        });

    } else if (type === 'v') {	//video news

        api.openWin({
            name: 'news-video',
            url: 'news-video.html',
            opaque: true,
            vScrollBarEnabled: false,
            pageParam: {newsId: newsId}
        });

        event.preventDefault();
    }

}

function initPage(id) {
    var getTabBarActivityUrl = '/tabBar?filter=';
    var urlParam = {
        include: ["news"],
        where: {
            id: id
        }
    };
    ajaxRequest(getTabBarActivityUrl + JSON.stringify(urlParam), 'GET', '', function (ret, err) {
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
            api.toast({msg: err.msg, location: 'middle'})
        }
        api.hideProgress();
    })
}

function getData(id) {
/*
//  var getTabBarActivityUrl = '/tabBar?filter=';
//  var urlParam = {
//      include: ["activity"],
//      where: {
//          id: id
//      }
//  };
//  ajaxRequest(getTabBarActivityUrl + JSON.stringify(urlParam), 'GET', '', function (ret, err) {
//      if (ret) {
//          var content = $api.byId('act-content');
//          var tpl = $api.byId('act-template').text;
//          var tempFn = doT.template(tpl);
//          content.innerHTML = tempFn(ret[0].activity);
//      } else {
//          api.alert({
//              msg: err.msg
//          });
//      }
//      api.hideProgress();
//  })
*/
	var testData = {"array":
					[{"username":"jackshen","act_name":"斯诺克","location":"绅士俱乐部","details":"一起来斯诺克吧！我等你哟","time":"2014-04-04","type":"娱乐"},
					{"username":"jackshen","act_name":"篮球","location":"第一运动场","details":"性别不限！但求实力对手！","time":"2014-04-04","type":"运动"},
					{"username":"北哥","act_name":"约么？","location":"某个Hotel！你选","details":"你懂的！哈哈~~","time":"2014-04-04","type":"学习"},
					{"username":"北哥","act_name":"吃货，走起！","location":"必胜客","details":"吃个饱饱哒，便宜实惠！","time":"2014-04-04","type":"拼桌"},
					{"username":"jackshen","act_name":"看个电影吧！","location":"男主白血病影院","details":"失恋求安慰！","time":"2014-04-04","type":"电影"},
					{"username":"北哥","act_name":"K歌","location":"宝龙","details":"谁能与我一 觉 高下！","time":"2014-04-04","type":"娱乐"},
					{"username":"jackshen","act_name":"露天桌游！","location":"钱塘江泮","details":"性别不限！但求实力对手！","time":"2014-04-04","type":"娱乐"},
					]
					};
	var username = "北哥";
	var onlyMine = {"array":[]};
	for ( var i=0;i < testData.array.length;i++)
	{
			if(testData.array[i].username === '北哥')
			{
				onlyMine.array.push(testData.array[i]);
			}
	}
	if (id==1)
	{
		var evalText = doT.template($("#act-template").text());
		$("#act-content").html(evalText(onlyMine));
	}else
	{
		var evalText = doT.template($("#act-template").text());
		$("#act-content").html(evalText(testData));
	}



}



apiready = function () {

//  getBanner(api.pageParam.tid);
//  initPage(api.pageParam.tid);

    //pull to refresh
    
var navigationBar = api.require("navigationBar");
var params = {
    x: 0,
    y: 0,
    w: api.frameWidth,
    //h: 49,
    //style: "up_to_down",
    
    style: "left_to_right",
    fixedOn:api.frameName,
itemSize:{
        w: api.frameName/2,
        h: 60
    },
    items: [
       
        {
              title:"好友动态",
               titleSelected:"好友动态",
              bg:"#ffff00",
            alpha: 0.8,
              bgSelected:"#ff00000"
        },
        {
              title:"我的动态",
               titleSelected:"我的动态",
              bg:"#ffff00",
            alpha: 0.8,
              bgSelected:"#ff00000"
        }
    ],
    font:{
    	//size:           //导航项字体大小.数字.默认系统字号，可为空
    	sizeSelected: 20,   // 选中时,导航项字体大小.默认size大小，可为空
    	//color:         ,   // 导航条字体颜色.字符串.默认#FFFFFF,可为空
    	//colorSelected:  ,// 导航条字体颜色.字符串.默认与 color 相同.可为空
    	//alpha:   ,// 背景透明度. 数字.取值范围0-1，默认1，可为空
    },
    selectedIndex:0
};

function callback(ret, err){
    if(! ret){
        api.alert({title: "出错了", msg: err["msg"]});
        return;
    }
	getData(ret.index);
    //api.alert({title: "提示", msg: "您点击了 "+ret.id+"   " +ret.index+ "导航项!"});
}

navigationBar.open(params, callback);
    
    
    api.setRefreshHeaderInfo({
        visible: true,
        // loadingImgae: 'wgt://image/refresh-white.png',
        bgColor: '#f2f2f2',
        textColor: '#4d4d4d',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    }, function (ret, err) {
        
        //getBanner(api.pageParam.tid);
        //initPage(api.pageParam.tid);
        alert("刷新完成！\n不过现在数据是死的！");
        getData();
        api.refreshHeaderLoadDone();
    });
    api.addEventListener({
        name: 'scrolltobottom'
    }, function (ret, err) {
    	alert("已经拉到底部了！");
        //getBanner(api.pageParam.tid);
        //initPage(api.pageParam.tid);
    });
};