# [jquery.pep.js](http://pep.briangonzalez.org)
*kinetic drag for mobile & desktop*

## Getting Started
In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jquery.pep.min.js"></script>
<script>
  jQuery(function($) {
    $('#pep').pep(); // yup, that simple.
  });
</script>
```

## Usage
Pep has many options. Here they are in their entirety, with their defaults.
```javascript
  defaults = {
                                                                          // OPTIONS W/ DEFAULTS
                                                                          // --------------------------------------------------------------------------------
    debug:                  false,                                        // debug via a small div in the lower-righthand corner of the document 
    activeClass:            'active',                                     // class to add to the DOM el while dragging
    multiplier:             1,                                            // +/- this number to modify to 1:1 ratio of finger/mouse movement to el movement 
    velocityMultiplier:     1.9,                                          // +/- this number to modify the springiness of the object as your release it
    shouldPreventDefault:   true,                                         // in some cases, we don't want to prevent the default on our Pep object, your call
    stopEvents:             '',                                           // space delimited set of events which programmatically cause the object to stop
    hardwareAccelerate:     true,                                         // apply the CSS3 silver bullet method to accelerate the pep object: http://indiegamr.com/ios6-html-hardware-acceleration-changes-and-how-to-fix-them/
    useCSSTranslation:      true,                                         // use CSS transform translations as opposed to top/left
    disableSelect:          true,                                         // apply `user-select: none` (CSS) to the object
    cssEaseString:          "cubic-bezier(0.190, 1.000, 0.220, 1.000)",   // get more css ease params from [ http://matthewlein.com/ceaser/ ]
    cssEaseDuration:        750,                                          // how long should it take (in ms) for the object to get from stop to rest?
    shouldEase:             true,                                         // disable/enable easing
    droppable:              false,                                        // CSS selector that this element can be dropped on, false to disable
    droppableActiveClass:   'pep-dpa',                                    // class to add to active droppable parents, default to pep-dpa (droppable parent active)
    overlapFunction:        false,                                        // override pep's default overlap function; takes two args: a & b and returns true if they overlap
    constrainTo:            false,                                        // constrain object to 'window' || 'parent'; works best w/ useCSSTranslation set to false
    removeMargins:          true,                                         // remove margins for better object placement
    axis:                   null,                                         // constrain object to either 'x' or 'y' axis
    forceNonCSS3Movement:   false,                                        // DO NOT USE: this is subject to come/go. Use at your own risk
    drag:                   function(){},                                 // called continuously while the object is dragging 
    start:                  function(){},                                 // called when dragging starts
    stop:                   function(){},                                 // called when dragging stops
    rest:                   function(){}                                  // called after dragging stops, and object has come to rest
  }; 
```

## API
```javascript
// Toggle functionality of all Pep objects on the page
$.pep.toggleAll()

// Explicitly disable all Pep objects on the page
$.pep.toggleAll(false)

// Explicitly enable all Pep objects on the page
$.pep.toggleAll(true)

````


## Examples
Checkout the examples in the `demos` folder, which cover a wide array of test cases and options. Or you can check out other examples at http://pep.briangonzalez.org/ (which can also be found in more detail on Codepen: http://codepen.io/briangonzalez/tag/pep-demo)

## On the web
Visit us at http://pep.briangonzalez.org or follow me on Twitter: [@brianmgonzalez](https://twitter.com/brianmgonzalez).

## Support
Pep has been tested in the latest:

  - Firefox
  - Chrome 
  - Safari
  - Opera
  - Internet Explorer

As well as:

  - Internet Explorer 6 [impossible!](http://www.youtube.com/watch?v=acc92L-Lhes&feature=youtu.be)
  - Internet Explorer 7 [you're insane?](http://www.youtube.com/watch?v=8Qxo4q4ofVU&feature=youtu.be)
  - Internet Explorer 8 [I don't believe!](http://www.youtube.com/watch?v=WWKq3ovMbOQ&feature=youtu.be)
  - Internet Explorer 9 [are you sure?](http://www.youtube.com/watch?v=xYxQdkyzDnI&feature=youtu.be)

## Milestones
  - 05/01/13  -   Added in `draggable` functionality
  - 12/02/12  -   Complete rewrite with support for movement using CSS3 Transforms (`translate()` function)
  - 05/30/12  -   Initial version
