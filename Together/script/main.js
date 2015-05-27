function myalert(){
alert("你点击了图片");
}
function act_details(id){
		api.openWin({
		name: 'act-details',
		url: './act-details.html',
		pageParam: {id: id }
	});
}
function publish(){
	var uid = $api.getStorage('uid');
		if(!uid){
			api.openWin({
		        name: 'userLogin',
		        url: './userLogin.html',
		        opaque: true,
		        vScrollBarEnabled:false
		    });
		    return;
		}

	api.openWin({
		name: 'act-publish',
		url: './act-publish.html'
	});
	
}

function initSlide() {
    var slide = $api.byId('slide');
    var pointer = $api.domAll('#pointer a');
    window.mySlide = Swipe(slide, {
        // startSlide: 2,
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

function openActDetail(did) {
    api.openWin({
        name: 'actDetail',
        url: 'actDetail.html',
        pageParam: {dataId: did}
    });
}

function openLifeDetail(title,type){
    api.openWin({
        name: 'life-list',
        url: 'life-list.html',
        opaque: true,
        vScrollBarEnabled: false,
        pageParam:{title:title,type:type}
    });
}

function getData(type) {
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

		var typeData = {"array":[]};
	        type = arguments[0] || "全部";
	
	
	var getdataUrl = "/get_act_list/all"
	api.ajax({
	    url:serverAddr + getdataUrl,
	    method:'get',
	    cache: false,
        timeout: 30,
        dataType: 'json',
        returnAll: false
    },function(ret,err){
    	testData = ret;
    	if (type==="全部")
	{
		var evalText = doT.template($("#act-template").text());
		$("#act-content").html(evalText(testData));
	}
	else
	{
		for( var i = 0;i < testData.array.length; i++)
		{
			if(testData.array[i].type===type)
			{	typeData.array.push(testData.array[i]);}
		}
		var evalText = doT.template($("#act-template").text());
		$("#act-content").html(evalText(typeData));
	}
    	//coding...
    });
	
	
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

	




}

function getBanner(id) {
//  api.showProgress({
//      title: '加载中...',
//      modal: false
//  });
//  var getTabBarBannerUrl = '/tabBar?filter=';
//  var urlParam = {
//      include: ["banner"],
//      where: {
//          id: id
//      }
//  };
//  ajaxRequest(getTabBarBannerUrl + JSON.stringify(urlParam), 'GET', '', function (ret, err) {
//      if (ret) {
//          var content = $api.byId('banner-content');
//          var tpl = $api.byId('banner-template').text;
//          var tempFn = doT.template(tpl);
//          content.innerHTML = tempFn(ret[0].banner);
//          initSlide();
//      } else {
//          api.alert({
//              msg: err.msg
//          });
//      }
//  })
	var testData = {"array":[{"url":"http://cms.csdnimg.cn/article/201408/29/53ffe43d28129.jpg","name":"Linux4.0 is Nice！"},
					{"url":"http://news.myfiles.com.cn/img/20120907/be2f097a301a4a3e8de75a81b0b8e50d.jpg","name":"Ubuntu"},
					{"url":"../image/jack.jpg","name":"I am jack!"}]
					};
					
	var evalText = doT.template($("#banner-template").text());
	$("#banner-content").html(evalText(testData));
    initSlide();        
    	



}

function act_selecter(){
	
	var type = ['全部','娱乐','运动',"学习","拼桌","电影","游戏"];
	api.actionSheet({
    title: '选择活动类型',
    cancelTitle: '取消',
    //destructiveTitle: '红色警告按钮',
    buttons: type
},function(ret,err){
	if(ret.buttonIndex==8)
	{}
	else {
	var result = $api.byId("result");
    result.innerHTML="<b>"+type[ret.buttonIndex-1]+"</b>";
    getData(type[ret.buttonIndex-1]);
    //api.alert({msg: '你刚点击了'+ret.buttonIndex });
    }
});
	
	
	/*
   var arrayTitle = new Array();
	arrayTitle[0]='学习';
	arrayTitle[1]='娱乐';
	arrayTitle[2]='运动';
	arrayTitle[3]='用膳';
	arrayTitle[3]='Game';
	var obj = api.require('multiSelector');
	obj.open({
				y:50,
    	     content:arrayTitle,
    	     
     	},function(ret,err){
        	 var selectObj="";
         	for (var index in ret.selectAry)
        	 {
            	 selectObj = selectObj + ret.selectAry[index]+",";
        	 }
        	 var result = $api.byId("result");
        	 result.innerHTML="活动类型:"+"<b>"+selectObj+"</b>";
        	 obj.close();
         	//api.alert({msg:'选择器选取的数据是'+ selectObj});
 });
    */

}



apiready = function () {
    getBanner(api.pageParam.tid);
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
        getBanner(api.pageParam.tid);
        getData();

        api.refreshHeaderLoadDone();
    });


    api.addEventListener({
        name: 'scrolltobottom'
    }, function (ret, err) {
    	api.toast({
	        msg:'已经没有啦！'
        });
    	//api.alert({msg:test},function(ret,err){});	
    	
        //getBanner(api.pageParam.tid);
       // getData(api.pageParam.tid);
    });
    
   
    
    
    
    
};