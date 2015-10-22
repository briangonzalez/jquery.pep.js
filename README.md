<img src="http://s.cdpn.io/4629/pep-with-circles.svg" width=600 alt='jquery.pep.js'>
----
*kinetic drag for mobile & desktop; more at [http://pep.briangonzalez.org](http://pep.briangonzalez.org)*


## Getting Started
Getting started is simple: include jQuery, include pep, then:
```javascript
$('.pep').pep(); // yup, that simple.
```

## Usage
Pep has many options. Here they are in their entirety, with their defaults. Need a little help? [Just ask](http://twitter.com/brianmgonzalez).

| Name                            | Default                                         | Description                                                                                                                                                                                                                                             |
|---------------------------------|-------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| initiate                        | `function(){}`                                  | [≘ touchstart/mousedown] called when first touch / click event is triggered on the object                                                                                                                                                               |
| start                           | `function(){}`                                  | called when dragging starts; when `dx` or `dy` are greater than `startThreshold[0]` or `startThreshold[1]`                                                                                                                                              |
| drag                            | `function(){}`                                  | [≘ touchmove/mousemove] called continuously while the object is dragging                                                                                                                                                                                |
| stop                            | `function(){}`                                  | [≘ touchend/mouseup] called when dragging stops                                                                                                                                                                                                         |
| easing                          | `function(){}`                                  | called while object is easing                                                                                                                                                                                                                           |
| rest                            | `function(){}`                                  | called after dragging stops, and object has come to rest                                                                                                                                                                                                |
| moveTo                          | `false`                                         | custom method to override the default moveTo functionality.                                                                                                                                                                                             |
| callIfNotStarted                | `['stop', 'rest']`                              | if object has *not* moved outside of the `startThreshold`, call either the user-provided `stop` or `rest` fxn's anyway, or call both                                                                                                                    |
| startThreshold                  | `[0,0]`                                         | how far past should the object move in the [x,y] direction before user 'start' function is called                                                                                                                                                       |
| grid                            | `[0,0]`                                         | define an [x,y] grid for the object to move along                                                                                                                                                                                                       |
| revert                          | `false`                                         | revert back to initial position                                                                                                                                                                                                                         |
| revertAfter                     | `stop`                                          | revert after given event - `'stop'` or `'ease'`                                                                                                                                                                                                         |
| revertIf                        | `function(){ return true; }`                    | return `false` / `true` from this function to conditionally revert an object                                                                                                                                                                            |
| droppable                       | `false`                                         | CSS selector that this element can be dropped on, false to disable                                                                                                                                                                                      |
| droppableActiveClass            | `'pep-dpa'`                                     | class to add to active droppable parents, default to pep-dpa (droppable parent active); inspect `this.activeDropRegions` within each function for valuable info                                                                                         |
| overlapFunction                 | `false`                                         | override pep's default overlap function; takes two args: a & b and returns true if they overlap                                                                                                                                                         |
| cssEaseString                   | *cubic-bezier(0.190, 1.000, 0.220, 1.000)*      | get more css ease params from [ http://matthewlein.com/ceaser/ ]                                                                                                                                                                                        |
| cssEaseDuration                 | `750`                                           | how long should it take (in ms) for the object to get from stop to rest?                                                                                                                                                                                |
| constrainTo                     | `false`                                         | constrain object to `'window'` or `'parent'` or `[top, right, bottom, left]`; works best w/ useCSSTranslation set to false                                                                                                                              |
| axis                            | `null`                                          | constrain object to either 'x' or 'y' axis                                                                                                                                                                                                              |
| debug                           | `false `                                        | show debug values and events in the lower-righthand corner of page                                                                                                                                                                                      |
| activeClass                     | `'pep-active'`                                  | class to add to the pep element while dragging                                                                                                                                                                                                          |
| multiplier                      | `1`                                             | +/- this number to modify to 1:1 ratio of finger/mouse movement to el movement                                                                                                                                                                          |
| velocityMultiplier              | `1.9`                                           | +/- this number to modify the springiness of the object as your release it                                                                                                                                                                              |
| shouldPreventDefault            | `true`                                          | in some cases, we don't want to prevent the default mousedown/touchstart on our Pep object, your call                                                                                                                                                   |
| allowDragEventPropagation       | `true`                                          | set to false to stop drag events from bubbling up through the DOM tree                                                                                                                                                                                  |
| stopEvents                      | `''`                                            | space delimited set of events which programmatically cause the object to stop                                                                                                                                                                           |
| hardwareAccelerate              | `true`                                          | apply the CSS3 silver bullet method to accelerate the pep object: http://indiegamr.com/ios6-html-hardware-acceleration-changes-and-how-to-fix-them/                                                                                                     |
| useCSSTranslation               | `true`                                          | use CSS transform translations as opposed to top/left                                                                                                                                                                                                   |
| disableSelect                   | `true`                                          | apply `user-select: none` (CSS) to the object                                                                                                                                                                                                           |
| removeMargins                   | `true`                                          | remove margins for better object placement                                                                                                                                                                                                              |
| shouldEase                      | `true`                                          | disable/enable easing                                                                                                                                                                                                                                   |
| place                           | `true`                                          | bypass pep's object placement logic                                                                                                                                                                                                                     |
| deferPlacement                  | `false`                                         | defer object placement until start event occurs                                                                                                                                                                                                         |
| forceNonCSS3Movement            | `false`                                         | DO NOT USE: this is subject to come/go. Use at your own risk                                                                                                                                                                                            |
| elementsWithInteraction         | `'input'`                                       | valid CSS/jQuery selector for elements within the Pep object that should allow user interaction, and thus propagate to allow movement                                                                                                                   |
| ignoreRightClick                | `true`                                          | start event will be ignored if triggered by a right click                                                                                                                                                                                               |
| startPos                        | `{ left: null, top: null }`                     | set the default left/top coordinate to position the object with on load                                                                                                                                                                                 |
| useBoundingClientRect           | `false`                                         | use [getBoundingClientRect()](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) to retrieve element dimensions instead of jQuery's .outerWidth() & .outerHeight() (useful when your element is scaled via CSS transforms) |



## API
```javascript
// Toggle functionality of all Pep objects on the page
$.pep.toggleAll()

// Explicitly disable all Pep objects on the page
$.pep.toggleAll(false)

// Explicitly enable all Pep objects on the page
$.pep.toggleAll(true)

// Unbind Pep completely from the object
var $pep = $('.pep');
$pep.pep();               // bind
$.pep.unbind( $pep );     // unbind
$pep.pep();               // bind
````

## Class Applications
The following classes are applied corresponding to events that are happening on the pep object:

  - `pep-active` -- applied when initiate event is triggered; removed when ease has finished
  - `pep-start` -- applied when start event is triggered; removed when stop event occurs
  - `pep-ease` -- applied when stop event is triggered; removed when ease has finished

## Installation
__Via Bower__

```shell
bower install jquery.pep
````

__From CDN__

Bleeding edge, development version:

````
http://rawgithub.com/briangonzalez/jquery.pep.js/master/src/jquery.pep.js
````

## A note on `droppable` option
There is a convenience object within the context of each function pep makes available (drag, rest, ease, etc.) called `activeDropRegions`, which is an array of jQuery objects that the pep object is currently "over".

__Example:__
```javascript
$('.pep').pep({
  droppable:   '.drop-target',
  drag: function(ev, obj){
    console.log('There are ' + this.activeDropRegions.length + 'active drop regions.')
  },
  revert: true,
  revertIf: function(ev, obj){
    return !this.activeDropRegions.length;
  }
})
```

## Having an issue?

Before filing an issue, be sure to read the docs and search previous issues. If you're still not having any luck, be sure to fork the following CodePen, demonstrating the issue that you're having.

#### [→ Fork me and modify before filing issue](http://codepen.io/briangonzalez/pen/wqmIJ)


## Examples
Checkout the examples in the `demos` folder, which cover a wide array of test cases and options. Or you can check out other examples at http://pep.briangonzalez.org/ (which can also be found in more detail on Codepen: http://codepen.io/briangonzalez/tag/pep-demo)

## Author
| ![twitter/brianmgonzalez](http://gravatar.com/avatar/f6363fe1d9aadb1c3f07ba7867f0e854?s=70](http://twitter.com/brianmgonzalez "Follow @brianmgonzalez on Twitter") |
|---|
| [Brian Gonzalez](http://briangonzalez.org) |


## Support

Pep includes at least partial support for most browsers, dating back to IE6.

## License

Pep is licensed under the [MIT License](http://www.tldrlegal.com/license/mit-license)
