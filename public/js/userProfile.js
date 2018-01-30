// Initialize Firebase




$(document).ready(function() {
  $('.modal').modal();
  $('select').material_select();
  /* global firebase */
  /* global Firebase */
  
   

  $.get("api/user_data", {}, function(data) {
    console.log("getting all user_data: " + data);
    var config = {
   apiKey: "AIzaSyBPF8oijoFmwqXhADisW_z9OJUb46kkmZM",
   authDomain: "jam-clash.firebaseapp.com",
   databaseURL: "https://jam-clash.firebaseio.com",
   projectId: "jam-clash",
   storageBucket: "jam-clash.appspot.com",
   messagingSenderId: "135488279188"
      };
   firebase.initializeApp(config);
  
  // get elemtents
  
  var uploader = document.getElementById('uploader');
  var fileButton = document.getElementById('fileButton');
  var storageRef = firebase.storage().ref('profileImages/' + data.email +'/+file_name') 
  
  storageRef.getDownloadURL().then(function(url){
  var img = document.getElementById("profilePic");
  img.src = url
  })
  //listen for file selection
  fileButton.addEventListener('change', function(e) {
      //get file
  var file = e.target.files[0];
      // create a storage ref
  // var storageRef = firebase.storage().ref('profileImages/' + data.email +'/+file_name') 
  
      //upload file
  var task = storageRef.put(file);
  storageRef.getDownloadURL().then(function(url){
    console.log(url)
    var updateData = {
      email: data.email,
      path: JSON.stringify(url)
    }
    updatePhoto(updateData)
    // var img = document.getElementById("profilePic");
    // img.src = url
  })
      // update progress bar
  task.on('state_changed',
      
      function progress(snapshot) {
          var percentage = (snapshot.bytesTransferred /
          snapshot.totalBytes) * 100;
          uploader.value = percentage;
          
      },
      function error(err) {
          throw err
      },
      function complete() {
          
      }
      
  )
  
  })
  
  
    // Sets account info into account info card
    $("#username").text(data.username);
    $("#name").text((data.userFirstName) + " " + (data.userLastName));
    $("#email").text(data.email);
    $("#instrument").text(data.instrumentsPlayed);
    $("#genre").text(data.genre);
    $("#inBand").text(data.isBand);
    $("#searchingFor").text(data.searchingFor);
    $("#about").text(data.about);
    $("#reverbNation").text(data.reverbNation);
    $("#soundCloud").text(data.soundCloud);
    $("#userStuff").append("<a href='" + data.faceBook + "'>" + "FaceBook" + '</a>' + "<br>"); 
    $("#userStuff").append("<a href='" + data.reverbNation + "'>" + "Reverb Nation" + '</a>' + "<br>");
    $("#userStuff").append("<a href='" + data.soundCloud + "'>" + "SoundCloud" + '</a>' );

    

    // set value in delete



    //Sets account info into edit profile modal
    $("label").addClass('active');
    $("#userFirstNameModal").val(data.userFirstName);
    $("#userLastNameModal").val(data.userLastName);
    $("#usernameModal").val(data.username);

    $("#inBandModal").val(data.isBand);
    $("#inBandModal").material_select();

    $("#instrumentsPlayedModal").val(data.instrumentsPlayed);
    $("#instrumentsPlayedModal").material_select();
    $("#reverbNationModal").text(data.reverbNation);
    $("#soundCloudModal").text(data.soundCloud);
    $("#faceBookModal").text(data.faceBook);

    $("#searchingForModal").val(data.searchingFor);
    $("#searchingForModal").material_select();

    $("#genreModal").val(data.genre);
    $("#genreModal").material_select();

    $("#aboutModal").val(data.about);
    $("#registerEmailModal").val(data.email);
  });




  $("#updateAccount").on("click", handleSubmitForm);

  function handleSubmitForm(event) {

    var about = $("#aboutModal").val().trim();
    var firstName = $("#userFirstNameModal").val().trim();
    var lastName = $("#userLastNameModal").val().trim();
    var email = $("#registerEmailModal").val().trim();
    var genre = $("#genreModal").val();
    var isBand = $("#isBandModal").val();
    var instrumentsPlayed = $("#instrumentsPlayedModal").val();
    var searchingFor = $("#searchingForModal").val();
    var username = $("#usernameModal").val();
    var faceBook = $("#faceBook").val();
    var soundCloud = $("#soundCloud").val();
    var reverbNation = $("#reverbNation").val()
    event.preventDefault();

    console.log("isBand content in form: " + isBand);



    var editedInfo = {

      about: about,
      userFirstName: firstName,
      userLastName: lastName,
      registerEmail: email,
      genre: genre,
      isBand: isBand,
      instrumentsPlayed: instrumentsPlayed,
      searchingFor: searchingFor,
      username: username,
      faceBook: faceBook,
      reverbNation: reverbNation,
      soundCloud: soundCloud
    };

    console.log("about to update the user line 75: " + JSON.stringify(editedInfo));
    updateUser(username, editedInfo);


    // empty out the input fields
    $("#aboutModal").val("")
    $("#userFirstNameModal").val("")
    $("#userLastNameModal").val("")
    $("#registerEmailModal").val("")
    $("#genreModal").val("")
    $("#isBandModal").val("")
    $("#instrumentsPlayedModal").val("")
    $("#searchingForModal").val("")
    $("#faceBook").val("");
    $("#soundCloud").val("");
    $("#reverbNation").val("")
  };



  // delete user account
  $("#handleDelete").click(function() {

// get the users id
    $.get("api/user_data", {}, function(data) {
      var id = data.id
      console.log("email1: " + id);
    }).done(function(user) {
      $.ajax({ // go delete that shit
        method: "DELETE",
        url: "/api/users/" + user.id
      }).done(function(data) { // tell me something good
        console.log("delete was successful: " + JSON.stringify(data));
        window.location.href = '/logout'; // redirect to login page
      });
    });
  });

  function updatePhoto(input) {
    $.ajax({
      method: "PUT",
      url: "/api/userPhoto",
      data: input
    }).done(function(data){
      console.log("*************************")
      console.log(data)
    })
  }

  function updateUser(username, user) {
    console.log("before updateUser ajax: " + JSON.stringify(user));
    $.ajax({
      method: "PUT",
      url: "/api/users/username", username,
      data: user
    }).done(function(data) {
      console.log("data from updateUser: " + JSON.stringify(data));
      window.location.href = '/logout';
    });

  };

});

// button to logout
$("#logout").on("click", function(event) {
  // event.preventDefault();
  $.get("/logout", function(data) {
    window.location.href = '/login';
  });
});



// view profile button
$("#main").on("click", function(event) {
  event.preventDefault();
  // go to the profile
  window.location.href = '/main';
});


// route to search in nav
$("#searchNav").on("click", function(event) {
  event.preventDefault();
  // go to the profile
  window.location.href = '/search';
});
