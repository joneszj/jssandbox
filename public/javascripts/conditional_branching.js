/* Variable Declarations */
var initialAreas;
var initialDegrees;
var initialPrograms;
var programOfInterestSelectId = '#Program_of_Interest__c';
var degreeLevelSelectId = '#Program_Type__c';
var degreesDataAttr = 'degrees';
var areaOfStudySelectId = '#verticals';
var areasDataAttr = 'areas';
/* END Variable Declarations */

$(document).ready(function(){
    Init();
});

function Init() {
    // work around for marketo forms
    dataAttributifyOptions();
    // clone initial selects
    initialAreas = $(areaOfStudySelectId).clone();
    initialDegrees = $(degreeLevelSelectId).clone();
    initialPrograms = $(programOfInterestSelectId).clone();
    // END clone initial selects    
    //disable program until branch requirements are met
    $(programOfInterestSelectId).prop( "disabled", true );
    // event listeners
    $(areaOfStudySelectId).change(function(){
        Main(areasDataAttr);
    });     
    $(degreeLevelSelectId).change(function(){
        Main(degreesDataAttr);
    });   
    // END event listeners    
}

function Main(filterCaller) {
    var selectedAreaHtml = $(areaOfStudySelectId + ' option:selected').html();
    var selectedAreaDegrees = $(areaOfStudySelectId + ' option:selected').data(degreesDataAttr);
    var selectedDegreeVal = $(degreeLevelSelectId).val();
    if (filterCaller === areasDataAttr) {
        // replace with initial degrees
        $(degreeLevelSelectId).html(initialDegrees.html());
        // reset programs to null, and disable
        $(programOfInterestSelectId).val($(programOfInterestSelectId + ' option').first().val()).prop( "disabled", true );
        // filter degrees to match selected area by removing degrees not applicable with the selected area
        $.each($(degreeLevelSelectId + ' option'), function() {
            if (selectedAreaDegrees.indexOf($(this).val()) > -1) {
                // keep degree
            } else if ($(this).val() === "") {
                // keep select
            } else {
                $(this).remove();
            }
        });
    } else if (filterCaller === degreesDataAttr) {
        // replace with initial programs
        $(programOfInterestSelectId).html(initialPrograms.html());
        // filter programs to match selected area and degree
        $.each($(programOfInterestSelectId + ' option'), function() {
            if ($(this).data(areasDataAttr) && $(this).data(degreesDataAttr)) {
                if (($(this).data(areasDataAttr).indexOf(selectedAreaHtml) > -1) && ($(this).data(degreesDataAttr).indexOf(selectedDegreeVal) > -1)) {
                    // keep program
                } else if ($(this).val() === "") {
                    // keep select
                } else {
                    $(this).remove();
                }
            }
        });
        // enable program
        $(programOfInterestSelectId).val($(programOfInterestSelectId + ' option').first().val()).prop( "disabled", false );
    }
}

// helper methods
function dataAttributifyOptions() {
    /* Modify initial options to set data-* attributes encoded in the value attribute for each option
        Marketo does not provide functionality for custom data attributes so having them encoded in 
        the value attribute allows us to build a solution for that limitation
    */
    //expected syntax on option value: value[{data attribute name}:{value or array of values}]
    //get all options
    $.each($('option'), function (i,e){
        while ($(this).val().indexOf("[") > -1){
            //parse for data attributes with the pipe '|' from the value attribute
            var dataAttributeName = $(this).val().substring($(this).val().indexOf("[")+1,$(this).val().indexOf(":"));
            var dataAttributeValue = $(this).val().substring($(this).val().indexOf(":")+1,$(this).val().indexOf("]"));
            //set data attribute
            $(this).attr(dataAttributeName,dataAttributeValue);
            //remove the encoded attribute
            $(this).val($(this).val().replace($(this).val().substring($(this).val().indexOf("["),$(this).val().indexOf(":")) , ''));
            $(this).val($(this).val().replace($(this).val().substring($(this).val().indexOf(":"),$(this).val().indexOf("]")+1), ''));
            $(this).val($(this).val().trim());
        }
    });
}    

//ex: Program_of_Interest__c
function poiHelper(poiName) {
    var total = '';
    $.each($('*[name="'+poiName+'"] * option'),function(e,i) { 
        total += "{ program_name: '" + $(this).text() + "', program_id: '" + $(this).val() + "', degrees: '"+ $(this).data('degrees') +"', areas: '"+ $(this).data('areas') +"', pid: '"+ $(this).data('pid') +"' },\n";
    });
    if(total.endsWith(",\n"))
    {
        total = total.substring(0 , total.length -2 );
    }
    console.log(total);
    var ytotal = '';
    $.each($('*[name="'+poiName+'"] option'),function(e,i) { 
        ytotal += "{ program_name: '" + $(this).text() + "', program_id: '" + $(this).val() + "', degrees: '"+ $(this).data('degrees') +"', areas: '"+ $(this).data('areas') +"', pid: '"+ $(this).data('pid') +"' },\n";
    });
    if(ytotal.endsWith(",\n"))
    {
        ytotal = ytotal.substring(0 , ytotal.length -2 );
    }
    console.log(ytotal);    
    var ztotal = '';
    var verticals = {
        all: [],
        unique: []
    };
    var area = 'areas';
    
    $.each($('*[name="'+poiName+'"] option'),function(e,i) {
        if ($(this) && $(this).data(area)) {
            var tempArr = $(this).data(area).split(',');
            for (var index = 0; index < tempArr.length; index++) {
                verticals.all.push(tempArr[index]);
            }
        } 
        verticals.unique = verticals.all.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
        });
    });
    var nodes = document.querySelectorAll('*[name="'+poiName+'"] option');
    var nodesAsArray = Array.prototype.slice.call(nodes);

    function Vertical() {
        this.Name = '';
        this.Programs = [];
        return this;
    }

    var verticalCollection = [];
    for (var index = 0; index < verticals.unique.length; index++) {
        var newVertical = new Vertical();
        newVertical.Name = verticals.unique[index];
        newVertical.Programs = nodesAsArray.filter(function(s){
            if ($(s) && $(s).data(area) && $(s).data(area).indexOf(verticals.unique[index]) > -1) {
                return true;
            } else {
                return false;
            }
        });
        verticalCollection.push(newVertical);
    }
    verticalCollection.forEach(function(a){
        ztotal += '**** ' + a.Name + ' ****\n';
        for (var index = 0; index < a.Programs.length; index++) {
            var element = a.Programs[index];
            ztotal += element.innerText + ' | ' + element.value + '\n';
        }
    });
    console.log(ztotal);
}

//extract data attr from current lp page
function MarketofyOptions(selectId) {
    var finalString = '';
    $.each($('#' + selectId + ' option'),function(index,e) {
        var dataAttributeString = "";
        for (var i = 0; i < e.attributes.length; i++) {
            var attrib = e.attributes[i];
            if (attrib.name.indexOf('data') > -1 || attrib.name.indexOf('pid') != -1) {
                dataAttributeString += '[' + attrib.name + ':' + attrib.value + ']';
            }
        }
        finalString += $(this).text() + ' | ' + $(this).val() + dataAttributeString + '\n';
    }); 
    console.log(finalString);
}

Array.prototype.getUnique = function(){
   var u = {}, a = [];
   for(var i = 0, l = this.length; i < l; ++i){
      if(u.hasOwnProperty(this[i])) {
         continue;
      }
      a.push(this[i]);
      u[this[i]] = 1;
   }
   return a;
}
// END helper methods
