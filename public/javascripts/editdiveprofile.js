$(function() {


    //hide 'success' message
    $('#success-message').hide();


    // accept edited form on 'submit' button click
    $("#edit-form").submit(function(e) {
        e.preventDefault();

        var formData = $('#edit-form').serialize();


        // make Ajax request to update recored in divesite collection
        $.post('/updateProfile', formData, function(data) {

            // Display 'success' message after submission is made
            $('#success-message').fadeIn().delay(3000).fadeOut();
        });


        // clears input fields for new reference info
        $("#edit-form").find('input[type="text"], input[type="date"], textarea').val('');

        // return to map after a 5 second delay
        var delay=5000
        setTimeout(function(){
           window.location.href = "/";
        },delay)

    });


  //$('#delete').on('click', deleteMarker);

});
