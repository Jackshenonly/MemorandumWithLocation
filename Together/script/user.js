
function act_details_mine(id){
		api.openWin({
		name: 'act-details-mine',
		url: './act-details-mine.html',
		pageParam: {id: id }
	});
}
function act_details(id){
		api.openWin({
		name: 'act-details',
		url: './act-details.html',
		pageParam: {id: id }
	});
}
function check(act_id,publisher)
{	
      var uid = $api.getStorage('uid');
   if (uid==publisher)
 {
    act_details_mine(act_id);
 }
  else
  {
    act_details(act_id);    
    }
}

function getdata(){

	var uid = $api.getStorage('uid');
	var URL = "/getPersonalData/";

	api.ajax({
				url : serverAddr + URL + uid,
				method : 'get',
				cache : false,
				timeout : 30,
				dataType : 'json',
				returnAll : false,
			}, function(ret, err) {
			
			
			initPersional(ret);
			
			});
			



}

function initPersional(ret1)
{
	//alert(ret.NickName);

    
    var personalCenter = api.require('personalCenter');

personalCenter.open({
    imgPath:'widget://image/jack.jpg',
    placeholderImg: 'widget://image/jack.jpg',
    showLeftBtn:false,
    showRightBtn:false,
    y:0,
    h:200,
    userName:ret1.NickName+"("+ret1.Gender+")",
    count: ret1.Credit,
  
  	fixedOn:'user',
    btnArray:[
        {
        	title:"我的活动",
        	titleColor:'#FFFFFF',
        	count:ret1.myActivity.count,
            bgImg:'widget://image/userbg.png',
            
    		
    },
	        {
        	title:"我的收藏",
        	titleColor:'#FFFFFF',
        	count:ret1.myCollect.count,
            bgImg:'widget://image/userbg.png',
    		
    },
    	        {
        	title:"我参加的",
        	titleColor:'#FFFFFF',
        	count:ret1.myParticipate.count,
            bgImg:'widget://image/userbg.png',
    		
    },
    ]
    },function(ret,err){
	
		display(ret.click,ret1);
});


}

function display(id,ret1){
	
			if(id ==0)
	{	

		var evalText = doT.template($("#act-template").text());
		$("#act-content").html(evalText(ret1.myActivity));
		
	}
		if(id ==1)
	{	
	
		var evalText = doT.template($("#act-template").text());
		$("#act-content").html(evalText(ret1.myCollect));
	}
		if(id ==2)
	{
		var evalText = doT.template($("#act-template").text());
		$("#act-content").html(evalText(ret1.myParticipate));
	}
	
		
}
apiready = function () {
	
	getdata();
	api.setRefreshHeaderInfo({
	visible: true,
        // loadingImgae: 'wgt://image/refresh-white.png',
        bgColor: '#f2f2f2',
        textColor: '#4d4d4d',
        textDown: '下拉刷新...',
        textUp: '松开刷新...',
        showTime: true
    },function(ret,err){
    	//coding...
    	getdata();
    	api.refreshHeaderLoadDone();
    });
	

	
};

