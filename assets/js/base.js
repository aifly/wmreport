var imgs = {
	logo :"./assets/images/logo.png",
	loginLogo :"./assets/images/login-logo.png",
	loginTitle :"./assets/images/raterlogo.png",
	userLoginTitle :"./assets/images/userlogo.png",
	loginPerson :"./assets/images/login-person.png",
	loginLock :"./assets/images/login-lock.png",
	open :"./assets/images/open.png",
	search :"./assets/images/search.png",
	loginBg:"./assets/images/login-bg.jpg",

	man:'./assets/images/man.png',
	group:'./assets/images/group.png',
	scoreIco:'./assets/images/score-ico.png',
	logout:'./assets/images/logout.png',
	file:'./assets/images/file.png',
	user:'./assets/images/user.png',
	media:'./assets/images/media.png',
	shangbao:'./assets/images/shangbao.png',
	setting:'./assets/images/setting.png',
	poster:'./assets/images/poster1.png',
	//smile:'./assets/images/smile.png',
	titleBg:'./assets/images/title-bg.png',
	ruleIco:'./assets/images/rule-ico.png',
	imgIco:'./assets/images/img-ico.png',
	videoIco:'./assets/images/video-ico.png',
	audioIco:'./assets/images/audio-ico.png',
	dongmanIco:'./assets/images/dongman-ico.png',


}

Date.prototype.Format = function (fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
window.config = {
	baseUrl:'https://api.symbin.cn/v1'
}