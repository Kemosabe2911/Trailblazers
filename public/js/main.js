
function displayTime() {
    let time= document.getElementById("timeinput").value;
    time= parseInt(time);
    console.log(time)
    let minutes = time/60;
    let seconds = time%60;
    minutes= minutes<10 ? "0"+minutes : minutes;
    seconds= seconds<10 ? "0"+seconds : seconds;
    document.getElementById('time').innerHTML= minutes + ":" + seconds;
    var interval = setInterval(timer,1000);
    minutes= parseInt(minutes);
    seconds= parseInt(seconds);
    if(seconds>=59){
        seconds=0;
        minutes=minute+1;
    }
    else{
        seconds=seconds+1;
    }
    console.log(minutes,seconds);
    function timer(){
        minutes= parseInt(minutes);
        seconds= parseInt(seconds);
        //console.log(minutes,seconds);
        minutes= minutes<10 ? "0"+minutes : minutes;
        seconds= seconds<10 ? "0"+seconds : seconds;
        //console.log(minutes,seconds);
        document.getElementById('time').innerHTML= " "+minutes + ":" + seconds +" ";
        minutes= parseInt(minutes);
        seconds= parseInt(seconds);
        if(seconds>=59){
            seconds=0;
            minutes=minutes+1;
        }
        else{
            seconds=seconds+1;
        }
        timeleft =  minutes * 60 + seconds;
        document.getElementById("timeinput").value= parseInt(timeleft);
    }
}


function displayTask(){
    //alert('Hello');
    document.getElementById("overlay").style.display= "block";
    document.getElementById("instruct").style.display= "block";
}

function ansCheck(clicked){
    var choice = clicked;
    console.log(clicked);
    var ans = document.getElementById("answer").value;
    if( ans === choice){
        document.getElementById("form_id").submit();
    }
    else{
        //document.getElementById("popup").style.opacity=1;
        alert("Wrong Answer! Please Try Again");
    }
}

function popupClose(){
    document.getElementById("popup").style.opacity= 0;
}