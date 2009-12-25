// run at background.html / need prefs.js

var RIL_API_URL = 'https://readitlaterlist.com/v2/';
var RIL_STATS = 'stats';
var RIL_GET   = 'get';

var requestTimeout = null;
var REQUEST_TIMEOUT_MS_ = 1000 * 30;

function RIL() {
    this.init();
}

RIL.prototype = {
    init: function _init() {
        this.result = new Array();
        this.count = 0;
        this.startRequest();
    },

    startRequest: function(callback) {
        console.log('startRequest called');
        // loadingAnimation.start();
        if (requestTimeout) {
            window.clearTimeout(requestTimeout);
        }
        requestTimeout = null;
        this.getUnreadCount(
            function(total, unread, read) { //onSuccess
                //loadingAnimation.stop();
                updateUnreadCount(total, unread, read);
            },
            function(opt_isSignedOut) { //onError
                updateUnreadCount('?', '?', '?');
                //loadingAnimation.stop();
                //showSignedOut();
                if (!opt_noSchedule) {
                    //scheduleRequest(opt_isSignedOut);
                }
            }
        );
    },

    startRequestItems: function(callback) {
        console.log('startRequestItems called');
        // loadingAnimation.start();
        if (requestTimeout) {
            window.clearTimeout(requestTimeout);
        }
        requestTimeout = null;
        this.getItems(
            'unread', // unread / read / null
            function(json) { //onSuccess
                //loadingAnimation.stop();
                console.log("startRequestItems/getItems/onSuccess");
                if (json.status == 2) {
                    // no changes
                    return;
                }
                setSinceRequest(json.since);
                callback(json);
            },
            function(opt_isSignedOut) { //onError
                updateUnreadCount('?', '?', '?');
                //loadingAnimation.stop();
                //showSignedOut();
                if (!opt_noSchedule) {
                    //scheduleRequest(opt_isSignedOut);
                }
            }
        );
    },

    getUnreadCount: function(onSuccess, onError) {
        var xhr = new XMLHttpRequest();
        var abortTimerId = window.setTimeout(function() {
            xhr.abort();
            onError();
        }, REQUEST_TIMEOUT_MS_);

        function handleSuccess(jsonText) {
            window.clearTimeout(abortTimerId);
            var json = JSON.parse(jsonText); // http://code.google.com/chrome/extensions/xhr.html
            onSuccess(json.count_list, json.count_unread, json.count_read);
        }

        function handleError(opt_isSignedOut) {
            window.clearTimeout(abortTimerId);
            onError(opt_isSignedOut);
        }

        try {
            console.log('request..');
            xhr.onreadystatechange = function(){
                console.log('readystate: ' + xhr.readyState);
                if (xhr.readyState == 4) {
                    if (xhr.status >= 400) {
                        console.log(
                            'Error response code: ' + xhr.status + '/' + xhr.statusText);
                        handleError(xhr.status == 401);
                    } else if (xhr.responseText) {
                        console.log('responseText: ' + xhr.responseText.substring(0, 200) +
                                    '...');
                        handleSuccess(xhr.responseText);
                    } else {
                        console.log('No responseText!');
                        handleError();
                    }
                }
            }

            xhr.onerror = function(error) {
                console.log('error');
                console.log(error);
                handleError();
            }
            
            //JSON.stringify({
            var data = [
                'username='+ getUsername(),
                'password='+ getPassword(),
                'apikey='+   getAPIKEY()
            ].join('&');
            console.log('xhr.send data: ' + data);
            xhr.open('POST', RIL_API_URL + RIL_STATS, true);
	    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(data);
        } catch(e) {
            console.log('XHR exception: ' + e);
            handleError();
        }
    },
    getItems: function(state, onSuccess, onError) { // state=(read|unread), func, func
        var xhr = new XMLHttpRequest();
        var abortTimerId = window.setTimeout(function() {
            xhr.abort();
            onError();
        }, REQUEST_TIMEOUT_MS_);

        function handleSuccess(jsonText) {
            window.clearTimeout(abortTimerId);
            var json = JSON.parse(jsonText); // http://code.google.com/chrome/extensions/xhr.html
            onSuccess(json);
        }

        function handleError(opt_isSignedOut) {
            window.clearTimeout(abortTimerId);
            onError(opt_isSignedOut);
        }

        try {
            console.log('request..');
            xhr.onreadystatechange = function(){
                console.log('readystate: ' + xhr.readyState);
                if (xhr.readyState == 4) {
                    if (xhr.status >= 400) {
                        console.log(
                            'Error response code: ' + xhr.status + '/' + xhr.statusText);
                        handleError(xhr.status == 401);
                    } else if (xhr.responseText) {
                        console.log('responseText: ' + xhr.responseText.substring(0, 200) +
                                    '...');
                        handleSuccess(xhr.responseText);
                    } else {
                        console.log('No responseText!');
                        handleError();
                    }
                }
            }

            xhr.onerror = function(error) {
                console.log('error');
                console.log(error);
                handleError();
            }
            
            //JSON.stringify({
            var data = [
                'username='+ getUsername(),
                'password='+ getPassword(),
                'apikey='+   getAPIKEY(),
                'state='+    state
            ].join('&');
            console.log('getItems xhr.send data: ' + data);
            xhr.open('POST', RIL_API_URL + RIL_GET, true);
	    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(data);
        } catch(e) {
            console.log('XHR exception: ' + e);
            handleError();
        }
    },
};

var SIGNED_IN_BADGE_COLOR_ = {color: [208, 0, 24, 255]};
var lastCountText = '';
function updateUnreadCount(total, unread, read) {
  //chrome.browserAction.setIcon({path: 'icon-signed-in.png'});
  var countText = unread + '';

  if (countText == lastCountText) {
    return;
  }

  lastCountText = countText;

  chrome.browserAction.setBadgeBackgroundColor(SIGNED_IN_BADGE_COLOR_);
  chrome.browserAction.setBadgeText({text: countText});
}

