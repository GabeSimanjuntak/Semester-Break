// Global variables
let price = 19.5;
let cid = [
    ["PENNY", 1.01],
    ["NICKEL", 2.05],
    ["DIME", 3.1],
    ["QUARTER", 4.25],
    ["ONE", 90],
    ["FIVE", 55],
    ["TEN", 20],
    ["TWENTY", 60],
    ["ONE HUNDRED", 100]
];

// DOM elements
const cashInput = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDueDisplay = document.getElementById("change-due");
const priceInput = document.getElementById("price");

// Currency unit values
const currencyUnitValues = {
    "PENNY": 0.01,
    "NICKEL": 0.05,
    "DIME": 0.1,
    "QUARTER": 0.25,
    "ONE": 1,
    "FIVE": 5,
    "TEN": 10,
    "TWENTY": 20,
    "ONE HUNDRED": 100
};

// Update price input when global price changes
priceInput.value = price;

// Function to calculate change
function checkCashRegister(price, cash, cid) {
    let changeDue = cash - price;
    let totalCID = parseFloat(cid.reduce((sum, item) => sum + item[1], 0).toFixed(2));
    
    if (changeDue < 0) {
        alert("Customer does not have enough money to purchase the item");
        return;
    }
    
    if (changeDue === 0) {
        return "No change due - customer paid with exact cash";
    }
    
    if (totalCID < changeDue) {
        return "Status: INSUFFICIENT_FUNDS";
    }
    
    // Check for CLOSED status first
    if (totalCID === changeDue) {
        let result = "Status: CLOSED ";
        cid.forEach(item => {
            if (item[1] > 0) {  // Only show denominations with amount > 0
                result += `${item[0]}: $${item[1].toFixed(2)} `;
            }
        });
        return result.trim();
    }
    
    let changeArray = [];
    let reversedCID = [...cid].reverse();
    let remainingChange = changeDue;
    
    reversedCID.forEach(item => {
        const [unit, amount] = item;
        const unitValue = currencyUnitValues[unit];
        let maxUnits = Math.floor(amount / unitValue);
        let neededUnits = Math.floor(remainingChange / unitValue);
        let usedUnits = Math.min(maxUnits, neededUnits);
        let usedAmount = parseFloat((usedUnits * unitValue).toFixed(2));
        
        if (usedUnits > 0) {
            changeArray.push([unit, usedAmount]);
            remainingChange = parseFloat((remainingChange - usedAmount).toFixed(2));
        }
    });
    
    if (remainingChange > 0) {
        return "Status: INSUFFICIENT_FUNDS";
    }
    
    let result = "Status: OPEN ";
    changeArray.forEach(item => {
        result += `${item[0]}: $${item[1].toFixed(2)} `;
    });
    
    return result.trim();
}

// Event listener for purchase button
purchaseBtn.addEventListener("click", () => {
    const cash = parseFloat(cashInput.value);
    
    if (isNaN(cash)) {
        alert("Please enter a valid cash amount");
        return;
    }
    
    if (cash < price) {
        alert("Customer does not have enough money to purchase the item");
        return;
    }
    
    const result = checkCashRegister(price, cash, cid);
    changeDueDisplay.textContent = result;
});