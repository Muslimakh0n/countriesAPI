// Bismillah

let mainDiv = document.querySelector(".main");
let container = document.querySelector(".about-data");
let filter = document.getElementById("filter");
let search = document.getElementById("search");
let theme = localStorage.getItem("theme") || "light";
const toggleTheme = () => {
  if (theme == "light") {
    theme = "dark";
  } else {
    theme = "light";
  }
  localStorage.setItem("theme", theme);
  document.body.className = theme;
};

// ----------------------------------------------------------------------------------------------------------------

const URL = "https://restcountries.com/v3.1";

async function fetchData(url) {
  const res = await fetch(`${URL}/${url}`);
  const data = await res.json();
  console.log(data);
  return data;
}

// ---------------------------------------------------------------------------------------------------------------

// console.log(container);
// Yo Allohiim, need to delete consols, don't forgot!

async function goToAbout(name) {
  console.log(name);
  const data = await fetchData("all");
  console.log("about", data);
  const el = data.find((element) => element.name.common == name);
  let currency = el.currencies ? Object.values(el.currencies)[0] : 0;
  let language = el.languages ? Object.values(el.languages)[0] : "no language";
  console.log(currency.name);
  container.style.display = "flex";
  container.innerHTML = `<div class="about-card container">
  <div class="back-btn mb-5 d-block py-2 px-3 bg-white shadow rounded" onclick="document.querySelector('.about-data').style.display='none'">
Go Back
  </div>
  <div
    class="mt-2 row gap-5 gap-lg-0"
  >
    <div class="img-box col-12 col-lg-6">
      <img src="${el.flags.png}" alt="${el.name.official}" />
    </div>

    <div class="col-12 col-lg-6">
      <div>
        <h2 class="mb-5">${el.name.common}</h2>
        <div class="d-flex justify-content-between">
          <ul class="list-unstyled">
            <li class="mb-3">
              <strong>Native:${el.name.official} </strong>
            </li>
            <li class="mb-3">
              <strong>Population:${el.population} </strong>
            </li>
            <li class="mb-3">
              <strong>Region:${el.region} </strong>
            </li>
            <li class="mb-3">
              <strong>Sub Region :${el.subregion || "no subregion"} </strong>
            </li>
            <li class="mb-3">
              <strong>Capital:${el.capital} </strong>
            </li>
          </ul>
          <ul class="list-unstyled">
            <li class="mb-3">
              <strong>Top Level Domain: :${el.tld} </strong>
            </li>
            <li class="mb-3">
              <strong>Currencies:${
                currency ? currency.name : "no currency"
              }</strong>
            </li>
            <li class="mb-3">
              <strong>
                Languages: ${language}
              </strong>
            </li>
          </ul>
        </div>
      </div>

      <div class="d-flex gap-5 flex-wrap align-items-center">
        <span>
          <strong>Border Countries:</strong>
        </span>
        <strong class="borders">${el.borders || "no borders"}</strong>
      </div>
    </div>
  </div>
</div>
   `;
}

function countryCard(flags, name, population, region, capital) {
  return `<div onclick="goToAbout('${name.common}')" class="col-12 col-md-6 col-lg-4 col-xl-3 mb-3">
  <div class="card">
  <div class="card-border">
  <img
    class="img-fluid rounded-0 rounded-top"
    src="${flags.png}"
    alt="${name.common}"
  />
  <div class="card-body">
    <h4>${name.common}</h4>
    <ul class="list-unstyled">
      <li>
        <strong>Population: </strong>
        ${population}
      </li>
      <li>
        <strong>Region: </strong>
        ${region}
      </li>
      <li>
        <strong>Capital: </strong>
        ${capital}
      </li>
    </ul>
  </div>
</div>
  </div>
</div>`;
}

// ---------------------------------------------------------------------------------------------------------------

async function renderCountries() {
  const data = await fetchData("all");
  console.log("fetched", data);
  mainDiv.innerHTML = "";
  for (const el of data) {
    mainDiv.innerHTML += countryCard(
      el.flags,
      el.name,
      el.population,
      el.region,
      el.capital
    );
  }
}
renderCountries();

// ---------------------------------------------------------------------------------------------------------------

async function renderNames() {
  const data = await fetchData("all");
  const regions = [];
  for (const el of data) {
    if (!regions.includes(el.region)) {
      regions.push(el.region);
    }
  }
  for (const el of regions) {
    filter.innerHTML += `<option>${el}</option>`;
  }
}
renderNames();

filter.onchange = async () => {
  if (filter.value == "Filter by Region") {
    renderCountries();
  } else {
    const data = await fetchData(`/region/${filter.value}`);
    mainDiv.innerHTML = "";
    for (const el of data) {
      mainDiv.innerHTML += countryCard(
        el.flags,
        el.name,
        el.population,
        el.region,
        el.capital
      );
    }
  }
};

// ---------------------------------------------------------------------------------------------------------------

search.oninput = async () => {
  const data = await fetchData(`/name/${search.value}`);
  const searchData = data.filter((el) => el.region == filter.value);
  if (search.value == "") {
    const data = await fetchData(`/region/${filter.value}`);
    mainDiv.innerHTML = "";
    for (const el of data) {
      mainDiv.innerHTML += countryCard(
        el.flags,
        el.name,
        el.population,
        el.region,
        el.capital
      );
    }
  } else {
    console.log(searchData);
    mainDiv.innerHTML = "";
    for (const el of searchData) {
      mainDiv.innerHTML += countryCard(
        el.flags,
        el.name,
        el.population,
        el.region,
        el.capital
      );
    }
  }
};
