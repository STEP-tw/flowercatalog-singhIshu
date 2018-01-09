let hidePot=function() {
  let pot=document.getElementById("pot");
  pot.style.visibility= "hidden";
}

let showPot=function() {
  let pot=document.getElementById("pot");
  pot.style.visibility= "visible";
}

let hidePotForASecond=function() {
  hidePot();
  setTimeout(showPot,1000)
}
