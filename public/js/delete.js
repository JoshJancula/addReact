$('#delete').on("click", function() {
  // Grab the id associated with the article from the delete button
  var thisId = $(this).attr("data");

  // Run POST method
  $.ajax({
      method: "DELETE",
      url: "/articles/deleteAll",
    })
    
    .done(function(data) { 
    console.log("heyahdflsihaskfhj")// refresh the page
 window.location.reload();
    });

});
