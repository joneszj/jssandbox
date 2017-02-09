//set vars
    // general
var formId = $('form');
var UniversityId = "0016100000TWYsXAAX";
var institutionId = "UC115";
var First_Name_Name = 'input[name="Rmlyc3QgTmFtZQ=="]';
var First_Name = $(First_Name_Name);
var Last_Name_Name = 'input[name="TGFzdCBOYW1l"]';
var Last_Name = $(Last_Name_Name);
var Email_Name = 'input[name="RW1haWw="]';
var Email = $(Email_Name);
var Phone_Name = 'input[name="UGhvbmUgTnVtYmVy"]';
var Phone = $(Phone_Name);
var Program_Of_Interest_Name = "select[name='UHJvZ3JhbSBvZiBJbnRlcmVzdA==']";
var Program_Of_Interest = $(Program_Of_Interest_Name);
var Education_Level_Name = 'select[name=""]';
var Education_Level = $(Education_Level_Name);
var Military_Affiliation_Name = 'select[name="TWlsaXRhcnkgQWZmaWxpYXRpb24="]';
var Military_Affiliation = $(Military_Affiliation_Name);
var Country_Name = 'select[name="Q291bnRyeQ=="]';
var Country = $(Country_Name);
var ThankYouPage = '';
var tcpaDiv = $("<div>", {id: "phoneTCPA", style: "color: #000;"});
var submitBtnText = "Get Certified Today";
var submitBtn = $('.submit-button:contains("'+submitBtnText+'")');
var manualPoISelectOptions = [

];
    // /general
    // conditional branching
var hasConditionalBranching = false;
var areaOfStudyVertical_Name = 'select[name="QXJlYSBvZiBTdHVkeSA="]';
var areaOfStudyVertical = $(areaOfStudyVertical_Name);
var verticleDataAttr = 'area';
var degreeSelect_Name = 'select[name="RGVncmVlIExldmVsOg=="]';
var degreeSelect = $(degreeSelect_Name);
var degreeDataAttr = 'degrees';
var manualAreaSelectOptions = [

];
var manualDegreeSelectOptions = [

];
    // / conditional branching
    // sixsigma
var isSixSigma = true;
var lotElement = 'select[name="SGlnaGVzdCBMZXZlbCBvZiBUcmFpbmluZw=="]'; //level of training
var lotElement_select = $(lotElement); //level of training
var industryElement = 'select[name="SW5kdXN0cnk="]' //sixsigma industry
var industryElement_select = $(industryElement); //level of training
var trainingForElement_Name = 'select[name="SSBhbSBpbnRlcmVzdGVkIGluIHRoaXMgdHJhaW5pbmcgZm9yOjo6SU5TVEFQQUdFX0JPWDo6TXlzZWxm"]';
var trainingForElement = $(trainingForElement_Name);
    // /sixsigma
    // multistepped
var isMultistepped = false;
var steps = {
    "step1": {
        "inputs": [
            lotElement
            , industryElement
        ]
    },
    "step2": {
        "inputs": [
            Military_Affiliation_Name 
            , Country_Name 
            , trainingForElement_Name
        ]        

    },
    "step3": {
        "inputs": [
            First_Name_Name, 
            Last_Name_Name, 
            Phone_Name, 
            Email_Name 
        ]
    }
};
    // /multistepped    
// /set vars


// helper methods
//ex: Program_of_Interest__c
function poiHelper(poiName) {
    var total = '';
    $.each($('*[name="'+poiName+'"] * option'),function(e,i) { 
        total += "{ program_name: '" + $(this).text() + "', program_id: '" + $(this).val() + "', degrees: '"+ $(this).data('degrees') +"', area: '"+ $(this).data('area') +"', pid: '"+ $(this).data('pid') +"' },\n";
    });
    if(total.endsWith(",\n"))
    {
        total = total.substring(0 , total.length -2 );
    }
    console.log(total);
    var total = '';
    $.each($('*[name="'+poiName+'"] option'),function(e,i) { 
        total += "{ program_name: '" + $(this).text() + "', program_id: '" + $(this).val() + "', degrees: '"+ $(this).data('degrees') +"', area: '"+ $(this).data('area') +"', pid: '"+ $(this).data('pid') +"' },\n";
    });
    if(total.endsWith(",\n"))
    {
        total = total.substring(0 , total.length -2 );
    }
    console.log(total);    
}

