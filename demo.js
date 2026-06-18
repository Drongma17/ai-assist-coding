// function to calculate the area of a circle
function calculateCircleArea(radius) {
    if (radius < 0) {
        return "Radius cannot be negative.";
    }
    return Math.PI * Math.pow(radius, 2);
}

// function to validate email address
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}


// function to fetch data from an API and log the response
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Example usage:
console.log(calculateCircleArea(5)); // Should print the area of a circle      