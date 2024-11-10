<?php

$url = "https://fcm.googleapis.com/fcm/send";

$server_key = "AIzaSyDeyih0XS5OagXvdzqRkIuv8i7zI1wvfIA";

$message = array(
    "data" => array(
        "title" => "Hello",
        "body" => "Welcome. This is my Portfolio. Hope you are interested to see this.",
        "icon" => "https://photos.fife.usercontent.google.com/pw/AP1GczNUYwqbqHvFydlPlufGw2rA8_i4ui4oBSD5z84E3u6HHGFUwhSeGE0G=w813-h813-s-no-gm?authuser=0",
        "image" => "https://photos.fife.usercontent.google.com/pw/AP1GczNUYwqbqHvFydlPlufGw2rA8_i4ui4oBSD5z84E3u6HHGFUwhSeGE0G=w813-h813-s-no-gm?authuser=0",
        "click_action" => "https://example.com"
    ),
    "registration_ids" => [
        "fK8hAHU1-R1yXbYMELh5M2:APA91bEC2IdH-Xo-ZV_YO5Dxt9nlPiKiphPoA0vIWv53j7V1tgIfCNOddp5N7o-RkoRz_hvTAGR6XDCWUgLxqycV657jTb_4leGczy0XKTCHFvXJahgBlis"
    ],
);

$options = array(
    CURLOPT_URL => $url,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => array(
        "Authorization: key=" . $server_key,
        "Content_Type: application/json",
    ),
    CURLOPT_POSTFIELDS => json_encode($message),
);

$curl = curl_init();
curl_setopt_array($curl, $option);
$response = curl_exec($curl);

if($response === false){
    echo "Error sending messages: " . curl_error($curl);
}else{
    echo "Message sent succesfully";
}
curl_close($curl);
?>
