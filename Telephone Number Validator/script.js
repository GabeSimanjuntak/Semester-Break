document.addEventListener('DOMContentLoaded', function() {
    const checkBtn = document.getElementById('check-btn');
    const clearBtn = document.getElementById('clear-btn');
    const userInput = document.getElementById('user-input');
    const resultsDiv = document.getElementById('results-div');
    
    checkBtn.addEventListener('click', function() {
        const inputValue = userInput.value.trim();
        
        if (!inputValue) {
            alert('Please provide a phone number');
            return;
        }
        
        const isValid = telephoneCheck(inputValue);
        const resultText = `${isValid ? 'Valid' : 'Invalid'} US number: ${inputValue}`;
        
        const resultElement = document.createElement('p');
        resultElement.textContent = resultText;
        resultElement.className = isValid ? 'valid' : 'invalid';
        
        resultsDiv.appendChild(resultElement);
        userInput.value = '';
    });
    
    clearBtn.addEventListener('click', function() {
        resultsDiv.innerHTML = '';
    });
    
    function telephoneCheck(str) {
        // Regular expression to match valid US phone number formats
        const regex = /^(1\s?)?(\(\d{3}\)|\d{3})[\s\-]?\d{3}[\s\-]?\d{4}$/;
        
        // Additional check for proper parentheses usage
        const hasParentheses = /\(|\)/.test(str);
        if (hasParentheses) {
            const parenthesesValid = /\(\d{3}\)/.test(str);
            if (!parenthesesValid) return false;
        }
        
        // Check if the cleaned number has 10 digits (or 11 with country code)
        const cleaned = str.replace(/\D/g, '');
        if (cleaned.length === 11 && cleaned[0] !== '1') return false;
        if (cleaned.length > 11 || cleaned.length < 10) return false;
        
        return regex.test(str);
    }
});