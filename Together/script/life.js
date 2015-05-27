function openchatDetail(fromuser){
    api.openWin({
        name: 'chat',
        url: 'chat.html',

        pageParam:{fromuser:fromuser}
    });
}


function getChatList()
{
		api.showProgress({
        title: '加载中...',
        modal: false
    });
//	var testData = {"array":
//			[ {"img":'../image/jack.jpg',"title":'bagger'},
//            {"img":'../image/jack.jpg',"title":'标题'},
//            {"img":'http://img1.3lian.com/gif/more/11/201206/a5194ba8c27b17def4a7c5495aba5e32.jpg',"title":'标题',subTitle:'子标题'},
//            {"img":'../image/jack.jpg',"title":'jackshen',},
//            {"img":'../image/jack.jpg',"title":'bagger',},
//            {"img":'../image/jack.jpg',"title":'牛牛',},
//            {"img":'../image/jack.jpg',"title":'嘻嘻',},
//            {"img":'../image/jack.jpg',"title":'bagger',}
//           ]
//	}
	var username = $api.getStorage('uid');

			var mystr = username;
			//alert(mystr);
			var getChatListURL = '/getChatList/'
			api.ajax({
				url : serverAddr + getChatListURL + mystr,
				method : 'get',
				cache : false,
				timeout : 30,
				dataType : 'json',
				returnAll : false,
			}, function(ret, err) {

			var evalText = doT.template($("#chatlist-template").text());
			$("#chatlist-content").html(evalText(ret));
					

			});




	api.hideProgress();
    
	
	
}
apiready = function () {
    

    getChatList();
    

    
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
        //getBanner(api.pageParam.tid);
        getChatList();

        api.refreshHeaderLoadDone();
    });


    api.addEventListener({
        name: 'scrolltobottom'
    }, function (ret, err) {
    

    	
    	
        //getBanner(api.pageParam.tid);
       // getData(api.pageParam.tid);
    });
    
   
    
    
    
    
};