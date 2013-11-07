$(function() {


    //hide 'submit' message
    $('#success-message').hide();

    // accept info from form on 'submit' button click
    $("#reference-form").submit(function(e) {
        e.preventDefault();

        var formData = $('#reference-form').serialize();

        $.post('/profile', formData, function(data) {

        //Delay works with queued / animated methods such as fadeIn / fadeOut
        $('#success-message').fadeIn().delay(3000).fadeOut();
      });

    });
  //$('#delete').on('click', deleteMarker);

});