//extract data attr from current lp page
function MarketofyOptions(selectId) {
    var finalString = ''
    $.each($('#' + selectId + ' option'),function(i,e) {
        var dataAttributeString = "";
        for (var i = 0; i < e.attributes.length; i++) {
            var attrib = e.attributes[i];
            if (attrib.name.indexOf('data') > -1 || attrib.name.indexOf('pid') != -1) {
                dataAttributeString += '[' + attrib.name + ':' + attrib.value + ']';
            }
        }
        finalString += $(this).text() + '|' + $(this).val() + dataAttributeString + '\n'
    }); 
    console.log(finalString);
}
// /helper methods

// calculated vars
var UserIPAddress = "";
var TCPATimstamp = "";
var Address1 = "";
var Address2 = "";
var City = "";
var State = "";
var Zip_Code = "";
var CountryCode = "";
var tcpaID = "";
var tcpaMessage = "";
var tcpaDisclosureID = "";
var curUrl = window.location.href.split('/');
var curWebsite = curUrl[2];
var ipAddressLookupFailed = true;
var currentStep = 1;
// / calculated vars

$(document).ready(function() {
    //set website field to current site
    $('input[name="Website"]').val(curWebsite);
    //get PoI's from sf'
    getPoIs(institutionId);
    //setup tcpa listeners
    getMuleTCPA();    
    if (isSixSigma) {
        Program_Of_Interest.hide();
    }
    if (isMultistepped) {
        //normalize step buttons
        makeNormalButton();
        //MS logic
        changeStep();
    } else {
        removeMSNavButtons();
    }
    //setup submit listener
    submitBtn.click(function(e){
        if ($(this).html() === submitBtnText) {
            submitform();
        }
    });
    //prevent submission to instapage
    $.each($('form'),function() {
        $(this).attr('action','');
    });
    //add tcpa fields
    $('<input name="TCPA_Notice__c">').attr('type','hidden').appendTo(formId);
    $('<input name="TCPA_Disclosure_Version_ID__c">').attr('type','hidden').appendTo(formId);
    $('<input name="TCPA_IP_Address__c">').attr('type','hidden').appendTo(formId);
    $('<input name="TCPA_Date_Time_Consent__c">').attr('type','hidden').appendTo(formId);
    $('<input name="TCPA__c">').attr('type','hidden').appendTo(formId);
    $('<input name="TCPA_Consent_ID__c">').attr('type','hidden').appendTo(formId);
    //get ip and set location data
    $.get("http://ipinfo.io", function(response) {
        UserIPAddress = response.ip;
        getLocationData(UserIPAddress);
    }, "jsonp");
});

//submits form, redirects on success
function submitform(e) {
    var divBtn = $(this).children('div');
    if ((divBtn.text().trim() == "Previous") && (divBtn.text().trim() == "Next") && (divBtn.text().trim().indexOf('Continue') > -1)) {
      
    } else if (($(event.currentTarget).html() != "Previous") && ($(event.currentTarget).html() != "Next") && (divBtn.text().trim().indexOf('Continue') == -1)) {
      $.ajax({
        url: 'https://sf-add-lead-api.cloudhub.io',
        type: 'POST',
        headers: {
          "Authorization": "Basic Qmlza0FwaUludGVncmF0aW9uczpHMEBwcGxlRzAh"
        },
        contentType: 'application/json',
        data: JSON.stringify(getFormValues()),
        success: function (data) {
          //redirect to thankyou page
          window.location = ThankYouPage;
        },
        error: function (e) {
          //let it fail, instapage validation will occur here
        }
      });
    }
  }

function removeMSNavButtons() {
    $.each($('.widget-button'), function(){
        var divBtn = $(this).children('div');
        if (divBtn.text().trim() == "Previous") {
            $(this).remove();
        } else if (divBtn.text().trim().indexOf('Contine') > -1) {
            $(this).remove();
        } else if (divBtn.text().trim() == "Next") {
            $(this).remove();
        }
    });
}

