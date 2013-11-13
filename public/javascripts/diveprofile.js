$(function() {


    //hide 'success' message
    $('#success-message').hide();

    // accept info from form on 'submit' button click
    $("#reference-form").submit(function(e) {
        e.preventDefault();

        var formData = $('#reference-form').serialize();
        console.log('formData: ', formData);

        $.post('/profile', formData, function(data) {

            // Display 'success' message after submission is made
            // Delay works with queued / animated methods such as fadeIn / fadeOut
            $('#success-message').fadeIn().delay(3000).fadeOut();
        });

        // clears input fields for new reference info
        $("#reference-form").find('input[type="text"], input[type="date"], textarea').val('');

        // return to map after a 5 second delay
        var delay=5000
        setTimeout(function(){
            window.location.href = "/";
        },delay)

    });


  //$('#delete').on('click', deleteMarker);

});
