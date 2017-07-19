/**
 * Created by Administrator on 2017/7/15.
 */
(function(win,doc){
    var fresh = function() {
        var html = doc.documentElement;
        var w = html.clientWidth;


        if(w<=600){
            html.style.fontSize = (w/10) + 'px';
        }else {
            html.style.fontSize = 66 + 'px';
        }

        //html.style.fontSize = (w/10) + 'px';
        //console.log(html.style.fontSize);
    }
    if(document.readyState === "complete") {
        fresh();
    } else {
        document.addEventListener( "DOMContentLoaded", fresh, false );
    }
    win.addEventListener('resize' , fresh , false);
})(window,document);
