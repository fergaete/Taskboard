jQuery(document).ready(function() {
    // Bootstrap date picker fix with jQuery UI component
    jQuery.fn.bootstrapDP = jQuery.fn.datepicker.noConflict();

    /**
     * jQuery function to serialize forms to JSON objects. Usage example:
     *
     * console.log(jQuery('#yourForm').serializeJSON());
     *
     * @returns {{}}
     */
    jQuery.fn.serializeJSON = function() {
        var json = {};

        jQuery.map(jQuery(this).serializeArray(), function(n, i) {
            var _ = n.name.indexOf('[');
            if (_ > -1) {
                var o = json;
                _name = n.name.replace(/\]/gi, '').split('[');
                for (var i = 0, len = _name.length; i < len; i++) {
                    if (i == len - 1) {
                        if (o[_name[i]]) {
                            if (typeof o[_name[i]] == 'string') {
                                o[_name[i]] = [o[_name[i]]];
                            }
                            o[_name[i]].push(n.value);
                        }
                        else o[_name[i]] = n.value || '';
                    }
                    else o = o[_name[i]] = o[_name[i]] || {};
                }
            }
            else {
                if (json[n.name] !== undefined) {
                    if (!json[n.name].push) {
                        json[n.name] = [json[n.name]];
                    }
                    json[n.name].push(n.value || '');
                }
                else json[n.name] = n.value || '';
            }
        });

        return json;
    };

    /**
     * Generic html element type getter.
     *
     * @returns {string}
     */
    jQuery.fn.getType = function() {
        return this[0].tagName == "INPUT" ? jQuery(this[0]).attr("type").toLowerCase() : this[0].tagName.toLowerCase();
    };

    var tooltips = jQuery('[rel=tooltip]');

    if (tooltips.length) {
        tooltips.tooltip();
    }
});

/**
 * Generic AJAX error handler.
 *
 * @param   {XMLHttpRequest}    jqXhr
 * @param   {String}            textStatus
 * @param   {String}            error
 */
function handleAjaxError(jqXhr, textStatus, error) {
    var message = '';
    var errorMessage = '';

    try {
        var errorInfo = jQuery.parseJSON(jqXhr.responseText);

        if (errorInfo.errors[0]) {
            errorMessage = errorInfo.errors[0].message;
        }
    } catch (exception) {
        errorMessage = jqXhr.responseText;
    }

    if (jqXhr.status === 0) {
        message = 'Not connect. Verify Network. ' + errorMessage;
    } else if (jqXhr.status == 403) {
        message = 'Forbidden [403]. ' + errorMessage;
    } else if (jqXhr.status == 404) {
        message = 'Requested page not found [404]. ' + errorMessage;
    } else if (jqXhr.status == 500) {
        message = 'Internal Server Error [500]. ' + errorMessage;
    } else if (textStatus === 'parsererror') {
        message = 'Requested JSON parse failed.';
    } else if (textStatus === 'timeout') {
        message = 'Time out error.';
    } else if (textStatus === 'abort') {
        message = 'Ajax request aborted.';
    } else {
        message = 'Uncaught Error.\n' + jqXhr.responseText + textStatus + ', ' + error;
    }

    makeMessage(message, 'error', {});
}

/**
 * Function to trigger noty message.
 *
 * @param   {string}    text    Message to show
 * @param   {string}    type    Type of message
 * @param   {object}    options Custom options for noty
 */
function makeMessage(text, type, options) {
    var timeout = 3000;

    switch (type) {
        case 'success':
            timeout = 1500;
    }

    noty(jQuery.extend({}, {
        text: text.nl2br(),
        type: type,
        layout: 'top',
        timeout: timeout
    }, options));
}

function dispatch(fn, args) {
    fn = (typeof fn == "function") ? fn : window[fn];  // Allow fn to be a function object or the name of a global function
    return fn.apply(this, args || []);  // args is optional, use an empty array by default
}

/**
 * Function opens a Bootbox modal dialog with specified title, content and buttons.
 *
 * @param   {string}            title   Modal title
 * @param   {string}            content Modal content as html
 * @param   {object|array|null} buttons Button(s) to add dialog
 * @param   {undefined|string}  trigger Possible body trigger event on close
 * @returns {*}
 */
function openBootboxDialog(title, content, buttons, trigger) {
    trigger = trigger || false;

    var buttonsToShow = [];

    // Every dialog has close button.
    buttonsToShow.push({
        label: "Close",
        class: "pull-left",
        callback: function() {
            if (trigger) {
                jQuery('body').trigger(trigger);
            }
        }
    });

    // We have multiple buttons
    if (buttons instanceof Array) {
        jQuery.each(buttons, function(index, button) {
            buttonsToShow.push(button);
        });
    } else if (buttons !== null) { // Just one button to add
        buttonsToShow.push(buttons);
    }

    // Return bootbox dialog
    var modal = bootbox.dialog(
        content,
        buttonsToShow,
        {
            header: title
        }
    );

    modal.removeClass('fade');

    return modal;
}

/**
 * Function to set specified cookie and value for given days.
 *
 * @param   {string}        name    Name of the cookie
 * @param   {string|number} value   Cookie value
 * @param   {number}        days    How many days cookie is valid
 */
function createCookie(name, value, days) {
    var expires = "";

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        expires = "; expires=" + date.toGMTString();
    }

    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

/**
 * Function to read specified cookie.
 *
 * @param   {string}    name     Name of the cookie
 *
 * @returns {*}
 */
function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }

        if (c.indexOf(nameEQ) == 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }

    return null;
}

/**
 * Function to erase specified cookie.
 *
 * @param   {string}    name     Name of the cookie
 */
function eraseCookie(name) {
    createCookie(name, "", -1);
}