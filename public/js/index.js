

$(document).ready(function () {
   
    $(document).ready(function () {
      // your code here
      $('.popup').click(function () {

        $('#img-modal').attr('src', $(this).parent().parent().find('img').attr('src'));
        $('.modal-title').text($(this).parent().parent().find('h5').text());
      });
      $('.btn-link').click(function (e) {
        //window.location='/design?image='+$(this).parent().parent().find('img').attr('src');
        e.preventDefault();
        var id= $(this).parent().parent().parent().data("id");
        window.location.href='/design/'+id;
        // //console.log(id);
        // var urls='/design';
        // $.ajax({
        //   url: urls,
        //   type: 'post' ,
        //   data : {id: id}
          
        // });
       
      });
    });
});