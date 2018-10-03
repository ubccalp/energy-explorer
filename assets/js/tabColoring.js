// More efficient but not supported on older browsers:
// document.querySelector("li[class*='active'] > a").textContent;
// Reference: https://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript
var css = '',
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

console.log(document.styleSheets[1]);
var test = document.querySelector("li[class*='active'] > a").innerHTML;
console.log(test);
if(test.startsWith("ENERGY 101")){
  css = ".navbar-inverse .navbar-nav>.active>a, .navbar-inverse .navbar-nav>.active>a:focus, .navbar-inverse .navbar-nav>.active>a:hover{background-image: none; background-color: #e83c36;}";
  //document.styleSheets[1].insertRule(".navbar-inverse .navbar-nav>.active>a, .navbar-inverse .navbar-nav>.active>a:focus, .navbar-inverse .navbar-nav>.active>a:hover{background-color: ##e83c36;}",0);
  css = css + ".energy101-active{background-color: #e83c36;}";
}
else if(test.startsWith("HOT TOPICS")){
  css = ".navbar-inverse .navbar-nav>.active>a, .navbar-inverse .navbar-nav>.active>a:focus, .navbar-inverse .navbar-nav>.active>a:hover{background-color: #e47a09;}";
  css = css + ".energy101-active{background-color: #e47a09;}";
  css = css + ".learnmore-button{background-color: #e47a09;}";
  // This needs to be updated!
  //css = css + ".learnmore-button{background-color: #ef7646;}";
  //css = css + ".section-11{background-image: url('./images/Group-8612x_1.png');}";
}
else if(test.startsWith("MAPS")){
  css = ".navbar-inverse .navbar-nav>.active>a, .navbar-inverse .navbar-nav>.active>a:focus, .navbar-inverse .navbar-nav>.active>a:hover{background-color: #2cb195;}";
  css = css + ".energy101-active{background-color: #2cb195;}";
  css = css + ".learnmore-button{background-color: #2cb195;}";
}
else if(test.startsWith("SCENARIOS")){
  css = ".navbar-inverse .navbar-nav>.active>a, .navbar-inverse .navbar-nav>.active>a:focus, .navbar-inverse .navbar-nav>.active>a:hover{background-color: #4298d3;}";
  css = css + ".energy101-active{background-color: #4298d3;}";
  css = css + ".learnmore-button{background-color: #4298d3;}";
}
else if(test.startsWith("TOOLS & RESOURCES"))
  css = ".navbar-inverse .navbar-nav>.active>a, .navbar-inverse .navbar-nav>.active>a:focus, .navbar-inverse .navbar-nav>.active>a:hover{background-color: #e83c36;}";
else if(test.startsWith("ABOUT US"))
  css = ".navbar-inverse .navbar-nav>.active>a, .navbar-inverse .navbar-nav>.active>a:focus, .navbar-inverse .navbar-nav>.active>a:hover{background-color: #e83c36;}";

style.type = 'text/css';
if (style.styleSheet){
  // This is required for IE8 and below.
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}

head.appendChild(style);
