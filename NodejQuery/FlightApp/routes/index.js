var express = require('express');
var router = express.Router();

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


ServerFlights = [];
ServerFlights.push(new Flight("Khalid", "Mohamed", "Khalid.Mohamed@gmail.com", "Seattle", "California", "5/20/2020", "7/20/2020", 1, 0, "Business"));

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  res.sendFile('index.html');
});

/* GET All Flight data */
router.get('/getAllFlights', function(req, res) {
  res.status(200).json(ServerFlights);
});


/* Add one new flight */
router.post('/AddFlight', function(req, res) {
  const newFlight = req.body;
  ServerFlights.push(newFlight);
  res.status(200).json(newFlight);
});


router.delete('/DeleteFlight/:destination', (req, res) => {
  const destination = req.params.destination;
  let found = false;
  console.log(destination);    

  for(var i = 0; i < ServerFlights.length; i++) // find the match
  {
      if(ServerFlights[i].destination === destination){
        ServerFlights.splice(i,1);  // remove object from array
          found = true;
          break;
      }
  }

  if (!found) {
    console.log("not found");
    return res.status(500).json({
      status: "error"
    });
  } else {
  res.send('Flight ' + destination + ' deleted!');
  }
});

module.exports = router;
