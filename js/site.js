// document element by ID shortcut
let $ = function (id) {
    return document.getElementById(id);
}

// format currency to US Dollars
let usd = function (num) {
    let formatter = new Intl.NumberFormat('en-US', {
        style: "currency",
        currency: 'USD',
        minimumFractionDigits: 2
    });
    return formatter.format(num);
}

// Entry point from button click
function calculateMortgage() {
    resetVisibility();
    let loanDetails = getLoanDetails();
    resetVisibility(false);
    showDetails(loanDetails);
}

// Display the results on screen
function showDetails(loanDetails) {
    $("monthlyPayment").innerHTML = usd(loanDetails.monthlyPayment);
    $("totalPrincipal").innerHTML = usd(loanDetails.amount);
    $("totalInterest").innerHTML = usd(loanDetails.totalInterest);
    $("totalCost").innerHTML = usd(loanDetails.totalCost);

    let month = 1;
    let tableBody = $("resultTableBody");
    tableBody.innerHTML = "";
    let rowTemplate = $("rowTemplate");
    let balance = loanDetails.amount;
    let paidInterest = 0;

    while (month <= loanDetails.term) {
        let interest = balance * (loanDetails.interestRate / 1200);
        paidInterest += interest;
        balance -= (loanDetails.monthlyPayment - interest).toFixed(2);
        const rowData = document.importNode(rowTemplate.content, true);
        rows = rowData.querySelectorAll("td");
        rows[0].textContent = month;
        rows[1].textContent = usd(loanDetails.monthlyPayment);
        rows[2].textContent = usd(loanDetails.monthlyPayment - interest);
        rows[3].textContent = usd(interest);
        rows[4].textContent = usd(paidInterest);
        rows[5].textContent = usd(balance);

        tableBody.appendChild(rowData);
        month++;
    }
    // TODO: add the edge case for rounding error 
    // sync up to last payment (over/under by a few cents)
}

// Gather loan details from page and store into object
function getLoanDetails() {
    let loanDetails = {};
    loanDetails.amount = Number.parseFloat($("loanAmount").value);
    loanDetails.term = Number.parseFloat($("termMonths").value);
    loanDetails.interestRate = Number.parseFloat($("interestRate").value);

    let divisor = loanDetails.amount * (loanDetails.interestRate / 1200);
    let dividend = (1 - (1 + loanDetails.interestRate / 1200) ** (-loanDetails.term));
    loanDetails.monthlyPayment = (divisor / dividend).toFixed(2);

    loanDetails.totalCost = loanDetails.monthlyPayment * loanDetails.term;
    loanDetails.totalInterest = loanDetails.totalCost - loanDetails.amount;

    return loanDetails;
}

function resetVisibility(hide = true) {
    if (hide) {
        document.getElementById("resultTable").classList.add("invisible");
        document.getElementById("errorMessage").classList.add("invisible");
        document.getElementById("monthlyPayment").classList.add("invisible");
        document.getElementById("totalPrincipal").classList.add("invisible");
        document.getElementById("totalInterest").classList.add("invisible");
        document.getElementById("totalCost").classList.add("invisible");
    } else {
        document.getElementById("resultTable").classList.remove("invisible");
        document.getElementById("monthlyPayment").classList.remove("invisible");
        document.getElementById("totalPrincipal").classList.remove("invisible");
        document.getElementById("totalInterest").classList.remove("invisible");
        document.getElementById("totalCost").classList.remove("invisible");
    }
}
