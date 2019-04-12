function getHeaderLevel(header) {
    return Number(header.nodeName.slice(-1));
}

      function gettoc(){
        var div = document.getElementById("post-content");
        var body = document.getElementsByClassName('post-content')[0];
        //var headers = body.querySelectorAll('h1, h2, h3, h4, h5, h6');
        var headers = div.querySelectorAll('h1[id]:not([id=""]), h2[id]:not([id=""]), h3[id]:not([id=""]), h4[id]:not([id=""]), h5[id]:not([id=""]), h6[id]:not([id=""])');
        if (headers.length >= 2) {
            $(document).ready(function(){$("aside#post-widget-toc").addClass("post-widget");(jQuery)});

             var ToC = "<nav role='navigation' class='post-toc-wrap' id='post-toc'>";

    var prevLevel = 1;
    var output = "";
    headers.forEach(function(h_headerElement) {
        var currLevel = getHeaderLevel(h_headerElement);
        if (currLevel > prevLevel) {
            var ranOnce = false;
            while (currLevel > prevLevel) {
                if (ranOnce) {
                    output += "&nbsp;";

                }
                if (prevLevel == 1) {
                    output += "<ol class=\"post-toc\"><li class=\"post-toc-item post-toc-level-" + currLevel + "\">";
                }else {
                    output += "<ol class=\"post-toc-child\"><li class=\"post-toc-item post-toc-level-" + currLevel + "\">";
                }
                prevLevel += 1;
                ranOnce = true;


            }
        } else if (currLevel == prevLevel) {
            output += "</li><li class=\"post-toc-item post-toc-level-" + currLevel + "\">";
        } else if (currLevel < prevLevel) {

            while (currLevel < prevLevel) {
                output += "</li></ol>";
                prevLevel -= 1;
            }
            output += "<li class=\"post-toc-item post-toc-level-" + currLevel + "\">";
        }
        output += '<a class="post-toc-link" href="#'+ h_headerElement.id + '">';
        output += '<span class="post-toc-number"> ' + '' + ' </span>';
        output += '<span class="post-toc-text"> ' + h_headerElement.innerText +' </span>';
        output += '</a>';

//replace h with  link hover
            var toTopLink = document.createElement("a");
            var id = h_headerElement.innerHTML.trim();
			toTopLink.href = "#" + id.replace(/ +/g, "_").replace(/<(?:.|\n)*?>/gm, '');
			toTopLink.setAttribute("class", "headerlink");
			toTopLink.setAttribute("title", id.replace(/<(?:.|\n)*?>/gm, ''));

            h_headerElement.id = id.replace(/ +/g, "_").replace(/<(?:.|\n)*?>/gm, '');
            h_headerElement.innerHTML = "";
            toTopLink.innerHTML = "" ;//id;";
            var toTopLinkspan = document.createElement("span");
            toTopLinkspan.innerHTML = id;

            h_headerElement.appendChild(toTopLink);
            h_headerElement.appendChild(toTopLinkspan);

    });

    if (output != "") {
        // Change 2 to the max header level you want in the TOC; in my case, H2
        while (prevLevel >= 2) {
            output += "</li></ol>";
            prevLevel -= 1;
        }
      output = '<h4>سوف تتصفح في هذا المقال</h4>'+output;
    }
 ToC +=  output;



 ToC += "</nav>";
  $("#post-widget-toc").prepend(ToC);
        } else {
            
            $(document).ready(function(){$("aside#post-widget-toc").addClass("hidden");(jQuery)});
        }
      }
