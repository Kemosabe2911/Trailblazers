
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
    function timer(){
        if(seconds<=0){
            seconds=59;
            if(minutes<=0){
                clearInterval(interval);
            }
            minutes=minutes-1;
        }
        seconds=seconds-1;
        minutes= minutes<10 ? "0"+minutes : minutes;
        seconds= seconds<10 ? "0"+seconds : seconds;
        document.getElementById('time').innerHTML= minutes + ":" + seconds;
        timeleft =  minutes * 60 + seconds;
        document.getElementById("timeinput").value= parseInt(timeleft);
    }
}

