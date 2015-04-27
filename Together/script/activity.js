function friendDetails(username){
alert("你点击了"+username);
}
function addFriend(){
alert("添加好友");
}

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

function getBanner() {
    api.showProgress({
        title: '加载中...',
        modal: false
    });

    var getActivityUrl = '/activity';
    ajaxRequest(getActivityUrl, 'GET', '', function (ret, err) {
        if (ret) {
            var content = $api.byId('banner-content');
            var tpl = $api.byId('banner-template').text;
            var tempFn = doT.template(tpl);

            //轮播图只显示3张
            var result = [];
            for(var i=0, len=3; i<len; i++){
                result.push(ret[i]);
            }
            content.innerHTML = tempFn(result);
            initSlide();
        } else {
            alert(JSON.stringify(err))
        }
        api.hideProgress();
    })
}

function getData() {

    api.showProgress({
        title: '加载中...',
        modal: false,
        
    });

//  var getActivityUrl = '/activity';
//  ajaxRequest(getActivityUrl, 'GET', '', function (ret, err) {
//      if (ret) {

			var ret = 
		{"array":
			[{"name":"jackshen","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"rose","sex":0,"image":"widget://image/jack.jpg"},
			{"name":"jackshen","sex":0,"image":"widget://image/jack.jpg"},
			{"name":"路向北","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"西游记","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"孙悟空","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"泰坦尼克","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"小鸡鸡","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"顾明辉","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"汪朝晖","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"万盛玮","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"草泥马","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"背锅","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"思密达","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"哈哈哈","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"嘻嘻嘻","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"Alibaba","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"baidu","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"tencent","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"baidu","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"baidu","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"tencent","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"baidu","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"tencent","sex":1,"image":"widget://image/jack.jpg"},
			{"name":"baidu","sex":1,"image":"widget://image/jack.jpg"},]
			
		};
//          var content = $api.byId('contactList');
//          var tpl = $api.byId('contacttmpl').text;
//          var tempFn = doT.template(tpl);
//          content.innerHTML = tempFn(ret);
			var evalText = doT.template($("#contacttmpl").text());
			$("#content_contactList").html(evalText(ret));
            
            api.parseTapmode();//使模板生效
            
//      } else {
//          api.toast({msg: err.msg, location: 'middle'})
//      }
      api.hideProgress();
//  })

}

//filter data
function getDataByFilter(filter, id) {
    if (!id || !filter) {
        return;
    }
    api.showProgress({
        title: '加载中...',
        modal: false
    });
    var urlParam = {}, whereParam = {};
    whereParam[filter] = id;
    whereParam['category'] = 4;
    urlParam['where'] = whereParam;
    var getActivityByIdUrl = '/activity?filter=';
    ajaxRequest(getActivityByIdUrl + JSON.stringify(urlParam), 'GET', '', function (ret, err) {
        if (ret) {
            var content = $api.byId('act-content');
            var tpl = $api.byId('act-template').text;
            var tempFn = doT.template(tpl);
            content.innerHTML = tempFn(ret);
            //init tapmode
            api.parseTapmode();
        } else {
            api.toast({msg: err.msg, location: 'middle'})
        }
        api.hideProgress();
    })

}


function openActDetail(did) {
    api.openWin({
        name: 'actDetail',
        url: 'actDetail.html',
//		delay: 200,
        pageParam: {dataId: did}
    });
}

apiready = function () {

//  getBanner();
    getData();



//pull to refresh
    api.setRefreshHeaderInfo({
        visible: true,
        // loadingImgae: 'wgt://image/refresh-white.png',
        bgColor: '#f2f2f2',
        textColor: '#4d4d4d',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    }, function (ret, err) {
    
//      getBanner();
        getData();

        api.refreshHeaderLoadDone();
    });

	//拉到底部刷新
    api.addEventListener({
        name: 'scrolltobottom'
    }, function (ret, err) {
        //getBanner();
        getData();
    });
    

};