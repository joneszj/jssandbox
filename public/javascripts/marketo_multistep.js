<script>
var prev = 'Previous';
var next = 'Next';
var invalidClass = 'mktoInvalid';
var requiredClass = 'mktoRequired';
var phoneId = 'Phone'

function multistepifyMarketoForm() {
    //get all marketo forms
    var allMarketoForms = document.querySelectorAll('form.mktoForm');
    //loop through each marketo form
    for (var index = 0; index < allMarketoForms.length; index++) {
        var fieldset = allMarketoForms[index].querySelectorAll('fieldset');
        //loop through each fieldset
        for (var y = 0; y < fieldset.length; y++) {
            //create nav button div
            var divBtnElement = document.createElement('div');
                divBtnElement.classList.add('mktoButtonRow');
                divBtnElement.style.width = '100%';
                divBtnElement.style.marginTop = '20px';
                divBtnElement.style.textAlign = 'center';
            var spanBtnElement = document.createElement('span');
                spanBtnElement.classList.add(['mktoButtonWrap', 'mktoNative']);
            divBtnElement.appendChild(spanBtnElement);
            fieldset[y].appendChild(divBtnElement);
            //hide fieldset border
            fieldset[y].style.borderWidth = '0px';
            //hide if not initial fieldset
            if (y !== 0) {
                fieldset[y].style.display = 'none';
            }
            var types = [];
            //add previous button to all but first fieldset
            if (y !== 0) {
                types.push(prev);              
            }
            //add next button to all but last fieldset
            if (y !== fieldset.length - 1) {
                types.push(next);
            }
            for (var a = 0; a < types.length; a++) {
                var type = types[a];
                var Btn = createPreviousNextButton(index, y, type);
                spanBtnElement.appendChild(Btn);
                //add event listener
                Btn.addEventListener('click', previousNextButtonMarketoClickListener);                 
            }
            //if last fieldset
            if (y === fieldset.length - 1) {
                //move submit button
                if (allMarketoForms[index].querySelectorAll('button[type="submit"]')[0]) {
                    allMarketoForms[index].querySelectorAll('button[type="submit"]')[0].dataset.form = index;
                    var submitClone = allMarketoForms[index].querySelectorAll('button[type="submit"]')[0].cloneNode(true);
                    allMarketoForms[index].querySelectorAll('button[type="submit"]')[0].style.display = 'none';
                    spanBtnElement.appendChild(submitClone);
                }                
            }            
            //to assist in identifying the form/fieldset
            //we add relavent data attributes to the fieldset
            fieldset[y].dataset.form = index;
            fieldset[y].dataset.fieldset = y;
            if (y === 0) {
                updateProgressBarBat(fieldset[y], y);
            }
        }
        styleForm(allMarketoForms[index]);    
        addTCPA(allMarketoForms[index]);            
    }
    labelInsideAlt();
}

function createPreviousNextButton(formIndex, fieldsetIndex, type) {
    var element = document.createElement('button');
    //element.style.margin = '0 10%';
    //give the btn a unique id
    element.id = String(formIndex) + String(fieldsetIndex) + String(type);
    //setting the text content to match the type
    element.innerHTML = type;
    return element;
}

function previousNextButtonMarketoClickListener() {
    //on lp's there seems to be a listener on all buttons to submit a form
    //this prevents it from submitting on the prev/next buttons
    event.preventDefault();
    //TODO: refactor this... hate chaining parent calls
    var parentFieldset = this.parentNode.parentNode.parentNode;
    var lastFieldset = document.querySelectorAll('fieldset[data-form="'+ parentFieldset.dataset.form +'"').length - 1;
    //hide submit sbutton
    document.querySelectorAll('button[type="submit"][data-form="'+ parentFieldset.dataset.form +'"]')[0].style.display = 'none';
    //if previous, show previous
    if (this.id.indexOf(prev) > -1) {
        //hide current fieldset
        document.querySelectorAll('fieldset[data-form="' + parentFieldset.dataset.form + '"][data-fieldset="' + parentFieldset.dataset.fieldset + '"]')[0].style.display = 'none';
        //shoe previous fieldset
        document.querySelectorAll('fieldset[data-form="' + parentFieldset.dataset.form + '"][data-fieldset="' + (parseInt(parentFieldset.dataset.fieldset) -1) + '"]')[0].style.display = '';
        updateProgressBarBat(parentFieldset, (parseInt(parentFieldset.dataset.fieldset) -1));        
    } 
    //if next, show next
    else if (this.id.indexOf(next) > -1) {
        if (validateFieldSet(parentFieldset,document.getElementsByName('formid')[parentFieldset.dataset.form].value)) {
            //hide current fieldset
            document.querySelectorAll('fieldset[data-form="' + parentFieldset.dataset.form + '"][data-fieldset="' + parentFieldset.dataset.fieldset + '"]')[0].style.display = 'none';
            //show next fieldset            
            document.querySelectorAll('fieldset[data-form="' + parentFieldset.dataset.form + '"][data-fieldset="' + (parseInt(parentFieldset.dataset.fieldset) +1) + '"]')[0].style.display = '';
            updateProgressBarBat(parentFieldset, (parseInt(parentFieldset.dataset.fieldset) +1));
            if ((parseInt(parentFieldset.dataset.fieldset) +1) == lastFieldset) {
                //is last fieldset in form, show submit button
                document.querySelectorAll('button[type="submit"][data-form="'+ parentFieldset.dataset.form +'"]')[0].style.display = '';
            }

        }
    } 
    //this shouln't happen
    else {
        
    }
}

