const guess = document.getElementById("guess");
const dead = document.getElementById("dead");
const injured = document.getElementById("injured");
const submit = document.getElementById("submit");
const start = document.getElementById("start");
const game = document.getElementById("game");
const loading = document.getElementById("loading");

const n = [0,1,2,3,4,5,6,7,8,9];
let keyCounter = 1;
const data =[];
let randomNumbersArray;
let setUp ={};

function getRandomNumber (value, array){
    randomNumbersArray = [];

    while(randomNumbersArray.length < value ){
        const randomNumber = Math.floor(Math.random() * ((9-0)+1));
        array.forEach((range,index) =>{
            if(randomNumber == range){
                if(!randomNumbersArray.some((val)=>{
                    return randomNumber == val;
                })){
                    randomNumbersArray.push(range);
                }
            }
        });
    }  

    let newArray = array.filter((value)=>{
        return !randomNumbersArray.includes(value);
    });

    return setUp ={
        newArray: newArray,
        randomNumbers: randomNumbersArray,
    };
};

function thinking(firsrTime1NotFirstTime2){
    if(firsrTime1NotFirstTime2 === 1){
        setTimeout(()=>{
            loading.classList.add("d-none");
            guess.classList.remove("d-none");
        },1000);
    }else if(firsrTime1NotFirstTime2 === 2){
        loading.classList.remove("d-none");
        guess.classList.add("d-none");
        
        setTimeout(()=>{
            loading.classList.add("d-none");
            guess.classList.remove("d-none");
        },1000);
    }
}

function storeData(){
    let tempData = guess.value.split("");
    let tempDead = dead.value;
    let tempInjured = injured.value;

    storedData = {
        key: keyCounter++,
        value: tempData,
        dead: parseInt(tempDead),
        injured: parseInt(tempInjured),
        sum: parseInt(tempDead) + parseInt(tempInjured)
    }

    
    data.push(storedData);
    
    if(setUpCounter === 2){
        storedData = {
            key: keyCounter++,
            value: setUp.newArray,
            dead: null,
            injured: null,
            sum: null
        }

        data.push(storedData);
    }
    dead.value = "";
    injured.value = "";
}

function myGuess(){
    if(setUpCounter === 1){
        guess.value = getRandomNumber(4,setUp.newArray).randomNumbers.join(""); 
    }

    if(setUpCounter > 1){
        secnarios(data[0].sum,data[1].sum,data);
    }
}

function arrayMethod(biggerArray,smallerArray,method){
    biggerArray = biggerArray.map(String);
    smallerArray = smallerArray.map(String);

    if(method == "intersection"){
        let intersection = biggerArray.filter((value) =>{
            return smallerArray.includes(value);
        });

        return intersection;
    }

    if(method == "bigDifference"){
        let bigDifference = biggerArray.filter((value) =>{
            return !smallerArray.includes(value);
        }).concat(
            smallerArray.filter((value) =>{
                return !biggerArray.includes(value);
            })
        );

        return bigDifference;
    }

    if(method == "difference"){
        let difference = biggerArray.filter((value) =>{
            return !smallerArray.includes(value);
        });

        return difference;
    }

    if(method == "union"){
        return biggerArray.concat(smallerArray);
    }
}

let gameOver = true;

function check(){
    data.forEach((value)=>{
        if(value.sum == 4){
            dead.classList.add("is-valid");
            injured.classList.add("is-valid");
            dead.setAttribute("disabled","");
            injured.setAttribute("disabled","");
            submit.setAttribute("disabled","");
            
            gameOver = false;
            setUpVal = false;
        }
    });
}

start.addEventListener("click",()=>{
    game.classList.remove("d-none");
    start.classList.add("d-none");

    thinking(1);

    guess.value = getRandomNumber(4,n).randomNumbers.join("");
});