//gets form values, preps ajax payload
function getFormValues() {
    if (isSixSigma) {
        setPOI();
    }
    
    var First_Name_Input = First_Name.val();
    var Last_Name_Input = Last_Name.val();
    var Email_Input = Email.val();
    var Phone_Input = Phone.val();
    var Program_Of_Interest_Input = Program_Of_Interest.val();
    var Education_Level_Input = Education_Level.val() === null ? Education_Level.find(":selected").text() : Education_Level.val();
    var Military_Affiliation_Input = Military_Affiliation.val() === null ? Military_Affiliation.find(":selected").text() : Military_Affiliation.val();

    var formvalues = {
        First_Name: First_Name_Input,
        Last_Name: Last_Name_Input,
        Email: Email_Input,
        Phone: Phone_Input,
        Program_Of_Interest: Program_Of_Interest_Input,
        Education_Level: Education_Level_Input,
        Military_Affiliation: Military_Affiliation_Input,
        UniversityId: UniversityId,
        UserIPAddress: UserIPAddress,
        TCPATimstamp: TCPATimstamp,
        Address1: Address1,
        Address2: Address2,
        City: City,
        State: State,
        Zip_Code: Zip_Code,
        CountryCode: CountryCode
    };

    return formvalues;
}

//gets/sets tcpa information
function getMuleTCPA() {
    $.get('https://leads.bisk.com/tcpa/?institutionID=' + UniversityId, function (data) {
        tcpaID = data.tcpaId;
        tcpaMessage = data.tcpaNotice;
        tcpaDisclosureID = data.tcpaDislosureId;
        submitBtn.after(tcpaDiv);
        $('#phoneTCPA').html(tcpaMessage);
        $('input[name*=TCPA_Notice__c]').val(tcpaMessage);
        $('input[name*=TCPA_Disclosure_Version_ID__c]').val(tcpaDisclosureID);
        $('input[name*=TCPA_IP_Address__c]').val(UserIPAddress);
        var d = new Date();
        var dateInsert = d.toLocaleString();
        $('input[name*=TCPA_Date_Time_Consent__c]').val(dateInsert);
        TCPATimstamp = dateInsert;
        $('input[name*=TCPA_Consent_ID__c]').val(tcpaID);
        $('input[name*=TCPA__c]').val('Granted');
    }, "json");
}

//loop for locationAPICall
function getLocationData(ipAddress) {
    setInterval(function() {
        if (ipAddressLookupFailed) {
            locationAPICall(ipAddress);
        }  
    }, 2500);
}

//set address information
function locationAPICall(ipAddress) {
    $.ajax({
        url: 'https://api.ipinfodb.com/v3/ip-city/',
        method: 'GET',
        data: 'key=6ed96826899c3c29728e3621ed46171a62eb44b7da8a621611a7ef9f87a0c498' + '&ip=' + ipAddress + '&format=json',
        timeout: 200,
        crossDomain: true,
        dataType: 'json',
        jsonp: false,
        jsonpCallback: 'callback',
        success: function(x) {
            City = x.cityName;
            State = x.regionName;
            Zip_Code = x.zipCode;
            CountryCode = x.countryCode;
            ipAddressLookupFailed = false;
        },
        error: function(e) {
        }
    });
}

//function to get pois form form
function getPoIs(institutionId) {
    $.ajax({
        url: 'https://programinfo-uat.cloudhub.io/api/poi?institutionid=' + institutionId,
        method: 'GET',
        headers: {
            "client_id": "78b878ed13ff4f0bb8381a7c6eb42ddb",
            "client_secret": "a417111f1bab4076896D132985EFA353",
            "cache-control": "clear-cache"
        },
        success: function (data) {
            if (hasConditionalBranching) {
                replacePoIOptions(manualPoISelectOptions);
                replaceAreaOptions(manualAreaSelectOptions);
                replaceDegreeOptions(manualDegreeSelectOptions);
                conditionalBranching();
            } else if (isSixSigma) {
                replacePoIOptions(data);            
            } else {
                replacePoIOptions(data);            
            }
        },
        error: function (e) {
            if (hasConditionalBranching) {
                replacePoIOptions(manualPoISelectOptions);
                replaceAreaOptions(manualAreaSelectOptions);
                replaceDegreeOptions(manualDegreeSelectOptions);
                conditionalBranching();
            } else if (isSixSigma) {
                replacePoIOptions(manualPoISelectOptions);                            
            } else {
                replacePoIOptions(manualPoISelectOptions);            
            }
        }
    });
}

