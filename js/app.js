const targetElementById = (id) => document.getElementById(id);

const tableBody = targetElementById("table-body");

//Show dynamic message based on API response or network error
const showMsg = (status) => {
  switch (status) {
    case "LOADING":
      {
        tableBody.innerHTML = `<img src="./img/loading-with-txt.gif" alt="Spinner">`;
      }
      break;
    case "RESPONSE_ERROR":
      {
        tableBody.innerHTML = `<h3 style="color: red">No billionaire found!</h3>`;
      }
      break;
    case "NETWORK_ERROR":
      {
        tableBody.innerHTML = `<h3 style="color: red">Please check your internet connection!</h3>`;
      }
      break;
    case "SUCCESS":
      {
        tableBody.innerHTML = "";
      }
      break;
    default: {
    }
  }
};

//Get limited billionaires from API
const getBillioniares = async (limit) => {
  const API_URL = `https://forbes400.onrender.com/api/forbes400?limit=${limit}`;
  try {
    showMsg("LOADING");
    const data = await (await fetch(API_URL)).json();
    showMsg("SUCCESS");
    displayBillioniares(data);
  } catch (error) {
    showMsg("NETWORK_ERROR");
    console.log("Error occured: ", error);
  }
};

//Sort the billionaires of the table in acending order using rank property
function sortDecending(billioniares) {
  billioniares.sort((a, b) => b.rank - a.rank);
}

//Calculate total wealth of displayed users in table
function calcuteTotalWealth(billionaires) {
  const total = billionaires.reduce((prev, curr) => {
    return prev + curr.finalWorth;
  }, 0);

  return total;
}

let allBillionaires = null;

//Convert milliseconds birthdate to formated birthdate
function getFormatedBirthDate(milliseconds) {
  const [, month, date, year] = new Date(milliseconds).toString().split(" ");
  return `${month} ${date}, ${year}`;
}

//Show user's details in a modal on the basis of name
//This funtion will be called by details button
function displayUserDetails(billionaireName) {
  const currentBillionaire = allBillionaires.find(
    (billionaire) => billionaire.personName === billionaireName
  );

  const {
    person: { squareImage },
    source,
    personName,
    countryOfCitizenship,
    state,
    city,
    birthDate,
    gender,
    bios,
    financialAssets,
  } = currentBillionaire;

  const { exchange, ticker, sharePrice, numberOfShares } = financialAssets[0];

  const biographyText = bios.slice(0, 2).join("");

  targetElementById("modal-body").innerHTML = `
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
    <h3 class="modal-title text-center" id="detailsModalLabel">${personName}</h3>
    <div class="biography-container">
      <h5 class="biography-heading text-center">Biography</h5>
    <p class="biography-description text-center">${biographyText}</p>
    </div>
    <div id="basic-info" class="basic-info d-flex justify-content-center align-items-center gap-3">
      <div class="user-image-container">
        <div>
          <img width="150px" height ="200px" src="${squareImage}" alt="User Image">
          <br><b>Source: </b><span>${source}</span>
        </div>
      </div>
      <div class="user-description">
        <b class="bottom-line-general-info">General Informations</b>
         <div>
         <b>Citizenship: </b>
         <span>${countryOfCitizenship}</span>
         </div>

         <div>
         <b>State: </b>
         <span>${state || "Not Found"}</span>
         </div>

         <div>
         <b>City: </b>
         <span>${city}</span>
         </div>

         <div>
         <b>Birthday: </b>
         <span>${getFormatedBirthDate(birthDate)}</span>
         </div>

         <div>
         <b>Gender: </b>
         <span>${gender}</span>
         </div>
         <!-- Start Financial Information -->
         <b class="mt-3 bottom-line-financial-info">Financial Information</b>
         <div>
          <b>Exchange: </b>
          <span>${exchange}</span>
          </div>

          <div>
          <b>Ticker: </b>
          <span>${ticker}</span>
          </div>

          <div>
          <b>Total Shares: </b>
          <span>${numberOfShares}</span>
          </div>

          <div>
          <b>Share Price: </b>
          <span>$${sharePrice}</span>
          </div>
         <!-- End Financial Information -->
      </div>
    </div>
    `;
}

//Display billinaires dynamically in a table
const displayBillioniares = (billioniares) => {
  allBillionaires = billioniares;
  targetElementById("table-head").innerHTML = `
<tr class="align-left">
  <th>Person</th>
  <th>Citizenship</th>
  <th>Industry</th>
  <th>Rank</th>
  <th>Wealth</th>
  <th>Action</th>
</tr>
  `;

  billioniares.forEach((billionaire) => {
    const { personName, countryOfCitizenship, industries, rank, finalWorth } =
      billionaire;
    tableBody.innerHTML += `
        <tr>
        <td>${personName}</td>
        <td>${countryOfCitizenship}</td>
        <td>${industries[0]}</td>
        <td>${rank}</td>
        <td>$${finalWorth}</td>
        <td>
          <button onclick="displayUserDetails('${personName}')" class="btn btn-details" data-bs-toggle="modal" data-bs-target="#detailsModal">Details</button>
        </td>
      </tr>
        `;
  });
};

//Select all sidebar buttons
const sideBarBtns = document.querySelectorAll(".left-sidebar-btn");

//Add event listeners for all buttons using loop
sideBarBtns.forEach((button) => {
  button.addEventListener("click", function () {
    //Get the text inside button
    const currentBtnText = this.children.length
      ? this.children[0].innerText
      : this.innerText;

    //Do different action according to cliked button
    switch (currentBtnText) {
      case "Sort By Rank":
        {
          tableBody.innerHTML = "";
          sortDecending(allBillionaires);
          displayBillioniares(allBillionaires);
        }
        break;
      case "Calculate The Entire Wealth":
        {
          const totalWealths = calcuteTotalWealth(allBillionaires);
          console.log(totalWealths);
          targetElementById("table-footer").innerHTML = `
            <tr class="fw-bolder">
                  <td colspan="4">Total</td>
                  <td>$${totalWealths}</td>
            </tr>
            `;
        }
        break;
      case "Show All Billionaires":
        {
          tableBody.innerHTML = "";
          getBillioniares("100");
        }
        break;
      case "Rihcest by industry":
        {
          window.location.href = "pages/industry.html";
        }
        break;
      case "Richest by states":
        {
          window.location.href = "pages/state.html";
        }
        break;
      default: {
        console.log("Unknown Command");
      }
    }
  });
});

//Search a billionaire's name or rank in input field
targetElementById("search-field").addEventListener("keyup", function (ev) {
  ev.preventDefault();
  const typedVal = ev.target.value.toLowerCase();

  if (tableBody.children.length === 1) {
    tableBody.innerText = "Nothing to search";
    return;
  }

  for (let tr of tableBody.children) {
    if (tr.children[0].innerText.toLowerCase().indexOf(typedVal) > -1 || tr.children[3].innerText.toLowerCase().indexOf(typedVal) > -1) {
      tr.style.display = "";
    } else {
      tr.style.display = "none";
    }
  }
});
getBillioniares("7");
