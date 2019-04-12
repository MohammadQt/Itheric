  if (typeof firstText == "undefined") firstText = "الأولى";
  if (typeof lastText == "undefined") lastText = "الأخيرة";
  var noPage;
  var currentPage;
  var currentPageNo;
  var postLabel;
  pagecurrentg();

  function looppagecurrentg(pageInfo) {
      var html = '';
      pageNumber = parseInt(numPages / 2);
      if (pageNumber == numPages - pageNumber) {
          numPages = pageNumber * 2 + 1
      }
      pageStart = currentPageNo - pageNumber;
      if (pageStart < 1) pageStart = 1;
      lastPageNo = parseInt(pageInfo / perPage) + 1;
      if (lastPageNo - 1 == pageInfo / perPage) lastPageNo = lastPageNo - 1;
      pageEnd = pageStart + numPages - 1;
      if (pageEnd > lastPageNo) pageEnd = lastPageNo;
      html += "<span class='showpageOf'>Page " + currentPageNo + ' of ' + lastPageNo + "</span>";
      var prevNumber = parseInt(currentPageNo) - 1;

      //Iccsi was here, doing magic      
      if (currentPageNo > 1) {
          if (currentPage == "page") {
              html += '<a class="showpage waves-effect waves-button firstpage" href="' + home_page + '">' + firstText + '</a>'
          } else {
              html += '<a class="displaypageNum waves-effect waves-button firstpage" href="/search/label/' + postLabel + '?&max-results=' + perPage + '">' + firstText + '</a>'
          }
      }

      if (currentPageNo > 2) {
          if (currentPageNo == 3) {
              if (currentPage == "page") {
                  html += '<a class="showpage waves-effect waves-button" href="' + home_page + '">' + prevText + '</a>'
              } else {
                  html += '<a class="displaypageNum waves-effect waves-button" href="/search/label/' + postLabel + '?&max-results=' + perPage + '">' + prevText + '</a>'
              }
          } else {
              if (currentPage == "page") {
                  html += '<a class="displaypageNum waves-effect waves-button" href="#" onclick="redirectpage(' + prevNumber + ');return false">' + prevText + '</a>'
              } else {
                  html += '<a class="displaypageNum waves-effect waves-button" href="#" onclick="redirectlabel(' + prevNumber + ');return false">' + prevText + '</a>'
              }
          }
      }
      if (pageStart > 1) {
          if (currentPage == "page") {
              html += '<a class="displaypageNum waves-effect waves-button" href="' + home_page + '">1</a></span>'
          } else {
              html += '<a class="displaypageNum waves-effect waves-button" href="/search/label/' + postLabel + '?&max-results=' + perPage + '">1</a>'
          }
      }
      if (pageStart > 2) {
          html += '<span class="space waves-effect waves-button"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"> ... </font></font></span>'
      }
      for (var jj = pageStart; jj <= pageEnd; jj++) {
          if (currentPageNo == jj) {
              html += '<span class="pagecurrent current waves-effect waves-button">' + jj + '</span>'
          } else if (jj == 1) {
              if (currentPage == "page") {
                  html += '<a class="displaypageNum waves-effect waves-button" href="' + home_page + '">1</a></span>'
              } else {
                  html += '<a class="displaypageNum waves-effect waves-button" href="/search/label/' + postLabel + '?&max-results=' + perPage + '">1</a>'
              }
          } else {
              if (currentPage == "page") {
                  html += '<a class="displaypageNum waves-effect waves-button" href="#" onclick="redirectpage(' + jj + ');return false">' + jj + '</a>'
              } else {
                  html += '<a class="displaypageNum waves-effect waves-button" href="#" onclick="redirectlabel(' + jj + ');return false">' + jj + '</a>'
              }
          }
      }
      if (pageEnd < lastPageNo - 1) {
          html += '<span class="space waves-effect waves-button"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">...</font></font></span>'
      }
      if (pageEnd < lastPageNo) {
          if (currentPage == "page") {
              html += '<a class="displaypageNum waves-effect waves-button" href="#" onclick="redirectpage(' + lastPageNo + ');return false">' + lastPageNo + '</a></span>'
          } else {
              html += '<a class="displaypageNum waves-effect waves-button" href="#" onclick="redirectlabel(' + lastPageNo + ');return false">' + lastPageNo + '</a>'
          }
      }


      var nextnumber = parseInt(currentPageNo) + 1;
      if (currentPageNo < (lastPageNo - 1)) {
          if (currentPage == "page") {
              html += '<a class="displaypageNum waves-effect waves-button" href="#" onclick="redirectpage(' + nextnumber + ');return false">' + nextText + '</a>'
          } else {
              html += '<a class="displaypageNum waves-effect waves-button" href="#" onclick="redirectlabel(' + nextnumber + ');return false">' + nextText + '</a>'
          }
      }

      if (currentPageNo < lastPageNo) {
          //Iccsi was here, doing magic
          if (currentPage == "page") {
              html += '<a class="displaypageNum waves-effect waves-button lastpage" href="#" onclick="redirectpage(' + lastPageNo + ');return false">' + lastText + '</a>'
          } else {
              html += '<a class="displaypageNum waves-effect waves-button lastpage" href="#" onclick="redirectlabel(' + lastPageNo + ');return false">' + lastText + '</a>'
          }
      }

      var pageArea = document.getElementsByName("page-nav");
      var blogPager = document.getElementById("blog-pager");
      for (var p = 0; p < pageArea.length; p++) {
          pageArea[p].innerHTML = html
      }
      if (pageArea && pageArea.length > 0) {
          html = ''
      }
      if (blogPager) {
          blogPager.innerHTML = html
      }
  }

  function totalcountdata(root) {
      var feed = root.feed;
      var totaldata = parseInt(feed.openSearch$totalResults.$t, 10);
      looppagecurrentg(totaldata)
  }

  function pagecurrentg() {
      var thisUrl = urlactivepage;
      if (thisUrl.indexOf("/search/label/") != -1) {
          if (thisUrl.indexOf("?updated-max") != -1) {
              postLabel = thisUrl.substring(thisUrl.indexOf("/search/label/") + 14, thisUrl.indexOf("?updated-max"))
          } else {
              postLabel = thisUrl.substring(thisUrl.indexOf("/search/label/") + 14, thisUrl.indexOf("?&max"))
          }
      }
      if (thisUrl.indexOf("?q=") == -1 && thisUrl.indexOf(".html") == -1) {
          if (thisUrl.indexOf("/search/label/") == -1) {
              currentPage = "page";
              if (urlactivepage.indexOf("#PageNo=") != -1) {
                  currentPageNo = urlactivepage.substring(urlactivepage.indexOf("#PageNo=") + 8, urlactivepage.length)
              } else {
                  currentPageNo = 1
              }
              document.write("<script  src=\"" + home_page + "feeds/posts/summary?max-results=1&alt=json-in-script&callback=totalcountdata\"><\/script>")
          } else {
              currentPage = "label";
              if (thisUrl.indexOf("&max-results=") == -1) {
                  perPage = 20
              }
              if (urlactivepage.indexOf("#PageNo=") != -1) {
                  currentPageNo = urlactivepage.substring(urlactivepage.indexOf("#PageNo=") + 8, urlactivepage.length)
              } else {
                  currentPageNo = 1
              }
              document.write('<script  src="' + home_page + 'feeds/posts/summary/-/' + postLabel + '?alt=json-in-script&callback=totalcountdata&max-results=1" ><\/script>')
          }
      }
  }

  function redirectpage(numberpage) {
      jsonstart = (numberpage - 1) * perPage;
      noPage = numberpage;
      var nameBody = document.getElementsByTagName('head')[0];
      var newInclude = document.createElement('script');
      newInclude.type = 'text/javascript';
      newInclude.setAttribute("src", home_page + "feeds/posts/summary?start-index=" + jsonstart + "&max-results=1&alt=json-in-script&callback=finddatepost");
      nameBody.appendChild(newInclude)
  }

  function redirectlabel(numberpage) {
      jsonstart = (numberpage - 1) * perPage;
      noPage = numberpage;
      var nameBody = document.getElementsByTagName('head')[0];
      var newInclude = document.createElement('script');
      newInclude.type = 'text/javascript';
      newInclude.setAttribute("src", home_page + "feeds/posts/summary/-/" + postLabel + "?start-index=" + jsonstart + "&max-results=1&alt=json-in-script&callback=finddatepost");
      nameBody.appendChild(newInclude)
  }

  function finddatepost(root) {
          post = root.feed.entry[0];
          var timestamp1 = post.published.$t.substring(0, 19) + post.published.$t.substring(23, 29);
          var timestamp = encodeURIComponent(timestamp1);
          if (currentPage == "page") {
              var pAddress = "/search?updated-max=" + timestamp + "&max-results=" + perPage + "#PageNo=" + noPage
          } else {
              var pAddress = "/search/label/" + postLabel + "?updated-max=" + timestamp + "&max-results=" + perPage + "#PageNo=" + noPage
          }
          location.href = pAddress
      }

var currentlocation = location.href;$(".accordian-menu-item h3 a").each(function(){var a=$(this);encodeURI(a.attr("href"))==currentlocation&&a.parents("div").addClass("selected")})/*,$(".accordian-menu-item h3 a").each(function(){var a=$(this);encodeURI(a.attr("href"))==currentlocation&&a.parents("details").attr('open','open')})*/,$(".accordian-menu-item h3 a").each(function(){var a=$(this);encodeURI(a.attr("href"))==currentlocation&&a.parents("li").addClass("active")});

var current=location.pathname?location.pathname:"./";$(".nav li a").each(function(){var a=$(this);encodeURI(a.attr("href"))==current&&a.parents("li").addClass("active")}),$(".tags-list a").each(function(){var a=$(this);encodeURI(a.attr("href"))==current&&a.addClass("active")}),$(".nav li a").each(function(){var a=$(this);encodeURI(a.attr("href"))==current&&a.parents("details").attr('open','open')});
