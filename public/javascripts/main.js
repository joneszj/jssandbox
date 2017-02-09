// static vars
var eventName = 'Click_ID__c';
var platformName = 'Search_Platform__c';
// end static vars

ready(function () {
    var queryString = window.location.search;
    //get tracking event and vendor from url
    var vendor = getParameterByName('vendorid', queryString);
    var event = getParameterByName('gclid', queryString);
    if (vendor && event) {
        try {
            upsertInputByName(eventName, vendor);
            upsertInputByName(platformName, event);
        } catch (error) {
            console.log('error in tracking upserter:' + error);
        }
    }
});

// helper functions
function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function getParameterByName(name, url) {
    if (!url) {
        url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function upsertInputByName(elementName, elementValue) {
    var forms = document.querySelectorAll('form');
    var elements = document.querySelectorAll('form input[name="' + elementName + '"]');
    if (elements.length !== 0) {
        for (var index = 0; index < elements.length; index++) {
            var element = elements[index];
            element.value = elementValue;
        }
    } else {
        for (var yindex = 0; yindex < forms.length; yindex++) {
            //create
            var element = document.createElement('input');
            element.type = "hidden";
            element.name = elementName;
            element.value = elementValue;
            forms[yindex].appendChild(element);
        }    
    }
}
// end helper functions