//funciton to replace poi values on form
//TODO: refactor replace* methods into one method
function replacePoIOptions(newPoIOptions) {
    $.each(Program_Of_Interest, function(){
        $(this).empty();
        var selectOption = document.createElement("option");
        selectOption.text = 'Select';
        selectOption.value = '';
        $(this).append(selectOption);
        for (var i = 0; i < newPoIOptions.length; i++) {
            var option = document.createElement("option");
            option.text = newPoIOptions[i].program_name;
            option.value = newPoIOptions[i].program_id;
            if (newPoIOptions[i].degrees) {
                option.dataset.degrees = newPoIOptions[i].degrees;
            }
            if (newPoIOptions[i].area) {
                option.dataset.area = newPoIOptions[i].area;
            }
            $(this).append(option);
        }
    });
}

function replaceAreaOptions(newPoIOptions) {
    $.each(areaOfStudyVertical, function(){
        $(this).empty();
        var selectOption = document.createElement("option");
        selectOption.text = 'Select';
        selectOption.value = '';
        $(this).append(selectOption);
        for (var i = 0; i < newPoIOptions.length; i++) {
            var option = document.createElement("option");
            option.text = newPoIOptions[i].program_name;
            option.value = newPoIOptions[i].program_id;
            if (newPoIOptions[i].degrees) {
                option.dataset.degrees = newPoIOptions[i].degrees;
            }
            if (newPoIOptions[i].area) {
                option.dataset.area = newPoIOptions[i].area;
            }
            $(this).append(option);
        }
    });
}

function replaceDegreeOptions(newPoIOptions) {
    $.each(degreeSelect, function(){
        $(this).empty();
        var selectOption = document.createElement("option");
        selectOption.text = 'Select';
        selectOption.value = '';
        $(this).append(selectOption);
        for (var i = 0; i < newPoIOptions.length; i++) {
            var option = document.createElement("option");
            option.text = newPoIOptions[i].program_name;
            option.value = newPoIOptions[i].program_id;
            if (newPoIOptions[i].degrees) {
                option.dataset.degrees = newPoIOptions[i].degrees;
            }
            if (newPoIOptions[i].area) {
                option.dataset.area = newPoIOptions[i].area;
            }
            $(this).append(option);
        }
    });
}

function makeNormalButton() {
    $.each($('.widget-button'), function(){
        var divBtn = $(this).children('div');
        if (divBtn.text().trim() == "Previous") {
            divBtn.children().children('div').removeClass('submit-button');
            $(this).children('div').children().children().click(function(e){
                //previous listener
                currentStep--;
                changeStep();
            });
        } else if (divBtn.text().trim() == "Next" || divBtn.text().trim().indexOf('Continue') > -1) {
            divBtn.children().children('div').removeClass('submit-button');
            $(this).children('div').children().children().click(function(){
                //next listener && validation
                var isValid = true;
                var values = [];
                for (var index = 0; index < steps["step" + String(currentStep)].inputs.length; index++) {
                    values.push($(String(steps["step" + String(currentStep)].inputs[index])).val());
                }
                for (var indexB = 0; indexB < values.length; indexB++) {
                    var element = values[indexB];
                    if (element === "" || element === null || element === undefined) {
                        isValid = false;
                    }
                }
                if (isValid) {
                    currentStep++;
                    changeStep();
                } else {
                    //TODO: for now, alert the user of validation errors
                    alert('Please fill out each field');
                }
            });
        }
    });
}

function updateWidgetCircle() {
    // $.each($('.widget-circle'),function() {
    //     //$(this).find('div').css({"background-color":"#001f5b"});
    // });
    $.each($('font'),function() {
        if ($(this).text() <= currentStep) {
            $(this).css({"color":"#fff"});
        }
    });    
}

