import axios from 'axios'

type Country = {
    name: string;
    code: string;
    capital: string;
    region: string;
    currency: {
        code: string;
        name: string;
        symbol: string;
    };
    language: {
        code: string;
        name: string;
    };
    flag: string;
    "dialling_code": string;
    isoCode: string;
}


const tableBody = document.querySelector('.table__body');
const arrowButton = document.querySelector('.btn-arrow');
const arrow = document.querySelector('.arrow')
const buttonTwo = document.querySelector('.btn__two');



const searchCountry = document.querySelector<HTMLInputElement>('.srch__input-country');
// const searchCapital = document.querySelector<HTMLInputElement>('.srch__input-capital');

// const paramsString = ('q=URLUtils.searchParams&topic=api');
// const searchParams = new URLSearchParams(paramsString);

// for (const p of searchParams) {
//     console.log(searchParams.get('topic'))
// }



const generateRows = () => {
    axios.get<Country[]>('http://localhost:3004/countries?_limit=20').then(({ data }) => {
        const countries = data;

        countries.map((country: Country) => {
            const tableRow = document.createElement('tr');
            tableRow.classList.add('table__row')
            tableRow.innerHTML = `
            <td>${country.name}</td>
            <td>${country.capital}</td>
            <td>${country.currency.code}</td>
            <td>${country.language.name}</td>
            `
            tableBody.appendChild(tableRow)
            


            // searchCountry.addEventListener('input', (e) => {
            //     const filter = searchCountry.value.toUpperCase();
            //     console.log(filter)

            //     if(country.name.toUpperCase() === filter) {
            //         tableBody.innerHTML = '';
            //         return filter;
            //         // tableRow.innerHTML =
                    
            //     }
                
            // })
        })


        let page = 1;
        buttonTwo.addEventListener('click', () => {
            page +=1;
            axios.get<Country[]>(`http://localhost:3004/countries?_page=${page}&_limit=20`).then(({ data }) => {
                
                const moreCountries = data;
                moreCountries.map((more) => {
                    const moreRows = document.createElement('tr');
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

        let abcde = true;
        arrowButton.addEventListener('click', () => {
            arrow.classList.add('arrow-up')
            tableBody.innerHTML = '';
            if (abcde) {
                axios.get<Country[]>('http://localhost:3004/countries?_limit=20&_sort=name&_order=desc').then(({ data }) => {
                    const countriesDesc = data;
                    countriesDesc.map((country: Country) => {
                        const tableRow = document.createElement('tr');
                        tableRow.classList.add('table__row')
                        tableRow.innerHTML = `
                        <td>${country.name}</td>
                        <td>${country.capital}</td>
                        <td>${country.currency.code}</td>
                        <td>${country.language.name}</td>
                        `
                        tableBody.appendChild(tableRow)
                    })
                })
                abcde = false;

            } else {
                axios.get<Country[]>('http://localhost:3004/countries?_limit=20&_sort=name&_order=asc').then(({ data }) => {
                    arrow.classList.remove('arrow-up')
                    generateRows()
                })
                abcde = true;
            }
        })

    })
}
generateRows()






