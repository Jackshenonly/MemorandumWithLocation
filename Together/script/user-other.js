function check()
{	
	var previous = api.pageParam.previous;
	
	if(previous === 'act-details-mine')
	{
		var html = "<a class=\"btn\" onclick=\"reject()\">也许不合适！</a>"
		$api.byId('reject').innerHTML = html;
	}
}
function reject()
{

	var username = api.pageParam.username;
	
				api.confirm({
				title : '亲',
				msg : '你确定要决绝' + username + '吗！',
				buttons : ['残忍拒绝', '我再想想']
			}, function(ret, err) {
				//coding...
				if (ret.buttonIndex == 1) {
					var username = api.pageParam.username;
					var act_id = $api.getStorage('act_id');
				var rejectURL = "/reject?"+"username="+username+"&act_id="+act_id;	
		            	api.ajax({
	    		url : serverAddr +rejectURL ,
				method : 'get',
				cache : false,
				timeout : 30,
				dataType : 'text',
				returnAll : false,
    },function(ret,err){
    	//coding...
    	if(ret === "1")
    	{
    		api.alert({msg:"拒绝成功！"
            },function(ret,err){
            	//coding...
            });
            api.closeWin();
    	}
    	else{
    	    		api.alert({msg:"操作失败！请检查网络！"
            },function(ret,err){
            	//coding...
            });
    	}
    });

				}
			});

	
	
}

function openchatDetail(){
	fromuser = api.pageParam.username;
    api.openWin({
        name: 'chat',
        url: 'chat.html',

        pageParam:{fromuser:fromuser}
    });
}

function act_details(id){
		api.openWin({
		name: 'act-details',
		url: './act-details.html',
		pageParam: {id: id }
	});
}

function getdata(){

	//var uid = $api.getStorage('uid');
	var uid = api.pageParam.username;
	
	
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
    y:45,
    h:200,
    userName:ret1.NickName+"("+ret1.Gender+")",
    count: ret1.Credit,
  
  	fixedOn:api.frameName,
    btnArray:[
        {
        	title:"他的活动",
        	titleColor:'#FFFFFF',
        	count:ret1.myActivity.count,
            bgImg:'widget://image/userbg.png',
            
    		
    },
	        {
        	title:"他的收藏",
        	titleColor:'#FFFFFF',
        	count:ret1.myCollect.count,
            bgImg:'widget://image/userbg.png',
    		
    },
    	        {
        	title:"他参加的",
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
	{	var evalText = doT.template($("#act-template").text());
		$("#act-content").html(evalText(ret1.myCollect));
	}
		if(id ==2)
	{			var evalText = doT.template($("#act-template").text());
		$("#act-content").html(evalText(ret1.myParticipate));
	}
	
		
}
apiready = function () {
	
	check();
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
    	check();
    	getdata();
    	
    	api.refreshHeaderLoadDone();
    });
	

	
};

