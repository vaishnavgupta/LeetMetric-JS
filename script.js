document.addEventListener("DOMContentLoaded",function(){
    const userInputField = document.getElementById("username-input");
    const searchBtn = document.getElementById("search-btn");
    const statsContainer = document.querySelector(".statsContainer");
    const easyProgressCircle = document.querySelector(".easyProgress");
    const mediumProgressCircle = document.querySelector(".mediumProgress");
    const hardProgressCircle = document.querySelector(".hardProgress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const statsCardsContainer = document.querySelector(".statsCardsContainer");


    function validateUserName(username){
        if(username.trim() === ""){
            alert("Please enter a valid username");
            return false;
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9_]{3,19}$/;
        const isValid = regex.test(username);
        if(!isValid){
            alert("Please enter a valid username");
        
        }
        return isValid;
    }

    function updateProgressCircle(solved,total,label,circle){
        const progressPercentage = (solved/total) * 100;
        circle.style.setProperty("--progress-degree",`${progressPercentage}%`);
        label.textContent = `${solved} / ${total}`
    }

    function displayUserData(parsedData){
        const totalEasySolved = parsedData.easySolved;
        const totalMediumSolved = parsedData.mediumSolved;
        const totalHardSolved = parsedData.hardSolved;
        const totalSolved = parsedData.totalSolved;
        const totalEasy = parsedData.totalEasy;
        const totalMedium = parsedData.totalMedium;
        const totalHard = parsedData.totalHard;
        const acceptanceRate = parsedData.acceptanceRate;
        const ranking = parsedData.ranking;
        const contributionPoints = parsedData.contributionPoints;

        //easy
        updateProgressCircle(totalEasySolved,totalEasy,easyLabel,easyProgressCircle);
        //medium
        updateProgressCircle(totalMediumSolved,totalMedium,mediumLabel,mediumProgressCircle);
        //hard
        updateProgressCircle(totalHardSolved,totalHard,hardLabel,hardProgressCircle);

        const cardData = [
            {
                label : "Total Solved",
                value : totalSolved
            },
            {
                label: "Acceptance Rate",
                value : `${acceptanceRate}%`
            },
            {
                label : "Ranking",
                value : ranking
            },
            {
                label : "Contribution Points",
                value : contributionPoints
            }
        ]
        console.log(cardData);
        statsCardsContainer.innerHTML = cardData.map(
            data => 
                 `
                <div class = "card">
                <h3>${data.label}</h3>
                <p>${data.value}</p>
                </div>`
            
        ).join("");
    }


    async function getData(username){
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try{
            searchBtn.textContent = "Searching...";
            searchBtn.disabled = true;
            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch data");
            }
            const parsedData = await response.json();
            console.log(parsedData);
            displayUserData(parsedData);
        }
        catch(error){
            statsContainer.innerHTML = `<h2>No data found for ${username}</h2>`;
            console.error("Error fetching data:", error);
        }
        finally{
            searchBtn.textContent = "Search";
            searchBtn.disabled = false;
        }
    }

    searchBtn.addEventListener('click',function(){
        const username = userInputField.value;
        console.log(username);
        if(validateUserName(username)){
            getData(username);
        }
    })
})