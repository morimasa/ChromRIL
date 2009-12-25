
var REFRESH_INTERVAL_KEY = 'refresh-interval';
var USERNAME_KEY = 'username';
var PASSWORD_KEY = 'password';
var API_KEY      = '67eg0db0p61e6n683eT3c55obyA8l40V';
var SINCE_REQUEST_KEY = 'since-request';

function getRefreshInterval() {
  return parseInt(localStorage[REFRESH_INTERVAL_KEY] || '300000', 10);
}

function setRefreshInterval(value) {
  localStorage[REFRESH_INTERVAL_KEY] = value;
}

function setUsername(value) {
    localStorage[USERNAME_KEY] = value;
}
function setPassword(value) {
    localStorage[PASSWORD_KEY] = value;
}

function getUsername() {
    return localStorage[USERNAME_KEY];
}
function getPassword() {
    return localStorage[PASSWORD_KEY];
}

function setSinceRequest(value) {
    localStorage[SINCE_REQUEST_KEY] = value;
}
function getSinceRequest() {
    return localStorage[SINCE_REQUEST_KEY];
}

function getAPIKEY() {
    return API_KEY;
}
