var pets = document.getElementsByClassName("pets");

for (i=0; i<pets.length; i++){
    var x = pets[i];
    x.innerHTML = "this is a good thingvagsdfgdsfgsdgit "+i;
}


function makeInvisible(j) {
    pets[j].innerHTML = "";
}