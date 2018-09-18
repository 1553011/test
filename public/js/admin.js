$("#nav-dashboard").css("background-color", "#08588c");
$("#nav-dashboard").css("color", "#fff");


var $content = $('.content-menu');
var typeContent = 'dashboard';

showContent(typeContent);

function showContent(type) {
  typeContent = type;
  $content.hide().filter('.' + type).show();
}


$(".nav-label").mousedown(function () {
  $(".nav-label").css("background-color", "#fff");
  $(".nav-label").css("color", "#08588c");
  $(this).css("background-color", "#08588c");
  $(this).css("color", "#fff");
  if ($(this).attr("id") == "nav-dashboard") {
    $('.search-tool').hide();
  }
  else {
    $('.search-tool').show();
  }
  if ($(this).attr("id") == "nav-product") {

    var items = $(".product-card");
    var numItems = items.length;
    var perPage = 10;
    items.slice(perPage).hide();
    $('#pagination-demo').pagination({
      items: numItems,
      itemsOnPage: perPage,
      cssStyle: "light-theme",

      // This is the actual page changing functionality.
      onPageClick: function (pageNumber) {
        // We need to show and hide `tr`s appropriately.
        var showFrom = perPage * (pageNumber - 1);
        var showTo = showFrom + perPage;

        // We'll first hide everything...
        items.hide()
          // ... and then only show the appropriate rows.
          .slice(showFrom, showTo).show();
      }

    });
  }
  else if ($(this).attr("id") == "nav-bills") {
    var items = $(".card-bill");
    var numItems = items.length;
    var perPage = 10;
    items.slice(perPage).hide();
    $('#pagination-bills').pagination({
      items: numItems,
      itemsOnPage: perPage,
      cssStyle: "light-theme",

      // This is the actual page changing functionality.
      onPageClick: function (pageNumber) {
        // We need to show and hide `tr`s appropriately.
        var showFrom = perPage * (pageNumber - 1);
        var showTo = showFrom + perPage;

        // We'll first hide everything...
        items.hide()
          // ... and then only show the appropriate rows.
          .slice(showFrom, showTo).show();
      }

    });
  }
});




function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }

}



// window.onclick = function(event) {
//   if (event.target == modal) {
//       modal.style.display = "none";
//   }
// }




var name, price, filename;
function uploadFile(target) {
  document.getElementById("file-name").value = target.files[0].name;
  name = $('#edt_name').val();
  price = $('#edt_price').val();
  filename = $('#file-name').val();
  console.log(name);
  console.log(price);
  console.log(filename);
  if (name && price && filename) {
    $('#btn_update_shirt').removeAttr("disabled");
  }
  else {
    $("#btn_update_shirt").attr("disabled", true);
  }

}

// Get the modal
var modal = document.getElementById('myModal');

var changeModal = document.getElementById('shirt_modal');
// Get the button that opens the modal
var btn = document.getElementById("btn_create");
var btnUpdate = document.getElementById("btn_update_shirt");
var btnChange = document.getElementById("btn_change_shirt");
var btnChange = document.getElementById("btn_remove_shirt");
// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
$(document).on('click', '#btn_create', function (e) {
  modal.style.display = "block";
});



$(document).on('click', '#btn_update_shirt', function (e) {
  $('#edt_name').val('');
  $('#edt_price').val('');
  $('#file-name').val('');
  $("#btn_update_shirt").attr("disabled", true);

  var input = document.getElementById("my-file-selector");

  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      //console.log(e.target.result);
      $.ajax({
        url: '/admin/create-shirt',
        data: {
          name: name,
          image: e.target.result,
          price: price
        },
        type: 'post',
        success: function (response) {
          location.reload();
          //window.location.href="/design/"+m;
          //console.log(response);
          //$(".product").load(location.href + " .product");
        }
      });
    }
    reader.readAsDataURL(input.files[0]);


  }
  modal.style.display = "none";
});





