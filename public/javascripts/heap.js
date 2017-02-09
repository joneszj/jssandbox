window.heap = window.heap || [], heap.load = function (e, t) {
    window.heap.appid = e, window.heap.config = t = t || {};
    var r = t.forceSSL || "https:" === document.location.protocol,
        a = document.createElement("script");
    a.type = "text/javascript", a.async = !0, a.src = (r ? "https:" : "http:") + "//cdn.heapanalytics.com/js/heap-" + e + ".js";
    var n = document.getElementsByTagName("script")[0];
    n.parentNode.insertBefore(a, n);
    for (var o = function (e) {
            return function () {
                heap.push([e].concat(Array.prototype.slice.call(arguments, 0)))
            }
        }, p = ["addEventProperties", "addUserProperties", "clearEventProperties", "identify", "removeEventProperty", "setEventProperties", "track", "unsetEventProperty"], c = 0; c < p.length; c++) heap[p[c]] = o(p[c])
};
heap.load("847256616");

//Function to read value of a cookie
function readCookie(name) {
    var cookiename = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(cookiename) === 0) return c.substring(cookiename.length, c.length);
    }
    return null;
}

var emailValue = '';
$('form').submit(function () {
    try {
        //get the email used for this form submit
        $.each(this.getElementsByTagName('input'), function () {
            if ($(this).attr('name').toLowerCase().indexOf('email') > -1) {
                //this should be the email input
                emailValue = $(this).val();
                //check if valid email
                if (/^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/.test(emailValue)) {
                    //should be a valid email address, lets add it to the heap obj
                    heap.identify(emailValue);
                    heap.addUserProperties({
                        '_mkto_trk': readCookie('_mkto_trk')
                    });
                }
            }
        });
    } catch (e) {
        console.log(e);
    }
});

// $(document).ready(function () {
//     try {
//         //console.log('assigning heap');
//         //heap.identify(readCookie('_mkto_trk'));
//     } catch (e) {
//         //console.log('error loading mkto id to head: ' + e);
//     }
// });