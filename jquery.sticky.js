define(['jquery.boiler'], function($){

	$.boiler('sticky', {
		defaults: {
			activeClass: 'sticky',
			offset: 0
		},

		init: function(){
			var plugin = this;
			
			plugin.origOffsetY = plugin.$el.offset().top + plugin.settings.offset;
			//http://ejohn.org/blog/learning-from-twitter/
			plugin.didScroll = true;

			$(window).scroll(function(){
				plugin.didScroll = true;
			});

			setInterval(function() {
				if ( plugin.didScroll ) {
					plugin.didScroll = false;
					plugin._update();
				}
			}, 250);
		},

		_update: function(){
			var plugin = this;
			if(window.scrollY >= this.origOffsetY){
				this.$el.addClass(plugin.settings.activeClass);
			}else{
				this.$el.removeClass(plugin.settings.activeClass);
			}
		}
	});

	// Return the jquery object
	// This way you don't need to require both jquery and the plugin
	return $;

});