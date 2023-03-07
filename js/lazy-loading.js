var otherPageInfo = {};
var otherPageHTMLString = {};
var PlayingAnimation = false;
var currentPage = window.location.href.replace(/^.*(\\|\/|\:)/, "").replace(".html", "").replace("index", "home");
if (currentPage == "") currentPage = "home";

$(window).on("load", function(){
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
            if (className == "") className = "home";

            let newPageElements = $('<div class="other-page '+className+'"></div>');

            /* Add CSS to prevent page from showing */
            newPageElements.css("position", "fixed")
            .css("top", "0").css("left", "100%").css("width", "100%").css("z-index", 100);

            newPageElements.appendTo("body");

            /* Find everything to add to Document */
            
            /* Inserted into body */
            //newPage.find("nav").css("opacity", "0").css("z-index", "-1000");
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
            setTimeout(() => {
                $("a").click(
                    AnimationPlayer
                );
              }, "100");
        });
    });
    $("a").click(
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
    let className = newPageURL.replace(/^.*(\\|\/|\:)/, "").replace(".html", "").replace("index", "home");
    if (className == "") className = "home";
    let targetElement = $("."+className);
    if(newPageURL == window.location.href || PlayingAnimation) {
        console.log("here");
        evt.preventDefault();
        return false; /* Ignore Current File */
    }

    // Updating User History and Current URL
    let newURL = new URL(evt.target.href, window.location.href)
    window.history.pushState({ additionalInformation: 'Updated the URL with JS from lazy-loading.js' }, $("title").text(), newURL);// NOTE: keeps title from current page not all pages
    window.history.replaceState({ additionalInformation: 'Updated the URL with JS from lazy-loading.js' }, $("title").text(), newURL);

    /* Animation Time!! */
    let lastPage = currentPage;
    currentPage = className;
    $("."+lastPage).css("position", "fixed");
    targetElement.css("z-index", 1000);

    PlayingAnimation = true;
    targetElement.delay( 50 ).animate({
        left: 0
        }, 1500, function() {
            $("."+currentPage).css("position", "relative");
            console.log("Done with Animation")
            $("."+lastPage).css("left", "100%");
            PlayingAnimation = false;
            targetElement.css("z-index", 100);
        });
    
    return false;
}