function validateFieldSet(fieldset, mktoFormId) {
    //mkto will add the class mktoValid if a field is valid
    //mktoInvalid if not valid
    var isValid = true;
    var allChildElements = fieldset.getElementsByTagName("*");
    for (var index = 0; index < allChildElements.length; index++) {
        var element = allChildElements[index];
        if (element && element.classList && element.classList.contains(requiredClass) && !element.value) {
            //checkif mktoRequired have values
            MktoForms2.getForm(mktoFormId).showErrorMessage('This field is required.',$(element));
            isValid = false;
        } else if (element && element.classList && element.classList.contains(invalidClass)) {
            //does element have invalid class
            MktoForms2.getForm(mktoFormId).showErrorMessage('This field is invalid.',$(element));
            isValid = false;
        }
    }
    return isValid;
}

// helper functions
function ready(fn) {
    if (document.readyState != 'loading') {
        //fn();
    } else {
        //document.addEventListener('DOMContentLoaded', fn);
    }
    MktoForms2.whenReady(fn);
}

function findAncestorBy(ele, matchType, matchValue) {
    var ele; //your clicked element
    while(ele.parentNode) {
        //display, log or do what you want with element
        ele = element.parentNode;
    }
}

function updateProgressBarBat(fieldstep, step) {
    step++;
    var currentForm = document.querySelectorAll('form.mktoForm')[fieldstep.dataset.form]
    var maxSteps = currentForm.querySelectorAll('fieldset').length;
    if (!currentForm.querySelectorAll('.steps-indicator').length) { 
        var stepIndicator = document.createElement("div");
        stepIndicator.className = "steps-indicator";
        var stepIndicatorText = document.createElement("div");
        stepIndicatorText.className = "stepIndicatorText";
        stepIndicatorText.textContent = "Step " + step + " of " + maxSteps;
        var progress = document.createElement("div");
        progress.className = "progress";
        var bar = document.createElement("div");
        bar.className = "bar";
        bar.style.width = ((step / maxSteps) * 100) + "%";
        var indicatedFieldNote = document.createElement('div');
        indicatedFieldNote.className = "required-note";
        indicatedFieldNote.innerHTML = '<span style="color: red;">*</span> Indicates required field.';
        stepIndicator.appendChild(indicatedFieldNote);
        stepIndicator.appendChild(stepIndicatorText);
        stepIndicator.appendChild(progress);
        progress.appendChild(bar);
        currentForm.insertBefore(stepIndicator, currentForm.childNodes[0]);
        
    } else {
        var pbar = currentForm.querySelectorAll(".bar")[0];
        pbar.style.width = ((step / maxSteps) * 100) + "%";
        currentForm.querySelectorAll('.stepIndicatorText')[0].textContent = "Step " + step + " of " + maxSteps;
    }
}

