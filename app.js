let firstBtn = document.querySelectorAll(".first button");
let secondBtn = document.querySelectorAll(".second button");
let firstInput = document.querySelector(".first-input");
let secondInput = document.querySelector(".second-input");
let firstInfo = document.querySelector(".first-info");
let secondInfo = document.querySelector(".second-info");
let inputs = document.querySelectorAll("input");;
let errDiv = document.querySelector(".error")

document.querySelector(".menu-toggle").addEventListener("click", () => {
    document.querySelector(".lists").classList.toggle("show");
  });

  function checkInput(value){
    value=value.replace(/,/g,".");
        value = value.replace(/[^0-9.]/g, '');
  
        if(value.includes(".")){
          let count = (value.match(/\./g) || []).length;
          if (count > 1) {
              value = value.slice(0, value.lastIndexOf('.'));
          }
          value=value.split(".");
          if(value[1].length>5){
            value[1]=value[1].slice(0,5)
          }
        value=value.join(".")
      }
  return value
  }

  let firstValue="RUB";
  let secondValue="USD";

  function generateApi(firstValue,secondValue){
  
    return fetch(`https://v6.exchangerate-api.com/v6/ece8ea48366ac8a0a2cbbb88/pair/${firstValue}/${secondValue}`)
    .then(res=>{
        return res.json()
    })
    .then(data => {
      errDiv.style.display = "none";
      return data.conversion_rate;
  })
  .catch(() => {
      errDiv.style.display = "block";
  });
  }

  document.addEventListener("DOMContentLoaded", () => {
  
    window.addEventListener('online', () => {
      errDiv.style.display = "none";
      if(lastInput=="first"){
        updateFirstİnput()
      }
        else if(lastInput=="second"){
          updateSecondInput()
        }
    });
  
    window.addEventListener('offline', () => {
      errDiv.style.display = "block";

    });
  });
  function calculateResult(inputValue, rate){
    return (inputValue*rate)
  }
  let lastInput = null; 

  function updateFirstİnput(){
    lastInput = "first"; 
      firstInput.value = checkInput(firstInput.value);
      generateApi(firstValue, secondValue).then(rate => {
          if (rate != null) {
            
              if (lastInput === "first") {

                  secondInput.value = calculateResult(firstInput.value,rate).toFixed(5);
              }
              let result = rate.toFixed(5);
              let result1 = (1 / rate).toFixed(5);
              firstInfo.textContent = `1 ${firstValue} = ${result} ${secondValue}`;
              secondInfo.textContent = `1 ${secondValue} = ${result1} ${firstValue}`;
          }
      });
  }

  firstInput.addEventListener("input", updateFirstİnput);
  function updateSecondInput(){
    lastInput = "second"; 
      secondInput.value = checkInput(secondInput.value);
      generateApi(secondValue, firstValue).then(rate => {
          if (rate != null) {
              if (lastInput === "second") {
                  firstInput.value = calculateResult(secondInput.value,rate).toFixed(5);
              }
              let result = rate.toFixed(5);
              let result1 = (1 / rate).toFixed(5);
              secondInfo.textContent = `1 ${firstValue} = ${result} ${secondValue}`;
              firstInfo.textContent = `1 ${secondValue} = ${result1} ${firstValue}`;
          }
      });
  }
  secondInput.addEventListener("input",updateSecondInput);
  


firstBtn.forEach(button => {
    
   button.addEventListener('click', () => {
        firstValue = button.value;
        firstBtn.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        if(lastInput=="first"){
          updateFirstİnput()
        }
        else{
          updateSecondInput()

        }
    });
});
secondBtn.forEach(button => {  
    button.addEventListener('click', () => {
        secondValue = button.value;
        secondBtn.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        if(lastInput=="second"){
          updateSecondInput()
          }
          else{
            updateFirstİnput()
  
          }
    });
});

updateFirstİnput()
  