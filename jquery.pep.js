/*******************************************************************
 * Pep! (jquery.pep.js) 
 * [ Version 0.21 ]
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
            debug:                  false,
            activeClass:            'active',
            multiplier:             1,
            stopEvents:             "",
            // get more css         ease params from [ http://matthewlein.com/ceaser/ ]
            cssEaseString:          "cubic-bezier(0.210, 1, 0.220, 1.000)",
            cssEaseDuration:        1000,
            constrainToWindow:      false,
            constrainToParent:      false,
            axis:                   null, 
            shouldEase:             true,
            drag:                   function(){},
            start:                  function(){},
            stop:                   function(){},
            rest:                   function(){}
        },
        disable = false;

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
                
        if (this.options.debug && !($('#debug').length > 0) )
          this._buildDebugDiv();

        // place object right where it is, but make it movable
        this._manageInitialPosition();
        
        // Bind the magic
        $this.bind( this._startTrigger, function(e){ self._do(e); } );
    };


    Pep.prototype._do = function(event){

      // Non-touch device -- or -- non-pinch on touch device?
      if ( !this._isTouch() || ( this._isTouch() && event.originalEvent.hasOwnProperty('touches') && event.originalEvent.touches.length == 1 ) ){
        event.preventDefault();
        var self              = this;
        var $this             = $(this.el);
        $this.addClass( this.options.activeClass );
        this._x               = self._isTouch() ? event.originalEvent.pageX : event.pageX;
        this._y               = self._isTouch() ? event.originalEvent.pageY : event.pageY;
        this._startX          = this._x;
        this._startY          = this._y;
        this._start           = true;
        this._active          = true;
        this._started         = false;
        this._moveEvent       = null;
        this._container       = this.options.constrainToParent ? $this.parent() : $(document);
        this._log( this._startTrigger );

        // remove CSS3 animation
        $this.css( self._cssEaseHashReset() );

        // ----------------------------------------------
        // stopping -------------------------------------
        var _doStop = function(event){
          if ( self._active ){
            if (self.options.shouldEase) self._ease();
            self._doRest(event, self);
            self._container.unbind( self._moveTrigger, _doDrag );
            $(document).unbind( self._endTrigger, _doStop );
            self._log( self._endTrigger );
            self._active = false;
            self._velocityQueue = [null,null,null,null,null];

            // fire user's stop event.
            self.options.stop(event, self);
          }
        };
        $(document).bind( this._endTrigger + " " + this.options.stopEvents, _doStop );  // ... then bind our stop trigger

        // -------------------------------------------------
        // dragging ----------------------------------------
        var _doDrag = function(event){

          // Stop all drag events
          if (disable) {
            _doStop();
            return;
          }
  
          // fire user's drag event.
          self.options.drag(event, self);

          var curX    = (self._isTouch() ? event.originalEvent.touches[0].pageX : event.pageX);
          var curY    = (self._isTouch() ? event.originalEvent.touches[0].pageY : event.pageY);

          // Last in, first out (LIFO) queue to help us manage velocity
          self._lifo( { time: event.timeStamp, x: curX, y: curY } );

          //  mouse off screen? -10 is a buffer.
          if ( self.options.constrainToWindow && (curX > window.innerWidth - 10 || curX < 10 || curY > window.innerHeight - 10 || curY < 10) ){
            $(self.el).trigger( self._endTrigger );
            return;
          }
                    
          var dx      = ( self._start ) ? 0 : curX - self._x;
          var dy      = ( self._start ) ? 0 : curY - self._y;
          var mult    = self.options.multiplier;
          var xOp     = ( dx >= 0 ) ? "+=" + Math.abs(dx / self._scale)*mult : "-=" + Math.abs(dx / self._scale)*mult;
          var yOp     = ( dy >= 0 ) ? "+=" + Math.abs(dy / self._scale)*mult : "-=" + Math.abs(dy / self._scale)*mult;
          
          //  If `constrainToParent` option is set, return if
          //  we hit the edge and we're moving in the direction
          if (self.options.constrainToParent) {
            var hash = self._handleConstrainToParent(dx, dy);
            xOp = (hash.x !== false) ? hash.x : xOp;
            yOp = (hash.y !== false) ? hash.y : yOp;
          }

          self._x     = curX;
          self._y     = curY;
          self._xDir  = ( dx >= 0 ) ? 'right' : 'left';
          self._yDir  = ( dy <= 0 ) ? 'up' : 'down';

          // fire user's start event.
          if ( !self._started && Math.abs(self._startX - curX) > 10 && Math.abs(self._startY - curY) > 10  ){
            self.options.start(event, self);
            self._started = true;
          }

          // move it ....
          self._moveTo(xOp, yOp);
          

          self._log( [self._moveTrigger, ", ", curX, " ", self._xDir, ", ", curY, " ", self._yDir].join('') );
          self._start = false;
        };

        var storeMoveEvent = function(event){
          self._moveEvent = event;
        };

        this._container.bind( this._moveTrigger, storeMoveEvent ); // ... then bind our drag trigger

        (function watchMoveLoop(){
          if ( !self._active ) return;
          _pepRequestAnimFrame(watchMoveLoop);
          if (self._moveEvent !== null ) _doDrag(self._moveEvent);
        })($, self, _doDrag);


      }
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

    Pep.prototype.setScale = function(val){ this._scale = val };

    Pep.prototype.setMultiplier = function(val){ this.options.multiplier = val };

    Pep.prototype._manageInitialPosition = function() {
      var $this = $(this.el);

      // make `relative` parent if constrainToParent
      if ( this.options.constrainToParent ){
        this._handleParentRelative();
        $this.css({ position: 'absolute' });
      }

      // put our target element exectly where it is...
      // but make it movable (pos absolute)
      this._offset = $this[this._positionType]();
      $this.css({ position: 'absolute', top: this._offset.top, left: this._offset.left, zIndex: 1});

      // // remove `relative` parent if !constrainToParent
      if ( !this.options.constrainToParent ) 
        this._handleParentRelative();
    };

    Pep.prototype._isTouch = function(){ return ('ontouchstart' in document.documentElement); };

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
      return { x: sumX, y: sumY };
    };

    Pep.prototype._ease = function(){
      $this         = $(this.el);
      var pos       = $this.position();
      var vel       = this._velocity();
      var dt        = this._dt;
      var mult      = 1;

      var dimHash           = this._dimensionHash();
      var upperXLimit       = dimHash.parent.width  - dimHash.self.width;
      var upperYLimit       = dimHash.parent.height - dimHash.self.height;

      var x         = ( vel.x > 0 ) ? "+=" + vel.x * mult : "-=" + Math.abs(vel.x) * mult;
      var y         = ( vel.y > 0 ) ? "+=" + vel.y * mult : "-=" + Math.abs(vel.y) * mult;

      if ( this.options.constrainToParent ){
        x         = ( pos.left + vel.x < 0 ) ? 0 : x;
        y         = ( pos.top  + vel.y < 0 ) ? 0 : y;

        x         = ( pos.left + vel.x > upperXLimit ) ? upperXLimit : x;
        y         = ( pos.top  + vel.y > upperYLimit ) ? upperYLimit : y;
      }

      // ✪  The CSS3 easing magic  ✪
      $this.css( this._cssEaseHash( this.options.cssEaseDuration, this.options.cssEaseString ) );

      // move it..........
      this._moveTo(x, y);

    };

    Pep.prototype._moveTo = function(x, y ){
      var $this = $(this.el);

      if ( this.options.axis  === 'x' ){
        $this.css({ left: x }); 
      } 
      else if ( this.options.axis  === 'y' ){
        $this.css({ top: y }); 
      } else{
        $this.css({ top: y , left: x });
      }
    };

    Pep.prototype._cssEaseHash = function(time, params){
      var transition = ['all ', time, 'ms ', params].join('');
      return {
                    '-webkit-transition'   : transition,  /* older webkit */
                       '-moz-transition'   : transition,
                        '-ms-transition'   : transition,
                         '-o-transition'   : transition,
                            'transition'   : transition,  /* custom */

      '-webkit-transition-timing-function' : params,  /* older webkit */
         '-moz-transition-timing-function' : params,
         ' -ms-transition-timing-function' : params,
           '-o-transition-timing-function' : params,
              'transition-timing-function' : params   /* custom */
            };
    };

    Pep.prototype._cssEaseHashReset = function(){
      return {
                    '-webkit-transition'   : '',
                       '-moz-transition'   : '',
                        '-ms-transition'   : '',
                         '-o-transition'   : '',
                            'transition'   : '',

      '-webkit-transition-timing-function' : '',
         '-moz-transition-timing-function' : '',
         ' -ms-transition-timing-function' : '',
           '-o-transition-timing-function' : '',
              'transition-timing-function' : ''
            };
    };

    Pep.prototype._doRest = function(event, obj){
      var self = this;

      this.timeout = setTimeout( function(){ 
                                  self.options.rest(event, obj);
                                  $(self.el).removeClass( self.options.activeClass ); 
                                }, self.options.cssEaseDuration );
    };

    Pep.prototype._buildDebugDiv = function() {
      $('body').append("<div id='debug' style='position: fixed; bottom: 0; right: 0; z-index: 10000; text-align: right'>debug mode</div>");   
    };

    Pep.prototype._handleParentRelative = function() {
      if (this.options.constrainToParent){
        $(this.el).parent().css({ position: 'relative' });
      }
      else{
        $(this.el).parent().css({ position: 'static' });
      }
    };

    Pep.prototype._handleConstrainToParent = function(dx, dy) {
      var $this             = $(this.el);
      var pos               = $this.position();
      var posX              = pos.left;
      var posY              = pos.top;
      var dimHash           = this._dimensionHash();
      var upperXLimit       = dimHash.parent.width  - dimHash.self.width;
      var upperYLimit       = dimHash.parent.height - dimHash.self.height;
      var hash              = { x: false, y: false };

      // is our object moving near our lower X & Y limits?
      if (posX <= 0 && dx < 0 )   hash.x = 0;
      if (posY <= 0 && dy < 0)    hash.y = 0;

      // is our object moving near our upper X & Y limits?
      if (posX >= upperXLimit && dx > 0)  hash.x = upperXLimit;
      if (posY >= upperYLimit && dy > 0)  hash.y = upperYLimit;

      return hash;

    };

    Pep.prototype._dimensionHash = function() {
      var $this             = $(this.el);

      var hash = {  self : { 
                                width:  $this.outerWidth(),
                                height: $this.outerHeight() } ,
                    parent : {  width:  $this.parent().width(),  
                                height: $this.parent().height() } 
                                                                  }

      return hash;

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


//
//      requestAnimationFrame Polyfill
//        More info: 
//        http://paulirish.com/2011/requestanimationframe-for-smart-animating/
//
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