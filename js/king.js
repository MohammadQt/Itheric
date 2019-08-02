$.fn.isOverflowed = function(){
			var e = this[0];
			return e.scrollHeight &gt; e.clientHeight || e.scrollWidth &gt; e.clientWidth;
		};
		$(document).ready(function() {
	$(&#39;#copy-compact-link&#39;).click(function(){
		copyTextToClipboard($(&#39;#compact_link&#39;).val(),$(this));
	});
	$(&#39;.copy-compact-link&#39;).click(function(){
		copyTextToClipboard($(&#39;[name=&quot;compact_link_&#39; + $(this).data(&#39;id&#39;) + &#39;&quot;]&#39;).val(),$(this));
	});
});
var enable_btn = false;
var enableBtn = function (){
	enable_btn = true;
}
var readList = new Array();
var readCount = 0;
if (localStorage.getItem(&quot;ListSaved&quot;) != undefined || localStorage.getItem(&quot;ListSaved&quot;) != null) {
    readList = JSON.parse(localStorage.getItem(&quot;ListSaved&quot;));
}
if (localStorage.getItem(&quot;saveCount&quot;) != undefined || localStorage.getItem(&quot;saveCount&quot;) != null) {
    readCount = localStorage.getItem(&quot;saveCount&quot;);
}

function get_short_url(long_url, login, api_key, func)
{
    $.getJSON(
        &quot;https://api-ssl.bitly.com/v3/shorten&quot;, 
        { 
            &quot;format&quot;: &quot;json&quot;,
            &quot;apiKey&quot;: api_key,
            &quot;login&quot;: login,
            &quot;longUrl&quot;: long_url
        },
        function(response)
        {
            func(response.data);
        }
    );
}
function copyTextToClipboard(text,element) {
	var textArea = document.createElement(&quot;textarea&quot;);
	textArea.style.position = &#39;fixed&#39;;
	textArea.style.top = 0;
	textArea.style.left = 0;
	textArea.style.width = &#39;2em&#39;;
	textArea.style.height = &#39;2em&#39;;
	textArea.style.padding = 0;
	textArea.style.border = &#39;none&#39;;
	textArea.style.outline = &#39;none&#39;;
	textArea.style.boxShadow = &#39;none&#39;;
	textArea.style.background = &#39;transparent&#39;;
	textArea.value = text;
	document.body.appendChild(textArea);

	if(navigator.userAgent.match(/ipad|iphone/i)){
		var range = document.createRange();  
		range.selectNodeContents(textArea);
		var selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
		textArea.setSelectionRange(0, 999999);
	}else{
		textArea.select();
	}
	
	try {
		var successful = document.execCommand(&#39;copy&#39;);
		var msg = successful ? &#39;successful&#39; : &#39;unsuccessful&#39;;
		$(&#39;.copy-compact-link&#39;).text(&#39;نسخ&#39;);
		element.text(&#39;تم النسخ&#39;);
	} catch (err) {
		console.log(&#39;Oops, unable to copy&#39;);
	}
	document.body.removeChild(textArea);
}
