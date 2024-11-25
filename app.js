let firstBtn = document.querySelectorAll(".first button");
let secondBtn = document.querySelectorAll(".second button");
let firstInput = document.querySelector(".first-input");
let secondInput = document.querySelector(".second-input");
let firstInfo = document.querySelector(".first-info");
let secondInfo = document.querySelector(".second-info");
let errDiv = document.querySelector(".error");

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
      if (/^0+$/.test(value)) {
        return value="0"; 
    }
    if(value=="."){
      return value="0."
    }
      if (value !== "0" && !value.startsWith("0.")) {
        value = value.replace(/^0+/, ""); 
    }
        
 return value

  }

  let firstValue="RUB";
  let secondValue="USD";

  function generateApi(firstValue,secondValue){
  
    return fetch(`https://v6.exchangerate-api.com/v6/1371d5ff85e06f9134a73f14/pair/${firstValue}/${secondValue}`)
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
      console.clear()
      errDiv.style.display = "none";
      if(lastInput=="first"){
        updateFirstInput()
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

  function updateFirstInput(){
    lastInput = "first"; 
      firstInput.value = checkInput(firstInput.value);
      if (firstInput.value === "0") {
        secondInput.value = "0";
        return; 
    }
      if (firstInput.value === "0.") {
        secondInput.value = "0.";
        return; 
    }

    if(firstValue==secondValue){
      secondInput.value=firstInput.value;
      firstInfo.textContent = `1 ${firstValue} = 1.00000 ${secondValue}`;
      secondInfo.textContent = `1 ${secondValue} = 1.00000 ${firstValue}`;
    }
      generateApi(firstValue, secondValue).then(rate => {
          if (rate != null) {
            
              if (lastInput === "first") { 
                
                 if(calculateResult(firstInput.value,rate)){
                  secondInput.value = calculateResult(firstInput.value,rate).toFixed(5);
                }
                else{
                  secondInput.value=""
                }

              }
              let result = rate.toFixed(5);
              let result1 = (1 / rate).toFixed(5);
              firstInfo.textContent = `1 ${firstValue} = ${result} ${secondValue}`;
              secondInfo.textContent = `1 ${secondValue} = ${result1} ${firstValue}`;
          }
      });
  }

  firstInput.addEventListener("input", updateFirstInput);
  function updateSecondInput(){
    lastInput = "second"; 
      secondInput.value = checkInput(secondInput.value);
      if (secondInput.value === "0") {
        firstInput.value = "0";
        return; 
    }
      if (secondInput.value === "0.") {
        firstInput.value = "0.";
        return; 
    }

    if(secondValue==firstValue){
      firstInput.value=secondInput.value;
      firstInfo.textContent = `1 ${firstValue} = 1.00000 ${secondValue}`;
      secondInfo.textContent = `1 ${secondValue} = 1.00000 ${firstValue}`;
    }
      generateApi(secondValue, firstValue).then(rate => {
          if (rate != null) {
              if (lastInput === "second") {
                              
                  if(calculateResult(secondInput.value,rate)){
                    firstInput.value = calculateResult(secondInput.value,rate).toFixed(5);
                  }
                  else{
                    firstInput.value=""
                  }
  
              
              }
              let result = rate.toFixed(5);
              let result1 = (1 / rate).toFixed(5);
              firstInfo.textContent = `1 ${firstValue} = ${result1} ${secondValue}`;
              secondInfo.textContent = `1 ${secondValue} = ${result} ${firstValue}`;
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
          updateFirstInput()
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
            updateFirstInput()
  
          }
    });
});

updateFirstInput()
  