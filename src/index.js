const _ = require('lodash');

/**
 * Pihhstacke comes from mistake and Pihh , my name
 * @desc Sends frontend errors to a database so the devs can know what is happening in which app version
 * @type {Pihhstake}
 *
 */
const Pihhstake = (function(){

    // ## PRIVATE STUFF
    /**
     * Will ensure we are dealing with a singleton
     * @type {null}
     * @private
     */
    let _instance = null;
    /**
     * Basic configuration object
     * @type {{url: string, intersectedConsoleMethods: string[], appInfo: {version: string}}}
     * @private
     */
    let _config = {
        url: 'http://localhost:3000/api/error',
        contentType: 'application/json',
        requestType: 'POST',
        consoleMethods: ['warn', 'error'],
        intersectedConsoleMethods: ['warn','error'],
        appInfo: {
            version: '0.0.1',

        }
    }

    _navigator = (()=> {
        return {
            name: navigator.appName,
            version: navigator.appVersion
        }
    });
    /**
     * Checks if the database url is valid
     * @param {String} value
     * @returns {boolean}
     * @private
     */
    const _validateUrl = function(value = '') {
        // return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
        const indexes = ['http://','https://','localhost'];
        for(let i = 0 ; i < indexes.length; i++) {
            if(value.indexOf(indexes[i]) === 0 ) return true;
        }
        return false;
    };
    /**
     * Allowed database request tipes
     * @type {string[]}
     * @private
     */
    const _allowedRequestTypes = ['PUT','POST','PATCH'];
    /**
     * Console styles
     * @type {string}
     * @private
     */
    const _logStyles = 'background: green; color: white; display: block;';
    /**
     * Checks the deviceID if the browser supports it
     */
    const _deviceID = (MediaDeviceInfo && MediaDeviceInfo.deviceId) ? MediaDeviceInfo.deviceId : 'Brower doesn\'t support MediaDeviceInfo';
    /**
     * Boots the
     * @param {Object} _config
     * @private
     */
    const _boot = (_config)=>{
        _overrideConfigurations(_config);
    }
    /**
     * Overrides default configurations
     * @param {Object} config
     * @private
     */
    const _overrideConfigurations = (config = {}) => {
        if(!_.isPlainObject(config)) return;
        for(let i = 0; i < Object.keys(config).length ; i++) {
           const key = Object.keys(config)[i];
           if(_config.hasOwnProperty(key)) {
               if(key === 'url'){
                   if(!_validateUrl(config[key])) break;
               }
               _config[key] = config[key];
           }
        };
    }


    /**
     * Determine the mobile operating system.
     * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
     *
     * @returns {String}
     */
    const _mobileOperatingSystem = (()=> {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;

        if (/windows phone/i.test(userAgent)) return 'Windows Phone';
        if (/android/i.test(userAgent)) return 'Android';
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) return 'iOS';

        return 'unknown';
    })();

    /**
     * @name _buildPostData
     * @desc Generates the info needed to store on the database
     * @param {Arguments} data - is a set of arguments passed via console.error or window.onerror
     * @private
     *
     */

    const _buildPostData = function(data = {}) {
        return JSON.stringify({
            error: data,
            deviceID: _deviceID,
            os: _mobileOperatingSystem,
            navigatorName: _navigator.name,
            navigatorVersion: _navigator.version
        });
    };

    /**
     * @name _postData
     * @desc sends a vanilla JS XMLHttpRequest to the server ( data type json )
     * @param {Arguments} data - a set of arguments passed via console.error or window.onerror
     * @private
     */
    const _postData = function(data){
        if(!_config.url) return;

        const xhr = new XMLHttpRequest();
        xhr.open("POST", _config.url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(_buildPostData(data));
    };

    /**
     * @name _interceptConsole
     * @desc intercepts console events to send a http request to store the error on the database
     * @private
     */
    const _interceptConsole = function(){
        var console = window.console;
        if(!console) return;

        function intercept(method){
            var original = console[method];

            console[method] = function(){
                const message = Array.prototype.slice.apply(arguments).join(' ');
                original.call(console, message);
                _postData(arguments);
            }
        }

        //METHOTDS TO INTERCEPT
        const methods = ['warn', 'error'];
        for (let i = 0; i < methods.length; i++) intercept(methods[i]);
    };

    /**
     * @name _interceptError
     * @desc intercepts window.onerror event to store the error on the database
     * @param {Arguments} data - a set of arguments passed via console.error or window.onerror
     * @private
     */
    const _interceptError = function(){
        window.onerror = function () {
            _postData(arguments);
            return false;
        }
    };

    const _log = function(){
        console.log('%c BlueDarwinErrorHandler::Start', _logStyles);
        console.log(...arguments);
        console.log('%c BlueDarwinErrorHandler::End', _logStyles);
    };
    class Pihhstake {
        constructor(config = {}){
            if(null !== _instance) return _instance;
            _boot(_config);
            _interceptConsole();
            _interceptError();
            _instance = this;

            return _instance;
        }
    }

    return Pihhstake;
})();

module.exports = Pihhstake;