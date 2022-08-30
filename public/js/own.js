
var foreelem = '';
var meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
var dias = ["D","L","M","M","J","V","S"];
var data;


//Animation css middleware
$.fn.extend({
    animateCss: function(animationName, callback) {
      var animationEnd = (function(el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd',
        };
  
        for (var t in animations) {
          if (el.style[t] !== undefined) {
            return animations[t];
          }
        }
      })(document.createElement('div'));
  
      this.addClass('animated ' + animationName).one(animationEnd, function() {
        $(this).removeClass('animated ' + animationName);
  
        if (typeof callback === 'function') callback();
      });
  
      return this;
    },
  });


$("#btn-inicio").mouseenter(function(){
    var elem = document.getElementById("begin");
    foreelem = elem.innerHTML;
   /* $("#begin").fadeOut(function(){
        //console.log("bueh");
    elem.innerHTML =
    '<h2 class="title__heading">'+        
        '<strong class="hero-section__words">'+
            'Escape Room'+
        '</strong>'+
    '</h2>'+
    '<br>'+
    '<br>'+
    '<div class="text-faded">¡Has sido encerrado junto a tu equipo!</div>'+
    '<div class="text-faded">Tienen 60 minutos para descifrar las pistas que te llevarán</div>'+
    '<div class="text-faded">a descubrir cómo escapar y quién está detrás de todo. </div>';
    $("#begin").fadeIn("slow");
    });*/

    $("#begin").animateCss("zoomOutLeft",function(){
        //console.log("bueh");
    elem.innerHTML =
    '<h2 class="title__heading">'+        
        '<strong class="hero-section__words">'+
            'Escape Room'+
        '</strong>'+
    '</h2>'+
    '<br>'+
    '<br>'+
    '<div class="text-faded">¡Has sido encerrado junto a tu equipo!</div>'+
    '<div class="text-faded">Tienen 60 minutos para descifrar las pistas que te llevarán</div>'+
    '<div class="text-faded">a descubrir cómo escapar y quién está detrás de todo. </div>';
    $("#begin").animateCss("zoomInLeft");
    });
});

$("#btn-inicio").mouseleave(function(){
    var elem = document.getElementById("begin");
    /*$("#begin").fadeOut(function(){
        //console.log("bueh");
        elem.innerHTML = foreelem;
        $("#begin").fadeIn("slow");
        initHeadline();
    });*/
    
    $("#begin").animateCss("zoomOutLeft",function(){
        //console.log("bueh");
        elem.innerHTML = foreelem;
        $("#begin").animateCss("zoomInLeft");
        initHeadline();
    });
    
    
});

$("#address-link").mouseenter(function(){
    $("#address-icon").animateCss("bounce");
});

$("#telephone-link").mouseenter(function(){
    $("#telephone-icon").animateCss("bounce");
});

$("#email-link").mouseenter(function(){
    $("#email-icon").animateCss("bounce");
});


function touchClick(){
    var elem = document.getElementById("begin");
    if(elem.className == 'title-01 title-01--11 text-center'){
        elem.className += ' touched';
        var elem = document.getElementById("begin");
    foreelem = elem.innerHTML;
    $("#begin").fadeOut(function(){
        //console.log("bueh");
    elem.innerHTML =
    '<h2 class="title__heading">'+        
        '<strong class="hero-section__words">'+
            'Escape Room'+
        '</strong>'+
    '</h2>'+
    '<div class="text-faded">¡Has sido encerrado junto a tu equipo!</div>'+
    '<div class="text-faded">Tienen 60 minutos para descifrar las pistas que te llevarán</div>'+
    '<div class="text-faded">a descubrir cómo escapar y quién está detrás de todo. </div>';
    $("#begin").fadeIn("slow");
    });
    }else if(elem.className == 'title-01 title-01--11 text-center touched'){
        elem.className = 'title-01 title-01--11 text-center';
        var elem = document.getElementById("begin");
    $("#begin").fadeOut(function(){
        //console.log("bueh");
        elem.innerHTML = foreelem;
        $("#begin").fadeIn("slow");
        initHeadline();
    }); 

    }
}

function triggerFirstCalendar(){
    var d = new Date();
    generateCalendar(d.getFullYear(),meses[d.getMonth()]);
}

/*0 = left ; 1 = right*/ 
function changeMonth(leftOrRight){
    var monthsElem = document.getElementById("month").innerHTML;
    monthAndYear = monthsElem.split(" "); /* 0 = month ; 1 = year*/ 
    var d = new Date();
    
    
    if(Number(monthAndYear[1]) >= d.getFullYear()){
        if(leftOrRight == 0  && (meses.indexOf(monthAndYear[0]) > d.getMonth() || Number(monthAndYear[1]) > d.getFullYear()) ){
            if(monthAndYear[0] == meses[0]){
                generateCalendar(Number(monthAndYear[1]) - 1 , meses[11]);  
            }else{
                generateCalendar(monthAndYear[1] , meses[meses.indexOf(monthAndYear[0]) - 1]);
            }
        }else if(leftOrRight == 1){
            if(monthAndYear[0] == meses[11]){
                generateCalendar(Number(monthAndYear[1]) + 1 , meses[0]);  
            }else{
                generateCalendar(monthAndYear[1] , meses[meses.indexOf(monthAndYear[0]) + 1]);
            }
        }

    }
}

