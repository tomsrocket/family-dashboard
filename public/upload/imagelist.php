<?php

$dir = __DIR__ . '/../photofeed/';
$files = array_diff(scandir($dir), ['.', '..']);

$images = [];

foreach ($files as $file) {
    if (preg_match('/\.(jpg|jpeg|png)$/i', $file)) {
        if ($file == "latest.jpg") continue; 
        $images[] = [
            "url" => "/photofeed/" . $file,
            "time" => filemtime($dir . $file)
        ];
    }
}

// neueste zuerst
usort($images, fn($a, $b) => $b['time'] - $a['time']);

header('Content-Type: application/json');
echo json_encode(array_slice($images, 0, 50)); // nur die neuesten Bilder zurückgeben