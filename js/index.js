const container = document.querySelector(".container"),
  popUp = document.querySelector(".container__popUp"),
  map = document.getElementById("map"),
  mapElements = map.children;

const getWindowSize = () => {
  return {
    windowX: window.innerWidth,
    windowY: window.innerHeight
  }
}

const getData = async () => {
  const API = "https://api.covid19api.com/summary";

  try {
    const response = await fetch(API);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

if (sessionStorage.getItem("countriesInfo") === null) {
  getData().then(({ Global, Countries, Date }) => {
    try {
      const countriesInfo = {
        global: Global,
        countries: Countries,
        date: Date,
      };

      sessionStorage.setItem("countriesInfo", JSON.stringify(countriesInfo));
    } catch (error) {
      console.error(error);
    }
  });
}

const selectedCountry = ({ countries }, target) => {
  const country = countries.find((country) => target.id == country.CountryCode);

  const other = {
    Country: "No data",
    TotalConfirmed: "no data",
  };

  return country === undefined ? other : country;
};

const getMousePosition = (e) => {
  return {
    mouseX: e.clientX,
    mouseY: e.clientY,
  };
};

const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const createPopUp = ({ Country, TotalConfirmed }) => {
  const name = document.querySelector(".container__popUp__name"),
    confirmed = document.querySelector(".container__popUp__confirmed");

  name.innerHTML = Country;
  confirmed.innerHTML = `Total Confirmed: ${numberWithCommas(TotalConfirmed)}`;
};

const positionPopUp = ({ mouseX, mouseY }) => {
  const OFFSET = 50;
  let offsetX = 0,
    offsetY = 0;

  const windowX = getWindowSize().windowX,
    windowY = getWindowSize().windowY;

  if (mouseY < windowY / 2) offsetY = OFFSET;
  else offsetY = -2*OFFSET;

  if (mouseX < windowX / 2) offsetX = OFFSET;
  else offsetX = -6*OFFSET;

  popUp.style.transform = `scale(1)`;
  popUp.style.top = `${mouseY + offsetY}px`;
  popUp.style.left = `${mouseX + offsetX}px`;
};

const fillCountry = (target) => {
    target.setAttribute("fill", "red");
    target.addEventListener("mouseout", (e) => e.target.setAttribute("fill", "black"));
};

map.addEventListener("mousemove", (e) => {
  const target = e.target;
  const countriesInfo = JSON.parse(sessionStorage.getItem("countriesInfo"));

  if (target.id !== "map") {
    const country = selectedCountry(countriesInfo, target);

    fillCountry(target);
    positionPopUp(getMousePosition(e));
    createPopUp(country);
  } else {
    popUp.style.transform = `scale(0)`;
    return;
  }
});
