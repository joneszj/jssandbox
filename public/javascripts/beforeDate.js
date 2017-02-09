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