var Http = (function() {

	'use strict';

	var xhr = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
	
	var settings = {
		header: '',
	};

	/**
	 * Initialize the settings.
	 */
	function init(options) {
		if(typeof options !== 'object') {
			throw new Error('Please provide an object as the settings.');
		}

		settings = extend(settings, options);
	}

	/**
	 * Extend an object, overrides the properties of the origin/abstract object.
	 */
	function extend(currentObj, newObj) {
		var extended = {};
	    var prop;

	    for(prop in currentObj) {
	        if(Object.prototype.hasOwnProperty.call(currentObj, prop)) {
	            extended[prop] = currentObj[prop];
	        }
		}

	    for(prop in newObj) {
	        if(Object.prototype.hasOwnProperty.call(newObj, prop)) {
	            extended[prop] = newObj[prop];
	        }
		}

	    return extended;
	}

	/**
	 * Makes a post request to a url.
	 */
	function post(options) {
		if(typeof options !== 'object') {
			throw new Error('post expecting a json object to be passed as an argument, but '+ typeof options + ' was passed.');
		}

		if(typeof options.data !== 'object') {
			throw new Error('data property expecting a json object to be passed as an argument, but ' + typeof options.data + ' was passed.');
		}

		options.data = options.data || null;

		xhr.open('POST', options.url, true);
		xhr.setRequestHeader("Content-type", options.headers || "application/x-www-form-urlencoded");
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

		if(options.hasOwnProperty('before') && typeof options.before == 'function') {
			options.before();
		}

		xhr.onreadystatechange = function() {
		    if(this.readyState == 4 && (this.status >= 200 || this.status <= 204)) {
		       	if(options.hasOwnProperty('success') && typeof options.success == 'function') {
		       		options.success(JSON.parse(this.response));
		   		} else if(options.hasOwnProperty('after') && typeof options.after == 'function') {
		       		options.after(this.response);
		   		}
		    }
		}

		xhr.onerror = function(message) {
			if(options.hasOwnProperty('error') && typeof options.error == 'function') {
				options.error(message);
			}
		}

		if(! options.data) {
			xhr.send(null);
			return options;
		}

		var queryString = Object.keys(options.data).map(function(key) {
	        return encodeURIComponent(key) + '=' + encodeURIComponent(options.data[key]);
    	}).join('&');

		xhr.send(queryString);

		return options;
	}

	/**
	 * Makes a get request to a url.
	 */
	function get(options) {
		if(typeof options !== 'object') {
			throw new Error('post expecting a json object to be passed as an argument, but '+ typeof options + ' was passed.');
		}

		if(typeof options.data !== 'object' && options.data != null) {
			throw new Error('data property expecting a json object to be passed as an argument, but ' + typeof options.data + ' was passed.');
		}

		options.data = options.data || null;

		if(options.data) {
			var queryString = Object.keys(options.data).map(function(key) {
				return encodeURIComponent(key) + '=' + encodeURIComponent(options.data[key]);
			}).join('&');

			xhr.open('GET', options.url+'?'+ queryString, true);
		} else {
			xhr.open('GET', options.url, true);
		}

		xhr.setRequestHeader("Content-type", options.headers || "application/x-www-form-urlencoded");
		xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

		if(options.hasOwnProperty('before') && typeof options.before == 'function') {
			options.before();
		}

		xhr.onreadystatechange = function() {
		    if(this.readyState == 4 && (this.status >= 200 || this.status <= 204)) {
		       	if(options.hasOwnProperty('success') && typeof options.success == 'function') {
		       		options.success(JSON.parse(this.response));
		   			
		   			if(options.hasOwnProperty('after') && typeof options.after == 'function') {
		       			options.after(this.response);
		   			}
		   		} 
		    }
		}

		xhr.onerror = function(message) {console.log(this);
			if(options.hasOwnProperty('error') && typeof options.error == 'function') {
				options.error(message);
			}
		}

	
		xhr.send(null);
			
		return options;
	}

	return {
		settings: init,
		post: post,
		get: get,
	};
})();