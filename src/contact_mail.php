
<?php
  use PHPMailer\PHPMailer\PHPMailer;
  use PHPMailer\PHPMailer\SMTP;
  use PHPMailer\PHPMailer\Exception;

  require 'vendor/autoload.php';

    $toEmail = "shinyfe74@gmail.com";
    $fromEmail = "minchulcha@minchulcha.com";
    // $mailHeaders = "From: " . $_POST["userName"] . "<". $_POST["userEmail"] .">\r\n";
    $mailHeaders = "From: minchulcha@minchulcha.com";
    $content = ("Name: " .$_POST["userName"]."\n"."Email: ".$_POST["userEmail"]."\n"."PhoneNumber: ".$_POST["userNumber"]."\n"."Message: ".$_POST["message"]);
    $subject = "From my homepage";

    $check = $_POST["message"];

    if ( !is_null( $check ) ) {
        $mail = new PHPMailer(true);
            //$mail->SMTPDebug  = 2;  //디버깅시 필요
        $mail->CharSet = PHPMailer::CHARSET_UTF8; //안쓰면 한글깨짐
        $mail->SMTPAuth    = true;
        $mail->SMTPSecure  = 'ssl';
        $mail->Host        = 'smtp.gmail.com';
        $mail->Port        = 465;
        $mail->Mailer      = 'smtp';
        $mail->Username    = 'shinyfe74@gmail.com';
        $mail->Password    = 'strjbznsfrbycesz';
        $mail->addAddress('shinyfe74@gmail.com', 'Receiver');
        $mail->setFrom('shinyfe74@gmail.com', 'Sender');
        $mail->isHTML(true);
        $mail->Subject     = $subject;
        $mail->Body        = $content;
        $mail->send();
    }


?>
