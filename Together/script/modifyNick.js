function ensure() {
    var uid = $api.getStorage('uid');
    var nickname = $api.byId('nickname').value;
	var mystr = "NickName="+nickname+"&username="+uid;
    var updateNickNameUrl = '/updateNickName?';

    api.ajax({
				url : serverAddr + updateNickNameUrl + mystr,
				method : 'post',
				cache : false,
				timeout : 30,
				dataType : 'text',
				returnAll : false,
			}, function(ret, err) {
				if (ret === '1') {
				
					api.alert({
						msg : '修改成功！'
					}, function(ret, err) {
					
						
						//coding...
					});
				} 
				else if(ret ==="0"){
				alert("修改失败！请重试");}
				else
				{
				alert("修改失败！请检查网络！");
				}

			});
}

apiready = function () {
    var header = $api.byId('header');
    $api.fixIos7Bar(header);

    var nickname = api.pageParam.nickname || '';
    $api.byId('nickname').value = nickname;
};