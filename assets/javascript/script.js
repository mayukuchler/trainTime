function updateClock() {
  var clock = moment().format("h:mm:ss a");

  var c = $("<h2>");
  var c2 = c.append(clock);
  $("#clock").html(c2);
}

setInterval(updateClock, 1000);

var database = firebase.database();

$("#add-train-btn").click(function(event) {
  event.preventDefault();
  var newTrain = $("#train-name-input")
    .val()
    .trim();
  var newDestination = $("#destination-input")
    .val()
    .trim();
  var newFirstTrain = $("#first-train-input")
    .val()
    .trim();
  var newFrequency = $("#frequency-input")
    .val()
    .trim();


  newObject = {
    train: newTrain,
    destination: newDestination,
    firstTrain: newFirstTrain,
    frequency: newFrequency
  };
  database.ref().push(newObject);

  console.log(newObject.train);
  console.log(newObject.destination);
  console.log(newObject.firstTrain);
  console.log(newObject.frequency);

  alert("Train successfully added!");

  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});


database.ref().on("child_added", function(childSnapshot, prevChildKey) {
  console.log(childSnapshot.val());

  var newTrain = childSnapshot.val().train;
  var newDestination = childSnapshot.val().destination;
  var newFirstTrain = childSnapshot.val().firstTrain;
  var newFrequency = childSnapshot.val().frequency;

  console.log(newTrain);
  console.log(newDestination);
  console.log("FIRST TRAIN DEPARTED AT: " + newFirstTrain);
  console.log("THE TRAIN ARRIVES EVERY " + newFrequency + " MINUTES");

  

  var firstTrainConverted = moment(newFirstTrain, "hh:mm").subtract(1, "days");
  console.log(firstTrainConverted);

  var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  var timeApart = diffTime % newFrequency;
  console.log("MINUTES TO SUBTRACT FROM FREQUENCY: " + timeApart);

  var minutesAway = newFrequency - timeApart;
  console.log("MINUTES UNTIL TRAIN: " + minutesAway);

  var nextArrival = moment().add(minutesAway, "minutes");
  var nextArrival2 = moment(nextArrival).format("hh:mm");

  console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));

  $("#train-table > tbody").append(
    "<tr><td>" +
      newTrain +
      "</td> <td>" +
      newDestination +
      "</td> <td>" +
      newFrequency +
      "</td><td>" +
      nextArrival2 +
      "</td><td>" +
      minutesAway +
      "</td></tr>"
  );
});
