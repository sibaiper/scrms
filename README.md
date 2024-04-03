# SCRMS: Easy-to-Use text scramble animation

SCRMS is a lightweight JavaScript library for implementing a scramble text animation in your web applications. With SCRMS, you can easily integrate this animation into your projects.


## Installation

You can install SCRMS via npm:

```bash
npm install scrms 
```

to import SCRMS:
```bash
import Scramble from "scrms";
```

##

# USAGE:

**basic example on a single HTML element:**

```JavaScript
const animation = new Scramble("#cssSelector");
```
_you can also use a variable instead of a CSS selector_


**usage with settings:**

```JavaScript
const animation = new Scramble(ele, {
  duration: 1,
  onAnimating: () => {
    seekSlider.value = parseFloat(animation.progress).toFixed(2) * 100;
  },

  onAnimationEnd: () => {
    seekSlider.value = 0;
  },
});
```

##

## object methods avaiable to use:

`obj.play()`

`obj.pause()`

`obj.stop()`

`obj.restart()`

##

## settings avaiable to change:

keep calling a function as long as the animation is happening:
`onAnimating: () => {}`

call a function as soon as the animation ends:
`onAnimationEnd: () => {}}`

the duration of how long should the animation take to finish:
`duration: number`

a delay to add before the animation fires:
`delay: number` 

if you want the animation to start from somewhere in the middle: 
`progress: number` from 0 to 1


##
