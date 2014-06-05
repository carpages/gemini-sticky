/**
 * @fileoverview

A jQuery plugin to make elements stick to the top of the page on scroll

 *
 * @namespace jquery.sticky
 * @copyright Carpages.ca 2014
 * @author Matt Rose <matt@mattrose.ca>
 *
 * @requires jquery-loader
 * @requires jquery.boiler
 * @requires jquery.respond
 *
 * @prop {string} activeClass {@link jquery.sticky#activeClass}
 * @prop {integer} offset {@link jquery.sticky#offset}
 * @prop {string} screen {@link jquery.sticky#screen}
 *
 * @example
  <html>
    <div id="js-sticky">
      I Stick!!
    </div>
  </html>
 *
 * @example
  $('#js-sticky').sticky();
 */
define(['jquery-loader', 'jquery.boiler', 'jquery.respond'], function($){

  $.boiler('sticky', {
    defaults: {
      /**
       * The class that's toggled when the element should stick
       *
       * @name jquery.sticky#activeClass
       * @type string
       * @default 'is-sticky'
       */
      activeClass: 'is-sticky',
      /**
       * The number of pixels to offset when the sticking should activate
       *
       * @name jquery.sticky#offset
       * @type integer
       * @default 0
       */
      offset: 0,
      /**
       * The screen size that you want the plugin to apply on
       *
       * @name jquery.sticky#screen
       * @type string
       * @default 'medium'
       */
      screen: 'medium'
    },

    init: function(){
      var plugin = this;

      // Weather to stick or not depending on the screen size
      plugin.stickScreen = $.respond.isScreen(plugin.settings.screen);
      $.respond.bind('resize', function(){
        plugin.stickScreen = $.respond.isScreen(plugin.settings.screen);
        plugin._update();
      });

      plugin.origOffsetY = plugin.$el.offset().top + plugin.settings.offset;
      //http://ejohn.org/blog/learning-from-twitter/
      plugin.didScroll = true;

      $window.scroll(function(){
        plugin.didScroll = true;
      });

      setInterval(function() {
        if ( plugin.didScroll ) {
          plugin.didScroll = false;
          plugin._update();
        }
      }, 250);
    },

    /**
     * Update to check whether to stick it.
     *
     * @private
     * @method
     * @name jquery.sticky#_update
    **/
    _update: function(){
      var plugin = this;
      if(window.scrollY >= plugin.origOffsetY && plugin.stickScreen){
        plugin.$el.addClass(plugin.settings.activeClass);
      }else{
        plugin.$el.removeClass(plugin.settings.activeClass);
      }
    }
  });

  // Return the jquery object
  // This way you don't need to require both jquery and the plugin
  return $;

});
