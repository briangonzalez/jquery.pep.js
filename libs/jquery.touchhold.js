(function($) {
	var DELAY = 750;
	
	$.extend($.fn, {
		touchhold: function(end, start) {
			var timeout, shouldTrigger = false;
			
			function _touchStart(e) {
				var that = this;
				timeout = setTimeout(function() {
					$(that).trigger('touchhold.start');
					shouldTrigger = true;
				}, DELAY);
			};
			
			function _touchMove() {
				clearTimeout(timeout);
			};
			
			function _touchEnd() {
				clearTimeout(timeout);
				if (shouldTrigger) {
					$(this).trigger('touchhold.end');
					shouldTrigger = false;
					return false;
				}
			};
			
			// Only bind the helper events if they haven't been bound yet
			if (!($(this).data('events')) || ($(this).data('events') && !($(this).data('events')['touchhold']))) {
				$(this).bind('touchstart', _touchStart)
					.bind('touchmove', _touchMove)
					.bind('touchend', _touchEnd);
			}
			
			if ($.isFunction(start)) { $(this).bind('touchhold.start', start); };
			if ($.isFunction(end)) { $(this).bind('touchhold.end', end); };
			return this;
		}
	});
})(jQuery);