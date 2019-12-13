// Instagram Feed

var url = "https://api.instagram.com/v1/users/self/media/recent/?access_token=9247944383.36af0b0.9a31b5265e1640a990c9c424168a27a0";
var request = new XMLHttpRequest(); // initiate
var instaFeed = document.querySelector('#root');

request.open("GET", url);
request.send()

request.addEventListener("readystatechange", function () {
    if (request.readyState === 4 && request.status === 200) {
        var data = JSON.parse(request.responseText); // assign the data to a variable called data and parse to a javascript object

        for (var i = 0; i < data.data.length; i++) {
            var imgURL = data.data[i].images.standard_resolution.url;
            console.log(imgURL);
            instaFeed.innerHTML += "<li><img src=" + imgURL + "></li>";
        }

        //callback function

    } else if (request.readyState === 4) {
        console.error("Something went wrong.");
    }
});

// active nav item
$(function () {
    var current = location.pathname;
    $('nav li a').each(function () {
        var $this = $(this);
        // if the current path is like this link, make it active
        if ($this.attr('href').indexOf(current) !== -1) {
            $this.addClass('active');
        }
    })
})