window.onload = function(){
	buildClock();
	makeIcons();
	setInputs();
}

function buildClock() {
    var timer = setInterval(function() {
        var d = new Date();
        var s = d.getSeconds();
        var m = d.getMinutes();
        var h = d.getHours();
        var rSec = 6 * s;
        var rMin = 6 * m;
        var rHrs = 30 * h;
        document.getElementById('sHand').style.webkitTransform = "rotate(" + rSec + "deg)";
        document.getElementById('sHand').style.transformOrigin = "bottom center";
        document.getElementById('mHand').style.webkitTransform = "rotate(" + rMin + "deg)";
        document.getElementById('mHand').style.transformOrigin = "bottom center";
        document.getElementById('hHand').style.webkitTransform = "rotate(" + rHrs + "deg)";
        document.getElementById('hHand').style.transformOrigin = "bottom center";
    }, 1);
}

function makeIcons() {
    for (var i = 0; i <= 1; i++) {
        for (var w = 0; w <= 11; w++) {
            var x = (w * ((screen.width - 20) / 12));
            var div = document.createElement('div');
            div.innerHTML = "";
            div.style.position = "absolute";
            div.id = "weatherIcons" + w + i;
            div.style.left = "" + x + 'px';
            if (i == 0) {
                div.style.top = '80%';
            } else {
                div.style.top = '95%';
            }
            div.setAttribute('class', 'weatherIcons');
            document.body.appendChild(div);
        }
    }
}

function setInputs() {
    var d = new Date();
    var day = d.getDate();
    if (day < 10) {
        day = "0" + d.getDate();
    }
    var month = d.getMonth() + 1;
    if (month < 10) {
        month = "0" + (d.getMonth() + 1);
    }
    var year = d.getFullYear();
    var date = (year + "-" + month + "-" + day);
    var date_plus_ten = (year + "-" + month + "-" + (day + 10));
    document.getElementById('date').value = date;
    document.getElementById('date').min = date;
    document.getElementById('zip').placeholder = "Enter ZIP Code Here";
}

function getDiffinDays() {
    var MS_PER_DAY = 1000 * 60 * 60 * 24;
    var d = new Date();
    var d2 = new Date(document.getElementById('date').value);
    var utc1 = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    var utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
    return Math.ceil((utc2 - utc1) / MS_PER_DAY) + 1;
}

function getGoldenHours(h) {
    var d = new Date();
    var m = d.getMonth();
    var morningHour;
    var eveningHour;
    switch (m) {
        case 0:
            eveningHour = 16;
            break;
        case 1:
            morningHour = 7;
            eveningHour = 17;
            break;
        case 2:
            morningHour = 7;
            eveningHour = 18;
            break;
        case 3:
            morningHour = 6;
            eveningHour = 19;
            break;
        case 4:
            morningHour = 6;
            eveningHour = 19;
            break;
        case 5:
            morningHour = 6;
            eveningHour = 20;
            break;
        case 6:
            morningHour = 6;
            eveningHour = 20;
            break;
        case 7:
            morningHour = 6;
            eveningHour = 19;
            break;
        case 8:
            morningHour = 7;
            eveningHour = 18;
            break;
        case 9:
            morningHour = 7;
            eveningHour = 18;
            break;
        case 10:
            morningHour = 8;
            eveningHour = 17;
            break;
        case 11:
            morningHour = 7;
            eveningHour = 16;
            break;
        default:
            break;
    }
    return (h == morningHour || h == eveningHour);
}

function onSubmit() {
    var zip = document.getElementById('zip').value;
    getForecast(zip);
    getCoordinates(zip);

    $(document).ready(function (){
	    $("#click").click(function (){
	        $('html, body').animate({
	            scrollTop: $("#div1").offset().top
	        }, 2000);
	    });
	});
}

function getForecast(zip){
    jQuery(document).ready(function($) {
        $.ajax({
            url: "http://api.wunderground.com/api/140b1f395c4da37c/hourly10day/q/IA/" + zip + ".json",
            dataType: "jsonp",
            success: function(parsed_json) {
                $('html, body').animate({
                    scrollTop: 800
                }, 300);

                var diff = getDiffinDays();
                if (diff > 10) {
                    alert("Please choose a date less than 10 days in the future");
                }

                for (var i = 0; i < 24; i++) {
                    var jsonF = i + diff * 24;
                    var condition = parsed_json['hourly_forecast'][jsonF]['condition'];
                    var civil = parsed_json['hourly_forecast'][jsonF]['FCTTIME']['civil'];
                    var hour = parsed_json['hourly_forecast'][jsonF]['FCTTIME']['hour'];
                    var temp = parsed_json['hourly_forecast'][jsonF]['temp']['english'];
                    var ifDay;
                    if (diff > 1) {
                        jsonF = ((diff * 24) - hour ) + 12;
                    }


                    if (i < 12) {
                        //document.getElementById('weatherIcons' + i + "0").style.backgroundImage = "url('"+ image +"')";
                        document.getElementById('weatherIcons' + i + "0").innerHTML = '<br>' + temp + ' F' + '<br>' + condition + '<br>' + civil;
                        document.getElementById('weatherIcons' + i + "0").id = hour;
                    } else {
                        //document.getElementById('weatherIcons' + (i - 12) + "1").style.backgroundImage = "url('"+ image +"')";
                        document.getElementById('weatherIcons' + (i - 12) + "1").innerHTML = '<br>'+ temp + ' F' + '<br>' + condition + '<br>' + civil;
                        document.getElementById('weatherIcons' + (i - 12) + "1").id = hour;
                    }

                    if (getGoldenHours(hour)) {
                        if (condition == "Clear") {
                            document.getElementById(hour).style.backgroundColor = "#FFB800";
                            document.getElementById(hour).style.background = "-moz-linear-gradient(top, #FFB800, #C48120)";
                            document.getElementById(hour).style.background = "-webkit-gradient(linear, 0% 0%, 0% 100%, from(#FFB800), to(#C48120))";
                            document.getElementById(hour).style.background = "linear-gradient(top, #FFB800, #C48120)";
                        }
                    }
                }
            }
        });
    });
}

function getCoordinates(zip){
    var geocoder = new google.maps.Geocoder();
    
}


