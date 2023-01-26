
import axios from "axios"

type Country = {
  name: string
  code: string
  capital: string
  region: string
  currency: {
    code: string
    name: string
    symbol: string
  }
  language: {
    code: string
    name: string
  }
  flag: string
  dialling_code: string
  isoCode: string
}

const tableBody = document.querySelector(".table__body")
const arrowButton = document.querySelector(".btn-arrow")
const arrow = document.querySelector(".arrow")
const buttonLoad = document.querySelector(".btn__load")
const searchBtn = document.querySelector<HTMLButtonElement>(".srch__btn")
const searchCountry = document.querySelector<HTMLInputElement>(".srch__input-country")
const searchCapital = document.querySelector<HTMLInputElement>(".srch__input-capital")
const searchCurrency = document.querySelector<HTMLInputElement>(".srch__input-currency")
const searchLanguage = document.querySelector<HTMLInputElement>(".srch__input-language")

const searchString = new URLSearchParams() 

searchCountry.addEventListener("input", function (e: Event) {
  const target = e.target as HTMLInputElement        
  // if the input is empty, remove the search parameter
  if (target.value === "") {
    searchString.delete("name")
  } else {
    let val = target.value;
    let firstLetter = val.charAt(0).toUpperCase() + val.slice(1);
    searchString.set("name", firstLetter)
    console.log(searchString.toString())
  }
})

searchCapital.addEventListener("input", function (e: Event) {
  const target = e.target as HTMLInputElement 

  if (target.value === "") {
    searchString.delete("name")
  } else {
    let val = target.value;
    let firstLetter = val.charAt(0).toUpperCase() + val.slice(1);
    searchString.set("capital", firstLetter)
    console.log(searchString.toString())
  }
})

searchCurrency.addEventListener("input", function (e: Event) {
  const target = e.target as HTMLInputElement
  console.log(target.value.toUpperCase())
  
  if (target.value === "") {
    searchString.delete("name")
    searchString.delete("capital")
  } else {
    let val = target.value
    let upperCase = val.toUpperCase()
    searchString.set("currency.code", upperCase)
    console.log(searchString.toString())
  }
}) 

searchLanguage.addEventListener("input", function (e: Event) {
  const target = e.target as HTMLInputElement
  
  if (target.value === "") {
    searchString.delete("name")
    searchString.delete("capital")
    searchString.delete("currency.code")
  } else {
    let val = target.value;
    let firstLetter = val.charAt(0).toUpperCase() + val.slice(1);
    searchString.set("language.name", firstLetter)
    console.log(searchString.toString())
  }
})

searchBtn.addEventListener("click", (event) => {
  event.preventDefault()
  getCountries(searchString.toString())
})

const getCountries = (searchParams: string) => {
  axios
    .get<Country[]>(`http://localhost:3004/countries?${searchParams}`)
    .then(({ data }) => {
      const countries = data
      tableBody.innerHTML = ""
      countries.forEach((country: Country) => {
        const tableRow = document.createElement("tr")
        tableRow.classList.add("table__row")
        tableRow.innerHTML = `
          <td>${country.name}</td>
          <td>${country.capital}</td>
          <td>${country.currency.code}</td>
          <td>${country.language.name}</td>
          `
        tableBody.appendChild(tableRow)
      })
    })
}

const generateRows = () => {
  axios
    .get<Country[]>("http://localhost:3004/countries?_limit=20")
    .then(({ data }) => {
      const countries = data
      countries.forEach((country: Country) => {
        const tableRow = document.createElement("tr")
        tableRow.classList.add("table__row")
        tableRow.innerHTML = `
          <td>${country.name}</td>
          <td>${country.capital}</td>
          <td>${country.currency.code}</td>
          <td>${country.language.name}</td>
          `
        tableBody.appendChild(tableRow)
      })
    })
}
generateRows()

let page = 1
buttonLoad.addEventListener("click", () => {
  page += 1
  axios.get<Country[]>(`http://localhost:3004/countries?_page=${page}&_limit=20`)
    .then(({ data }) => {
      const moreCountries = data
      moreCountries.forEach((more) => {
        const moreRows = document.createElement("tr")
        moreRows.innerHTML = `
          <td>${more.name}</td>
          <td>${more.capital}</td>
          <td>${more.currency.code}</td>
          <td>${more.language.name}</td>
          `
        tableBody.appendChild(moreRows)
      })
    })
})
      
let sortedAlphabetically = true
arrowButton.addEventListener("click", () => {
  arrow.classList.add("arrow-up")
  tableBody.innerHTML = ""
  if (sortedAlphabetically) {
    axios
      .get<Country[]>(`http://localhost:3004/countries?${searchString.toString()}&_limit=20&_sort=name&_order=desc`)
      .then(({ data }) => {
        const countriesDesc = data
        countriesDesc.forEach((country: Country) => {
          const tableRow = document.createElement("tr")
          tableRow.classList.add("table__row")
          tableRow.innerHTML = `
                  <td>${country.name}</td>
                  <td>${country.capital}</td>
                  <td>${country.currency.code}</td>
                  <td>${country.language.name}</td>
                  `
          tableBody.appendChild(tableRow)
        })
      })
      sortedAlphabetically = false
  } else {
    axios
      .get<Country[]>("http://localhost:3004/countries?_limit=20&_sort=name&_order=asc")
      .then(({ data }) => {
        arrow.classList.remove("arrow-up")
        generateRows()
      })
      sortedAlphabetically = true
  }
})