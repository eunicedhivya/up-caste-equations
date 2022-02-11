var blackOut = document.getElementsByClassName("UPCasteEq_model_blackout")[0];
var modelBox = document.getElementsByClassName("UPCasteEq_model")[0];
var result = document.getElementById("result");
var methodology = document.getElementById("methodology");

var phaseName = document.getElementById("phase");
var constName = document.getElementById("constituency");
var candCasteName = document.getElementById("candCaste");
var candPartyName = document.getElementById("candParty");
var errors = document.getElementById("errors");

document.getElementById("phase").addEventListener("change", function(){
    var phaseno = this.value;
    var fdData = rawData.filter(function(obj){
        return obj['phase'] === phaseno;
    });
    // console.log(fdData, fdData.length);
    createDropdown("constituency", fdData, "constituency");
});

document.getElementById("constituency").addEventListener("change", function(){
    var val = this.value;
    
    var fdData = rawData.filter(function(obj){
        return obj['constituency'] === val;
    });

    document.getElementById("name2017").innerHTML = fdData[0]["winnerName(2017)"];
    document.getElementById("won2017").innerHTML = fdData[0]["winningParty(2017)"];
    document.getElementById("caste2017").innerHTML = fdData[0]["casteCandidate(2017)"];
    
    var casteData = [];
    casteData.push(fdData[0]['first']);
    casteData.push(fdData[0]['second']);
    casteData.push(fdData[0]['third']);

    // console.log("casteData", casteData)
    createDropdown("candCaste", casteData, "caste");
    createDropdown("candParty", partyList, "party");
    createDropdown("candCategory", cand_category, "category");
});

document.getElementById("submit").addEventListener("click", function(){
   var errorVal = [];
   var tempPhase = document.getElementById("phase").value;
   var tempConst = document.getElementById("constituency").value;
   var tempCaste = document.getElementById("candCaste").value;
   var tempParty = document.getElementById("candParty").value;
   var tempRange = document.getElementById("probable_range").value;

   if(tempPhase === "Select phase"){
       phaseName.style.border = "2px solid red";
       errorVal.push("phase")
   }else{
       phaseName.style.border = "none";
   }
   if(tempConst === "Select constituency"){
       constName.style.border = "2px solid red";
       errorVal.push("constituency")
   }else{
       constName.style.border = "none";
   }
   
   if(tempCaste === "Select caste"){
       candCasteName.style.border = "2px solid red";
       errorVal.push("caste")
   }else{
       candCasteName.style.border = "none";
   }

   if(tempParty === "Select party"){
       candPartyName.style.border = "2px solid red";
       errorVal.push("party")
   }else{
       candPartyName.style.border = "none";
   }

   if((tempConst !== "Select constituency") && (tempCaste !== "Select caste") && (tempParty !== "Select party")){
        showResult(tempRange, getProbability(tempConst, tempCaste, tempParty), tempConst, tempCaste, tempParty,);
        errors.innerHTML = "";
   }else{
       var errorMsg = errorVal.join(", ") + " required"
       console.log(errorMsg);
       errors.innerHTML = errorMsg;
   }
})

function showResult(userResult, modelResult, constituency, caste, party){
    blackOut.style.display = "block";
    modelBox.style.display = "block";
    result.style.display = "block";
    methodology.style.display = "none";
    document.getElementById("chosenConst").innerHTML = constituency;
    document.getElementById("chosenParty").innerHTML = party;
    document.getElementById("chosenCaste").innerHTML = caste;
    document.getElementById("userPrediction").innerHTML = userResult+"%";
    document.getElementById("modelPrediction").innerHTML = modelResult+"%";
}