function changeStep() {
        //hide all inputs
        $.each($('input'), function() {
            $(this).hide();
        });
        $.each($('select'), function() {
            $(this).hide();
        });    
        var incrementStepForContinueBtn = currentStep + 1;
        submitBtn.hide();
        $('#phoneTCPA').hide();
        //show inputs for step
        if (currentStep == 1) {
            $.each($('.widget-button'), function(){
                var divBtn = $(this).children('div');
                if (divBtn.text().trim() == "Previous") {
                    divBtn.children().children('div').removeClass('submit-button');    
                    $(this).hide();
                } else if(divBtn.text().trim().indexOf('Continue') > -1) {
                    $(this).find('div.button_submit ').text('Continue to Step ' + incrementStepForContinueBtn);
                    //$(this).text('Continue to Step ' + ++currentStep);
                    $(this).show();
                }
            });
            $('#element-313').find('div').css({"background-color":"#001f5b"});
            $('#element-315').find('div').css({"background-color":"#dfdfdf"});
            $('#element-314').find('div').css({"background-color":"#dfdfdf"});
        } else if (currentStep == 2) {
            $.each($('.widget-button'), function(){
                var divBtn = $(this).children('div');
                if (divBtn.text().trim() == "Previous") {
                    $(this).show();
                } else if(divBtn.text().trim() == "Next") {
                    $(this).show();
                } else if(divBtn.text().trim().indexOf('Continue') > -1) {
                    $(this).find('div.button_submit ').text('Continue to Step ' + incrementStepForContinueBtn);
                    $(this).show();
                }
            });
            $('#element-313').find('div').css({"background-color":"#001f5b"});
            $('#element-315').find('div').css({"background-color":"#001f5b"});
            $('#element-314').find('div').css({"background-color":"#dfdfdf"});
        } else if (currentStep == 3) {
        $.each($('.widget-button'), function(){
                var divBtn = $(this).children('div');
                if (divBtn.text().trim() == "Next" || divBtn.text().trim().indexOf('Continue') > -1) {
                    divBtn.children().children('div').removeClass('submit-button');     
                    $(this).hide();
                }
            });
            submitBtn.show();
            $('#phoneTCPA').show();
            $('#element-313').find('div').css({"background-color":"#001f5b"});
            $('#element-315').find('div').css({"background-color":"#001f5b"});
            $('#element-314').find('div').css({"background-color":"#001f5b"});           
        }
        for (var index = 0; index < steps["step" + String(currentStep)].inputs.length; index++) {
            $(String(steps["step" + String(currentStep)].inputs[index])).show();
        }
        //moveButtonsWithForm();
        updateWidgetCircle();
}

function moveButtonsWithForm() {
    $.each($('.widget-button'), function(){
        debugger;
        $(this).appendTo($('form').find("* select:visible, * input:visible").last());
    });
}

//munchkin code
(function () {
    var didInit = false;

    function initMunchkin() {
        if (didInit === false) {
            didInit = true;
            Munchkin.init('058-NIT-467');
        }
    }
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = '//munchkin.marketo.net/munchkin.js';
    s.onreadystatechange = function () {
        if (this.readyState == 'complete' || this.readyState == 'loaded') {
            initMunchkin();
        }
    };
    s.onload = initMunchkin;
    document.getElementsByTagName('head')[0].appendChild(s);
})();

