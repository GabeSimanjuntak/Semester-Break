document.addEventListener('DOMContentLoaded', function() {
    const convertBtn = document.getElementById('convert-btn');
    const numberInput = document.getElementById('number');
    const outputDiv = document.getElementById('output');
    
    convertBtn.addEventListener('click', function() {
        const inputValue = numberInput.value.trim();
        
        // Check if input is empty
        if (inputValue === '') {
            outputDiv.textContent = 'Please enter a valid number';
            outputDiv.className = 'error';
            return;
        }
        
        const number = parseInt(inputValue);
        
        // Check if number is less than 1
        if (number < 1) {
            outputDiv.textContent = 'Please enter a number greater than or equal to 1';
            outputDiv.className = 'error';
            return;
        }
        
        // Check if number is 4000 or greater
        if (number >= 4000) {
            outputDiv.textContent = 'Please enter a number less than or equal to 3999';
            outputDiv.className = 'error';
            return;
        }
        
        // Convert to Roman numeral
        const romanNumeral = convertToRoman(number);
        outputDiv.textContent = romanNumeral;
        outputDiv.className = 'success';
    });
    
    function convertToRoman(num) {
        const romanNumerals = [
            { value: 1000, numeral: 'M' },
            { value: 900, numeral: 'CM' },
            { value: 500, numeral: 'D' },
            { value: 400, numeral: 'CD' },
            { value: 100, numeral: 'C' },
            { value: 90, numeral: 'XC' },
            { value: 50, numeral: 'L' },
            { value: 40, numeral: 'XL' },
            { value: 10, numeral: 'X' },
            { value: 9, numeral: 'IX' },
            { value: 5, numeral: 'V' },
            { value: 4, numeral: 'IV' },
            { value: 1, numeral: 'I' }
        ];
        
        let result = '';
        
        for (let i = 0; i < romanNumerals.length; i++) {
            while (num >= romanNumerals[i].value) {
                result += romanNumerals[i].numeral;
                num -= romanNumerals[i].value;
            }
        }
        
        return result;
    }
});