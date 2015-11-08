<?php  
$myfile = fopen("newfile.txt", "w") or die("Unable to open file!");
$message = $_REQUEST['message'];
fwrite($myfile, $message);
fclose($myfile);
echo '{ "message": "' . $_POST['message'] . '" }';
?>
