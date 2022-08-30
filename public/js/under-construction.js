// import { clearScreenDown } from "readline";

//#region Pieces Drag
/* ============================================================================= */
$(".piece").ondragstart = function() {
    return false;
  };

$(".piece").on("mousedown",function(e){
    var id = "#" + this.id.toString();
    $(id).addClass("active-touch");
    if($(id).parent()[0].className === "dropBox"){
        $(id).parent().parent().prepend($(id).css({"position": "absolute","transform": pieceToMouse(e,id)}));
    }

    $(document).bind("mousemove",".box",function(e){ 
        $(id).css({"left": 0,"top": 0,"transform": pieceToMouse(e,id)});
        var dropBoxArray = $(".dropBox").find().prevObject;
        var collision = collapses(e,dropBoxArray);
        if(collision.response && !collision.dropBox.firstChild){
            $(collision.dropBox).css("background","white").animateCss("flash",function(){
                $(collision.dropBox).css("background","none");
            });
            
        }
    });
});
//#endregion

//#region Updates piece's position on Drag
/* ============================================================================= */
function pieceToMouse(e,id){
    var x = e.pageX;
    var y = e.pageY;
    var newposX = x - ($(id).width()/2);
    var newposY = y - ($(id).height()/2); 
    return "translate3d("+newposX+"px,"+newposY+"px,0px)";
}
//#endregion

//#region Pieces Drop
/* ============================================================================= */
$(".piece").on("mouseup",function(e){
    var id = "#" + this.id.toString();
    $(id).removeClass("active-touch");
    $(document).unbind("click mousemove");
    var dropBoxArray = $(".dropBox").find().prevObject;
    var collision = collapses(e,dropBoxArray);
    if(collision.response){
        dropIt(id,collision.dropBox);
    }else{
        $(".dropBoxContainer").css("background","white").animateCss("flash",function(){

                $(".dropBoxContainer").css("background","none");
            
            }
        );
    }
});

function collapses(e,dropBoxArray){
    var x = e.clientX;
    var y = e.clientY;
    for(var i=0; i < dropBoxArray.length; i++){

        if( x > $(dropBoxArray[i]).position().left &&
            x < $(dropBoxArray[i]).position().left + $(dropBoxArray[i]).width() &&
            y > $(dropBoxArray[i]).position().top &&
            y < $(dropBoxArray[i]).position().top + $(dropBoxArray[i]).height()){

                return {response: true, dropBox: dropBoxArray[i]};           
        }
    }
    return {response: false, dropBox: dropBoxArray[i]};
}

function dropIt(id,dropBoxArrayId){

    if(!dropBoxArrayId.firstChild){
        $(dropBoxArrayId).append($(id).css({"transform": "none","position": "relative","top":0,"left":0}));
    };
    checkIt();
    
}

function checkIt(){
    var dropBoxArray = $(".dropBox").find().prevObject;
    var count = 0;
    for(var i=0; i < dropBoxArray.length; i++){
        // console.log()
        if( dropBoxArray[i].firstChild ){
            count++;   
            continue;   
        }
        break;
    }

    if( count == 4){
        if( $("#toDropTL").find().prevObject[0].children[0].id === "topLeft" &&
            $("#toDropTR").find().prevObject[0].children[0].id === "topRight" &&
            $("#toDropBL").find().prevObject[0].children[0].id === "botLeft" &&
            $("#toDropBR").find().prevObject[0].children[0].id === "botRight"){
                $(".piece").unbind("mousedown");
                $(".piece").unbind("mouseup");
                $("#toDrop").css({"position": "absolute","transform": "translate(-50%,-50%)","border-style": "none"});
                $('#toDropText').animateCss("fadeOut");
                $('#toDropText').empty();
                $('#toDropText').remove();
                setTimeout(function(){
                    $(".dropBox").each(
                        function(i,v){
                                var id = "#" + v.id;
                                $(id).empty();
                                $(id).remove();

                    });
                    $(".title-own").css({"opacity":"0%","visibility":"visible"});
                    $(".title-own").animateCss("fadeIn");
                    $("#toDrop").empty();
                    $("#toDrop").css("height","max-content");
                    $("#toDrop").css("width","max-content");

                    $("#toDrop").append('<img src="img/img/logollave-2.png" alt="Smiley face">');
                }, 2000);     
        }
    }
}
//#endregion

