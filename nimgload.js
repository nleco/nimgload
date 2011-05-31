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
NImgLoad = (function(doc) {
	var defaults = {
		class : {
			'bgImg' : 'nimg-bg-none'
		},
		threshold : 0
	},
	allImgs = [],
	allBgImgs = [],
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
			if (item == undefined || class == undefined || item.className == undefined)
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
			if (item == undefined || class == undefined || item.className == undefined)
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
			if (item == undefined || class == undefined || item.className == undefined)
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
		},
		
		removeNulls : function(list) {
			do {
				ix = list.indexOf(null);
				if (ix >= 0) {
					list.splice(ix, 1);
				}
			} while (ix >= 0);
			
			return list;
		}
	}
	
	/**
	 * usefull methods
	 **/
	function trigger() {
		var l = allImgs.length,
			lbg = allBgImgs.length,
			y = util.getWindowScroll().y,
			h = util.getWindowSize().height,
			i, el, off, ix;

		//remove items already processed so that the array only has images not processed.
		if (l) {
			for (i = 0; i < l; i++) {
				el = allImgs[i];
			
				if (!el.getAttribute('src') && el.getAttribute('data-src') && y+h >= util.getOffset(el).top-defaults.threshold) {
					el.setAttribute('src', el.getAttribute('data-src'));
					el.removeAttribute('data-src');
					allImgs[i] = null;
				}
			}
		
			allImgs = util.removeNulls(allImgs);
		}
		
		//remove those with bg images
		if (lbg) {
			for (i = 0; i < lbg; i++) {
				el = allBgImgs[i];
			
				if (y+h >= util.getOffset(el).top-defaults.threshold) {
					util.removeClass(el, defaults.class.bgImg);
					allBgImgs[i] = null;
				}
			}
			
			allBgImgs = util.removeNulls(allBgImgs);
		}
	}
	
	/**
	 * will set the images we'll bother to look at
	 **/
	function initImgs(list) {			
		var l = list.length,
			i, item;
		
		for (i = 0; i < l; i++) {
			item = list[i];
			if (item.getAttribute('data-src')) {
				allImgs.push(item);
			}
		}
	}
	
	/**
	 * will set the objects with a specific class that we'll look at
	 **/
	function initClassedNodes(node) {
		var c = node.childNodes,
			l = c.length,
			i;
		
		if (node.tagName == undefined)
			return;
			
		if (util.hasClass(node, defaults.class.bgImg)) {
			allBgImgs.push(node);
		}

		if (l) {
			for (i = 0; i < l; i++) {
				initClassedNodes(c[i]);
			}
		}
	}

	return {
		init: function (opts) {
			opts = opts || {};
			
			if (opts.bgImgClass) {
				defaults.class.bgImg = opts.bgImgClass;
			}
			
			//initialization
			initImgs(doc.getElementsByTagName('img'));
			initClassedNodes(doc.body);

			//start some initial binding
			util.bind(window, 'scroll', function(){
				trigger();
			});
			
			trigger();
		},
		trigger : function() {
			trigger();
		}
	};
})(this.document);