document.getElementById("closeModel").addEventListener("click", function(){
    blackOut.style.display = "none";
    modelBox.style.display = "none";
    result.style.display = "none";
    methodology.style.display = "none";
})
document.getElementById("closeModel2").addEventListener("click", function(){
    blackOut.style.display = "none";
    modelBox.style.display = "none";
    result.style.display = "none";
    methodology.style.display = "none";
})
document.getElementById("method").addEventListener("click", function(){
    blackOut.style.display = "block";
    modelBox.style.display = "block";
    result.style.display = "none";
    methodology.style.display = "block";
})
document.getElementById("reset").addEventListener("click", function(){
    document.getElementById("probable_range").value = 0;
    document.getElementById("phase").selectedIndex = 0;
    document.getElementById("constituency").selectedIndex = 0;
    document.getElementById("candParty").selectedIndex = 0;
    document.getElementById("candCaste").selectedIndex = 0;
    document.getElementById("caste_list").innerHTML = '<li>-</li><li>-</li><li>-</li>';
    document.getElementById("name2017").innerHTML = "";
    document.getElementById("won2017").innerHTML = "";
    document.getElementById("caste2017").innerHTML = "";
})

function getProbability(constName, caste, party, category){
    var parameters = []

    var fdData = rawData.filter(function(obj){
        return obj['constituency'] === constName;
    });
    

    // Check if VoterMargin is greater than 5
    parameters.push(getBooleanForOneCond(parseFloat(fdData[0]["voterMargin"]) > 5, 1, 0))

    // Check if Anti-Incumbency
    parameters.push(getBooleanForOneCond(fdData[0]["winningParty(2012)"] === fdData[0]["winningParty(2017)"], 0.5, 1))
        
    // Check if Input Caste is equal to first Dominant Caste
    parameters.push(getBooleanForOneCond(caste === fdData[0]["first"], 1, 0))

    // Check if Input Caste is equal to second Dominant Caste
    parameters.push(getBooleanForOneCond(caste === fdData[0]["second"], 1, 0))

    // Check if Input Caste is equal to third Dominant Caste
    parameters.push(getBooleanForOneCond(caste === fdData[0]["third"], 1, 0))

    // Check if Input Caste is equal to first Dominant and check if Input Party is equal to first Party Preference
    parameters.push(getBooleanForTwoConds(caste === fdData[0]["first"], party === party === fdData[0]["firstPreference"], 1, 0))
    
    // Check if Input Caste is equal to second Dominant and check if Input Party is equal to second Caste Preference
    parameters.push(getBooleanForTwoConds(caste === fdData[0]["second"], party === fdData[0]["secondPreference"], 1, 0))
    
    // Check if Input Caste is equal to second Dominant and check if Input Party is equal to second Caste Preference
    parameters.push(getBooleanForTwoConds(caste === fdData[0]["third"], party === fdData[0]["thirdPreference"], 1, 0))

    // party is equal to first Caste Preference
    parameters.push(getBooleanForOneCond(party === fdData[0]["firstPreference"], 1, 0))

    // party is equal to second Caste Preference
    parameters.push(getBooleanForOneCond(party === fdData[0]["secondPreference"], 1, 0))

    // party is equal to third Caste Preference
    parameters.push(getBooleanForOneCond(party === fdData[0]["thirdPreference"], 1, 0))

    var sumArr = parameters.reduce(function(a, b){
        return a+b;
    })

    var output = (sumArr/8 * 100).toFixed(1);

    console.log(parameters);
    console.log(output);

    return output;
    

}

function getBooleanForTwoConds(cond1, cond2, truVal, falVal){
    if(cond1 && cond2){
        return truVal
    }else{
        return falVal
    }
}
function getBooleanForOneCond(cond, truVal, falVal){
    if(cond){
        return truVal
    }else{
        return falVal
    }
}


function createDropdown(selector, data, type){

    var dropdownCont =  document.getElementById(selector)

    dropdownCont.innerHTML = '';

    var dOption = document.createElement("option")
        dOption.innerHTML = "Select "+type;
    
    dropdownCont.appendChild(dOption);

    if(type === "constituency"){

        data.forEach(function(obj){
            var option = document.createElement("option");
            option.value = obj[type];
            option.innerHTML = obj[type];
            dropdownCont.appendChild(option);
        });

    }else if(type === "caste" || type === "party" || type === "category"){

        data.forEach(function(obj){
            var option = document.createElement("option");
            option.value = obj;
            option.innerHTML = obj;
            dropdownCont.appendChild(option);
        });

        if(type === "caste"){
            var candList = document.getElementById("caste_list");
            candList.innerHTML = "";
            data.forEach(function(obj){
                var li = document.createElement("li");
                li.innerHTML = obj;
                candList.appendChild(li);
            });
        }
        

    }

}
