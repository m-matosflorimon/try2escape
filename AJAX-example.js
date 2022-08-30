//JSON and AJAX Tutorial: With Real Examples  from LearnWebCode min: 19:00

var thePets = [
    {
        "name": "Meowsalot",
        "species": "cat",
        "favFood": "tuna"
    },
    {
        "name": "Barky",
        "species": "dog",
        "favFood": "carrots"
    }
]

var ourRequest = new XMLHttpRequest();

ourRequest.open('GET','https://learnwebcode.github.io/json-example/animals-1.json');
ourRequest.onload = function(){
    console.log(ourRequest.responseText);
    var ourData = JSON.parse(ourRequest.responseText);
    console.log(ourData[0]);
};

ourRequest.send();