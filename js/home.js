let discount = 1;
let planetIndex = 0;

function movePlanets(newIndex) {
    let targetValue = -10000;

    $("main > .destination-wrapper").each((index, element) => {
        //console.log((targetValue*index)+"px");
        element.style.setProperty("--z-height", (targetValue*(index-newIndex))+"px");
        element.style.setProperty("--planet-scale", Math.max(1-Math.abs(2*(index-newIndex)),0));
    });

    /* Set name of planet */
    let names = ["Mercury", "Venus", "Xpedition", "Mars", "Jupiter"];
    $(".hero-title").html(names[newIndex]);

    if(newIndex == 2 || newIndex == 3){
        discount = 0.5;
    }else discount = 1;
    planetIndex = newIndex;
}

function updateCalendar(cells, selectedStartPos, selectedEndPos, discount){
    console.log("selectedStartPos: "+selectedStartPos);

    cells.each((index, element) => {
        console.log("selectedEndPos: "+index >= selectedStartPos && index <= selectedEndPos);
        $(element).addClass("selected-date");

        if(selectedStartPos != null && index >= selectedStartPos && index <= selectedEndPos){
            console.log(index);
            $(element).addClass("selected-date");

            // calc price
            if(selectedEndPos != null){
                let lenTrip = Math.abs(selectedEndPos - selectedStartPos);
                if(lenTrip < 14){
                    $(".booking-modal > .price > .min-booking").removeClass("d-none");
                    $(".booking-modal > .price > .btn").addClass("d-none");
                    $(".booking-modal > .price > .cost-label").html("Total Cost: NAN");
                }
                else{
                    $(".booking-modal > .price > .cost-label").html("Total Cost: "+ new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'USD' }).format(lenTrip*1000000*discount+25000000));
                    $(".booking-modal > .price > .min-booking").addClass("d-none");
                    $(".booking-modal > .price > .btn").removeClass("d-none");
                }
            }
        }else{
            $(element).removeClass("selected-date");
        }

        if(selectedStartPos == null){
            $(".booking-modal > .price > .cost-label").html("Total Cost: NAN");
            $(".booking-modal > .price > .min-booking").removeClass("d-none");
            $(".booking-modal > .price > .btn").addClass("d-none");
        }

    });
}

function onPageLoad() {
    console.log("Loading Home")
    /* scroll through planets using scroll wheel */
    $(document).on("wheel", (e) => {
        if($("main > .destination-wrapper").first().is(':animated')) return;
        if(e.originalEvent.deltaY > 0){
            movePlanets(Math.min(planetIndex+1, $("main > .destination-wrapper").length-1));
        }else if(e.originalEvent.deltaY < 0){
            movePlanets(Math.max(planetIndex-1, 0));
        }
    });
    
    $("main > .destination-wrapper").each((index, element) => {
        element.style.setProperty("z-index", -index-100);

    });


    movePlanets(2);

    /* create modal vars */
    let cells = $(".booking-modal > .calendar > table > tbody > tr > td").has("p");
    let currentlySelecting = false;
    let skipNextClick = false;
    let selectedStartPos = null;
    let selectedEndPos = null;

    /* Create Modal Event Listeners*/
    $(".booking-modal").fadeOut(0);
    $(".destination-wrapper > .btn, .booking-modal :is(.btn-close, .price > .btn) ").click(function(){
        let modal  = $(".booking-modal");
        if(!modal.is(':animated')) modal.fadeToggle(750);
        skipNextClick = false;
        selectedStartPos = null;
        selectedEndPos = null;
        updateCalendar(cells, selectedStartPos, selectedEndPos, discount);
    });


    /* create Calendar Event Listeners */
    cells.css("cursor", "pointer");

    cells.click(function(){
        let cellIndex = cells.index($(this));
        if(skipNextClick){
            skipNextClick = false;
            selectedStartPos = null;
            selectedEndPos = null;
        }else {
            if(currentlySelecting){
                selectedEndPos = cellIndex
                if(selectedEndPos < selectedStartPos){// forcing start to be less than or equal to end
                    let temp = selectedEndPos;
                    selectedEndPos = selectedStartPos;
                    selectedStartPos = temp;
                }
                currentlySelecting = false;
                skipNextClick = true;
            }else{
                selectedStartPos = cellIndex
                currentlySelecting = true;
            }
        }
        updateCalendar(cells, selectedStartPos, selectedEndPos, discount);
    });

    cells.hover(function(){
        let cellIndex = cells.index($(this));
        if(currentlySelecting){
            updateCalendar(cells, selectedStartPos, cellIndex, discount);
        }
    })
}


if(document.readyState === 'complete'){
    console.log("Path 1");
    onPageLoad();
}else{
    console.log("Path 2");
    document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
          // document ready
          onPageLoad();
          document.onreadystatechange = null;
        }
      };
}
