$(document).ready(function() {
    
    var sender;
    var reciever;
    var username;
    // initialize modal
    $('select').material_select();
    $('#contactModal').modal({
        ready: function(modal, trigger) {
          // gets the reciever email and hides it in #toEmail
            modal.find('#toEmail').text(trigger.data('id'));
        }

    });


    // when you click on the submitMessage button in modal
    $("#submitMessage").on("click", function(event) {
        event.preventDefault();
        // get the recievers email
        reciever = $("#toEmail").text();
        console.log("reciever: " + reciever);
        // message to be sent
        let message = $("#message").val().trim();
        // get the sender information
        $.get("api/user_data", {}, function(data) {
            console.log(data);
            sender = data.email;
            username = data.username;
            console.log("sender: " + sender + "  username: " + username);
        }).done(function() {
            
        // send the message
        $.get("/send", {
                to: reciever,
                subject: "New Message",
                html: "<h4>" + "email: " + sender + "</h4>" +
                    "<h4>" + "name: " + username + "</h4>" +
                    "<p>" + "message: " + message + "</p>"

            },
            function(data) {
                if (data == "sent") {
                    console.log("Great Success!");
                }
            });
        // close the modal 
        $('#contactModal').modal('close');
        // empty text field
        $("#message").val("");
    });

   });



});