var id;
$(document).on('click', '.product-card', function (e) {
  $('#shirt_modal').css("display", "block");
  $('#change_name').attr('placeholder', 'Old name: ' + $(this).find('h5').text());
  $('#change_price').attr('placeholder', 'Old price: ' + $(this).find('p').text());
  id = $(this).data('id');
});

$(document).on('click', '.close', function (e) {
  $('#myModal').css("display", "none");
  $('#shirt_modal').css("display", "none");
});

$(document).on('click', '#btn_delete_shirt', function (e) {
  console.log(id);
  $.ajax({
    url: '/admin/delete-shirt',
    data: {
      id: id
    },
    type: 'post',
    success: function (response) {

      //window.location.href="/design/"+m;
      $('#shirt_modal').css("display", "none");
      location.reload();
      //showContent('product');
      //console.log(response);
      //$('#shirt_modal').css("display", "none");
      //$(".product").load(location.href + " .product");
    }
  });

  $('#shirt_modal').css("display", "none");
});
$(document).on('click', '#btn_change_shirt', function (e) {

  var new_name = $('#change_name').val();
  var new_price = $('#change_price').val();

  $.ajax({
    url: '/admin/update-shirt',
    data: {
      name: new_name,
      price: new_price,
      id: id
    },
    type: 'post',
    success: function (response) {
      //location.reload();
      //window.location.href="/design/"+m;
      //console.log(response);
      $('#change_name').val('');
      $('#change_price').val('');
      $('#shirt_modal').css("display", "none");
      $(".product").load(location.href + " .product");
    }
  });

  $('#shirt_modal').css("display", "none");
});



$("select").change(function (e) {
  e.preventDefault();
  var select;
  if ($(this).val() == 'Enable')
    select = 1;
  else
    select = 0;
  var id = $(this).data('id');

  $.ajax({
    url: '/admin/status-user',
    data: {
      id: id,
      select: select
    },
    type: 'post',
    success: function (response) {

      //window.location.href="/design/"+m;
      console.log(response);
    }
  });
});

$('#search').submit(function (e) {
  e.preventDefault();
  var arr = $('#txt_search').val();
  if (typeContent == 'mail') {
    $.ajax({
      url: '/admin/search-mail',
      type: 'post',
      data: { arr: arr },
      success: function (response) {
        //location.reload();
        var data = response;
        // //console.log(data);
        // //$('.usermail').html(response);
        // //$('.mail').html(response);
        $(".usermail").each(function () {
          $(this).css("display", "none");
        })
        console.log(data);
        $(".usermail").each(function () {
          var cur = $(this);
          data.forEach(function (x) {
            console.log(x);
            if (cur.data('id') == x.id)
              cur.css("display", "block");
          });
        });
      }
    });
  }
  else if (typeContent == 'product') {
    $.ajax({
      url: '/admin/search-product',
      type: 'post',
      data: { arr: arr },
      success: function (response) {
        var data = response;
        $(".product-card").each(function () {
          $(this).css("display", "none");
        })
        $(".product-card").each(function () {
          var cur = $(this);
          data.forEach(function (x) {
            if (cur.data('id') == x.id)
              cur.css("display", "block");
          });
        });
        var items = $(".product-card:visible");
        var numItems = items.length;
        var perPage = 10;
        items.slice(perPage).hide();
        $('#pagination-demo').pagination({
          items: numItems,
          itemsOnPage: perPage,
          cssStyle: "light-theme",

          // This is the actual page changing functionality.
          onPageClick: function (pageNumber) {
            // We need to show and hide `tr`s appropriately.
            var showFrom = perPage * (pageNumber - 1);
            var showTo = showFrom + perPage;

            // We'll first hide everything...
            items.hide()
              // ... and then only show the appropriate rows.
              .slice(showFrom, showTo).show();
          }
        });
      }
    });
  }
  else if (typeContent == 'account') {
    $.ajax({
      url: '/admin/search-account',
      type: 'post',
      data: { arr: arr },
      success: function (response) {
        var data = response;
        $(".user").each(function () {
          $(this).css("display", "none");
        })
        $(".user").each(function () {
          var cur = $(this);
          data.forEach(function (x) {
            if (cur.data('id') == x.id) {
              //console.log(x.id);
              cur.css("display", "block");
            }

          });
        });
      }
    });
  }
});


