<html>
<head>
    <title>Share-Upload</title>
    <link rel="icon" href="/upload/icon-192.png" sizes="192x192" />
</head>
<body style="color:white;background:#333;font-family:Verdana, sans-serif">
  <center>
<img src="/upload/icon-192.png" style="max-width:200px;border-radius:10px" alt="Icon" width="100%">
<h1>
<?php

$uploadDir = __DIR__ . '/../photofeed/';

// einfache Sicherheit (Token optional)
/*$token = $_GET['token'] ?? '';
if ($token !== 'MEIN_SECRET_TOKEN') {
    http_response_code(403);
    echo "Forbidden";
    exit;
}
*/
// Debug (optional)
if (empty($_FILES)) {
    echo "Keine Dateien empfangen";
    
} else {

  // Share Target kann mehrere Dateien schicken
  $files = $_FILES['file'];

  if (is_array($files['name'])) {
      // mehrere Dateien
      for ($i = 0; $i < count($files['name']); $i++) {
          if ($files['error'][$i] === UPLOAD_ERR_OK) {
              $tmpName = $files['tmp_name'][$i];
              $filename = time() . '_' . $i . '.jpg';
              move_uploaded_file($tmpName, $uploadDir . $filename);
              copy($uploadDir . $filename, $uploadDir . 'latest.jpg');
          }
      }
  } else {
      // einzelnes Bild
      if ($files['error'] === UPLOAD_ERR_OK) {
          $filename = time() . '.jpg';
          move_uploaded_file($files['tmp_name'], $uploadDir . $filename);
          copy($uploadDir . $filename, $uploadDir . 'latest.jpg');

      } else {
          echo "Upload Fehler Code: " . $files['error'];
          echo "</h1>

          <pre>
            phpFileUploadErrors = array(
              0 => 'There is no error, the file uploaded with success',
              1 => 'The uploaded file exceeds the upload_max_filesize directive in php.ini',
              2 => 'The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form',
              3 => 'The uploaded file was only partially uploaded',
              4 => 'No file was uploaded',
              6 => 'Missing a temporary folder',
              7 => 'Failed to write file to disk.',
              8 => 'A PHP extension stopped the file upload.',
          );
          </pre>          
          ";

      }
  }

  echo "Upload OK";
}
?>
</h1>
  </center>
</body>
</html>