let setUpCounter = 0;
let setUpVal = true;
submit.addEventListener("click", ()=>{
    if(dead.value && injured.value){
        setUpCounter++;
        
        storeData();
        thinking(2);
        check();
        if(setUpVal){
            myGuess();
        }
    }else{
        dead.classList.add("is-invalid");
        injured.classList.add("is-invalid");
        setTimeout(() => {
            dead.classList.remove("is-invalid");
            injured.classList.remove("is-invalid");
        }, 1000);
    }  
});

///////////////////////// Scenarios///////////////////////////
let secnariosCounter = 0;
let good =[];
let bad =[];
let goodAndBad =[];
let goodAndBad2 =[];
let goodAndBad3 =[];
let nextTry;
let tempGoodOrBad;
let tempGoodAndBad;
let tempGoodAndBad2;
let tempBad;
let tempGood;
let firstTry =[];
function secnarios(key1Total,key2Total,storedData){
    /////////////////////////////////////////// Case 1 (2 & 0)//////////////////////////////////////////////////////
    if((key1Total == 2 || key1Total == 0) && (key2Total == 2 || key2Total == 0) && (data[0].sum + data[1].sum == 2)){
        secnariosCounter++;

        good = storedData[2].value;

        storedData[0].sum === 0 ? bad = storedData[0].value : bad = storedData[1].value;

        storedData[0].sum > 1 ? goodAndBad = storedData[0].value : goodAndBad = storedData[1].value;
        
        firstTry = [];
        
        if(secnariosCounter === 1){
            if(storedData[0].sum === 2){
                firstTry = getRandomNumber(4,getRandomNumber(2,good).randomNumbers.concat(getRandomNumber(2,goodAndBad).randomNumbers)).randomNumbers;
    
                guess.value = firstTry.join("");
            }else{
                firstTry = getRandomNumber(4,getRandomNumber(2,good).randomNumbers.concat(getRandomNumber(2,goodAndBad).randomNumbers)).randomNumbers;
    
                guess.value = firstTry.join("");
            }
        }

        check();

        

        if(secnariosCounter > 1 && gameOver){
            data.forEach((obj,index)=>{
                if(obj.sum == 2 && index == 3 && secnariosCounter == 2){
                    nextTry = arrayMethod(obj.value,goodAndBad,"bigDifference");
                }

                if(obj.sum == 3 && index == 3 && secnariosCounter == 2){
                    tempGoodAndBad = arrayMethod(obj.value,goodAndBad,"intersection");

                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    tempBad = getRandomNumber(1,bad).randomNumbers;

                    tempGood = getRandomNumber(2,good).randomNumbers;

                    nextTry = getRandomNumber(4,tempGood.concat(tempBad,tempGoodOrBad)).randomNumbers;
                }

                if(obj.sum == 2 && index == 4 && secnariosCounter == 3){
                    tempGoodOrBad = arrayMethod(goodAndBad,storedData[3].value,"difference");

                    nextTry = good.concat(arrayMethod(storedData[3].value,obj.value,"difference"),getRandomNumber(1,tempGoodOrBad).randomNumbers);

                    tempGood = good.concat(arrayMethod(tempGoodAndBad,obj.value,"difference"));
                }

                if(obj.sum == 3 && index == 4 && secnariosCounter == 3){
                    tempGoodOrBad = arrayMethod(goodAndBad,storedData[3].value,"difference");

                    tempGood = arrayMethod(obj.value,bad,"difference");

                    nextTry = tempGood.concat(getRandomNumber(1,tempGoodOrBad).randomNumbers);
                }

                if(obj.sum == 3 && index == 5 && secnariosCounter == 4){
                    nextTry = arrayMethod(tempGoodOrBad,obj.value,"difference").concat(tempGood);
                }
            });

            guess.value = getRandomNumber(4,nextTry).randomNumbers.join("");
        }
    }

    /////////////////////////////////// Case 2 (3 & 0)//////////////////////////////////////////////
    if((key1Total == 3 || key1Total == 0) && (key2Total == 3 || key2Total == 0) && (data[0].sum + data[1].sum == 3)){
        secnariosCounter++;

        key1Total == 0 ? bad = storedData[0].value : bad = storedData[1].value;

        key1Total == 3 ? goodAndBad = storedData[0].value : goodAndBad = storedData[1].value;

        goodAndBad2 = storedData[2].value;

        if(secnariosCounter === 1){
            firstTry = getRandomNumber(2,bad).randomNumbers.concat(getRandomNumber(2,goodAndBad).randomNumbers);

            guess.value = firstTry.join("");
        }

        check();

        if(secnariosCounter > 1 && gameOver){
            data.forEach((obj,index)=>{
                if(obj.sum == 2 && index == 3 && secnariosCounter == 2){
                    good = arrayMethod(obj.value,bad,"difference");

                    tempGoodAndBad = arrayMethod(goodAndBad,obj.value,"difference");

                    nextTry = getRandomNumber(3,bad).randomNumbers.concat(getRandomNumber(1,tempGoodAndBad).randomNumbers);
                }

                if(obj.sum == 1 && index == 3 && secnariosCounter == 2){
                    good = arrayMethod(goodAndBad,obj.value,"difference");

                    tempGoodAndBad = arrayMethod(obj.value,bad,"difference");

                    nextTry = getRandomNumber(3,bad).randomNumbers.concat(getRandomNumber(1,tempGoodAndBad).randomNumbers);
                }

                if(obj.sum == 0 && index == 4 && secnariosCounter == 3){
                    good = arrayMethod(tempGoodAndBad,obj.value,"difference").concat(good);

                    nextTry = good.concat(getRandomNumber(1,goodAndBad2).randomNumbers);
                }

                if(obj.sum == 1 && index == 4 && secnariosCounter == 3){
                    good = arrayMethod(obj.value,bad,"difference").concat(good);

                    nextTry = good.concat(getRandomNumber(1,goodAndBad2).randomNumbers);
                }

                if(obj.sum == 3 && index == 5 && secnariosCounter == 4){
                    good = good.concat(arrayMethod(goodAndBad2,obj.value,"difference"));

                    nextTry = good;
                }

            });

            guess.value = getRandomNumber(4,nextTry).randomNumbers.join("");
        }
    }

    /////////////////////////////////////// Case 3 (2 & 1)//////////////////////////////////////////////
    if((key1Total == 2 || key1Total == 1) && (key2Total == 2 || key2Total == 1) && (data[0].sum + data[1].sum == 3)){
        let val = true;
        secnariosCounter++;

        key1Total == 2 ? goodAndBad = storedData[0].value : goodAndBad = storedData[1].value;

        key1Total == 1 ? goodAndBad2 = storedData[0].value : goodAndBad2 = storedData[1].value;

        goodAndBad3 = storedData[2].value;

        if(secnariosCounter === 1){
            tempGoodOrBad = getRandomNumber(1,goodAndBad3).randomNumbers;

            tempGoodAndBad = getRandomNumber(3,goodAndBad).randomNumbers;

            firstTry = tempGoodOrBad.concat(tempGoodAndBad);

            guess.value = firstTry.join("");
        }


        check();

        if(secnariosCounter > 1 && gameOver){
            data.forEach((obj,index)=>{
                if((obj.sum == 3 || obj.sum == 1) & index == 4 && secnariosCounter == 3 && data[3].sum == 2){
                    data[3] = data[4];
                    data.splice(4,1);

                    secnariosCounter = 2;
                }

                if(obj.sum == 1 && (index == 3 || index == 4) && secnariosCounter == 2){
                    bad = tempGoodOrBad;
                    good = arrayMethod(goodAndBad3,bad,"difference").concat(arrayMethod(goodAndBad,obj.value,"difference"));

                    tempGoodAndBad = arrayMethod(goodAndBad,good,"difference");
                    tempGoodAndBad2 = getRandomNumber(2,tempGoodAndBad).randomNumbers;

                    nextTry = getRandomNumber(2,good).randomNumbers.concat(tempGoodAndBad2);
                }

                if(obj.sum == 3 && (index == 3 || index == 4) && secnariosCounter == 2){
                    good = tempGoodOrBad;
                    bad = arrayMethod(goodAndBad3,good,"difference").concat(arrayMethod(goodAndBad,obj.value,"difference"));

                    tempGoodAndBad = arrayMethod(goodAndBad,bad,"difference");
                    tempGoodAndBad2 = getRandomNumber(2,tempGoodAndBad).randomNumbers;

                    nextTry = getRandomNumber(2,bad).randomNumbers.concat(tempGoodAndBad2);
                }

                if(obj.sum == 2 && index == 3 && secnariosCounter == 2){
                    tempGoodOrBad = arrayMethod(goodAndBad3,tempGoodOrBad,"difference");

                    nextTry = tempGoodOrBad.concat(tempGoodAndBad);

                }

                if(obj.sum == 2 && index == 4 && secnariosCounter == 3 && data[3].sum != 2){
                    if(data[3].sum == 1){
                        bad = bad.concat(tempGoodAndBad2);
                        good = good.concat(arrayMethod(data[3].value,bad,"difference"));
                    } else if(data[3].sum == 3){
                        good = good.concat(tempGoodAndBad2);
                        bad = bad.concat(arrayMethod(data[3].value,good,"difference"));
                    }

                    tempGoodAndBad = getRandomNumber(2,goodAndBad2).randomNumbers;

                    nextTry = getRandomNumber(2,good).randomNumbers.concat(tempGoodAndBad);
                }

                if(obj.sum == 3 && index == 4 && secnariosCounter == 3 && data[3].sum != 2){
                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad2).randomNumbers;

                    nextTry = tempGoodOrBad.concat(getRandomNumber(2,good).randomNumbers,getRandomNumber(1,bad).randomNumbers);
                }

                if(obj.sum == 1 && index == 4 && secnariosCounter == 3 && data[3].sum != 2){
                    good = good.concat(arrayMethod(goodAndBad,obj.value,"difference"));

                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad2).randomNumbers;

                    nextTry = tempGoodOrBad.concat(getRandomNumber(2,good).randomNumbers,getRandomNumber(1,bad).randomNumbers);
                }

                if((obj.sum == 2 || obj.sum == 3) && index == 5 && secnariosCounter == 4 && data[4].sum != 2){
                    if(obj.sum == 2){
                        good = good.concat(arrayMethod(tempGoodAndBad2,tempGoodOrBad,"difference"));
                    }else if(obj.sum == 3){
                        good = good.concat(tempGoodOrBad);
                    }

                    tempGoodAndBad = getRandomNumber(2,goodAndBad2).randomNumbers;

                    nextTry = getRandomNumber(2,good).randomNumbers.concat(tempGoodAndBad);

                }

                if((obj.sum == 2 || obj.sum == 3) && index == 5 && secnariosCounter == 4 && data[4].sum == 2){
                    if(obj.sum ==  3){
                        tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;
                    }else if(obj.sum == 2){
                        tempGoodAndBad = arrayMethod(goodAndBad2,tempGoodAndBad,"difference");

                        tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;
                    }

                    nextTry = tempGoodOrBad.concat(good);
                }

                if(obj.sum == 3 && index == 6 && secnariosCounter == 5 && data[4] == 2){
                    good = good.concat(arrayMethod(tempGoodAndBad,tempGoodOrBad,"difference"));

                    nextTry = good;
                }

                if((obj.sum == 3 || obj.sum == 2) && index == 6 && secnariosCounter == 5 && data[4] != 2){
                    if(obj.sum == 2){
                        tempGoodAndBad = arrayMethod(goodAndBad2,tempGoodAndBad,"difference");

                        tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;
                    }else if(obj.sum == 3){
                        tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;
                    }

                    nextTry = tempGoodOrBad.concat(good);
                }

                if(obj.sum == 3 && index == 7 && secnariosCounter == 6){
                    good = good.concat(arrayMethod(tempGoodAndBad,tempGoodOrBad,"difference"));

                    nextTry = good;
                }
            });
            if(val){
                guess.value = getRandomNumber(4,nextTry).randomNumbers.join("");
            }

        }
    }

    /////////////////////////////////////// Case 4 (2 & 2)//////////////////////////////////////////////////
    if(key1Total == 2 && key2Total == 2){
        secnariosCounter++;

        

        goodAndBad = storedData[0].value;

        goodAndBad2 = storedData[1].value;

        if(secnariosCounter === 1){
            bad = storedData[2].value;

            tempGoodAndBad = getRandomNumber(2,goodAndBad).randomNumbers;

            firstTry = getRandomNumber(2,bad).randomNumbers.concat(tempGoodAndBad);

            guess.value = firstTry.join("");
        }

        check();

        if(secnariosCounter > 1 && gameOver){
            data.forEach((obj,index)=>{
                if(obj.sum == 2 && index == 3 && secnariosCounter == 2){
                    
                    good = arrayMethod(obj.value,bad,"difference");

                    tempGoodAndBad = getRandomNumber(2,goodAndBad2).randomNumbers;
                    
                    nextTry = getRandomNumber(2,good).randomNumbers.concat(tempGoodAndBad);
                }

                if(obj.sum == 0 && index == 3 && secnariosCounter == 2){
                            
                    good = arrayMethod(goodAndBad,obj.value,"difference");

                    tempGoodAndBad = getRandomNumber(2,goodAndBad2).randomNumbers;
                    
                    nextTry = getRandomNumber(2,good).randomNumbers.concat(tempGoodAndBad);
                }
                // not part of anything {
                if(obj.sum == 1 && index == 3 && secnariosCounter == 2){
                            
                    tempGoodAndBad = arrayMethod(obj.value,bad,"difference");
                    
                    tempGoodAndBad2 = getRandomNumber(2,goodAndBad2).randomNumbers;
                    
                    nextTry = getRandomNumber(2,bad).randomNumbers.concat(tempGoodAndBad2);
                }

                if(obj.sum == 0 && index == 4 && secnariosCounter == 3 && data[3].sum == 1){
                    good = arrayMethod(goodAndBad2,tempGoodAndBad2,"difference");

                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    nextTry = good.concat(tempGoodOrBad,getRandomNumber(1,bad).randomNumbers);
                }

                if(obj.sum == 2 && index == 4 && secnariosCounter == 3 && data[3].sum == 1){
                    good = tempGoodAndBad2;

                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    nextTry = good.concat(tempGoodOrBad,getRandomNumber(1,bad).randomNumbers);
                }

                if((obj.sum == 2 || obj.sum == 3) && index == 5 && secnariosCounter == 4 && (data[4].sum == 0 || data[4].sum == 2)){
                    if(obj.value == 2){
                        good = good.concat(arrayMethod(tempGoodAndBad,tempGoodOrBad,"difference"));
                    }else if(obj.sum == 3){
                        good = good.concat(tempGoodOrBad);
                    }

                    tempGoodAndBad = arrayMethod(goodAndBad2,tempGoodAndBad,"difference");

                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    nextTry = getRandomNumber(3,good).randomNumbers.concat(tempGoodOrBad);
                }

                // { for 1 and 1

                if(obj.sum == 1 && index == 4 && secnariosCounter == 3){
                    tempGoodAndBad = getRandomNumber(3,goodAndBad).randomNumbers;

                    nextTry = tempGoodAndBad.concat(getRandomNumber(1,bad).randomNumbers);
                }

                if(obj.sum == 1 && index == 5 && secnariosCounter == 4 && data[4].sum == 1){
                    good = arrayMethod(goodAndBad,tempGoodAndBad,"difference");

                    tempGoodAndBad2 = getRandomNumber(2,tempGoodAndBad).randomNumbers;

                    nextTry = bad.concat(tempGoodAndBad2);
                }

                if(obj.sum == 2 && index == 5 && secnariosCounter == 4 && data[4].sum == 1){
                    bad = bad.concat(arrayMethod(goodAndBad,tempGoodAndBad,"difference"));

                    tempGoodAndBad2 = getRandomNumber(2,tempGoodAndBad).randomNumbers;

                    nextTry = getRandomNumber(2,bad).randomNumbers.concat(tempGoodAndBad2);
                }

                if(obj.sum == 1  && index == 6 && secnariosCounter == 5 && data[5].sum == 1){
                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad2).randomNumbers;

                    nextTry = bad.concat(tempGoodOrBad,good);
                }

                if(obj.sum == 0  && index == 6 && secnariosCounter == 5 && data[5].sum == 1){
                    good = good.concat(arrayMethod(tempGoodAndBad,tempGoodAndBad2,"difference"));

                    tempGoodAndBad = getRandomNumber(2,goodAndBad2).randomNumbers;

                    nextTry = good.concat(tempGoodAndBad);
                }

                if(obj.sum == 2  && index == 6 && secnariosCounter == 5 && data[5].sum == 2){
                    good = tempGoodAndBad2;

                    tempGoodAndBad = getRandomNumber(2,goodAndBad2).randomNumbers;

                    nextTry = good.concat(tempGoodAndBad);
                }

                if(obj.sum == 1  && index == 6 && secnariosCounter == 5 && data[5].sum == 2){
                    good = arrayMethod(tempGoodAndBad,tempGoodAndBad2,"difference");

                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad2).randomNumbers

                    nextTry = good.concat(getRandomNumber(2,bad).randomNumbers,tempGoodOrBad);
                }

                if((obj.sum == 1 || obj.sum == 2)   && index == 7 && secnariosCounter == 6 && data[6].sum == 1){
                    if(obj.sum == 1){
                        good = good.concat(arrayMethod(tempGoodAndBad2,tempGoodOrBad,"difference"));
                    }else if(obj.sum == 2){
                        good = good.concat(tempGoodOrBad);
                    }

                    tempGoodAndBad = getRandomNumber(2,goodAndBad2).randomNumbers

                    nextTry = good.concat(tempGoodAndBad);
                }

                if(obj.sum == 2   && index == 7 && secnariosCounter == 6 && data[6].sum != 1){
                    good = good.concat(arrayMethod(goodAndBad2,tempGoodAndBad,"difference"));

                    nextTry = good;
                }

                if(obj.sum == 3   && index == 7 && secnariosCounter == 6 && data[6].sum != 1){
                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    nextTry = good.concat(getRandomNumber(1,bad).randomNumbers,tempGoodOrBad);
                }

                if(obj.sum == 2 && index == 8 && secnariosCounter == 7 && data[6].sum == 1){
                    good = good.concat(arrayMethod(goodAndBad2,tempGoodAndBad,"difference"));

                    nextTry = good;
                }

                if(obj.sum == 3 && index == 8 && secnariosCounter == 7 && data[6].sum == 1){
                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    nextTry = good.concat(getRandomNumber(1,bad).randomNumbers,tempGoodOrBad);
                }

                if((obj.sum == 2 || obj.sum == 3) && index == 8 && secnariosCounter == 7 && data[6].sum != 1){
                    if(obj.sum == 2){
                        good = good.concat(arrayMethod(tempGoodAndBad,tempGoodOrBad,"difference"));
                    }else if(obj.sum == 3){
                        good = good.concat(tempGoodOrBad);
                    }

                    tempGoodAndBad = arrayMethod(goodAndBad2,tempGoodAndBad,"difference");

                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    nextTry = good.concat(tempGoodOrBad);
                }

                if(obj.sum == 3 && index == 9 && secnariosCounter == 8 && data[6].sum != 1){
                    good = good.concat(arrayMethod(tempGoodAndBad,tempGoodOrBad,"difference"));

                    nextTry = good;
                }

                if((obj.sum == 2 || obj.sum == 3) && index == 9 && secnariosCounter == 8 && data[6].sum == 1){
                    if(obj.sum == 2){
                        good = good.concat(arrayMethod(tempGoodAndBad,tempGoodOrBad,"difference"));
                    }else if(obj.sum == 3){
                        good = good.concat(tempGoodOrBad);
                    }

                    tempGoodAndBad = arrayMethod(goodAndBad2,tempGoodAndBad,"difference");

                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    nextTry = good.concat(tempGoodOrBad);
                }

                if(obj.sum == 3 && index == 10 && secnariosCounter == 9){
                    good = good.concat(arrayMethod(tempGoodAndBad,tempGoodOrBad,"difference"));

                    nextTry = good;
                }

                if(obj.sum == 0 && index == 4 && secnariosCounter == 3 && data[3].sum != 1){
                    good = good.concat(arrayMethod(goodAndBad2,obj.value,"difference"));
                            
                    nextTry = getRandomNumber(4,good).randomNumbers;
                }

                if(obj.sum == 3 && index == 4 && secnariosCounter == 3 && data[3].sum != 1){
                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;
                            
                    nextTry = getRandomNumber(2,good).randomNumbers.concat(tempGoodOrBad,getRandomNumber(1,bad).randomNumbers);
                }

                if((obj.sum == 3 || obj.value == 2) && index == 5 && secnariosCounter == 4 && data[4].sum == 3){
                    if(obj.sum == 3){
                        good = good.concat(tempGoodOrBad);
                    }else if(obj.sum == 2){
                        good = good.concat(arrayMethod(tempGoodAndBad,tempGoodOrBad,"difference"));
                    }

                    tempGoodAndBad = arrayMethod(goodAndBad2,tempGoodAndBad,"difference");

                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    nextTry = getRandomNumber(3,good).randomNumbers.concat(tempGoodOrBad);
                }

                if(obj.sum == 3 && index == 6 && secnariosCounter == 5){ // might require another val bout data[5].sum
                    good = good.concat(arrayMethod(tempGoodAndBad,tempGoodOrBad,"difference"));

                    nextTry = good;
                }
            });

            guess.value = getRandomNumber(4,nextTry).randomNumbers.join("");    
        }

        
    }

    /////////////////////////////////////////// Case 5 (3 & 1)////////////////////////////////////////////////
    if((key1Total == 3 || key1Total == 1) && (key2Total == 3 || key2Total == 1) && (data[0].sum + data[1].sum == 4 )){
        secnariosCounter++;

        bad = storedData[2].value;

        key1Total == 3 ? goodAndBad = storedData[0].value : goodAndBad = storedData[1].value;

        key1Total == 1 ? goodAndBad2 = storedData[0].value : goodAndBad2 = storedData[1].value;

        if(secnariosCounter === 1){
            firstTry = getRandomNumber(2,bad).randomNumbers.concat(getRandomNumber(2,goodAndBad).randomNumbers);

            guess.value = firstTry.join("");
        }

        check();

        if(secnariosCounter > 1 && gameOver){
            data.forEach((obj,index)=>{
                if(obj.sum == 2 && index == 3 && secnariosCounter == 2){
                    
                    good = arrayMethod(obj.value,bad,"difference");
                    
                    tempGoodAndBad = arrayMethod(goodAndBad,obj.value,"difference");
                    
                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    nextTry = getRandomNumber(2,bad).randomNumbers.concat(getRandomNumber(1,good).randomNumbers,tempGoodOrBad);
                }

                if(obj.sum == 1 && index == 3 && secnariosCounter == 2){
                    
                    good = arrayMethod(goodAndBad,obj.value,"difference");
                    
                    tempGoodAndBad = arrayMethod(obj.value,bad,"difference");
                    
                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    nextTry = getRandomNumber(2,bad).randomNumbers.concat(getRandomNumber(1,good).randomNumbers,tempGoodOrBad);
                }

                if(obj.sum == 1 && index == 4 && secnariosCounter == 3){
                    good = good.concat(arrayMethod(tempGoodAndBad,tempGoodOrBad,"difference"));

                    nextTry = getRandomNumber(2,good).randomNumbers.concat(getRandomNumber(2,goodAndBad2).randomNumbers);
                }

                if(obj.sum == 2 && index == 4 && secnariosCounter == 3){
                    good = good.concat(tempGoodOrBad);

                    nextTry = getRandomNumber(2,good).randomNumbers.concat(getRandomNumber(2,goodAndBad2).randomNumbers);
                }

                if(obj.sum == 2 && index == 5 && secnariosCounter == 4){
                    tempGoodAndBad = arrayMethod(goodAndBad2,obj.value,"difference");

                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    nextTry = getRandomNumber(3,good).randomNumbers.concat(tempGoodOrBad);
                }

                if(obj.sum == 3 && index == 5 && secnariosCounter == 4){
                    tempGoodAndBad = arrayMethod(obj.value,good,"difference");

                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    nextTry = getRandomNumber(3,good).randomNumbers.concat(tempGoodOrBad);
                }

                if(obj.sum == 3 && index == 6 && secnariosCounter == 5){
                    good = good.concat(arrayMethod(tempGoodAndBad,tempGoodOrBad,"difference"));

                    nextTry = good;
                }
            });

            guess.value = getRandomNumber(4,nextTry).randomNumbers.join("");
        }

    }

    ////////////////////////////////////////////////////// Case 6 (1 & 1)/////////////////////////////////////////////////////
    if(key1Total == 1  && key2Total == 1){
        secnariosCounter++;

        

        if(secnariosCounter === 1){
            good = storedData[2].value;

            goodAndBad = storedData[0].value;

            goodAndBad2 = storedData[1].value;

            tempGoodAndBad = getRandomNumber(2,goodAndBad).randomNumbers;

            firstTry = getRandomNumber(2,good).randomNumbers.concat(tempGoodAndBad);

            guess.value = firstTry.join("");
        }

        check();

        if(secnariosCounter > 1 && gameOver){
            data.forEach((obj,index)=>{
                if(obj.sum == 2 && index == 3 && secnariosCounter == 2){
                    bad = tempGoodAndBad;

                    tempGoodAndBad = arrayMethod(goodAndBad,tempGoodAndBad,"difference");

                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    nextTry = good.concat(getRandomNumber(1,bad).randomNumbers,tempGoodOrBad);
                }

                if(obj.sum == 3 && index == 3 && secnariosCounter == 2){
                    bad = arrayMethod(goodAndBad,tempGoodAndBad,"difference");

                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    nextTry = good.concat(getRandomNumber(1,bad).randomNumbers,tempGoodOrBad);
                }

                if(obj.sum == 2 && index == 4 && secnariosCounter == 3){
                    good = good.concat(arrayMethod(tempGoodAndBad,tempGoodOrBad,"difference"));

                    tempGoodAndBad = getRandomNumber(2,goodAndBad2).randomNumbers;

                    nextTry = getRandomNumber(2,good).randomNumbers.concat(tempGoodAndBad);
                }

                if(obj.sum == 3 && index == 4 && secnariosCounter == 3){
                    good = good.concat(tempGoodOrBad);

                    tempGoodAndBad = getRandomNumber(2,goodAndBad2).randomNumbers;

                    nextTry = getRandomNumber(2,good).randomNumbers.concat(tempGoodAndBad);
                }

                if(obj.sum == 2 && index == 5 && secnariosCounter == 4){
                    tempGoodAndBad = arrayMethod(goodAndBad2,tempGoodAndBad,"difference");

                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    nextTry = good.concat(tempGoodOrBad);
                }

                if(obj.sum == 3 && index == 5 && secnariosCounter == 4){
                    tempGoodOrBad = getRandomNumber(1,tempGoodAndBad).randomNumbers;

                    nextTry = good.concat(tempGoodOrBad);
                }

                if(obj.sum == 3 && index == 6 && secnariosCounter == 5){
                    good = good.concat(arrayMethod(tempGoodAndBad,tempGoodOrBad,"difference"));

                    nextTry = good;
                }
            });

            guess.value = getRandomNumber(4,nextTry).randomNumbers.join("");
        }
    }
}
