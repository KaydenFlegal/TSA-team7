$(document).ready(function(){
    let links = $("nav a");
    links.click(function(event){
        event.preventDefault();
        console.log("prevent nav");
    })


})