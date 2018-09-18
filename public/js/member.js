$(document).ready(function () {
    $("#btn_update").click(function () {
        $("#myModal").css("display", "block");
        document.getElementById('edt_name').value=document.getElementById('name').textContent;
        document.getElementById('edt_phone').value=document.getElementById('phone').textContent;
        document.getElementById('edt_address').value=document.getElementById('address').textContent;
    });

    $("#btn_update_account").click(function () {
        document.getElementById('name').textContent=document.getElementById('edt_name').value;
        document.getElementById('phone').textContent= document.getElementById('edt_phone').value;
        document.getElementById('address').textContent= document.getElementById('edt_address').value;
        var name=document.getElementById('edt_name').value;
        var phone= document.getElementById('edt_phone').value;
        var address= document.getElementById('edt_address').value;
        var userId=$("#box-info").attr("data-id");
        $.ajax({
            url: '/order/'+userId,
            dataType: "json",
            type: 'post',
            data:
            {
               name:name,
               phone:phone,
               address:address
            },
            success: function (response) {   
                console.log(response);
            }
        });
        $("#myModal").css("display","none");
    });

    $("#btn_change_password").click(function () {
        $("#edt_old_pass").value="";
        $("#edt_pass").value="";
        $("#edt_confirm_pass").value="";
        $("#changePassword").css("display","block");
    });

    $("#close-update-account").click(function () {
        $("#myModal").css("display","none");
    });

    $(".bill-info").click(function () {
        $("#orderPopup").css("display", "block");
        $("#order-content").html( $(this).children(".shirts").html());
        
    });

    $("#close-detail-order").click(function () {
        $("#orderPopup").css("display","none");
    });


    $("#close_pay").click(function () {
        $("#payPopup").css("display","none");
    });

    $(".btn-pay").click(function () {
        $("#payPopup").css("display", "block");        
        $("#btn-confirm").attr("data-billid",$(this).attr("data-billid"))
    });

    $("#btn-confirm").click(function () {
        //ajax call to save image inside folder
        var userId=$("#btn-confirm").attr("data-id");
        var userEmail=$("#btn-confirm").attr("data-email");
        var billId=$("#btn-confirm").attr("data-billid");
        var method=$('input[name=method]:checked').val();
        console.log("method:"+method);                    
        if (method=="1"){
            window.location.href="../checkout/cod/"+userId+"/"+billId;
        }
        else{
            $.ajax({
                url: '/checkout',
                dataType: "json",
                type: 'post',
                data:
                {
                    userId:userId,
                    billId:billId,
                    email:userEmail,
                    method:method
                },
                success: function (response) {   
                    console.log(response);
                    // $.ajax({
                    //     url: response.link,
                    //     type: 'get',
                    //     headers: {
                    //         "X-XSS-Protection":"1",
                    //         "mode":"block"
                    //     }
                    // });
                    window.location.href=response.link;
                }
            });
        }
    });
});