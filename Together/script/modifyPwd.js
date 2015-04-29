function delWord(el) {
	var input = $api.prev(el, '.txt');
	input.value = '';
}

function ensure() {
		api.showProgress({
        title: '密码修改中...',
        modal: false
    });
	var newPwd = $api.byId('newPwd').value;
	var newPwd2 = $api.byId('newPwd2').value;
	var uid = $api.getStorage('uid');
	if (newPwd !== newPwd2) {
		api.alert({
			msg : '确认密码与新密码不一致'
		});
	}
	if (newPwd && newPwd2 && newPwd === newPwd2) {
		var pwdmodifyUrl = '/pwd_modify?';
		api.ajax({
			url : serverAddr + pwdmodifyUrl + "username=" + uid + "&newpwd=" + newPwd2,
			method : 'POST',
			cache : false,
			timeout : 30,
			dataType : 'text',
			returnAll : false,
		}, function(ret, err) {
			if (ret === "1") {
				alert("密码修改成功！");
				api.closeWin();
			
			} else {
				alert("修改失败！请重试！");
			}
			//coding...
		});
		api.hideProgress();
	}
}

var inputWrap = $api.domAll('.input-wrap');
var i = 0, len = inputWrap.length;
for (i; i < len; i++) {
	var txt = $api.dom(inputWrap[i], '.txt');
	var del = $api.dom(inputWrap[i], '.del');
	(function(txt, del) {
		$api.addEvt(txt, 'focus', function() {
			if (txt.value) {
				$api.addCls(del, 'show');
			}
			$api.addCls(txt, 'light');
		});
		$api.addEvt(txt, 'blur', function() {
			$api.removeCls(del, 'show');
			$api.removeCls(txt, 'light');
		});
	})(txt, del);

}

apiready = function() {
	var header = $api.byId('header');
	$api.fixIos7Bar(header);
}; 