var billID;
$(document).on('click', '.card-bill', function (e) {
  $("#order-content").empty();
  billID = $(this).data('id');
  $.ajax({
    url: '/admin/findBill',
    type: 'post',
    data: { id: billID },
    success: function (response) {
      response.CustomShirts.forEach(function (value) {
        console.log(value);
        $("#order-content").append(
          '<div class="card-bill row">' +
          '<div class="bill-image col-4">' +
          '<img class="img-info" src=' + value.image + ' height="100" width="100" alt="">' +
          '</div>' +
          '<div class="bill col-7">' +
          '<h5 style="text-align: left;">' + value.name + '</h5>' +
          '<p style="text-align: left;" class="tag">' + value.vnprice + ' VNĐ</p>' +
          '<h6 style="font-size:10px;">Created at: ' + value.createdAt + '</h6>' +
          '</div>' +
          '</div>')
      });
      $("#orderPopup").css("display", "block");
    }
  });
});

$(document).on('click', '#btn_delete_bill', function (e) {
  console.log(billID);
  $.ajax({
    url: '/admin/delete-bill',
    type: 'post',
    data: { id: billID },
    success: function (response) {

      $("#orderPopup").css("display", "none");
      location.reload();
    }
  });
});
var minDate, maxDate;
$(document).on('click', '#close-detail-order', function (e) {
  $("#orderPopup").css("display", "none");
});

//get data
var data;
$.ajax({
  url: '/admin/get-data',
  type: 'post',
  success: function (response) {
    data = response;
    console.log(data);
    data.sort(function (x, y) {
      var a = x.date;
      var b = y.date;
      var sA = a.split('-').map(function (v, i) { return (i < 2) ? ("0" + v).substr(-2) : v; }).reverse().join('');
      var sB = b.split('-').map(function (v, i) { return (i < 2) ? ("0" + v).substr(-2) : v; }).reverse().join('');
      return sA > sB;
    });
    var total = data.map(function (a) { return a.total; });
    var date = data.map(function (a) { return a.date; });
    date.forEach(function (value, index) {
      date[index] = value.substring(0, 10);
    });
    minDate = date[0];
    console.log(minDate);
    maxDate = date[date.length - 1];
    console.log(maxDate);
    var myChart = new Chart($("#myChart"), {
      type: 'line',
      data: {
        labels: date,
        datasets: [{
          label: 'Revenue',
          data: total,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)'
          ],
          borderWidth: 3
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });



    $('#daterange').daterangepicker({
      locale: {
        format: 'YYYY/MM/DD'
      },
      "startDate": minDate,
      "endDate": maxDate,
      "minDate": minDate,
      "maxDate": maxDate

    }, function (start, end, label) {
      console.log('New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') );
      var arrDate=[],arrTotal=[];
      
      date.forEach(function (value, index) {
        
        if(date[index]>=start.format('YYYY-MM-DD')&&date[index]<=end.format('YYYY-MM-DD')){
          console.log("AAAA");
          arrDate.push(date[index]);
          arrTotal.push(total[index])
        }
      });
      
      console.log(arrDate);
      console.log(arrTotal);
      new Chart($("#myChart"), {
        type: 'line',
        data: {
          labels: arrDate,
          datasets: [{
            label: 'Revenue',
            data: arrTotal,
            backgroundColor: [

              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',

            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',

            ],
            borderWidth: 3
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              }
            }]
          }
        }
      });

    });

  }
});



