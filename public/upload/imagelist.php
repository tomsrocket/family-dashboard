<?php

$dir = __DIR__ . '/../photofeed/';
$cacheDir = $dir . 'cache/';

if (!is_dir($cacheDir)) {
    mkdir($cacheDir, 0777, true);
}

$files = array_diff(scandir($dir), ['.', '..', 'cache']);

$images = [];

foreach ($files as $file) {

    if (!preg_match('/\.(jpg|jpeg|png)$/i', $file)) continue;

    $originalPath = $dir . $file;
    $cachePath = $cacheDir . $file;

    // 👉 Thumbnail erzeugen, wenn noch nicht vorhanden
    if (!file_exists($cachePath)) {

        $info = getimagesize($originalPath);
        if (!$info) continue;

        [$width, $height, $type] = $info;

        // max 300px
        $maxSize = 300;
        $scale = min($maxSize / $width, $maxSize / $height, 1);

        $newWidth = (int)($width * $scale);
        $newHeight = (int)($height * $scale);

        // Bild laden
        switch ($type) {
            case IMAGETYPE_JPEG:
                $src = imagecreatefromjpeg($originalPath);
                break;
            case IMAGETYPE_PNG:
                $src = imagecreatefrompng($originalPath);
                break;
            default:
                continue 2;
        }

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