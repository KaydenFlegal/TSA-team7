$(document).ready(function(){
    let otherPageInfo = {};
    let links = $(".nav-wrapper a");
    links.each((index, element) => {
        fetch(element.href).then((response) => response.text())
        .then((data) => {
            var dom = document.implementation.createHTMLDocument(element.href);
            console.log(data);
            otherPageInfo[element.href] = $(dom);
            
        });
    });

    links.click(function(evt){
                    //YOUR CODE HERE
                    let newPage = otherPageInfo[evt.target.href];
                    console.log("body");
                    console.log(newPage);

                    $('head *').remove();
                    $("other-pages").css("position", "fixed")
                        .css("bottom", "-100%").html(newPage.find("body").html());
                
                    evt.preventDefault();

                    return false;
                }
            );
});