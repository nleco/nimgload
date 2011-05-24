/*
 * nimgload - helps load images once they are in view
 *
 * Author: Samuel Sanchez
 * URL: http://github.com/nleco/nimgload
 *
 * Copyright (c) 2011 Samuel Sanchez
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Note: will look at all images on your site and only process those with data-src set up.
 */
NImgLoad = (function(d) {
	var defaults = {
		imgClass : 'nimg-done',
		invisClass : 'nimg-invis',
		threshold : 0
	},
	allImgs = d.getElementsByTagName('img'),
	util = {
		/**
		 * attaches an event to an element
		 **/
		bind : function (item, type, method) {
			if (item.addEventListener) {
				item.addEventListener(type, method, false);
			} else if (item.attachEvent) {
				item.attachEvent('on'+type, function(){
					method.call(this);
				});
			} else {
				if (console && console.log) {
					console.log('NImgLoad not supported');
				}
				return false;
			}
		},
	
		/**
		 * returns how far the window is scrolled
		 * source: http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
		 **/
		getWindowScroll : function() {
			var scrOfX = 0, scrOfY = 0;
		
			if ( typeof( window.pageYOffset ) == 'number' ) {
				//Netscape compliant
				scrOfY = window.pageYOffset;
				scrOfX = window.pageXOffset;
			} else if ( document.body && (document.body.scrollLeft || document.body.scrollTop)) {
				//DOM compliant
				scrOfY = document.body.scrollTop;
				scrOfX = document.body.scrollLeft;
			} else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
				//IE6 standards compliant mode
				scrOfY = document.documentElement.scrollTop;
				scrOfX = document.documentElement.scrollLeft;
			}
			return {x:scrOfX, y:scrOfY};
		},
	
		/**
		 * returns the window size
		 * source: http://www.howtocreate.co.uk/tutorials/javascript/browserwindow
		 **/
		getWindowSize : function() {
			var w = 0,
				h = 0;
			if (typeof(window.innerWidth) == 'number') {
				//Non-IE
				w = window.innerWidth;
				h = window.innerHeight;
			} else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
				//IE 6+ in 'standards compliant mode'
				w = document.documentElement.clientWidth;
				h = document.documentElement.clientHeight;
			} else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
				//IE 4 compatible
				w = document.body.clientWidth;
				h = document.body.clientHeight;
			}
			return {width:w, height:h};
		},
		
		/**
		 * adds a class from an element only if it isn't already there
		 **/
		addClass : function(item, class) {
			if (item == undefined || class == undefined)
				return;
				
			var s = item.className.split(' '),
				l = s.length, 
				i;
				
			for (i = 0; i < l; i++) {
				if (s[i] == class)
					return;
			}
			
			if (item.className) {
				item.className += ' ' + class;
			} else {
				item.className = class;
			}
		},
	
		/**
		 * removes a class from an element
		 **/
		removeClass : function(item, class) {
			if (item == undefined || class == undefined)
				return;
				
			var s = item.className.split(' '),
				l = s.length, 
				i;
				
			for (i = 0; i < l; i++) {
				if (s[i] == class)
					s[i] = '';
			}
			
			item.className = s.join(' ');
		},
		
		/**
		 * finds if an element has a class
		 **/
		hasClass : function(item, class) {
			if (item == undefined || class == undefined)
				return false;
				
			var s = item.className.split(' '),
				l = s.length, 
				i;
				
			for (i = 0; i < l; i++) {
				if (s[i] == class)
					return true;
			}
			
			return false;
		},
	
		/**
		 * returns the offsets of the element based on the document
		 * source: http://stackoverflow.com/questions/442404/dynamically-retrieve-html-element-x-y-position-with-javascript
		 **/
		getOffset : function(el) {
			var _x = 0;
			var _y = 0;
			while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
				_x += el.offsetLeft - el.scrollLeft;
				_y += el.offsetTop - el.scrollTop;
				el = el.offsetParent;
			}
			return {top: _y, left: _x};
		}
	}
	
	/**
	 * usefull methods
	 **/
	function trigger() {
		var l = allImgs.length,
			y = util.getWindowScroll().y,
			h = util.getWindowSize().height,
			i, el, off;
		
		//todo: may want to remove items already processed so that the array only has images not processed.
		for (i = 0; i < l; i++) {
			el = allImgs[i];
			
			if (!el.getAttribute('src') && el.getAttribute('data-src') && y+h >= util.getOffset(el).top-defaults.threshold) {
				el.setAttribute('src', el.getAttribute('data-src'));
				el.removeAttribute('data-src');
				util.addClass(el, defaults.imgClass);
			}
		}
	}
	
	//start some initial binding
	util.bind(window, 'scroll', function(){
		trigger();
	});
	
	return {
		init: function (opts) {
			opts = opts || {};
			
			trigger();
		},
		trigger : function() {
			trigger();
		}
	};
})(this.document);