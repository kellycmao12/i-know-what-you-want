<?php
    $api = 'https://serpapi.com/search.json?q=';
    $other = '&tbm=shop&num=1&hl=en&gl=us';
    $apiKey = '&api_key=63668192bfce10425fbbb5ee5b72d6f2a521afaa997e1f91158a6c1f7fec6580';
    $url = $api.$_GET['query'].$other.$apiKey;

    // on server request api
    // Initialize a CURL session.
    $ch = curl_init();
    
    // Return Page contents.
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    
    //grab URL and pass it to the variable.
    curl_setopt($ch, CURLOPT_URL, $url);
    
    $result = curl_exec($ch);
    
    echo $result;

?>