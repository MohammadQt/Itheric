	function extractDomain(url) {
		var hostname;
		if (url.indexOf("://") > -1) {hostname = url.split('/')[2];}
		else {hostname = url.split('/')[0];}
		hostname = hostname.split(':')[0];
		hostname = hostname.split('?')[0];
		return hostname;
	}
	function exception(){
		var exception = new Array();	
		setting.pengecualian = setting.pengecualian;
		exception = setting.pengecualian.split(",");
		return exception;
	}
	function hanyauntuk(){
		var hanyauntuk = new Array();	
		setting.hanyauntuk = setting.hanyauntuk;
		hanyauntuk = setting.hanyauntuk.split(",");
		return hanyauntuk;
	}

	function convertstr(str) {
		return str.replace(/^\s+/, '').replace(/\s+$/, '');
	}

	if (!setting.pengecualian) {
		setting.pengecualian = window.location.href;
	}else {
		setting.pengecualian += ","+window.location.href;
	}
	var exception = exception();
	var exceptionlength = exception.length;
	var hanyauntuk = hanyauntuk();
	var hanyauntuklength = hanyauntuk.length;
	var checklink = "";
	var checkexception = "";	
	var linktag = document.getElementsByTagName("a");
	var blogpage = setting.pageurl;		

	if (setting.pengecualianstatus == false && setting.hanyauntukstatus == false) {
		alert('Silahkan pilih salah satu status agar auto link aktif !')
	}

	for (var i = 0; i < linktag.length; i++) {	
		checkpengecualian = true;
		checkhanyauntuk = false;
		no = 0;
		if (setting.pengecualianstatus) {		
			checkpengecualian = false;
			while (checkpengecualian == false && no < exceptionlength) {
				checklink = extractDomain(linktag[i].href);
				checkexception = extractDomain(exception[no]);
				if (checklink.match(checkexception)) {
					checkpengecualian = true;
				}
				no++;
			}
		}
		if (setting.hanyauntukstatus) {	
			checkhanyauntuk = false;
			while (checkhanyauntuk == false && no < hanyauntuklength) {
				checklink = extractDomain(linktag[i].href);
				checkexception = extractDomain(hanyauntuk[no]);
				if (checklink.match(checkexception)) {
					checkhanyauntuk = true;
				}
				no++;
			}	
		}
		if (checkpengecualian == false || checkhanyauntuk == true) {	
			linktag[i].href = blogpage + setting.path + aesCrypto.encrypt(convertstr(linktag[i].href),convertstr('root'));
			linktag[i].target = "_blank";
		}
	}
