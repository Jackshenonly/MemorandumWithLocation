function friendDetails(username){
alert("你点击了"+username);
}
function addFriend(){
//alert("添加好友");
			api.prompt({
				title : "添加好友",
				buttons : ['确定', '取消']
			}, function(ret, err) {
				if (ret.buttonIndex == 1) {
					//					api.alert({
					//						msg : ret.text
					//					});
				    commit(ret.text);
				}
			});  
}


function commit(comments) {
		    
			var username = $api.getStorage('uid');

			var mystr = "HostUsername=" + username + "&FriendUsername=" + comments;
			//alert(mystr);
			var addFriendUrl = '/add_friend?'
			api.ajax({
				url : serverAddr + addFriendUrl + mystr,
				method : 'post',
				cache : false,
				timeout : 30,
				dataType : 'text',
				returnAll : false,
			}, function(ret, err) {
				if (ret === '1') {
				
					api.alert({
						msg : '添加成功！'
					}, function(ret, err) {
					
						getData()
						//coding...
					});
				} 
				else if(ret ==="2")
				{
					alert("该用户已经是你的好友了！");
				}
				else if(ret ==="3")
				{
					alert("没有该用户！");
				}
				else {
					alert('添加失败！请重试！');
				}
			});
		}


function haveAtry()
{
			var username = $api.getStorage('uid');

			var mystr = username;
			//alert(mystr);
			var haveAtryUrl = '/haveAtry/'
			api.ajax({
				url : serverAddr + haveAtryUrl + mystr,
				method : 'get',
				cache : false,
				timeout : 30,
				dataType : 'text',
				returnAll : false,
			}, function(ret, err) {

				
					api.alert({
						title:"你可以尝试添加以下用户：",
						msg : ret,
					}, function(ret, err) {
					
						
						//coding...
					});
	

			});
		
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
	var username = $api.getStorage('uid');

			var mystr = username;
			//alert(mystr);
			var getFriendUrl = '/get_friend/'
			api.ajax({
				url : serverAddr + getFriendUrl + mystr,
				method : 'get',
				cache : false,
				timeout : 30,
				dataType : 'json',
				returnAll : false,
			}, function(ret, err) {
				if (ret) {
				var evalText = doT.template($("#contacttmpl").text());
				$("#content_contactList").html(evalText(ret));
				api.parseTapmode();//使模板生效

				} 
				
				else {
					alert('你还没有好友！试试缘分吧！');
				}
			});
/*
//			var ret = 
//		{"array":
//			[{"name":"jackshen","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"rose","sex":0,"image":"widget://image/jack.jpg"},
//			{"name":"jackshen","sex":0,"image":"widget://image/jack.jpg"},
//			{"name":"路向北","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"西游记","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"孙悟空","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"泰坦尼克","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"小鸡鸡","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"顾明辉","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"汪朝晖","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"万盛玮","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"草泥马","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"背锅","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"思密达","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"哈哈哈","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"嘻嘻嘻","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"Alibaba","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"baidu","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"tencent","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"baidu","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"baidu","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"tencent","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"baidu","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"tencent","sex":1,"image":"widget://image/jack.jpg"},
//			{"name":"baidu","sex":1,"image":"widget://image/jack.jpg"},]
//			
//		};
//			
//			
 */           
            
            

      api.hideProgress();


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