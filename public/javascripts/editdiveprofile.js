$(function() {


    //hide 'success' message
    $('#success-message').hide();

    // accept info from form on 'submit' button click
    $("#edit-form").submit(function(e) {
        e.preventDefault();

        var formData = $('#edit-form').serialize();

        //$.post('/updateProfile', formData, function(data) {

            // Display 'success' message after submission is made
            // Delay works with queued / animated methods such as fadeIn / fadeOut
            $('#success-message').fadeIn().delay(3000).fadeOut();
        //});

        // clears input fields for new reference info
        $("#edit-form").find('input[type="text"], input[type="date"], textarea').val('');

        // return to map after a 4.5 second delay
        var delay=4500
        setTimeout(function(){
            window.location.href = "/";
        },delay)

    });


  //$('#delete').on('click', deleteMarker);

});
