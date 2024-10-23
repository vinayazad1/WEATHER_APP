const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather");

const userContainer = document.querySelector(".weather-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const errorControl = document.querySelector(".error-control");

//initially variables need??

let currentTab = userTab;
const API_KEY = "ab47105011d20961afd2eff5bce1e0df";
currentTab.classList.add("current-tab");
getfromSessionStorage();


function switchTab(clickedTab){
    if(clickedTab!= currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
        

    if(!searchForm.classList.contains("active")){
        //kya search form wala container is invisible , if yes then
        //make it visible;
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }else{
    //main pehle search wala tab pr tha ab your weather tab visible
     //karna hai
    searchForm.classList.remove("active");
    userInfoContainer.classList.remove("active");
    //ab main your weather tab me aagya hu , toh weather bhi dsiplay
    //karna padega ,so let's  check local storage first 
    //for cordinates , if we haved saved them there.
    getfromSessionStorage();
    }
    }
}


userTab.addEventListener("click", () => {
    //pass clicked tab as input parameter
    switchTab(userTab);
})

searchTab.addEventListener("click", () => {
    //pass clicked tab as input parameter
    switchTab(searchTab);
})

//check if cordinates are already present in session storage '
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates")
    if(!localCoordinates){
        //agar local coordinates nahin mile 
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    //make grantcontainer invisible
    console.log("hua 2");
    grantAccessContainer.classList.remove("active");
    //make loader visible 
    loadingScreen.classList.add("active");



    //API CALL
    try{
        const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        loadingScreen.classList.remove("active");
        errorControl.classList.remove("active");

        userInfoContainer.classList.add("active");
         console.log("hua 2.5");
        renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        console.log("hai kuch");
    }
}

function renderWeatherInfo(weatherInfo){
    //firstly , we have to fetch the elements
    console.log("hua 3")
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weatherInfo object and put it UI elements
    console.log("hua 3")
    cityName.innerText =  weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `https://api.openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText =`${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPositon);
        console.log("hua1");
    }
    else{
        alert("your browser dos not support this file");
        
    }
}

function showPositon(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        
    }
     console.log(userCoordinates);
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}


const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else
    fetchSearchWeatherInfo(cityName);
})


async function fetchSearchWeatherInfo(city){
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    console.log("haanji");

    try{
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        if (!response.ok) {
            throw new Error();
        }
        const data = await response.json();
        
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        console.log("yha hu1")
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.remove("active");
        errorControl.classList.add("active");

    }
    

}

