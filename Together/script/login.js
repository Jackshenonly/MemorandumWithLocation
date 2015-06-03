function delWord(el) {
    var input = $api.prev(el, '.txt');
    input.value = '';
}

function login() {
    api.openWin({
        name: 'userRegister',
        url: 'userRegister.html',
        opaque: true,
        vScrollBarEnabled: false
    });
}

function ensure() {
    api.showProgress({
        title: '正在登录...',
        modal: false
    });
    var name = $api.byId('username').value;
    var pwd = $api.byId('password').value;
	if(name && pwd)
	{
	
    var loginUrl = '/login?';
    api.ajax({
	    url: serverAddr + loginUrl +"username="+name+"&password="+pwd,
	    method:'post',
	    cache: false,
        timeout: 30,
        dataType: 'text',
        returnAll: false,
    },function(ret,err){
    	//alert(ret);
    	if(ret==="1")
    	{
    		$api.setStorage('uid', name);
    		$api.setStorage('pwd',pwd);
    		
    		setTimeout(function () {
                api.closeWin();
            }, 100);
            //$api.setStorage('token', ret.id);
    	}
    	else{alert("请检查用户名和密码！");}
    	
    	api.hideProgress();
    });
    
    
    

    
    }
	else
	{alert("用户名或密码不能为空！");
	api.hideProgress();}
	
}

apiready = function () {
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
};