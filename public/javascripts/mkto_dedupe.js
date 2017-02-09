//behavior: clear mkto tracking cookie form field (not to be confused with the mkto tracking cookie) if the user is known to our mkto lead system
//how: call api from mulesoft that will return basic information about the user if known in mkto lead system, and will retun null if user is anonymous.

//as this module should not be required by any external document we can protect the global namespace by wrapping it into an anonymous self executing function
(function(){
    var mulesoftAPIURL = '';
    var mktoTrkCookie = getCookie('_mkto_trk');
    var mktoTrkCookieFormFieldIdentifier = '.mktotrk';

    function getMktoLead() {
        //perform ajax call to mulesoft
        var request = new XMLHttpRequest();
        request.open('GET', mulesoftAPIURL, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                var data = JSON.parse(request.responseText);
                //success, if data has at the least a valid email, then the user is known  
                if (data && data.hasOwnProperty('email') && data.email) {
                    //clear mktotrk form field
                    clearMktoTrkFormfields();
                    //prepop
                    prepopulateForm(data);
                } else {
                    //user is anonymous, no action required
                }

            } else {
                // We reached our target server, but it returned an error

            }
        };

        request.onerror = function() {
            // There was a connection error of some sort
        };

        request.send();        
    }

    function prepopulateForm(data) {
        //TODO: prepop
    }

    function clearMktoTrkFormfields() {
        var trkfields = document.querySelectorAll(mktoTrkCookieFormFieldIdentifier);
        for (var x = 0; x < trkfields.length; x++) {
            var element = trkfields[x];
            element.value = '';   
        }
    }

    ready(getMktoLead);

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }    

    // ***helper functions***
    function ready(fn) {
        if (document.readyState != 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
        MktoForms2.whenReady(fn);
    }
})();