$(".email-input").on("click",function(){
    $(".email-input").css("border","1px solid #ccc");
});

$("#submit-btn").on("click",function(){
    var request = new XMLHttpRequest();
    var email = $(".email-input").val();
    if(isEmail(email)){
        $(".email-input").val("");
        $(".email-input").css("border","0.5px solid red");
        return;
    }
    console.log('/form/submitted?email=' + email);
    request.open('POST','/form/submitted?email=' + email);
    request.onload = function(){
        if(!request.responseText){
            console.log("No hubo respuesta");
        }
        
        var data = JSON.parse(request.responseText);
        console.log(data.msg);
        switch(data.msg){
            case "successful":
                $('.circle-loader').toggleClass('load-complete');
                $('.checkmark').show();
                break;
            
            case "unsuccessful":
                $("#email-input-area").html(
                    '<div class="text-faded title-own-text">Estamos experimentando fallos. <br> Favor intentar mas tarde.</div>' );
                break;

            case "old user":
                $("#email-input-area").html(
                    '<div class="text-faded title-own-text">El usuario introducido ya existe.</div>');
                break;

            case "validation error":
                $(".email-input").css("border","0.5px solid red");
                break;
        }
        $(".socialLeft").addClass("socialToggle");
    }
    $("#pre-form").animateCss("fadeOut",function(){
        $("#email-input-area").html(
            '<div class="circle-loader">'+
                '<div class="checkmark draw"></div>'+
            '</div>');
    request.send();
        
});
   
});

function isEmail(input){
    // var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 
    var pattern = /\S+@\S+\.\S+/;
    //console.log(input.match(pattern) ===  null);
    return input.match(pattern) ===  null;
}

// #region TouchScreen
/* ============================================================================= */
$(".piece").on("touchstart",function(e){
    console.log("no me toque");
    e.preventDefault();
    var id = "#" + this.id.toString();

// ======================================================
// ======================================================
//     // HERE TO TAKE IT OUT OF A dropBox
//     // COMENTAAAAA
// ======================================================
// ======================================================

    // if($(id).parent()[0].className === "dropBox"){
    //     $(id).parent().parent().prepend($(id).css({"transform": "initial","position": "initial","top":"initial","left":"initial"}));
    // }

    $('.piece').each(
        function(i,v){
            var idi = "#" + v.id;
            if(idi != id){
                $(idi).removeClass("active-touch");
            }
    });
    $(id).toggleClass("active-touch");
    
    if( $(id).hasClass("active-touch") && $(id).parent().hasClass("dropBox") ){
        $(id).parent().parent().prepend($(id));
        
    }
    
    var activeTouch = $(".active-touch").find().prevObject;
    if( activeTouch.length > 0 ){
        $(".dropBox").css({"background-image" : 'radial-gradient(farthest-side at 80% 20%, transparent , rgba(169, 169, 169, 0.367))', 'border' : '2px rgba(169, 169, 169, 0.967)' , 'border-radius' : '5px'});
        
        $(".dropBox").bind("touchstart",function(e){ 
            e.preventDefault();
            var id = "#" + this.id.toString();
            console.log($(id).children());
            // dropIt($($(activeTouch[0])).id , this);
            if( $(id).children().length < 1 ){
                $(id).append($(activeTouch[0]));
                $($(activeTouch[0])).css({"transform": "none","position": "relative","top":0,"left":0});
                $($(activeTouch[0])).removeClass("active-touch");
                checkIt();
            }

            $(".dropBox").unbind("touchstart");
            $(".dropBox").css({"background-image" : 'none', 'border' : 'none' , 'border-radius' : '0'});
        });
    }else{
        $(".dropBox").css({"background-image" : 'none', 'border' : 'none' , 'border-radius' : '0'});
    }
    
});

$(".piece").on("touchend",function(e){
    e.preventDefault();
    var flag = false;
    var id = "#" + this.id.toString();
});
/* ============================================================================= */
//#endregion