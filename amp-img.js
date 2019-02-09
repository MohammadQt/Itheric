$('.thumbnail').find('img').replaceWith(function () {
   return '<amp-img src="'+this.src+'" width="1080" height="610" layout="responsive" alt="'+this.alt+'"></amp-img>'
});
