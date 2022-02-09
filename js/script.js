var blackOut = document.getElementsByClassName("UPCasteEq_model_blackout")[0];
var modelBox = document.getElementsByClassName("UPCasteEq_model")[0];
var result = document.getElementById("result");
var methodology = document.getElementById("methodology");

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
    
    var casteData = [];
    casteData.push(fdData[0]['first']);
    casteData.push(fdData[0]['second']);
    casteData.push(fdData[0]['third']);

    // console.log("casteData", casteData)
    createDropdown("candCaste", casteData, "caste");
    createDropdown("candParty", partyList, "party");
    createDropdown("candCategory", cand_category, "category");
});
document.getElementById("probable_range").addEventListener("change", function(){
    var val = this.value;
    console.log(val);
    // var fdData = rawData.filter(function(obj){
    //     return obj['constituency'] === val;
    // });
    
    // var casteData = [];
    // casteData.push(fdData[0]['first']);
    // casteData.push(fdData[0]['second']);
    // casteData.push(fdData[0]['third']);

    // // console.log("casteData", casteData)
    // createDropdown("candCaste", casteData, "caste");
    // createDropdown("candParty", partyList, "party");
    // createDropdown("candCategory", cand_category, "category");
});

document.getElementById("submit").addEventListener("click", function(){
   var tempPhase = document.getElementById("phase").value;
   var tempConst = document.getElementById("constituency").value;
   var tempCaste = document.getElementById("candCaste").value;
   var tempParty = document.getElementById("candParty").value;
   var tempCategory = document.getElementById("candCategory").value;
   var tempRange = document.getElementById("probable_range").value;
   console.log(tempPhase, tempConst, tempCaste, tempParty, tempCategory, tempRange);
   blackOut.style.display = "block";
   modelBox.style.display = "block";
   getProbability(tempConst, tempCaste, tempParty, tempCategory);
   showResult(tempRange, getProbability(tempConst, tempCaste, tempParty, tempCategory), tempConst, tempCaste, tempParty,);
})

function showResult(userResult, modelResult, constituency, caste, party){
    blackOut.style.display = "block";
    modelBox.style.display = "block";
    result.style.display = "block";
    methodology.style.display = "none";
    document.getElementById("chosenConst").innerHTML = constituency;
    document.getElementById("chosenParty").innerHTML = caste;
    document.getElementById("chosenCaste").innerHTML = party;
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
    document.getElementById("candCategory").selectedIndex = 0;
    document.getElementById("caste_list").innerHTML = '<li>-</li><li>-</li><li>-</li>';
})

