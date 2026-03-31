<?php

$dir = __DIR__ . '/../photofeed/';
$cacheDir = $dir . 'cache/';

if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0777, true);
}



function loadImageCorrectOrientation($path) {

    $info = getimagesize($path);
    [$width, $height, $type] = $info;
    // Bild laden
    switch ($type) {
        case IMAGETYPE_JPEG:
            $img = imagecreatefromjpeg($path);
            break;
        case IMAGETYPE_PNG:
            $img = imagecreatefrompng($path);
            break;
        default:
            echo "unknown image type: $type";
            return null;
    }

    $exif = @exif_read_data($path);

    if (!empty($exif['Orientation'])) {

        switch ($exif['Orientation']) {

            case 2:
                imageflip($img, IMG_FLIP_HORIZONTAL);
                break;

            case 3:
                $img = imagerotate($img, 180, 0);
                break;

            case 4:
                imageflip($img, IMG_FLIP_VERTICAL);
                break;

            case 5:
                $img = imagerotate($img, -90, 0);
                imageflip($img, IMG_FLIP_HORIZONTAL);
                break;

            case 6:
                $img = imagerotate($img, -90, 0);
                break;

            case 7:
                $img = imagerotate($img, 90, 0);
                imageflip($img, IMG_FLIP_HORIZONTAL);
                break;

            case 8:
                $img = imagerotate($img, 90, 0);
                break;
        }
    }

    return $img;
}


$files = array_diff(scandir($dir), ['.', '..', 'cache']);

$images = [];

foreach ($files as $file) {

    if (!preg_match('/\.(jpg|jpeg|png)$/i', $file)) continue;

    if ($file === 'latest.jpg') continue;
    
    $originalPath = $dir . $file;
    $cachePath = $cacheDir . $file;

    // 👉 Thumbnail erzeugen, wenn noch nicht vorhanden
    if (!file_exists($cachePath)) {

        $src = loadImageCorrectOrientation($originalPath);
        if (!$src) continue;

        // 👉 NACH Rotation!
        $width = imagesx($src);
        $height = imagesy($src);

        $maxSize = 300;

        $scale = min($maxSize / $width, $maxSize / $height, 1);

        $newWidth = (int)($width * $scale);
        $newHeight = (int)($height * $scale);

        $dst = imagecreatetruecolor($newWidth, $newHeight);

        imagecopyresampled(
            $dst, $src,
            0, 0, 0, 0,
            $newWidth, $newHeight,
            $width, $height
        );

        // speichern
        imagejpeg($dst, $cachePath, 70);

        imagedestroy($src);
        imagedestroy($dst);
    }

    $images[] = [
        "url" => "/photofeed/cache/" . $file,
        "time" => filemtime($originalPath)
    ];
}

// neueste zuerst
usort($images, fn($a, $b) => $b['time'] - $a['time']);

header('Content-Type: application/json');
echo json_encode($images);