//because we are attempting a 1 to 1 comparison
//we need to match the styling rulesets of the previous
//umbraco form styles
function styleForm(form) {
    debugger;
    //remove forms2.css
    //document.getElementById("mktoForms2BaseStyle").remove();
    if (document.getElementById("mktoForms2ThemeStyle")) {
        document.getElementById("mktoForms2ThemeStyle").remove();
    }
    //remove width settings:
    form.style.width = '100%';
    //form classes: leadsystem labelsInside multistep
    addClass(form, 'leadsystem');
    addClass(form, 'labelsInside');
    addClass(form, 'multistep');
    //under step indicator: <div class="required-note">*Indicates required field.</div>
    //form.querySelectorAll("/steps-indicator")[0].appendChild('<div class="required-note">*Indicates required field.</div>');
    //fieldsets: data-stepid (text-align: right;)
    for (var index = 0; index < form.querySelectorAll('fieldset').length; index++) {
        var fieldset = form.querySelectorAll('fieldset')[index];
        fieldset.style.textAlign = 'right';
        fieldset.style.width = '100%';
    }
    //select parent div classes: program selectfield field hideLabel
    for (var index = 0; index < form.querySelectorAll('select').length; index++) {
        var select = form.querySelectorAll('select')[index];
        var div = document.createElement("div");
        var parent = select.parentNode;
        parent.style.width = '100%';
        addClass(div,'selectfield');
        addClass(div,'field');
        parent.insertBefore(div, select);
        addClass(div.parentNode,'hideLabel');
        div.appendChild(select);
        select.style.width = '100%';
    }    
    //input parent div text classes: textfield field blurInput
    for (var index = 0; index < form.querySelectorAll('input').length; index++) {
        var input = form.querySelectorAll('input')[index];
        addClass(input,'textfield');
        addClass(input,'field');
        //addClass(input,'blurInput');
        input.style.padding = '.5em';
        input.style.width = '100%';
    }        
    //next btn class: nextbutton
    //next btn has title set to value
    //previous btn prevbutton
    //previous btn has title set to value
}

ready(multistepifyMarketoForm);