function getProbability(constName, caste, party, category){
    var parameters = []

    var fdData = rawData.filter(function(obj){
        return obj['constituency'] === constName;
    });
    

    // Check if VoterMargin is greater than 5
    // console.log("Check if Voter Margin is greater Than 5", fdData[0]["voterMargin"]);
    // if(parseFloat(fdData[0]["voterMargin"]) > 5){
    //     console.log("true", 1);
    // }else{
    //     console.log("false", 0);
    // }
    // console.log(getBooleanForOneCond(parseFloat(fdData[0]["voterMargin"]) > 5, 1, 0));
    parameters.push(getBooleanForOneCond(parseFloat(fdData[0]["voterMargin"]) > 5, 1, 0))


    // Check if Anti-Incumbency
    // console.log("Check if Anti-Incumbency");
    // if(fdData[0]["winningParty(2012)"] === fdData[0]["winningParty(2017)" === party]){
    //     console.log("true", 0.5);
    // }else{
    //     console.log("false", 1);
    // }
    // console.log(getBooleanForOneCond(fdData[0]["winningParty(2012)"] === fdData[0]["winningParty(2017)"], 0.5, 1));
    parameters.push(getBooleanForOneCond(fdData[0]["winningParty(2012)"] === fdData[0]["winningParty(2017)"], 0.5, 1))
    // console.log(getBooleanForOneCond(fdData[0]["winningParty(2012)"] === fdData[0]["winningParty(2017)" === party], 0.5, 1));
    // parameters.push(getBooleanForOneCond(fdData[0]["winningParty(2012)"] === fdData[0]["winningParty(2017)" === party], 0.5, 1))
    
    // Check if Input Caste is equal to first Dominant Caste
    // console.log("Check if Input Caste is equal to first Dominant Caste");
    // if(caste === fdData[0]["first"]){
    //     console.log("true", 1);
    // }else{
    //     console.log("false", 0);
    // }
    // console.log(getBooleanForOneCond(caste === fdData[0]["first"], 1, 0));
    parameters.push(getBooleanForOneCond(caste === fdData[0]["first"], 1, 0))

    // Check if Input Caste is equal to second Dominant Caste
    // console.log("Check if Input Caste is equal to second Dominant Caste");
    // if(caste === fdData[0]["second"]){
    //     console.log("true", 1);
    // }else{
    //     console.log("false", 0);
    // }
    // console.log(getBooleanForOneCond(caste === fdData[0]["second"], 1, 0));
    parameters.push(getBooleanForOneCond(caste === fdData[0]["second"], 1, 0))

    // Check if Input Caste is equal to third Dominant Caste
    // console.log("Check if Input Caste is equal to first Dominant Caste");
    // if(caste === fdData[0]["third"]){
    //     console.log("true", 1);
    // }else{
    //     console.log("false", 0);
    // }
    // console.log(getBooleanForOneCond(caste === fdData[0]["third"], 1, 0));
    parameters.push(getBooleanForOneCond(caste === fdData[0]["third"], 1, 0))

    // Check if Input Caste is equal to first Dominant and check if Input Party is equal to first Party Preference
    // console.log("Check if Input Caste is equal to first Dominant and check if Input Party is equal to first Caste Preference");
    // if(caste === fdData[0]["first"] && party === fdData[0]["firstPreference"]){
    //     console.log("true", 1);
    // }else{
    //     console.log("false", 0);
    // }
    // console.log(getBooleanForTwoConds(caste === fdData[0]["first"], party === party === fdData[0]["firstPreference"], 1, 0))
    parameters.push(getBooleanForTwoConds(caste === fdData[0]["first"], party === party === fdData[0]["firstPreference"], 1, 0))
    
    // Check if Input Caste is equal to second Dominant and check if Input Party is equal to second Caste Preference
    // console.log("Check if Input Caste is equal to second Dominant and check if Input Party is equal to second Caste Preference");
    // if(caste === fdData[0]["second"] && party === fdData[0]["secondPreference"]){
    //     console.log("true", 1);
    // }else{
    //     console.log("false", 0);
    // }
    // console.log(getBooleanForTwoConds(caste === fdData[0]["second"], party === fdData[0]["secondPreference"], 1, 0))
    parameters.push(getBooleanForTwoConds(caste === fdData[0]["second"], party === fdData[0]["secondPreference"], 1, 0))
    
    // Check if Input Caste is equal to second Dominant and check if Input Party is equal to second Caste Preference
    // console.log("Check if Input Caste is equal to third Dominant and check if Input Party is equal to third Caste Preference");
    // if(caste === fdData[0]["third"] && party === fdData[0]["thirdPreference"]){
    //     console.log("true", 1);
    // }else{
    //     console.log("false", 0);
    // }
    // console.log(getBooleanForTwoConds(caste === fdData[0]["third"], party === fdData[0]["thirdPreference"], 1, 0))
    parameters.push(getBooleanForTwoConds(caste === fdData[0]["third"], party === fdData[0]["thirdPreference"], 1, 0))
    
    // Check if Input Caste is equal to second Dominant and check if Input Party is equal to second Caste Preference
    // console.log("Check if Input Const ScCode is 2 and ");
    // if(parseInt(fdData[0]["scCode"]) === 2 && category === "SC"){
    //     console.log("true", 1);
    // }else{
    //     console.log("false", 0);
    // }
    // console.log(getBooleanForTwoConds(parseInt(fdData[0]["scCode"]) === 2, category === "SC", 1, 0))
    parameters.push(getBooleanForTwoConds(parseInt(fdData[0]["scCode"]) === 2, category === "SC", 1, 0))

    // party is equal to first Caste Preference
    // console.log("party is equal to first Caste Preference");
    // if(party === fdData[0]["firstPreference"]){
    //     console.log("true", 1);
    // }else{
    //     console.log("false", 0);
    // }
    // console.log(getBooleanForOneCond(party === fdData[0]["firstPreference"], 1, 0));
    parameters.push(getBooleanForOneCond(party === fdData[0]["firstPreference"], 1, 0))

    // party is equal to second Caste Preference
    // console.log("party is equal to second Caste Preference");
    // if(party === fdData[0]["secondPreference"]){
    //     console.log("true", 1);
    // }else{
    //     console.log("false", 0);
    // }
    // console.log(getBooleanForOneCond(party === fdData[0]["secondPreference"], 1, 0));
    parameters.push(getBooleanForOneCond(party === fdData[0]["secondPreference"], 1, 0))

    // party is equal to third Caste Preference
    // console.log("party is equal to third Caste Preference");
    // if(party === fdData[0]["thirdPreference"]){
    //     console.log("true", 1);
    // }else{
    //     console.log("false", 0);
    // }
    // console.log(getBooleanForOneCond(party === fdData[0]["thirdPreference"], 1, 0));
    parameters.push(getBooleanForOneCond(party === fdData[0]["thirdPreference"], 1, 0))

    var sumArr = parameters.reduce(function(a, b){
        return a+b;
    })

    var output = (sumArr/8 * 100).toFixed(1);

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
        // dOption.value = "Select "+type;
    
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
