const timeDiv = document.querySelector("#time");
const dateDiv = document.querySelector("#date");
const btn = document.querySelector("button");
let is24hours = false;
function updateTime() {
    if(is24hours){
         timeDiv.innerText = new Date().toLocaleTimeString('en-IN',{hour12: false
         });
    }else{
        timeDiv.innerText  = new Date().toLocaleTimeString('en-IN',{hour12:true});
    }
}
function updateDate (){
    dateDiv.innerText = new Date().toLocaleDateString('en-IN');
}
//button clicking
btn.addEventListener("click", function() {
   is24hours = !is24hours;
   btn.innerText = is24hours ? "switch to 12-hour format" : "switch to 24-hour format";
   updateTime();
}
);
updateDate()
setInterval(updateTime,1000);