/***************************************************
 * Pep! (jquery.pep.js)
 * Copyright 2012, Brian Gonzalez
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 *    Dependencies:
 *        - jQuery
 */

;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = 'pep',
        defaults = {
            debug:                  false,
            activeClass:            'active',
            multiplier:             1,
            stopEvents:             "", 
            // get more css         ease params from [ http://matthewlein.com/ceaser/ ]
            cssEaseString:          "cubic-bezier(0.210, 1, 0.220, 1.000)",
            cssEaseDuration:        1000, 
            constrainToWindow:      false,
            shouldEase:             true,
            drag:                   function(){},
            stop:                   function(){},
            start:                  function(){}
        };

    // The actual plugin constructor
    function Pep( element, options ) {
        this.el = element;
        this.options = $.extend( {}, defaults, options) ;
        this._defaults = defaults;
        this._name = "pep";
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
        this._startTrigger =        this._isTouch() ? "touchstart"  : "mousedown";
        this._endTrigger =          this._isTouch() ? "touchend"    : "mouseup";
        this._moveTrigger =         this._isTouch() ? "touchmove"   : "mousemove"; 
        this.init();
    }

    Pep.prototype.init = function () {
        var self = this;
        var $this = $(this.el);
        this._offset =  $this.offset();
        
        // build our debug div
        if (this.options.debug && !($('#debug').length > 0) ) $('body').append("<div id='debug' style='position: fixed; bottom: 0; right: 0; z-index: 10000; text-align: right'>debug mode</div>"); 
        
        // Bind the magic
        $this.bind( this._startTrigger, function(e){ self._do(e) } );
    };

    Pep.prototype._bindings = function(){};

    Pep.prototype._do = function(event){

      // Non-touch device or non-pinch on touch device?
      if ( !this._isTouch() || ( this._isTouch() && event.originalEvent.hasOwnProperty('touches') && event.originalEvent.touches.length == 1 ) ){
        event.preventDefault();
        var self      = this;
        var $this     = $(this.el);  
        $this.addClass( this.options.activeClass );
        this._x       = self._isTouch() ? event.originalEvent.pageX : event.pageX;
        this._y       = self._isTouch() ? event.originalEvent.pageY : event.pageY;
        this._startX  = this._x;
        this._startY  = this._y;
        this._start   = true;
        this._active  = true;
        this._started = false;
        self._log( this._startTrigger );

        // remove CSS3 animation
        $this.css( self._cssEaseHashReset() );

        // dragging
        $.fn.pep.dragging = function(event){ 
  
          // fire user's drag event.
          self.options.drag(event, self);

          var curX    = (self._isTouch() ? event.originalEvent.touches[0].pageX : event.pageX);
          var curY    = (self._isTouch() ? event.originalEvent.touches[0].pageY : event.pageY);

          // put our target element exectly where it is...
          // but make it movable (pos absolute)
          if ($this.css('position') !== 'absolute') { 
             $this.css({ position: 'absolute', top: self._offset.top, left: self._offset.left});
          }

          // LIFO queue to help us manage velocity
          self._lifo( { time: event.timeStamp, x: curX, y: curY } );

          //  mouse off screen? -10 is a buffer
          if ( self.options.constrainToWindow && (curX > window.innerWidth - 10 || curX < 10 || curY > window.innerHeight - 10 || curY < 10) ){ 
            $(self.el).trigger( self._endTrigger ); 
            return; 
          }
          
          var dx      = ( self._start ) ? 0 : curX - self._x;
          var dy      = ( self._start ) ? 0 : curY - self._y;
          var mult    = self.options.multiplier;
          var xOp     = ( dx >= 0 ) ? "+=" + Math.abs(dx / self._scale)*mult : "-=" + Math.abs(dx / self._scale)*mult;
          var yOp     = ( dy >= 0 ) ? "+=" + Math.abs(dy / self._scale)*mult : "-=" + Math.abs(dy / self._scale)*mult;
          self._x     = curX;
          self._y     = curY;
          self._xDir  = ( dx >= 0 ) ? 'up' : 'down';
          self._yDir  = ( dy <= 0 ) ? 'up' : 'down';

          // fire user's start event.
          if ( !self._started && Math.abs(self._startX - curX) > 10 && Math.abs(self._startY - curY) > 10  ){
            self.options.start(event, self);
            self._started = true;
          }

          $this.css({ top: yOp , left: xOp });
          self._log( self._moveTrigger + ", " + curX + " " + self._xDir + ", " + curY + " " + self._yDir );
          self._start = false;
        }
        $(window).bind( this._moveTrigger, $.fn.pep.dragging ); // ... then bind out drag trigger

        // stop
        $.fn.pep.stopping = function(event){
          if ( self._active ){
            if (self.options.shouldEase) self._ease();
            $(window).unbind( self._moveTrigger, $.fn.pep.dragging );
            $this.unbind( self._endTrigger, $.fn.pep.stopping );
            self._log( self._endTrigger ); 
            self._active = false;
            self._velocityQueue = [null,null,null,null,null];
            $this.removeClass( self.options.activeClass );            

            // fire user's stop event.
            self.options.stop(event, self);

          }
        }
        $this.bind(     this._endTrigger + " " + this.options.stopEvents, $.fn.pep.stopping );      // ... then bind out stop trigger
        $(window).bind( this._endTrigger + " " + this.options.stopEvents, $.fn.pep.stopping );  // ... then bind our stop trigger
      }
    };

    Pep.prototype.setMultiplier = function(val){
      this.options.multiplier = val;
    }

    Pep.prototype.forceStop = function(){
      $(this.el).trigger( this._endTrigger );
    }

    Pep.prototype.disableEase = function(){
      this.options.shouldEase = false;
    }

    Pep.prototype.enableEase = function(){
      this.options.shouldEase = true;
    }

    Pep.prototype._isTouch = function(){ return ('ontouchstart' in document.documentElement) };
    Pep.prototype.setScale = function(val){ this._scale = val };

    Pep.prototype._log = function(msg){
      if (this.options.debug){
        if ( $('#msg').length == 0 ) $('#debug').append("<div id='msg'></div><div id='velocity'></div>");
        $('#msg').html(msg);
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
      return { x: sumX, y: sumY }
    };

    Pep.prototype._ease = function(){
      $this         = $(this.el);
      var vel       = this._velocity();
      var dt        = this._dt;
      var mult      = 1;
      var x         = ( vel.x > 0 ) ? "+=" + vel.x * mult : "-=" + Math.abs(vel.x) * mult;
      var y         = ( vel.y > 0 ) ? "+=" + vel.y * mult : "-=" + Math.abs(vel.y) * mult;

      // ✪  The CSS3 easing magic  ✪ 
      $this.css( this._cssEaseHash( this.options.cssEaseDuration, this.options.cssEaseString ) )
      $this.css({ top: y, left: x });
    };

    Pep.prototype._cssEaseHash = function(time, params){
      return {
                    '-webkit-transition'   : 'all '+ time +'ms ' + params,                   /* older webkit */
                    '-webkit-transition'   : 'all '+ time +'ms ' + params,
                       '-moz-transition'   : 'all '+ time +'ms ' + params,
                        '-ms-transition'   : 'all '+ time +'ms ' + params,
                         '-o-transition'   : 'all '+ time +'ms ' + params,
                            'transition'   : 'all '+ time +'ms ' + params,                     /* custom */

      '-webkit-transition-timing-function' : params,   /* older webkit */
      '-webkit-transition-timing-function' : params, 
         '-moz-transition-timing-function' : params, 
         ' -ms-transition-timing-function' : params, 
           '-o-transition-timing-function' : params, 
              'transition-timing-function' : params   /* custom */ 
            }
    };

    Pep.prototype._cssEaseHashReset = function(){
      return {
                    '-webkit-transition'   : '',                  
                    '-webkit-transition'   : '',
                       '-moz-transition'   : '',
                        '-ms-transition'   : '',
                         '-o-transition'   : '',
                            'transition'   : '',                 

      '-webkit-transition-timing-function' : '',   
      '-webkit-transition-timing-function' : '', 
         '-moz-transition-timing-function' : '', 
         ' -ms-transition-timing-function' : '', 
           '-o-transition-timing-function' : '', 
              'transition-timing-function' : ''
            }
    };

    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Pep( this, options ));
            }
        });
    }

})( jQuery, window, document );