function generateCalendar(year, month){

    var daysElem = document.getElementById("calendar-days");
    var monthsElem = document.getElementById("month");
    var i = 1;
    var text = '';
    var fecha = new Date(year,meses.indexOf(month),1);
    var hoy = new Date();
    monthsElem.innerHTML =  month + ' ' + year;
    for(i = 0; i < dias.length; i++){
        if(i == 0){
            text += '<div class="weekday-s">' + dias[i] + '</div>'
        }else{
        text += '<div class="weekday">' + dias[i] + '</div>'
        }
    }

    for(i = 0; i < fecha.getDay(); i++){
        text += '<div class="day-disabled"></div>'
    }

    for (i = 1; i < lastDay(year,meses.indexOf(month)) + 1; i++) {
        if(i < hoy.getDate() && hoy.getMonth() == meses.indexOf(month) && hoy.getFullYear() == year){
            text += '<div class="day-disabled">' + i + '</div>'
        }else{
        text += '<div onclick="dayClicked(this)" class="day">' + i + '</div>'
        }
    }

    daysElem.innerHTML = text;
}

function lastDay(y,m){
    return  new Date(y, m +1, 0).getDate();
    }


    function animateCalendar(element) {
        var elem = document.getElementById(element);   
        if(elem.style.transform != 'translateX(0%)'){
        var pos = 50;
        
        var id = setInterval(frame, 5);
        function frame() {
          if (pos == 0) {
            clearInterval(id);
          } else {
            pos--;    
                    
            elem.style.transform = 'translateX(' + pos + '%)';
            
                }
            }
        }
      }

function inverseAnimateCalendar(element) {
        var elem = document.getElementById(element);   
        if(elem.style.transform != 'translateX(0%)'){
        var pos = 50;
        
        var id = setInterval(frame, 5);
        function frame() {
          if (pos == 0) {
            clearInterval(id);
          } else {
            pos++;    
                    
            elem.style.transform = 'translateX(' + pos + '%)';
            
                }
            }
        }
      }

