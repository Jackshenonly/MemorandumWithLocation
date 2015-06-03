var inputWrap = $api.domAll('.input-wrap');
var i = 0, len = inputWrap.length;
for (i; i < len; i++) {
    var txt = $api.dom(inputWrap[i], '.txt');
    var del = $api.dom(inputWrap[i], '.del');
    (function (txt, del) {
        $api.addEvt(txt, 'focus', function () {
            if (txt.value) {
                $api.addCls(del, 'show');
            }
            $api.addCls(txt, 'light');
        });
        $api.addEvt(txt, 'blur', function () {
            $api.removeCls(del, 'show');
            $api.removeCls(txt, 'light');
        });
    })(txt, del);

}

function delWord(el) {
    var input = $api.prev(el, '.txt');
    input.value = '';
}

function ensure() {
    api.showProgress({
        title: '注册中...',
        modal: false
    });
    var name = $api.byId('userName').value;
    var pwd = $api.byId('userPwd').value;
    var pwd2 = $api.byId('userPwd2').value;
    if (name ==="all00" || name ==="all01" || name ==="all10" || name ==="all11")
    {
    	alert("用户已经被注册！");
    	api.hideProgress();
    	return ;
    }
    if (pwd !== pwd2) {
        api.alert({
            msg: '两次密码不一致'
        }, function (ret, err) {
        api.hideProgress();
                //coding...
        });
        	return;
        
      }
    if(!name)
    {api.alert({msg:'账号不能为空！'
    },function(ret,err){
    api.hideProgress();
    	//coding...
    });
    	return;
    }
    
    var registerUrl = '/register?';
    api.ajax({
	    url:serverAddr + registerUrl +"username="+name+"&password="+pwd,
	    method:'POST',
	    cache: false,
        timeout: 30,
        dataType: 'text',
        returnAll: false,
    },function(ret,err){
    	if(ret==="1")
    	{
    		alert("注册成功！");
    		api.closeWin();
    	}
    	else if(ret ==="2")
    	{alert("用户已经被注册！");}
    	else {alert("注册失败！请重试！");}
    	//coding...
    });
    api.hideProgress();
    /*
//  var bodyParam = {
//      username: uname,
//      password: pwd2
//  }
//  ajaxRequest(registerUrl, 'post', JSON.stringify(bodyParam), function (ret, err) {
//      if (ret) {
//          api.alert({
//              msg: '注册成功！'
//          }, function () {
//              api.closeWin();
//          });
//
//      } else {
//          api.alert({
//              msg: err.msg
//          });
//      }
//      api.hideProgress();
//  })*/
}

apiready = function () {
    var header = $api.byId('header');
    $api.fixIos7Bar(header);
};