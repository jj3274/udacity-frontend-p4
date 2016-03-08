## Website Performance Optimization portfolio project

This project is to optimize an online portfolio website for speed. In particular, optimize the critical rendering path and make this page render as quickly as possible based on techniques from [Critical Rendering Path course](https://www.udacity.com/course/ud884).

### Part 1: Optimize PageSpeed Insights score for index.html

Here is the step to run PageSpeed Insights analysis for this project

1. Check out the repository
1. To inspect the site on your phone, you can run a local server

  ```bash
  $> cd /path/to/your-project-folder
  $> python -m SimpleHTTPServer 8080
  ```

1. Open a browser and visit localhost:8080
1. Download and install [ngrok](https://ngrok.com/) to make your local server accessible remotely.

  ```bash
  $> cd /path/to/your-project-folder
  $> ngrok http 8080
  ```

1. Copy the public URL ngrok gives you and try running it through PageSpeed Insights!
This project also includes Grunt integration, but ngrok requires paid plan to run: [More on integrating ngrok, Grunt and PageSpeed.](http://www.jamescryer.com/2014/06/12/grunt-pagespeed-and-ngrok-locally-testing/)

#### Analysis: Compare PageSpeed Insights scores

You can check out different versions of the site using git tag <tagname>

There are four tags for Part 1 project:
1. initial-template
1. v0.1-images-optimized
1. v0.2-completed-part1
1. v0.2-completed-part1-pagespeed-score-96

The initial score was **30/100**, and the final score is **96/100**.

Multiple optimizations are applied. More analysis using Google Chrome Dev Tool are as following:
1. Initial template
```DCL: 143ms, onload: 4466ms```

1. After image size reduction using OS X 'sips' command and 'ImageOptim' app
```DCL: 184ms, onload: 523ms```

1. After lazy css loading
```DCL: 3ms, onload: 578ms```

1. After moving javascript and css link to the bottom of page
```DCL: 3ms, onload: 269ms```

1. After inline css to html
```DCL: 4ms, onload: 159ms```

1. After minifying javascript/css/html
```DCL: 4ms, onload: 129ms```

### Part 2: Optimize Frames per Second in pizza.html

The requirement is to perform an optimizations 1) ensuring a consistent frame rate at 60fps when scrolling in pizza.html, and 2) reducing the time to resize pizza less than 5 ms shown in the browser console.

All changes in main.js can be found using **JY: CHANGE** string search

1. JY: CHANGE1

```javascript
// More efficient way to access DOM -> document.getElementsByClassName()
var pizzaContainer = document.getElementsByClassName('randomPizzaContainer');
```

1. JY: CHANGE2

```javascript
// Simply set width by % instead of computing pixel to set.
var newSize = sizeSwitcher(size) * 100;
for (var i = 0, len = pizzaContainer.length; i < len; i++) {
  // var dx = determineDx(pizzaContainer[i], size);
  // var newwidth = (pizzaContainer[i].offsetWidth + dx) + 'px';
  // pizzaContainer[i].style.width = newwidth;
  pizzaContainer[i].style.width = newSize + "%";
}
```

1. JY: CHANGE3

```javascript
// Calculate phase and prepare translateX style statement
var translateXStyle = [];
var scrollRate = (document.body.scrollTop / 1250);
for (var i = 0; i < 5; i++) {
  var phase = Math.sin(scrollRate + i);
  translateXStyle[i] = "translateX(" + (100 * phase) + "px)";
}

for (i = 0; i < items.length; i++) {
  // Now, simply set translateX style for css transform
  items[i].style.transform = translateXStyle[i % 5];
}
```

1. JY: CHANGE4

```javascript
// Similar to updatePositions(), Calculate phase and element left position.
var phaseList = [], baseLeftList = [];
var scrollRate = (document.body.scrollTop / 1250);
for (var i = 0; i < 5; i++) {
  phaseList[i] = Math.sin(scrollRate + i) * 100;
}
for (i = 0; i < cols; i++) { // This also removes the repeated calculation.
  baseLeftList[i] = i * s;
}

for (i = 0; i < 200; i++) {
  var elem = document.createElement('img');
  elem.className = 'mover';
  elem.src = "images/pizza.png";
  elem.style.height = "100px";
  elem.style.width = "73.333px";
  var phase = phaseList[i % 5];
  var baseLeft = baseLeftList[i % cols];
  elem.style.left = baseLeft + phase + 'px'; // Now, we can simply concat as string
  elem.style.top = (Math.floor(i / cols) * s) + 'px';
  document.querySelector("#movingPizzas1").appendChild(elem);
}
```
