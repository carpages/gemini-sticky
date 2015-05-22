/**
 * @fileoverview

A Gemini plugin to make elements stick to the top of the page on scroll

 *
 * @namespace gemini.sticky
 * @copyright Carpages.ca 2014
 * @author Matt Rose <matt@mattrose.ca>
 *
 * @requires gemini
 * @requires gemini.respond
 *
 * @prop {string} activeClass {@link gemini.sticky#activeClass}
 * @prop {integer} offset {@link gemini.sticky#offset}
 * @prop {string} screen {@link gemini.sticky#screen}
 * @prop {interger} latency {@link gemini.sticky#latency}
 * @prop {boolean} staticWidth {@link gemini.sticky#staticWidth}
 *
 * @example
  <html>
    <div id="js-sticky">
      I Stick!!
    </div>
  </html>
 *
 * @example
  G('#js-sticky').sticky();
 */
(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([
      'gemini',
      'gemini.respond'
    ], factory);
  } else if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(
      require('gemini'),
      require('gemini.respond')
    );
  } else {
    // Browser globals
    factory(G);
  }
}(function($) {

  $.boiler('sticky', {
    defaults: {
      /**
       * The class that's toggled when the element should stick
       *
       * @name gemini.sticky#activeClass
       * @type string
       * @default 'sticky'
       */
      activeClass: 'sticky',
      /**
       * The number of pixels to offset when the sticking should activate
       *
       * @name gemini.sticky#offset
       * @type integer
       * @default 0
       */
      offset: 0,
      /**
       * The screen size that you want the plugin to apply on
       *
       * @name gemini.sticky#screen
       * @type string
       * @default 'medium'
       */
      screen: 'medium',
      /**
       * How often to check the scroll position of the user. Use with care to
       * find the right balance between latency and performance.
       *
       * @name gemini.sticky#latency
       * @type integer
       * @default 200
       */
      latency: 200,
      /**
       * Whether to make the width of the sticky object static so that its width
       * isn't affected when its position becomes fixed
       *
       * @name gemini.sticky#staticWidth
       * @type boolean
       * @default false
       */
      staticWidth: false
    },

    init: function(){
      var plugin = this;

      // Weather to stick or not depending on the screen size
      plugin.stickScreen = $.respond.isScreen(plugin.settings.screen);
      $.respond.bind('resize', function(){
        plugin.stickScreen = $.respond.isScreen(plugin.settings.screen);

        if(plugin.settings.staticWidth) plugin._adjustWidth();
        plugin._checkStick();
      });

      if(plugin.settings.staticWidth) plugin._adjustWidth();

      plugin.origOffsetY = plugin.$el.offset().top + plugin.settings.offset;
      //http://ejohn.org/blog/learning-from-twitter/
      plugin.didScroll = true;

      $window.scroll(function(){
        plugin.didScroll = true;
      });

      setInterval(function() {
        if ( plugin.didScroll ) {
          plugin.didScroll = false;
          plugin._checkStick();
        }
      }, plugin.settings.latency);
    },

    /**
     * Update width of item to fit environment
     *
     * @private
     * @method
     * @name gemini.sticky#_adjustWidth
    **/
    _adjustWidth: function(){
      var plugin = this;

      var hasClass = plugin.$el.hasClass(plugin.settings.activeClass);

      if (hasClass) {
        plugin.$el.removeClass(plugin.settings.activeClass);
      }

      plugin.$el.width("");
      plugin.$el.width(plugin.$el.width() - 0.5);

      if (hasClass) {
        plugin.$el.addClass(plugin.settings.activeClass);
      }

    },

    /**
     * Update to check whether to stick it.
     *
     * @private
     * @method
     * @name gemini.sticky#_checkStick
    **/
    _checkStick: function(){
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

}));