// http://jaketrent.com/post/addremove-classes-raw-javascript/
function hasClass(el, className) {
  if (el.classList)
    return el.classList.contains(className)
  else
    return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

function addClass(el, className) {
  if (el.classList)
    el.classList.add(className)
  else if (!hasClass(el, className)) el.className += " " + className
}

function removeClass(el, className) {
  if (el.classList)
    el.classList.remove(className)
  else if (hasClass(el, className)) {
    var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    el.className=el.className.replace(reg, ' ')
  }
}

function labelInsideAlt() {
    //TODO: remove dependency on jQuery
    if(typeof jQuery == "function") {
    labelsInside = function() {
        var $form = $('.mktoForm'),
            $textInputs = $('input[type="text"], input[type="tel"], input[type="email"], textarea', $form),
            $selects = $('select', $form),
            activeEl,
            toggleLabel = function() {
            var $parent = $(this).parent()
                .addClass("hideLabel")
                .removeClass("blurInput");
            try {
                activeEl = document.activeElement;
            } catch(err) {
                activeEl = null;
            }
            if (!$.trim(this.value) && this != activeEl) {
                $parent
                .addClass("blurInput")
                .removeClass("hideLabel");
            }
            },
            toggleAllLabels = function() {
            $textInputs.each(toggleLabel);
            };
        $form.addClass("labelsInside");
        // $selects.each(function() {
        // var $this = $(this),
        //     $parent = $this.parent(),
        //     labelText = $parent.children("label").text(),
        //     $option = $this.children("option:first"),
        //     optionVal = $option.val();
        //     optionText = $option.text();
        // $parent.addClass("hideLabel").find("label").hide();
        // if (optionVal != "-1" && optionVal != "") {
        //     if (optionText.indexOf(labelText) == 0) {
        //     labelText = optionText;
        //     } else {
        //     labelText += " " + optionText;
        //     $this.addClass("selectSelected");
        //     }
        // }
        // $option.toggleClass("optionLabel", this.value == "-1")
        //     .attr("selected","selected")
        //     .attr("label",labelText)
        //     .html(labelText);
        // }).change(function() {
        // $(this).toggleClass("selectSelected", this.selectedIndex > 0 || this.value != "-1");
        // });
        $textInputs.each(toggleLabel)
        .bind("keypress blur change input", toggleAllLabels)
        .filter('.phonemask').bind("focus", toggleAllLabels);
        $("form.labelsInside div:not(.blurInput, .hideLabel)").children("label").show();
    }
    $(document).ready(labelsInside);
    }
}

function addTCPA(form) {
    var tcpa = 'By completing this form, I consent to receiving calls and/or emails from BISK regarding educational services and programs. I understand calls may be generated using an automated technology. Consent is needed to contact you, but is not a requirement to purchase goods or services.'
    var phoneElement = form.getElementById(phoneId);
    phoneElement.addEventListener("focus",function () {
        if (!form.getElementById('tcpanotice')) {
            var tcpaNotice = form.createElement('div');
            tcpaNotice.innerHTML = tcpa;
            phoneElement.parentNode.appendChild(tcpaNotice);
        }
    })
}

/* //WIP||Depricated
    // function updateProgressBar(fieldstep, step) {
    //     step++;
    //     var cssId = 'bootstrap';  
    //     if (!document.getElementById(cssId))
    //     {
    //         //https://www.viget.com/articles/js-201-run-a-function-when-a-stylesheet-finishes-loading
    //         var head = document.getElementsByTagName( "head" )[0],
    //         body = document.body,
    //         css = document.createElement( "link" );
    //         css.id = cssId;
    //         img = document.createElement( "img" );
    //         cssUrl = "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css";

    //         css.href = cssUrl;
    //         css.rel = "stylesheet";
    //         head.appendChild( css );

    //         img.onerror = function() {
    //             // Code to execute when the stylesheet is loaded
    //             updateProgressBarWork(fieldstep, step);
    //         };
    //         body.appendChild( img );
    //         img.src = cssUrl;
    //     } else {
    //         updateProgressBarWork(fieldstep, step);
    //     }
    // }

    // function updateProgressBarWork(fieldstep, step) {
    //     var currentForm = document.querySelectorAll('form.mktoForm')[fieldstep.dataset.form]
    //     //identify current fieldstep for current form
    //     var maxSteps = currentForm.querySelectorAll('fieldset').length;
    //     //upsert progress bar
    //     if (!currentForm.querySelectorAll('.progress').length) {
    //         var progressParent = document.createElement("div");
    //         progressParent.className = "progress";
    //         var progresBar = document.createElement("div");
    //         progresBar.className = "progress-bar";
    //         progresBar.setAttribute("role", "progressbar");
    //         progresBar.setAttribute("aria-valuenow", step);
    //         progresBar.setAttribute("aria-valuemin", step);
    //         progresBar.setAttribute("aria-valuemax", maxSteps);
    //         progresBar.style.textAlign = "center !important";
    //         progresBar.style.width = ((step / maxSteps) * 100) + "%";
    //         progresBar.textContent = "Step " + step + " of " + maxSteps;        
    //         progressParent.appendChild(progresBar);
    //         currentForm.insertBefore(progressParent, currentForm.childNodes[0]);
    //     } else {
    //         var bar = currentForm.querySelectorAll(".progress-bar")[0];
    //         bar.setAttribute("aria-valuenow", step);
    //         bar.style.width = ((step / maxSteps) * 100) + "%";
    //         bar.textContent = "Step " + step + " of " + maxSteps;
    //     }
    // }

        //if (!isValid) {
    //MktoForms2.getForm(mktoFormId).validate();
    //     for (var y = 0; y < allChildElements.length; y++) {
    //         var yelement = allChildElements[y];
    //         if (yelement && yelement.classList && yelement.classList.contains('mktoError')) {
    //             yelement.style.display = '';
    //         }
    //     }
    // } else {
    //     for (var z = 0; z < allChildElements.length; z++) {
    //         var zelement = allChildElements[z];
    //         if (zelement && zelement.classList && zelement.classList.contains('mktoError')) {
    //             zelement.style.display = 'none';
    //         }
    //     }
    //}
*/
</script>
<style>
    .mktoForm .mktoFormCol {
        width: 100%;
    }
    .mktoFieldWrap {
        width: 100%;
    }
    .leadsystem fieldset:after {
        content: none;
    }
    .leadsystem fieldset:before {
        content: none;
    }   
    .selectfield:before {
        background-color: transparent;
    }   
    .selectfield:after {
        bottom: -18px;
    }     
    .leadsystem button, .leadsystem input[type="button"] {
        margin: 0px 1%;
    }    
    .mktoOffset {
        display: none;
        width: 0px;
        height: 0px;
    }      
    .mktoFormCol{
        margin-bottom: 0px !important;
    }
    .labelsInside .blurInput label {
        width: 100%;
        top: 15px;
    }    
    .mktoLabel {
        width: 100% !important;
    }    
    .mktoRadioList {
        width: 100% !important;
    }
    .mktoRadioList input {
        width: auto !important;
        margin-left: 20px;
    }
    .mktoRadioList label {
        width: 150px !important;
        display: table-caption !important;
    }
    .steps-indicator .bar {
        background-color: rgb(51, 51, 51);
    }    
    .mktoAsterix {
        float: left;
        padding-right: 5px;
    }
</style>