// conditional branching
function conditionalBranching() {
        // this variable acts as a means to pre-filter a form for a particular degree level
        // available options: A, B, C, M
        // associates, bachelors, masters, and certificates respectively, comma deliminate for multiple
        var defaultDegrees = "M".toUpperCase(); //TODO: this can get buggy if multiple values are passed
        // this variable will lock or unlock a form to a particular degree level (by hiding and disabling the ddl)
        var lockDegree = false;
        var hideDegree = true;
        /* /KEEP OUT OF MINIFICATION */
        //MktoForms2.whenReady(function(form) {
            Main();
        //})
        function Main() {
            /* Modify initial options to set data-* attributes in the value attribute
               Marketo does not provide functionality for custom data attributes so having them in the value attribute
               allows us to build a solution for that limitation
             */
            //dataAttributifyOptions();
            //clone initial selects
            var originalOptions = $(Program_Of_Interest_Name).clone();
            var secondaryOptions = $(degreeSelect_Name).clone();
            //used to persist selected degreeLevel on change event
            var selectedDegree;
            //remove poi options initially after its cloned, keep the Select option if present
            removeAllButSelect(Program_Of_Interest_Name);
            //when user changes verticle, do work
            $(areaOfStudyVertical_Name).change(function () {
                //reset the degree options associated with the area
                resetDegree();
                //get verticle selected text, filter available programs by selected verticle
                var AoStext = $(areaOfStudyVertical_Name + ' option:selected').text();
                //if accounting, use a js friendly value
                if (AoStext == 'Accounting & Finance' || (AoStext.indexOf('Accounting')) > -1 && AoStext.indexOf('Finance') > -1) {
                    AoStext = 'Accounting';
                }
                //if verticle is not select
                if (AoStext != '* Area of Study:' || AoStext.indexOf('select') != -1) {
                    //set poi with initial loaded options and values
                    $(Program_Of_Interest_Name).html(originalOptions.html());
                    //filter poi by the areas text to the pot data-verticle attribute
                    filterOptions(Program_Of_Interest_Name, verticleDataAttr, AoStext);
                } else {
                    //if verticle == select remove all but first option
                    removeAllButSelect(Program_Of_Interest_Name);
                }
                //initialize degree options for user to select
                $(degreeSelect_Name).html(secondaryOptions.html());
                removeProgramLevelsWithNoPrograms();
                removeAreasOfInterestNotApplicableToDefaultedDegree();
            });
            //when user changes degree, do work
            $(degreeSelect_Name).change(function () {
                //get selected degree value
                selectedDegree = $(degreeSelect_Name).val();
                //if a default degree is not supplied, execute the verticle change logic
                if (!defaultDegrees) {
                    $(areaOfStudyVertical_Name).change();
                }
                $(degreeSelect_Name).val(selectedDegree);
                //get degree text
                var degreeLeveltext = $(degreeSelect_Name + ' option:selected').val();
                //if degree is not select an degree
                if (degreeLeveltext != '* Degree Level:'|| degreeLeveltext.indexOf('select') != -1) {
                    filterOptions(Program_Of_Interest_Name, degreeDataAttr, degreeLeveltext);
                } else {
                    //if area == select remove all but first option
                    removeAllButSelect(Program_Of_Interest_Name);
                }
                removeCertificateGroup();
            });
            removeAreasOfInterestNotApplicableToDefaultedDegree();
        };

        function removeAllButSelect(selectName) {
            if ($(selectName + ' option:first').text().indexOf('select') > -1 || $(selectName + ' option:first').val() === "")
            {
                $(selectName + ' option:not(:first)').remove();
            } else {
                $.each($(selectName + ' option'), function () {
                    $(this).remove();
                });
            }
        }

        function filterOptions(selectElementName, dataAttr, dataFilterValues) {
            dataAttr = dataAttr.toLowerCase();
            $.each($(selectElementName).find('option[data-' + dataAttr + ']'), (function () {
                var optionData = $(this).data(dataAttr).split(',');
                var newArray = dataFilterValues.split();
                var remove = true;
                for (var i = 0; i < optionData.length; i++) {
                    if ($.inArray(optionData[i], newArray) != -1) {
                        remove = false;
                    }
                }
                if (remove) {
                    $(this).remove();
                }
            }));

            $.each($('option.section'), function () {
                if ($(this).next().hasClass('section') || $(this).prev().hasClass('section') || $(Program_Of_Interest_Name + ' option').not('.section').length == 1) {
                    $(this).remove();
                }
            });
            $.each($('optgroup'), function () {
                if (!$(this).children().length) {
                    $(this).remove();
                }
            });
        }

        //this will reset the program options in case the user changes selected verticle to the first option
        function resetDegree() {
            $(degreeSelect_Name).val(0);
        }

        //will need a function to remove program levels that do not have programs available for the selected areaOfInterest
        function removeProgramLevelsWithNoPrograms() {
            var associate = false;
            var bachelor = false;
            var masters = false;
            var certificate = false;
            $.each($(Program_Of_Interest_Name + ' option'), function (i, e) {
                if (e.dataset[degreeDataAttr] && e.dataset[degreeDataAttr] == 'A') {
                    associate = true;
                }
                if (e.dataset[degreeDataAttr] && e.dataset[degreeDataAttr] == 'B') {
                    bachelor = true;
                }
                if (e.dataset[degreeDataAttr] && e.dataset[degreeDataAttr] == 'M') {
                    masters = true;
                }
                if (e.dataset[degreeDataAttr] && e.dataset[degreeDataAttr] == 'C') {
                    certificate = true;
                }
            });
            if (!associate) {
                $(degreeSelect_Name + ' option[value="A"]').remove();
            }
            if (!bachelor) {
                $(degreeSelect_Name + ' option[value="B"]').remove();
            }
            if (!masters) {
                $(degreeSelect_Name + ' option[value="M"]').remove();
            }
            if (!certificate) {
                $(degreeSelect_Name + ' option[value="C"]').remove();
            }
        }

        //unsure why, but the certificat group option appears when it should not, this is a hotfix to address that issue
        function removeCertificateGroup() {
            debugger;
            var removeCertOptionGroup = true;
            $.each($(Program_Of_Interest_Name + ' option'), function (i, e) {
                if (e.dataset.degrees && e.dataset.degrees == 'C') {
                    removeCertOptionGroup = false;
                }
            });
            if (removeCertOptionGroup) {
                $.each($(Program_Of_Interest_Name + ' option.section'), function (i, e) {
                    if (e.innerHTML == "Certificates") {
                        $(this).remove();
                    }
                });
            }
        }

        //remove verticles that do not have programs with the selected degree level
        //should only execute when a default && (lock || hidden) degree field is true
        function removeAreasOfInterestNotApplicableToDefaultedDegree() {
            debugger;
            if (defaultDegrees) {
                // if defaultDegree has only one option, set it to that degree
                if (defaultDegrees.split(',').length == 1) {
                    filterOptions(areaOfStudyVertical_Name, degreeDataAttr, defaultDegrees);
                    $(degreeSelect_Name).val(defaultDegrees[0]);
                    $(degreeSelect_Name).change();
                    if (lockDegree) {
                        $(degreeSelect_Name).prop('disabled', true);
                    }
                    if (hideDegree) {
                        $(degreeSelect_Name).hide();
                    }
                } else {
                    //if multiple defaultDegree are provided, we cant lock/hide the degree selection

                }
            }

        }

        function dataAttributifyOptions() {
            //expected syntax: [{data attribute name}:{value or array of values}]
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
}
// /conditional branching
// sixsigma
 function setPOI() {
     debugger;
    //SetPOI
    var selectedPIDValue = 'a0361000008wRRfAAM'    
    //Lean Six Sigma
    if ($(lotElement + ' option:selected').text() === "Black Belt") {
         selectedPIDValue = 'a0361000008wRUAAA2'
    }
    //Healthcare
    if ($(industryElement + ' option:selected').text() === "Healthcare") {
         selectedPIDValue = 'a0361000008wRRhAAM'
    }
    //Information Technology
    if ($(industryElement + ' option:selected').text() === "Information Technology") {
         selectedPIDValue = 'a0361000008wRRiAAM'
    }
    //Financial Services
    if ($(industryElement + ' option:selected').text() === "Financial Services") {
         selectedPIDValue = 'a0361000008wRRgAAM'
    }
    //Six Sigma
    if ($(industryElement + ' option:selected').text() === "Manufacturing" ||
        $(industryElement + ' option:selected').text() === "Government" ||
        $(industryElement + ' option:selected').text() === "Business Services" ||
        $(industryElement + ' option:selected').text() === "Retail / eCommerce" ||
        $(industryElement + ' option:selected').text() === "Technology" ||
        $(industryElement + ' option:selected').text() === "Other") {
         selectedPIDValue = 'a0361000008wRRfAAM'
    }

     
     Program_Of_Interest.val(selectedPIDValue);
 }
// /sixsigma