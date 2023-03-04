var otherPageInfo = {};
var otherPageHTMLString = {};
var PlayingAnimation = false;

$(window).ready(function(){
    let links = $(".nav-wrapper a");
    links.each((index, element) => {
        fetch(element.href).then((response) => response.text())
        .then((data) => {
            /* Store Page HTML for Recreating Document after nav off then back on */
            otherPageHTMLString[element.href] = data;

            /* Create new HTML Doc for jquery */
            var parser = new DOMParser();
            var doc = parser.parseFromString(data, "text/html");

            otherPageInfo[element.href] = $(doc);
            
            /* Find everything to pre-load */

        });
    });
    
    links.click(
        function(evt){
            if(evt.target.href == window.location.href || PlayingAnimation) {
                evt.preventDefault();
                return false; /* Ignore Current File */
            }

            let newPage = otherPageInfo[evt.target.href];

            let newPageElements = $(".other-pages");
            
            // Adding elements to HTML and setting up for animation
            newPage.find("nav").css("opacity", "0").css("z-index", "-1000");
            newPageElements.css("position", "fixed")
            .css("top", "100%").css("width", "100%").css("z-index", 100)
            .html(newPage.find("body").html());

            // Adding Stylesheets, Scripts, to header
            $("head title").remove();
            $("head").prepend(newPage.find("head").children().addClass("keep"));

            // Updating User History and Current URL
            window.history.pushState({ additionalInformation: 'Updated the URL with JS' }, newPage.find("title").text(), evt.target.href);
            window.history.replaceState({ additionalInformation: 'Updated the URL with JS' }, newPage.find("title").text(), evt.target.href);

            PlayingAnimation = true;
            newPageElements.delay( 50 ).animate({
                top: 0
                }, 1500, function() {
                    console.log("Done with Animation")
                    $("head *").not(".keep").remove();
                    $("body > *").not(newPageElements).not("nav").remove();
                    $(".keep").removeClass();

                    $("body").append(newPageElements.children());
                    //newPageElements.remove();

                    // Resetting Doc for next time
                    var parser = new DOMParser();
                    otherPageInfo[evt.target.href] = $(parser.parseFromString(otherPageHTMLString[evt.target.href], "text/html"));

                    PlayingAnimation = false;
                });

                
            console.log("body");
            console.log(newPage);
            
            evt.preventDefault();
            return false;
        }
    );
});