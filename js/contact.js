function sendContact() {
    var valid;	
    valid = validateContact();
    if(valid) {
        jQuery.ajax({
            url: "src/contact_mail.php",
            data:'userName='+$("#userName").val()+'&userEmail='+
            $("#userEmail").val()+'&userNumber='+
            $("#userNumber").val()+'&message='+
            $(message).val(),
            type: "POST",
            success:function(data){
                $("#mail-status").html(data);
                alert("Mail sended");
            },
            error:function (){}
        });
    }
}

function validateContact() {
    var valid = true;	
    $(".demoInputBox").css('background-color','');
    $(".info").html('');
    if(!$("#userName").val()) {
        $("#userName-info").html("(required)");
        $("#userName").css('background-color','#FFFFDF');
        valid = false;
    }
    if(!$("#userEmail").val()) {
        $("#userEmail-info").html("(required)");
        $("#userEmail").css('background-color','#FFFFDF');
        valid = false;
    }
    if(!$("#userEmail").val().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
        $("#userEmail-info").html("(invalid)");
        $("#userEmail").css('background-color','#FFFFDF');
        valid = false;
    }
    if(!$("#userNumber").val()) {
        $("#userNumber-info").html("(required)");
        $("#userNumber").css('background-color','#FFFFDF');
        valid = false;
    }
    if(!$("#message").val()) {
        $("#message-info").html("(required)");
        $("#message").css('background-color','#FFFFDF');
        valid = false;
    }
    return valid;
}