function fadeOut(elementid,_callback) {
        var element = document.getElementById(elementid);
        var op = 1;  // initial opacity
        var timer = setInterval(function () {
            if (op <= 0.1){
                clearInterval(timer);
                element.style.visibility = 'hidden';
                _callback();
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op -= op * 0.1;
        }, 10);
       
    }

    function fadeIn(elementid) {
        var element = document.getElementById(elementid);
        var op = 0.001;  // initial opacity
        element.style.opacity = op;
        element.style.visibility = 'visible';
        element.style.display = 'block';
        var timer = setInterval(function () {
            if (op >= 0.9){
                clearInterval(timer);
                
                /*element.style.display = 'none';*/
            }
            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ")";
            op += op * 0.1;
        }, 10);
    }

function dayClicked(element){

    var children = document.getElementById("calendar-days").children;
    //var dateStr;
    var dateArray = [];
    for (var i = 0; i < children.length; i++) {
      children[i].style.background = 'rgb(0, 0, 0, 0)';
      // Do stuff
    }

    element.style.background= '#ffc64f';
    

    dateArray = (element.innerHTML + " " + document.getElementById("month").innerHTML).split(" ");
    dateArray[1] = meses.indexOf(dateArray[1]);
    //console.log(dateArray);
    //dateStr = element.innerHTML + ' ' + document.getElementById("month").innerHTML;
    //console.log(dateStr);

    var input = $("<input>")
               .attr("name", "reservDate").val(dateArray)
               .attr("type", "hidden");
    $('#register-form').append(input);
    generateForm(dateArray);
    
    
}

function generateForm(date){
    
    var request = new XMLHttpRequest();

    request.open('GET','/form/load?date=' + date);
    request.onload = function(){
    
       if(!request.responseText){
            /*var anouncement = document.createElement("div");
            
            anouncement.id = "anouncement";
            document.getElementById("container-form").insertAdjacentElement("beforebegin",anouncement);
            //document.getElementById("container-form").insertAdjacentElement("afterend",anouncement);
            document.getElementById("anouncement").innerHTML = "Lo siento perra";
            //anouncement.text = "Lo siento perra";
            fadeIn("anouncement");
            return;*/
            //console.log("klk wawawa");

            
            $(".container-form").fadeOut(function(){
                $("#calendar").fadeOut(function(){
                    $("#calendar").css("transform","translateX(50%)")
                }).fadeIn();
                
            });


            /*fadeOut("container-form",function(){
                fadeOut("calendar", function(){
                    document.getElementById("calendar").style.transform = 'translateX(50%)';
                    fadeIn("calendar");
                });
            });*/
            //inverseAnimateCalendar("calendar");

            document.getElementById("reservaciones-parrafo").innerHTML = "Ahora mismo no tenemos ese horario disponible, por favor intenta con otro";
            $("#reservaciones-parrafo").animateCss("rubberBand");
            return;
        }

        data = JSON.parse(request.responseText);
        console.log(data);
        document.getElementById("form-mision").innerHTML = '';
        for(var i = 0; i<data.length - 1; i++){
            var option = document.createElement("option");
            option.text = data[i].name;
            option.value = data[i].name;
            var select = document.getElementById("form-mision");
            select.appendChild(option);
        }
        
        setMission();

        if (innerWidth >= 585){
            animateCalendar("calendar");
        }else{
            fadeOut("calendar",function(){

            });
        }
        
        fadeIn("container-form");
        $("#container-form").animateCss("jackInTheBox");
        document.getElementById("reservaciones-parrafo").innerHTML = "Completa con tu datos";
        $("#reservaciones-parrafo").animateCss("rubberBand");
};

    request.send();

}

function setMission(){
    var currentMission = document.getElementById("form-mision").value;
    document.getElementById("form-personas").innerHTML = '';
    document.getElementById("form-hora").innerHTML = '';
        for(var i = 0; i<data.length;i++){
            if(data[i].name == currentMission){
                currentMission = i;
                break;
            }
        }

        for(var i = 0; i<data[currentMission].times.length; i++){
            var option = document.createElement("option");
            option.text = data[currentMission].times[i];
            option.value = data[currentMission].times[i];
            var select = document.getElementById("form-hora");
            select.appendChild(option);
        }

        for(var i = 1; i<=data[currentMission].people; i++){
            var option = document.createElement("option");
            option.text = i;
            option.value = i;
            var select = document.getElementById("form-personas");
            select.appendChild(option);
        }
}

function formBack(){
    fadeOut("container-form",function(){
        fadeIn("calendar");
    });
    
}

function submitForm(){
    document.getElementById("register-form").submit();

}









/////////////////////////////////////////////////////////
//set animation timing
var animationDelay = 2500,
//loading bar effect
barAnimationDelay = 3800,
barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
//letters effect
lettersDelay = 50,
//type effect
typeLettersDelay = 150,
selectionDuration = 500,
typeAnimationDelay = selectionDuration + 800,
//clip effect
revealDuration = 600,
revealAnimationDelay = 1500;




function initHeadline() {
//insert <i> element for each letter of a changing word
singleLetters($('.hero-section.letters').find('.title__effect'));
//initialise headline animation
animateHeadline($('.hero-section'));
}

initHeadline();

function singleLetters($words) {
$words.each(function(){
    var word = $(this),
  letters = word.text().split(''),
  selected = word.hasClass('is-visible');

var newLetters = letters.join('');
word.html(newLetters).css('opacity', 1);
});
}

function animateHeadline($headlines) {
var duration = animationDelay;
$headlines.each(function() {
    var headline = $(this);

    if (headline.hasClass('clip')){
        var spanWrapper = headline.find('.hero-section__words'),
            newWidth = spanWrapper.width() + 10
        spanWrapper.css('width', newWidth);
    } else {
        //assign to .hero-section__words the width of its longest word
        var words = headline.find('.hero-section__words .title__effect'),
              width = 10;

        $(window).load(function() {
  words.each(function() {
    var wordWidth = $(this).width();
    if (wordWidth > width) width = wordWidth;
  });

  headline.find('.hero-section__words').css('width', width);
});
    };

    //trigger animation
    setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
});
}

function hideWord($word) {
var nextWord = takeNext($word);

if($word.parents('.hero-section').hasClass('clip')) {
    $word.parents('.hero-section__words').animate({ width : '2px' }, 1000, function(){
        switchWord($word, nextWord);
        showWord(nextWord);
    });

} else {
    switchWord($word, nextWord);
    setTimeout(function(){ hideWord(nextWord) }, animationDelay);
}
}

function showWord($word, $duration) {
if($word.parents('.hero-section').hasClass('clip')) {
    $word.parents('.hero-section__words').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){
        setTimeout(function(){ hideWord($word) }, revealAnimationDelay);
    });
}
}

function hideLetter($letter, $word, $bool, $duration) {
$letter.removeClass('in').addClass('out');

if(!$letter.is(':last-child')) {
     setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);
} else if($bool) {
     setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
}

if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
    var nextWord = takeNext($word);
    switchWord($word, nextWord);
}
}

function showLetter($letter, $word, $bool, $duration) {
$letter.addClass('in').removeClass('out');

if(!$letter.is(':last-child')) {
    setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration);
} else {
    if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
}
}

function takeNext($word) {
return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
}

function takePrev($word) {
return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
}

function switchWord($oldWord, $newWord) {
$oldWord.removeClass('is-visible').addClass('is-hidden');
$newWord.removeClass('is-hidden').addClass('is-visible');
}
