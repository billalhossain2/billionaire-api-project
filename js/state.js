
const cardsContainer = document.getElementById("cards-container");

//Show api message dynaically
const showMsg = status => {
    switch (status) {
        case "LOADING":{
            cardsContainer.innerHTML = `<img src="../img/loading-bullet.gif" alt="Spinner">`;
        }
        break;
        case "RESPONSE_ERROR":{
            cardsContainer.innerHTML = `<h3 style="color: red">No billionaire found!</h3>`;
        }
        break;
        case "NETWORK_ERROR":{
            cardsContainer.innerHTML = `<h3 style="color: red">Please check your internet connection!</h3>`;
        }
        break;
        case "SUCCESS":{
            cardsContainer.innerHTML = "";
        }
        break;
        default:{}
    }
}

//Load data from API by state search query
const getBillionairesByStateApi = async state =>{
    const API_URL = `https://forbes400.onrender.com/api/forbes400/states/${state}`;
    try {
    showMsg('LOADING')
    const data = await (await fetch(API_URL)).json();
    if( data.length === 0){
        showMsg('RESPONSE_ERROR')
    }else{
        showMsg('SUCCESS')
        displayStateBillionaires(data);
    }
    } catch (error) {
        showMsg('NETWORK_ERROR')
    }
}



//All loaded data
let allBillionaires = null;


//This button will be toggled based on condtion
const loadMoreBtn = document.getElementById('load-more');

//It returns 10 billionaires if the length is more than 10
const showTenBillionaires = (billionaires) =>{
    allBillionaires = billionaires;
    if(allBillionaires.length > 10){
        billionaires = allBillionaires.slice(0, 10);
        allBillionaires = allBillionaires.slice(10);
        loadMoreBtn.classList.remove('d-none')
        console.log('removed........')
    }else{
        loadMoreBtn.classList.add('d-none')
        console.log('Button none added......')
    }
    return billionaires;
}

//Event listener for load more button
loadMoreBtn.addEventListener('click', ()=> displayStateBillionaires(allBillionaires))

//Function for displaying billionaires by state wise
const displayStateBillionaires = billionaires => {

    billionaires = showTenBillionaires(billionaires);

    billionaires.forEach(billionaire => {
        const {person:{squareImage}, source,  personName, countryOfCitizenship, state, city, financialAssets} = billionaire;
        cardsContainer.innerHTML += `
        <div class="card mb-3 pt-4" style="max-width: 350px; height: 300px; background: #0E1B34; color: white;">
            <div class="row g-0">
            <h5 class="card-title text-center">${personName}</h5>
              <div class="col-md-4 d-flex align-items-center">
                <div class="p-2">
                <img max-width="200px" height = "250px" src="${squareImage}" class="img-fluid rounded-start" alt="Billionaire Photo">
                <p style="font-size: 12px"><b>Source: </b><span>${source}</span></p>
                </div>
              </div>
              <div class="col-md-8">
                <div class="card-body">
                   <p><b>Citizenship</b>: <span>${countryOfCitizenship}</span></p>
                   <p><b>State</b>: <span>${state || 'Not Found'}</span></p>
                   <p><b>City</b>: <span>${city}</span></p>
                   <p><b>Total Sahres</b>: <span>${financialAssets ? financialAssets[0].numberOfShares : 'Not Found!'}</span></p>
                   <p><b>Share Price</b>: <span>${financialAssets ? financialAssets[0].sharePrice : 'Not Found!'}</span></p>
                </div>
              </div>
            </div>
          </div>
        `;
    })
}

getBillionairesByStateApi('Texas');