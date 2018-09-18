$('#registedMail').submit(function(e){
    e.preventDefault();
    var mail=$('#email').val();
    $.ajax({
      url: '/home/mail',
      type: 'post',
      data : {email: mail},
      success: function(response){
        $('#email').val('');
        $('#registedMail').html("<p>We will contact with you soon !</p>")
        .hide()
        .fadeIn(100, function() {
          // $('.form-inline').append("<img id='checkmark' src='images/check.png' />");
        });
      }
    });
    return false;
});








