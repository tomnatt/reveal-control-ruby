$(document).ready(function() {
    connect();
    connectionReady();
});

count = 0;
function connectionReady() {
    if (count > 20) {
        console.log("giving up");
    } else if (ws.readyState != 1) {
        count++;
        setTimeout(connectionReady, 500);
    } else {
        pageReady();
    }
}

function connect() {
    ws = new WebSocket("ws://192.168.1.5:8081/");

    ws.onopen = function(evt) { 
        console.log("connected");
    }

    ws.onclose = function(evt) {
        console.log("disconnected");
    }

    ws.onmessage = function(evt) {
        console.log("response: " + evt.data);
        chat(evt.data);
    }

    ws.onerror = function(evt) {
        console.log("error: " + evt.data);
    }
    
}

function disconnect() {
    ws.close();
}

function send(words) {
    ws.send(words);
}

function pageReady() {
    $('input#say').focus();
    $('form').submit(function() {
        var msg = $(this).find('input#say').val();
        send(msg);
        $(this)[0].reset();
        return false;
    });
}

function chat(data) {
    var t = new Date();
    var time = t.getHours() + ":" + t.getMinutes() + ":" + t.getSeconds();
    $('#results').prepend("<p>" + time + ": " + data + "</p>");
}
