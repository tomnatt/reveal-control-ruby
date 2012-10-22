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
    ws = new WebSocket("ws://192.168.1.5:8080/");

    ws.onopen = function(evt) { 
        console.log("connected");
    }

    ws.onclose = function(evt) {
        console.log("disconnected");
    }

    ws.onmessage = function(evt) {
        console.log("response: " + evt.data);
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

// is this of any use?
// http://stackoverflow.com/questions/7919856/how-to-use-websockets-with-play-framework

function pageReady() {

    $("#upControl").bind("tap", function() {
        send("move up");
    });

    $("#downControl").bind("tap", function() {
        send("move down");
    });
    
    $("#leftControl").bind("tap", function() {
        send("move left");
    });
    
    $("#rightControl").bind("tap", function() {
        send("move right");
    });
    
}
