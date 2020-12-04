<?php

// reCAPTCHA v3
// https://www.google.com/recaptcha/admin/site/

$g_recaptcha_response = $_POST['g_recaptcha_response'];
$g_recaptcha_response_check = false;
$PRIVATE_KEY = '6LdEIvkZAAAAAOgiE6as0lxo5dETiCczq1d4OJyA';

if (!empty($g_recaptcha_response)) {

	$response = json_decode(file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=".$PRIVATE_KEY."&response=".$g_recaptcha_response."&remoteip=".$_SERVER["REMOTE_ADDR"]),true);

	echo $response;

	if ($response["success"] and $response["score"] >= 0.5) {

		$g_recaptcha_response_check = true;

	}

}

if (!$g_recaptcha_response_check) {

	$mytext = date('d.m.y H:i') . "\r\n";
	$mytext .= $_POST['subject'] . "\r\n";
	$mytext .= $_POST['name'] . "\r\n";
	$mytext .= $_POST['email'] . "\r\n";
	$mytext .= $_POST['linkedin'] . "\r\n";
	$mytext .= $_POST['message'] . "\r\n";
	$mytext .= "___________\r\n";

	$fp = fopen('log-invalid-recaptcha.txt', "a");
	fwrite($fp, $mytext);
	fclose($fp);

	exit;

}

use PHPMailer\PHPMailer\PHPMailer;

require 'PHPMailer/PHPMailer.php';

$mail = new PHPMailer(true);

try {

	//Recipients
	$mail->setFrom('no-reply@valuenetwork.live', 'Value Network');
	$mail->addAddress('79198889134@ya.ru');
	$mail->addAddress('info@valuenetwork.live');

	//Content
	$html  = '<b>Name:</b> ' . $_POST['name'];
	$html .= '<br><b>Email:</b> ' . $_POST['email'];
	$html .= '<br><b>LinkedIn profile:</b> ' . $_POST['linkedin'];
	$html .= '<br><b>Message:</b> ' . $_POST['message'];

	$mail->CharSet  = 'UTF-8';
	$mail->Subject = $_POST['subject'];
	$mail->msgHTML($html);
	$mail->send();

	echo $_POST['subject'];

}
catch (Exception $e) {
	echo 'Message could not be sent. Mailer Error: ', $mail->ErrorInfo;
}