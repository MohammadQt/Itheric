/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * copyright 2015, Codrops
 * http://www.codrops.com
 */

;(function(window) {

	'use strict';

	var support = { animations : Modernizr.cssanimations },
		animEndEventNames = { 'WebkitAnimation' : 'webkitAnimationEnd', 'OAnimation' : 'oAnimationEnd', 'msAnimation' : 'MSAnimationEnd', 'animation' : 'animationend' },
		animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
		onEndAnimation = function( el, callback ) {
			var onEndCallbackFn = function( ev ) {
				if( support.animations ) {
					if( ev.target != this ) return;
					this.removeEventListener( animEndEventName, onEndCallbackFn );
				}
				if( callback && typeof callback === 'function' ) { callback.call(); }
			};
			if( support.animations ) {
				el.addEventListener( animEndEventName, onEndCallbackFn );
			}
			else {
				onEndCallbackFn();
			}
		};

	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}

	function MLmenux(el, options) {
		this.el = el;
		this.options = extend( {}, this.options );
		extend( this.options, options );
		
		// the menuxs (<ul>´s)
		this.menuxs = [].slice.call(this.el.querySelectorAll('.menux__level'));

		// index of current menux
		// Each level is actually a different menux so 0 is root, 1 is sub-1, 2 sub-2, etc.
		this.current_menux = 0;

		/* Determine what current menux actually is */
		var current_menux;
		this.menuxs.forEach(function(menuxEl, pos) {
			var items = menuxEl.querySelectorAll('.menux__item');
			items.forEach(function(itemEl, iPos) {
				var currentLink = itemEl.querySelector('.menux__link--current');
				if (currentLink) {
					// This is the actual menux__level that should have current
					current_menux = pos;
				}
			});
		});

		if (current_menux) {
			this.current_menux = current_menux;	
		}

		this._init();
	}

	MLmenux.prototype.options = {
		// show breadcrumbs
		breadcrumbsCtrl : true,
		// initial breadcrumb text
		initialBreadcrumb : 'all',
		// show back button
		backCtrl : true,
		// delay between each menux item sliding animation
		itemsDelayInterval : 60,
		// direction 
		direction : 'r2l',
		// callback: item that doesn´t have a submenux gets clicked
		// onItemClick([event], [inner HTML of the clicked item])
		onItemClick : function(ev, itemName) { return false; }
	};

	MLmenux.prototype._init = function() {
		// iterate the existing menuxs and create an array of menuxs, 
		// more specifically an array of objects where each one holds the info of each menux element and its menux items
		this.menuxsArr = [];
		this.breadCrumbs = false;
		var self = this;
		var submenuxs = [];

		/* Loops over root level menux items */
		this.menuxs.forEach(function(menuxEl, pos) {
			var menux = {menuxEl : menuxEl, menuxItems : [].slice.call(menuxEl.querySelectorAll('.menux__item'))};
			
			self.menuxsArr.push(menux);

			// set current menux class
			if( pos === self.current_menux ) {
				classie.add(menuxEl, 'menux__level--current');
			}

			var menux_x = menuxEl.getAttribute('data-menux');
			var links = menuxEl.querySelectorAll('.menux__link');
			links.forEach(function(linkEl, lPos) {
				var submenux = linkEl.getAttribute('data-submenux');
				if (submenux) {
					var pushMe = {"menux":submenux, "name": linkEl.innerHTML };
					if (submenuxs[pos]) {
						submenuxs[pos].push(pushMe);
					} else {
						submenuxs[pos] = []
						submenuxs[pos].push(pushMe);
					}
				}
			});
		});

		/* For each menux, find their parent menux */		
		this.menuxs.forEach(function(menuxEl, pos) {
			var menux_x = menuxEl.getAttribute('data-menux');
			submenuxs.forEach(function(submenuxEl, menux_root) {
				submenuxEl.forEach(function(submenuxItem, subPos) {
					if (submenuxItem.menux == menux_x) {
						self.menuxsArr[pos].backIdx = menux_root;
						self.menuxsArr[pos].name = submenuxItem.name;
					}
				});
			});
		});

		// create breadcrumbs
		if( self.options.breadcrumbsCtrl ) {
			this.breadcrumbsCtrl = document.createElement('nav');
			this.breadcrumbsCtrl.className = 'menux__breadcrumbs';
			this.breadcrumbsCtrl.setAttribute('aria-label', 'You are here');
			this.el.insertBefore(this.breadcrumbsCtrl, this.el.firstChild);
			// add initial breadcrumb
			this._addBreadcrumb(0);
			
			// Need to add breadcrumbs for all parents of current submenux
			if (self.menuxsArr[self.current_menux].backIdx != 0 && self.current_menux != 0) {
				this._crawlCrumbs(self.menuxsArr[self.current_menux].backIdx, self.menuxsArr);
				this.breadCrumbs = true;
			}

			// Create current submenux breadcrumb
			if (self.current_menux != 0) {
				this._addBreadcrumb(self.current_menux);
				this.breadCrumbs = true;
			}
		}

		// create back button
		if (this.options.backCtrl) {
			this.backCtrl = document.createElement('button');
			if (this.breadCrumbs) {
				this.backCtrl.className = 'menux__back';	
			} else {
				this.backCtrl.className = 'menux__back menux__back--hidden';
			}
			this.backCtrl.setAttribute('aria-label', 'Go back');
			this.backCtrl.innerHTML = '<span class="icon icon--arrow-right"></span>';
			this.el.insertBefore(this.backCtrl, this.el.firstChild);
		}

		// event binding
		this._initEvents();
	};

	MLmenux.prototype._initEvents = function() {
		var self = this;

		for(var i = 0, len = this.menuxsArr.length; i < len; ++i) {
			this.menuxsArr[i].menuxItems.forEach(function(item, pos) {
				item.querySelector('a').addEventListener('click', function(ev) { 
					var submenux = ev.target.getAttribute('data-submenux'),
						itemName = ev.target.innerHTML,
						submenuxEl = self.el.querySelector('ul[data-menux="' + submenux + '"]');

					// check if there's a sub menux for this item
					if( submenux && submenuxEl ) {
						ev.preventDefault();
						// open it
						self._openSubmenux(submenuxEl, pos, itemName);
					}
					else {
						// add class current
						var currentlink = self.el.querySelector('.menux__link--current');
						if( currentlink ) {
							classie.remove(self.el.querySelector('.menux__link--current'), 'menux__link--current');
						}
						classie.add(ev.target, 'menux__link--current');
						
						// callback
						self.options.onItemClick(ev, itemName);
					}
				});
			});
		}
		
		// back navigation
		if( this.options.backCtrl ) {
			this.backCtrl.addEventListener('click', function() {
				self._back();
			});
		}
	};

	MLmenux.prototype._openSubmenux = function(submenuxEl, clickPosition, submenuxName) {
		if( this.isAnimating ) {
			return false;
		}
		this.isAnimating = true;
		
		// save "parent" menux index for back navigation
		this.menuxsArr[this.menuxs.indexOf(submenuxEl)].backIdx = this.current_menux;
		// save "parent" menux´s name
		this.menuxsArr[this.menuxs.indexOf(submenuxEl)].name = submenuxName;
		// current menux slides out
		this._menuxOut(clickPosition);
		// next menux (submenux) slides in
		this._menuxIn(submenuxEl, clickPosition);
	};

	MLmenux.prototype._back = function() {
		if( this.isAnimating ) {
			return false;
		}
		this.isAnimating = true;

		// current menux slides out
		this._menuxOut();
		// next menux (previous menux) slides in
		var backmenux = this.menuxsArr[this.menuxsArr[this.current_menux].backIdx].menuxEl;
		this._menuxIn(backmenux);

		// remove last breadcrumb
		if( this.options.breadcrumbsCtrl ) {
			this.breadcrumbsCtrl.removeChild(this.breadcrumbsCtrl.lastElementChild);
		}
	};

	MLmenux.prototype._menuxOut = function(clickPosition) {
		// the current menux
		var self = this,
			currentmenux = this.menuxsArr[this.current_menux].menuxEl,
			isBackNavigation = typeof clickPosition == 'undefined' ? true : false;

		// slide out current menux items - first, set the delays for the items
		this.menuxsArr[this.current_menux].menuxItems.forEach(function(item, pos) {
			item.style.WebkitAnimationDelay = item.style.animationDelay = isBackNavigation ? parseInt(pos * self.options.itemsDelayInterval) + 'ms' : parseInt(Math.abs(clickPosition - pos) * self.options.itemsDelayInterval) + 'ms';
		});
		// animation class
		if( this.options.direction === 'r2l' ) {
			classie.add(currentmenux, !isBackNavigation ? 'animate-outToright' : 'animate-outToleft');
		}
		else {
			classie.add(currentmenux, isBackNavigation ? 'animate-outToright' : 'animate-outToleft');	
		}
	};

	MLmenux.prototype._menuxIn = function(nextmenuxEl, clickPosition) {
		var self = this,
			// the current menux
			currentmenux = this.menuxsArr[this.current_menux].menuxEl,
			isBackNavigation = typeof clickPosition == 'undefined' ? true : false,
			// index of the nextmenuxEl
			nextmenuxIdx = this.menuxs.indexOf(nextmenuxEl),

			nextmenux = this.menuxsArr[nextmenuxIdx],
			nextmenuxEl = nextmenux.menuxEl,
			nextmenuxItems = nextmenux.menuxItems,
			nextmenuxItemsTotal = nextmenuxItems.length;

		// slide in next menux items - first, set the delays for the items
		nextmenuxItems.forEach(function(item, pos) {
			item.style.WebkitAnimationDelay = item.style.animationDelay = isBackNavigation ? parseInt(pos * self.options.itemsDelayInterval) + 'ms' : parseInt(Math.abs(clickPosition - pos) * self.options.itemsDelayInterval) + 'ms';

			// we need to reset the classes once the last item animates in
			// the "last item" is the farthest from the clicked item
			// let's calculate the index of the farthest item
			var farthestIdx = clickPosition <= nextmenuxItemsTotal/2 || isBackNavigation ? nextmenuxItemsTotal - 1 : 0;

			if( pos === farthestIdx ) {
				onEndAnimation(item, function() {
					// reset classes
					if( self.options.direction === 'r2l' ) {
						classie.remove(currentmenux, !isBackNavigation ? 'animate-outToright' : 'animate-outToleft');
						classie.remove(nextmenuxEl, !isBackNavigation ? 'animate-inFromleft' : 'animate-inFromright');
					}
					else {
						classie.remove(currentmenux, isBackNavigation ? 'animate-outToright' : 'animate-outToleft');
						classie.remove(nextmenuxEl, isBackNavigation ? 'animate-inFromleft' : 'animate-inFromright');
					}
					classie.remove(currentmenux, 'menux__level--current');
					classie.add(nextmenuxEl, 'menux__level--current');

					//reset current
					self.current_menux = nextmenuxIdx;

					// control back button and breadcrumbs navigation elements
					if( !isBackNavigation ) {
						// show back button
						if( self.options.backCtrl ) {
							classie.remove(self.backCtrl, 'menux__back--hidden');
						}
						
						// add breadcrumb
						self._addBreadcrumb(nextmenuxIdx);
					}
					else if( self.current_menux === 0 && self.options.backCtrl ) {
						// hide back button
						classie.add(self.backCtrl, 'menux__back--hidden');
					}

					// we can navigate again..
					self.isAnimating = false;

					// focus retention
					nextmenuxEl.focus();
				});
			}
		});

		// animation class
		if( this.options.direction === 'r2l' ) {
			classie.add(nextmenuxEl, !isBackNavigation ? 'animate-inFromleft' : 'animate-inFromright');
		}
		else {
			classie.add(nextmenuxEl, isBackNavigation ? 'animate-inFromleft' : 'animate-inFromright');
		}
	};

	MLmenux.prototype._addBreadcrumb = function(idx) {
		if( !this.options.breadcrumbsCtrl ) {
			return false;
		}

		var bc = document.createElement('a');
		bc.href = '#'; // make it focusable
		bc.innerHTML = idx ? this.menuxsArr[idx].name : this.options.initialBreadcrumb;
		this.breadcrumbsCtrl.appendChild(bc);

		var self = this;
		bc.addEventListener('click', function(ev) {
			ev.preventDefault();

			// do nothing if this breadcrumb is the last one in the list of breadcrumbs
			if( !bc.nextSibling || self.isAnimating ) {
				return false;
			}
			self.isAnimating = true;
			
			// current menux slides out
			self._menuxOut();
			// next menux slides in
			var nextmenux = self.menuxsArr[idx].menuxEl;
			self._menuxIn(nextmenux);

			// remove breadcrumbs that are ahead
			var siblingNode;
			while (siblingNode = bc.nextSibling) {
				self.breadcrumbsCtrl.removeChild(siblingNode);
			}
		});
	};

	MLmenux.prototype._crawlCrumbs = function(currentmenux, menuxArray) {
		if (menuxArray[currentmenux].backIdx != 0) {
			this._crawlCrumbs(menuxArray[currentmenux].backIdx, menuxArray);
		}
		// create breadcrumb
		this._addBreadcrumb(currentmenux);
	}

	window.MLmenux = MLmenux;

})(window);