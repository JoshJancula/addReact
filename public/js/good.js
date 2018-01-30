window.onload = function() {
  
    $.ajax({
        method: "GET",
        url: "/articles",
    }).done(function(data) {
        console.log(data)
        renderNews(data)
    })
function renderNews(data) {
    if(data.length !== 0) {
        $("#news").empty();
        $("#news").show();
        
        data.forEach(function(result) {
            console.log("----------------------"+JSON.stringify(result))
            var div1 = $("<div>").append(
          "<div class='row'>" +
          "<div class='col m10'>" + "<div class='card horizontal'>" + "<div class='card-image'>" + "<img src="+ result.image + ">" +
          "</div>" +
          "<div class='card-stacked'>" + "<div class='card-content'>" +
          "<h2>" + result.title + "</h2>" +
          "<p> Summary : " + result.summary + "</p>" +
          "<p> <a href='" + result.link + "'>" + "Article link" + '</a>' + "</p>" +
          "</div>" +
          "</div>" +
          "</div>"
                );
                
                $("#news").append(div1);
        })
        
      }
    
   }
   
   
    // route to search in nav
  $("#searchNav").on("click", function(event) {
    event.preventDefault();
    // go to the profile
    window.location.href = '/search';
  });
  
  // route to main in nav
  $("#main").on("click", function(event) {
    event.preventDefault();
    // go to the profile
    window.location.href = '/main';
  });

  // button to logout
  $("#logout").on("click", function(event) {
    // event.preventDefault();
    $.get("/logout", function(data) {
      window.location.href = '/login';
    });
  });



  // view profile button
  $("#myProfile").on("click", function(event) {
    event.preventDefault();
    // go to the profile
    window.location.href = '/userProfile';
  });


   
   
}