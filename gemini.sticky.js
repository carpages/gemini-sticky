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
 * @prop {string} passedThresholdClass {@link gemini.sticky#passedThresholdClass}
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
( function( factory ) {
  if ( typeof define === 'function' && define.amd ) {
    // AMD. Register as an anonymous module.
    define([ 'gemini', 'gemini.respond' ], factory );
  } else if ( typeof exports === 'object' ) {
    // Node/CommonJS
    module.exports = factory(
      require( 'gemini-loader' ),
      require( 'gemini-respond' )
    );
  } else {
    // Browser globals
    factory( G );
  }
})( function( $ ) {
  $.boiler( 'sticky', {
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
      staticWidth: false,

      /**
       * Stop moving the sticky object downwards when it reaches the bottom of the
       * parent div
       *
       * @name gemini.sticky#containInParent
       * @type boolean
       * @default false
       */
      containInParent: true
    },

    init: function() {
      var plugin = this;

      // cache the element's parent
      plugin.$parent = plugin.$el.parent();

      // Whether to stick or not depending on the screen size
      plugin.stickScreen = $.respond.isScreen( plugin.settings.screen );
      $.respond.bind( 'resize', function() {
        plugin.stickScreen = $.respond.isScreen( plugin.settings.screen );

        if ( plugin.settings.staticWidth ) {
          plugin._adjustWidth();
        }

        plugin._checkStick();
      });

      if ( plugin.settings.staticWidth ) {
        plugin._adjustWidth();
      }

      plugin.origOffsetY = plugin.$el.offset().top + plugin.settings.offset;
      // http://ejohn.org/blog/learning-from-twitter/
      plugin.didScroll = false;

      $( window ).scroll( function() {
        plugin.didScroll = true;
      });

      setInterval( function() {
        if ( plugin.didScroll ) {
          plugin.didScroll = false;

          plugin.bottomOfElement =
            plugin.$el.offset().top + plugin.$el.height();
          plugin.bottomOfParent =
            plugin.$parent.offset().top + plugin.$parent.height();

          plugin._checkStick();
        }
      }, plugin.settings.latency );
    },

    /**
     * Update width of item to fit environment
     *
     * @private
     * @method
     * @name gemini.sticky#_adjustWidth
     **/
    _adjustWidth: function() {
      var plugin = this;

      var hasClass = plugin.$el.hasClass( plugin.settings.activeClass );

      if ( hasClass ) {
        plugin.$el.removeClass( plugin.settings.activeClass );
      }

      plugin.$el.width( '' );
      plugin.$el.width( plugin.$el.width() - 0.5 );

      if ( hasClass ) {
        plugin.$el.addClass( plugin.settings.activeClass );
      }
    },

    /**
     * Update to check whether to stick it.
     *
     * @private
     * @method
     * @name gemini.sticky#_checkStick
     **/
    _checkStick: function() {
      var plugin = this;

      if ( plugin.settings.containInParent ) {
        if (
          plugin.stuckToParent &&
          window.pageYOffset <= plugin.$el.offset().top
        ) {
          plugin._unstickFromParent();
          return;
        }

        if (
          plugin.bottomOfElement >= plugin.bottomOfParent &&
          plugin.stickScreen
        ) {
          plugin._stick({ toParent: true });
          return;
        }
      }

      if (
        !plugin.stuckToParent &&
        window.pageYOffset >= plugin.origOffsetY &&
        plugin.stickScreen
      ) {
        plugin._stick();
        return;
      }

      plugin._unstick();
    },

    _stick: function( options ) {
      var plugin = this;
      options = options || {};

      if ( options.toParent ) {
        plugin._stickInParent();
      }

      plugin.$el.addClass( plugin.settings.activeClass );
    },

    _stickInParent: function() {
      var plugin = this;

      if ( plugin.stuckToParent ) {
        return;
      }

      plugin.stuckToParent = true;
      plugin.$parent.css({ position: 'relative' });
      plugin.$el.css({
        position: 'absolute',
        top: 'inherit',
        bottom: '0'
      });
    },

    _unstickFromParent: function() {
      var plugin = this;

      if ( !plugin.stuckToParent ) {
        return;
      }

      plugin.stuckToParent = false;
      plugin.$parent.css({ position: '' });
      plugin.$el.css({
        position: '',
        top: '',
        bottom: ''
      });
    },

    _unstick: function() {
      var plugin = this;
      plugin.$el.removeClass( plugin.settings.activeClass );
    }
  });

  // Return the jquery object
  // This way you don't need to require both jquery and the plugin
  return $;
});
