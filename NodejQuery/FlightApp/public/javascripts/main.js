Flights = [];

document.addEventListener("DOMContentLoaded", function (event) {
    // update the li's on our homepage
    let listUl = document.getElementById("listUl");
    UpdateDisplay(listUl); 


    // this will refresh the data each time you navigate back to the Home page
    $(document).on('pagebeforeshow', '#Show', function () {
        let listUl = document.getElementById("listUl");
        UpdateDisplay(listUl);
    }
    );

    // this will refresh the data each time you navigate back to the Delete page
    $(document).on('pagebeforeshow', '#AddDelete', function () {
        let deleteListUl = document.getElementById("deleteListUl");
        UpdateDisplay(deleteListUl);   // call shared code with delete and home
        document.getElementById("deleteItem").value = "";  // clear this text box

        
     // this will clear the text boxes  each time you navigate back to the Add page
             
        document.getElementById("firstName").value = ""; 
        document.getElementById("lastName").value = ""; 
        document.getElementById("email").value  = ""; 
        document.getElementById("flyingFrom").value = ""; 
        document.getElementById("destination").value = ""; 
        document.getElementById("departing").value  = "";
        document.getElementById("returning").value = ""; 
        document.getElementById("adults").value = ""; 
        document.getElementById("children").value  = "";
        document.getElementById("travelClass").value  = "";
                
    }
    );

    $(document).on("pagebeforeshow", "#Details", function (event) {   
        let localDestination = document.getElementById("IDparmHere").innerHTML; 
        
        
        for(let i=0; i < Flights.length; i++) {  

            if( encodeURI(Flights[i].destination) == localDestination){
                document.getElementById("oneLastName").innerHTML =  Flights[i].lastName;
                document.getElementById("oneDestination").innerHTML =  Flights[i].destination;
                document.getElementById("oneDeparting").innerHTML =  Flights[i].departing;
                document.getElementById("oneReturning").innerHTML =  Flights[i].returning;
                document.getElementById("oneTravelClass").innerHTML =  Flights[i].travelClass;

                break;
            }  
        }
    });

    // add a button event for adding new Flights on Add page
    document.getElementById("newFlight").addEventListener("click", function () {
        let newFlight = new Flight( document.getElementById("firstName").value, 
           document.getElementById("lastName").value,
           document.getElementById("email").value,
           document.getElementById("flyingFrom").value, 
           document.getElementById("destination").value,
           document.getElementById("departing").value, 
           document.getElementById("returning").value,
           document.getElementById("adults").value, 
           document.getElementById("children").value,
           document.getElementById("travelClass").value ) ;

         /*   var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/UK/GBP/en-GB/?query=Stockholm",
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
                "x-rapidapi-key": "85318e8eecmsh4d30c53b25a200dp128bf8jsnfd71ab4b6f52"
            }
        }
        
        $.ajax(settings).done(function (response) {
            console.log(response);
             });*/
       
        $.ajax({
            url : "/AddFlight",
            type: "POST",
            data: JSON.stringify(newFlight),
            contentType: "application/json; charset=utf-8",
            dataType   : "json",
            success: function (result) {
                console.log(result);
                document.location.href = "index.html#Show";  // go to this page to show item was added
            }
        });
     });

     // add a button even for deleting a flight on Delete page
     document.getElementById("delete").addEventListener("click", function () {
        let which = document.getElementById("deleteItem").value;

        $.ajax({
            type: "DELETE",
                url: "/DeleteFlight/" +which,
                success: function(result){
                    console.log(result);
                    document.location.href = "index.html#Show";  // go to this page to show item was deleted
                },
                error: function (xhr, textStatus, errorThrown) {  
                    console.log('Error in Operation');  
                    alert("Server could not delete Flight with destination " + which)
                }  
            });

     });
 

});  // end of code that must wait for document to load before running

// constructor
function Flight(pFirstName, pLastName, pEmail, pFlyingFrom, pdestination, pDeparting, pReturning, pAdults, pChildren, pTravelClass) {
    this.firstName = pFirstName;
    this.lastName = pLastName;
    this.email= pEmail;
    this.flyingFrom = pFlyingFrom;
    this.destination = pdestination;
    this.departing= pDeparting;
    this.returning = pReturning;
    this.adults = pAdults;
    this.children= pChildren;
    this.travelClass = pTravelClass;
  }

// this function is shared by Home and Delete page to add li's to which ever ul is passed in
 function UpdateDisplay(whichElement) {

    $.get("/getAllFlights", function(data, status){  // AJAX get
        Flights = data;  // put the returned server json data into our local array
 //   });

    whichElement.innerHTML = "";
    // sort by destination
    Flights.sort(function(a, b) {
        return (a.destination) - (b.destination);
    });
    Flights.forEach(function(item, index) {   // build one li for each item in array
        var li = document.createElement('li');
        whichElement.appendChild(li);


        var uriDestination = encodeURI(item.destination);
        li.innerHTML =  item.lastName + "  " + item.destination +
        "   <a data-transition='pop' class='oneFlight' data-parm=" + uriDestination + "  href='#Details'>Flight Details </a> "
    });   


     var classname = document.getElementsByClassName("oneFlight");  
     Array.from(classname).forEach(function (element) {
         element.addEventListener('click', function(){
             var parm = this.getAttribute("data-parm");  
             console.log(parm);
             document.getElementById("IDparmHere").innerHTML = parm;
             document.location.href = "index.html#Details";
         });
     });  

});  

}


