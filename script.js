const apiKey = "Dae5peUZvHbtRwXlbsxu9gB3seNl9ogT";
const apiUrlBase = "https://api.currencybeacon.com/v1/convert";
const li1 = document.querySelectorAll('.js1 li');
const li2 = document.querySelectorAll('.js2 li');
const inputs = document.querySelectorAll("input");
const rateDisplay1 = document.querySelector(".change-p"); 
const rateDisplay2 = document.querySelector(".change-p1"); 
const errorMessage = document.querySelector("#error-message"); 
let value1 = 'RUB';
let value2 = 'USD';

function fetchCurrencyRate(from, to, amount, callback) {
    const apiUrl = `${apiUrlBase}?api_key=${apiKey}&from=${from}&to=${to}&amount=${amount}`;
    fetch(apiUrl)
        .then(res => {
            if (!res.ok) throw new Error("API hatası");
            return res.json();
        })
        .then(data => {
            hideErrorMessage(); 
            callback(data.value);
        })
        .catch(() => {
            showErrorMessage(); 
        });
}


function showErrorMessage() {
    errorMessage.style.display = "block";
}


function hideErrorMessage() {
    errorMessage.style.display = "none";
}


function setupCurrencySelection(liElements, isInput1) {
    liElements.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (isInput1) {
                value1 = liElements[index].innerText;
            } else {
                value2 = liElements[index].innerText;
            }
   
            liElements.forEach((el, i) => {
                el.classList.toggle('violet', i === index);
            });

            updateExchangeRates();

            const amount = isInput1 ? inputs[0].value : inputs[1].value;
            if (amount) {
                fetchCurrencyRate(value1, value2, amount, (rate) => {
                    const targetInput = isInput1 ? inputs[1] : inputs[0];
                    targetInput.value = rate.toFixed(4);
                });
            }
        });
    });
}

function setupInputListener() {
    inputs[0].addEventListener('keyup', () => {
        const amount = validateInput(inputs[0].value);
        fetchCurrencyRate(value1, value2, amount, (rate) => {
            inputs[1].value = rate.toFixed(4);
        });
    });

    inputs[1].addEventListener('keyup', () => {
        const amount = validateInput(inputs[1].value);
        fetchCurrencyRate(value2, value1, amount, (rate) => {
            inputs[0].value = rate.toFixed(4);
        });
    });
}

function validateInput(value) {
    const sanitizedValue = value.replace(/[^0-9.]/g, '');
    return sanitizedValue === '' ? 0 : parseFloat(sanitizedValue);
}
function updateExchangeRates() {
    fetchCurrencyRate(value1, value2, 1, (rate) => {
        rateDisplay1.textContent = `1 ${value1} = ${rate.toFixed(4)} ${value2}`;
    });
    fetchCurrencyRate(value2, value1, 1, (rate) => {
        rateDisplay2.textContent = `1 ${value2} = ${rate.toFixed(4)} ${value1}`;
    });
}

function setDefaultSelections() {
    
    li1.forEach(item => item.classList.remove('violet'));
    li1[0].classList.add('violet');
    value1 = 'RUB';

    li2.forEach(item => item.classList.remove('violet'));
    li2[1].classList.add('violet');
    value2 = 'USD';

    inputs[0].value = 1;

    updateExchangeRates();
    fetchCurrencyRate(value1, value2, 1, (rate) => {
        inputs[1].value = rate.toFixed(4);
    });
}

setupCurrencySelection(li1, true);
setupCurrencySelection(li2, false);
setupInputListener();
setDefaultSelections(); 


