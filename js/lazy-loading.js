var otherPageInfo = {};
var otherPageHTMLString = {};
var PlayingAnimation = false;

$(document).ready(function(){
    let links = $(".nav-wrapper a");
    links.each((index, element) => {
        if(element.href == window.location.href) return;
        fetch(element.href).then((response) => response.text())
        .then((data) => {
            /* Store Page HTML for Recreating Document after nav off then back on */
            otherPageHTMLString[element.href] = data;

            /* Create new HTML Doc for jquery */
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, "text/html");

            let newPage = $(doc);

            let className = element.href.replace(/^.*(\\|\/|\:)/, "").replace(".html", "").replace("index", "home");

            let newPageElements = $('<div class="other-page '+className+'"></div>');

            /* Add CSS to prevent page from showing */
            newPageElements.css("position", "fixed")
            .css("top", "0").css("left", "100%").css("width", "100%").css("z-index", 100);

            newPageElements.appendTo("body");

            /* Find everything to add to Document */
            
            /* Inserted into body */
            newPage.find("nav").css("opacity", "0").css("z-index", "-1000");
            newPageElements.html(newPage.find("body").html());

            /* remove duplicates */
            $("head script").each((index, oldElement) => {
                newPage.find("head script").each((index, newElement) => {
                    if(newElement.src == oldElement.src) {
                        console.log(newElement);
                        newElement.remove();
                    }
                });
            });
            $("head link[rel=preconnect], head link[rel=stylesheet]").each((index, oldElement) => {
                newPage.find("head script").each((index, newElement) => {
                    if(newElement.src == oldElement.src) newPage.find(newElement).remove();
                });
            });

            newPage.find("head meta").remove();
            newPage.find("head title").remove();

            /* Inserted into head */
            $("head").append(newPage.find("head").children().addClass("keep"));
        });
    });
    
    links.click(
        AnimationPlayer
    );

    /* Add back and forth nav */
    window.onpopstate = (event) => {
        window.location.href = document.location;
    };
    
});

function AnimationPlayer(evt){
    evt.preventDefault();
    let newPageURL = evt.target.href;
    let targetElement = $("."+newPageURL.replace(/^.*(\\|\/|\:)/, "").replace(".html", "").replace("index", "home"));
    if(newPageURL == window.location.href || PlayingAnimation) {
        console.log("here");
        evt.preventDefault();
        return false; /* Ignore Current File */
    }

    // Updating User History and Current URL
    window.history.pushState({ additionalInformation: 'Updated the URL with JS' }, $("title").text(), evt.target.href);// NOTE: keeps title from current page not all pages
    window.history.replaceState({ additionalInformation: 'Updated the URL with JS' }, $("title").text(), evt.target.href);

    PlayingAnimation = true;
    targetElement.delay( 50 ).animate({
        left: 0
        }, 1500, function() {
            console.log("Done with Animation")
            PlayingAnimation = false;
        });
    
    return false;
}