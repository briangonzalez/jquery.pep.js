/*******************************************************************
 * Pep! (jquery.pep.js)
 * [ Version 0.2 ]
 * ----------------------------------------------------------
 * Copyright 2012, Brian Gonzalez
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 *
 *    Dependencies:
 *        - jQuery
 */

;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = 'pep',
        defaults = {
            debug:                  true,
            activeClass:            'active',
            multiplier:             1,
            stopEvents:             "",
            // get more css         ease params from [ http://matthewlein.com/ceaser/ ]
            cssEaseString:          "cubic-bezier(0.210, 1, 0.220, 1.000)",
            cssEaseDuration:        3000,
            constrainToWindow:      false,
            constrainToParent:      false,          // EXPERIMENTAL! use with caution. you've been warned.
            shouldEase:             true,
            drag:                   function(){},
            start:                  function(){},
            stop:                   function(){},
            rest:                   function(){}
        },
        vendors = ['-webkit-', '-moz-', '-ms-', '-o-', ''],
        disable = false;

    // The actual plugin constructor
    function Pep( element, options ) {
        this.el =                   element;
        this.options =              $.extend( {}, defaults, options) ;
        this._defaults =            defaults;
        this._name =                "pep";
        this._scale =               1;
        this._active =              false;
        this._start =               false;
        this._started =             false;
        this._x =                   0;
        this._y =                   0;
        this._startX =              0;
        this._startY =              0;
        this._xDir =                'up';
        this._yDir =                'up';
        this._dt =                  null;
        this._offset =              null;
        this._velocityQueue =       [null,null,null,null,null];
        this.tempFxn =              {};
        this._startTrigger =        this._isTouch() ? "touchstart"  : "mousedown";
        this._endTrigger =          this._isTouch() ? "touchend"    : "mouseup";
        this._moveTrigger =         this._isTouch() ? "touchmove"   : "mousemove";
        this._positionType =        this.options.constrainToParent ? 'position' : 'offset';
        this.init();
    }

    Pep.prototype.init = function () {

        var self = this;
        var $this = $(this.el);
                
        // Build our debug div
        if (this.options.debug && !($('#debug').length > 0) ) $('body').append("<div id='debug' style='position: fixed; bottom: 0; right: 0; z-index: 10000; text-align: right'>debug mode</div>"); 
        
        // Bind the magic
        $this.bind( this._startTrigger, function(e){ self._do(e); } );
    };


    Pep.prototype._do = function(event){

      // Non-touch device -- or -- non-pinch on touch device?
      if ( !this._isTouch() || ( this._isTouch() && event.originalEvent.hasOwnProperty('touches') && event.originalEvent.touches.length == 1 ) ){
        event.preventDefault();
        var self              = this;
        var $this             = $(this.el);
        var $parent           = $this.parent();
        var e                 = self._isTouch() ? event.originalEvent.touches[0] : event;

        if( $this.hasClass( self.options.activeClass ) ) stopping();
        $this.addClass( this.options.activeClass );
        this._x               = e.pageX;
        this._y               = e.pageY;
        this._startX          = this._x;
        this._startY          = this._y;
        this._start           = true;
        this._active          = true;
        this._started         = false;
        this._moveEvent       = null;
        this._width           = $this.outerWidth();
        this._height          = $this.outerHeight();
        this._maxX            = $parent.width() - this._width;
        this._maxY            = $parent.height() - this._height;
        self._log( this._startTrigger );

        // remove CSS3 animation
        $this.css( self._cssEaseHashReset() );

        // stopping -------------------------------------
        var stopping = function(event){
          if ( self._active ){
            if (self.options.shouldEase) self._ease();
            self._doRest(event, self);
            $(window).unbind( self._moveTrigger, dragging );
            $this.unbind( self._endTrigger, stopping );
            self._log( self._endTrigger );
            self._active = false;
            self._velocityQueue = [null,null,null,null,null];
            $this.removeClass( self.options.activeClass );

            // fire user's stop event.
            self.options.stop(event, self);
          }
        };
        $(window).bind( this._endTrigger + " " + this.options.stopEvents, stopping );  // ... then bind our stop trigger

        // dragging ----------------------------------------
        var dragging = function(event){

          // Stop all drag events
          if (disable) {
            stopping();
            return;
          }

          self._offset = $this[self._positionType]();
          $this.css({ top: self._offset.top, left: self._offset.left });
  
          // fire user's drag event.
          self.options.drag(event, self);
          var e       = self._isTouch() ? event.originalEvent.touches[0] : event;
          var curX    = e.pageX;
          var curY    = e.pageY;

          // put our target element exectly where it is...
          // but make it movable (pos absolute)
          if ($this.css('position') !== 'absolute') {
             $this.css({ position: 'absolute', top: self._offset.top, left: self._offset.left});
          }

          // Last in, first out (LIFO) queue to help us manage velocity
          self._lifo( { time: event.timeStamp, x: curX, y: curY } );

          //  mouse off screen? -10 is a buffer
          if ( self.options.constrainToWindow && (curX > window.innerWidth - 10 || curX < 10 || curY > window.innerHeight - 10 || curY < 10) ){
            $(self.el).trigger( self._endTrigger );
            return;
          }
                    
          var dx      = ( self._start ) ? 0 : curX - self._x;
          var dy      = ( self._start ) ? 0 : curY - self._y;
          var mult    = self.options.multiplier;
          var left    = ( dx >= 0 ? "+=" : "-=" ) + Math.abs(dx / self._scale)*mult;
          var top     = ( dy >= 0 ? "+=" : "-=" ) + Math.abs(dy / self._scale)*mult;

          self._x     = curX;
          self._y     = curY;
          self._xDir  = ( dx < 0 ) ? 'left' : 'right';
          self._yDir  = ( dy < 0 ) ? 'up' : 'down';

          if (self.options.constrainToParent) {
            var pos   = $this.position(), x = curX - self._width, y = curY - self._height;
            left = (x >= self._maxX || pos.left > self._maxX) ? self._maxX : (x <= 0 || pos.left < 0) ? 0 : left;
            top = (y >= self._maxY || pos.top > self._maxY) ? self._maxY : (y <= 0 || pos.top < 0) ? 0 : top;
            /*curX = x;
            curY = y;*/
          }
          
          // fire user's start event.
          if ( !self._started && Math.abs(self._startX - curX) > 10 && Math.abs(self._startY - curY) > 10  ){
            self.options.start(event, self);
            self._started = true;
          }
          
          $this.css({ top: top , left: left });
          self._log( [self._moveTrigger, ", ", curX, " ", self._xDir, ", ", curY, " ", self._yDir].join('') );
          self._start = false;
        };

        var storeMoveEvent = function(event){
          self._moveEvent = event;
        };

        $(window).bind( this._moveTrigger, storeMoveEvent ); // ... then bind our drag trigger

        (function watchMoveLoop(){
          if ( !self._active ) return;
          _pepRequestAnimFrame(watchMoveLoop);
          if (self._moveEvent !== null ) dragging(self._moveEvent);
        })($, self, dragging);

      }
    };

    Pep.prototype.setMultiplier = function(val){
      this.options.multiplier = val;
    };

    Pep.prototype.forceStop = function(){
      $(this.el).trigger( this._endTrigger );
    };

    Pep.prototype.disableEase = function(){
      this.options.shouldEase = false;
    };

    Pep.prototype.enableEase = function(){
      this.options.shouldEase = true;
    };

    Pep.prototype._isTouch = function(){ return ('ontouchstart' in document.documentElement); };
    Pep.prototype.setScale = function(val){ this._scale = val; };

    Pep.prototype._log = function(msg){
      if (this.options.debug){
        var $msg = $('#msg');
        if ( $msg.length == 0 ) $('#debug').append("<div id='msg'></div><div id='velocity'></div>");
        $msg.html(msg);
        var vel = this._velocity();
        $('#velocity').html( "velocity: " + vel.x + ", " + vel.y + " " + "dt: " + this._dt );
      }
    };

    Pep.prototype._lifo = function(val){
      // last in, first out
      var arr = this._velocityQueue;
      arr = arr.slice(1, arr.length);
      arr.push(val);
      this._velocityQueue = arr;
    };

    Pep.prototype._velocity = function(){
      var sumX = 0;
      var sumY = 0;
      for ( var i = 0; i < this._velocityQueue.length -1; i++  ){
        if ( this._velocityQueue[i] ){
          sumX        = sumX + (this._velocityQueue[i+1].x - this._velocityQueue[i].x);
          sumY        = sumY + (this._velocityQueue[i+1].y - this._velocityQueue[i].y);
          this._dt    = ( this._velocityQueue[i+1].time - this._velocityQueue[i].time );
        }
      }

      // return velocity in each direction.
      return { x: sumX, y: sumY };
    };

    window._pepRequestAnimFrame = (function(callback) {
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    Pep.prototype._ease = function(){

      var $this     = $(this.el);
      var $parent   = $this.parent();
      var pos       = $this.position();
      var vel       = this._velocity();
      var dt        = this._dt;
      var mult      = 1;
      var x         = Math.abs(vel.x) * mult;
      var y         = Math.abs(vel.y) * mult;
      var left      = ( vel.x > 0 ? "+=" : "-=") + x;
      var top       = ( vel.y > 0 ? "+=" : "-=") + y;
      
      if (this.options.constrainToParent) {
        top = (pos.top - y <= 0) ? 0 : (y + pos.top >= this._maxY) ? this._maxY : top;
        left = (pos.left - x <= 0) ? 0 : (x + pos.left >= this._maxX) ? this._maxX : left;
      }

      // ✪  The CSS3 easing magic  ✪
      $this.css( this._cssEaseHash( this.options.cssEaseDuration, this.options.cssEaseString ) );
      $this.css({ top: top, left: left });
      
    };

    Pep.prototype._cssEaseHash = function(time, params){
      return this._setCssEaseHash(time, params);
    };

    Pep.prototype._cssEaseHashReset = function(){
      return this._setCssEaseHash();
    };

    Pep.prototype._setCssEaseHash = function (time, params) {
      var transition, obj = {}, prefix;
      params = params || '';
      transition = params ? ['all ', time, 'ms ', params].join('') : '';
      for (var i = 0, len = vendors.length; i < len; i++) {
        prefix = vendors[i];
        obj[prefix+'transition'] = transition;
        obj[prefix+'transition-timing-function'] = params;
      }
      return obj;
    };

    Pep.prototype._doRest = function(event, obj){
      var self = this;
      this.timeout = setTimeout( function(){ self.options.rest(event, obj); }, self.options.cssEaseDuration );
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Pep( this, options ));
            }
        });
    };

    $[pluginName] = {
      stopAll: function () {
        disable = true;
        return this;
      },
      startAll: function () {
        disable = false;
        return this;
      }
    };

})( jQuery, window, document );