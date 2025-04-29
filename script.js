// Function to update stars visually
function updateStars(container, value) {
    const stars = container.querySelectorAll('.star');
    const fullStars = Math.floor(value);
    const fraction = value - fullStars;

    stars.forEach((star, index) => {
        star.classList.remove('filled', 'partial');
        if (index + 1 <= fullStars) {
            // Full star
            star.classList.add('filled');
        } else if (index === fullStars && fraction > 0) {
            // Partial star
            star.classList.add('partial');
            star.style.setProperty('--fill-percent', `${fraction * 100}%`);
        }
    });
    
    container.setAttribute('data-rating', value.toString());
    const ratingDisplay = container.parentElement.nextElementSibling;
    if (ratingDisplay) {
        ratingDisplay.textContent = `Rating: ${value.toFixed(1)}`;
    }
}

// Function to handle plus/minus button clicks
function handleStarButtonClick(containerId, increment) {
    const container = document.getElementById(containerId);
    const currentRating = parseFloat(container.getAttribute('data-rating')) || 0;
    const newRating = Math.min(5, Math.max(0, currentRating + increment));
    updateStars(container, newRating);
}

// Function to initialize star ratings
function initializeStarRating(containerId) {
    const container = document.getElementById(containerId);
    const stars = container.querySelectorAll('.star');
    const initialRating = 3.0; // Set default to 3.0
    
    updateStars(container, initialRating);

    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = parseFloat(this.getAttribute('data-value'));
            updateStars(container, value);
        });
    });
}

// Function to initialize sliders
function initializeSliders() {
    const sliderGroups = document.querySelectorAll('.slider-group');
    
    sliderGroups.forEach(group => {
        const slider = group.querySelector('.slider');
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';
        
        // Create unified thumb element
        const thumb = document.createElement('div');
        thumb.className = 'slider-thumb';
        thumb.textContent = slider.value;
        
        // Wrap slider in container
        slider.parentNode.insertBefore(sliderContainer, slider);
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(thumb);
        
        function updateSliderThumb() {
            const value = parseFloat(slider.value);
            const min = parseFloat(slider.min);
            const max = parseFloat(slider.max);
            const percent = (value - min) / (max - min);
            
            // Calculate position accounting for thumb width
            const thumbWidth = 30;
            const trackWidth = slider.offsetWidth;
            const availableWidth = trackWidth - thumbWidth;
            const position = (percent * availableWidth) + (thumbWidth / 2);
            
            thumb.style.left = `${position}px`;
            thumb.textContent = value;
        }
        
        // Update on all relevant events
        slider.addEventListener('input', updateSliderThumb);
        slider.addEventListener('change', updateSliderThumb);
        window.addEventListener('resize', updateSliderThumb);
        
        // Initialize thumb position
        requestAnimationFrame(updateSliderThumb);
    });
}

// Function to calculate the difference between two numbers
function calculateDifference(value1, value2) {
    return Math.abs(value1 - value2);
}

// Function to calculate flavour match score - check both flavours against both actual flavours
function calculateFlavourMatch(userFlavours, actualFlavours) {
    let score = 0;
    const lowerUserFlavours = userFlavours.map(f => f.toLowerCase().trim()).filter(f => f); // Remove empty strings
    const lowerActualFlavours = actualFlavours.map(f => f.toLowerCase().trim()).filter(f => f);
    
    // Check each user flavour against both actual flavours
    lowerUserFlavours.forEach(userFlavour => {
        if (lowerActualFlavours.includes(userFlavour)) {
            score++;
        }
    });
    
    return score;
}

// Main calculation function
function calculateWinner() {
    // Get all slider values
    const marzScores = {
        lightBold: parseFloat(document.getElementById('marzSlider1').value),
        smoothTannic: parseFloat(document.getElementById('marzSlider2').value),
        drySweet: parseFloat(document.getElementById('marzSlider3').value),
        softAcidic: parseFloat(document.getElementById('marzSlider4').value),
        rating: parseFloat(document.getElementById('marz-stars').dataset.rating),
        flavours: [
            document.getElementById('marzFlavour1').value,
            document.getElementById('marzFlavour2').value
        ]
    };

    const juneScores = {
        lightBold: parseFloat(document.getElementById('juneSlider1').value),
        smoothTannic: parseFloat(document.getElementById('juneSlider2').value),
        drySweet: parseFloat(document.getElementById('juneSlider3').value),
        softAcidic: parseFloat(document.getElementById('juneSlider4').value),
        rating: parseFloat(document.getElementById('june-stars').dataset.rating),
        flavours: [
            document.getElementById('juneFlavour1').value,
            document.getElementById('juneFlavour2').value
        ]
    };

    const actualScores = {
        lightBold: parseFloat(document.getElementById('actualSlider1').value),
        smoothTannic: parseFloat(document.getElementById('actualSlider2').value),
        drySweet: parseFloat(document.getElementById('actualSlider3').value),
        softAcidic: parseFloat(document.getElementById('actualSlider4').value),
        rating: parseFloat(document.getElementById('actual-stars').dataset.rating),
        flavours: [
            document.getElementById('actualFlavour1').value,
            document.getElementById('actualFlavour2').value
        ]
    };

    // Calculate differences for each participant
    const marzDiff = {
        lightBold: calculateDifference(marzScores.lightBold, actualScores.lightBold),
        smoothTannic: calculateDifference(marzScores.smoothTannic, actualScores.smoothTannic),
        drySweet: calculateDifference(marzScores.drySweet, actualScores.drySweet),
        softAcidic: calculateDifference(marzScores.softAcidic, actualScores.softAcidic),
        rating: calculateDifference(marzScores.rating, actualScores.rating),
        flavourScore: calculateFlavourMatch(marzScores.flavours, actualScores.flavours)
    };

    const juneDiff = {
        lightBold: calculateDifference(juneScores.lightBold, actualScores.lightBold),
        smoothTannic: calculateDifference(juneScores.smoothTannic, actualScores.smoothTannic),
        drySweet: calculateDifference(juneScores.drySweet, actualScores.drySweet),
        softAcidic: calculateDifference(juneScores.softAcidic, actualScores.softAcidic),
        rating: calculateDifference(juneScores.rating, actualScores.rating),
        flavourScore: calculateFlavourMatch(juneScores.flavours, actualScores.flavours)
    };

    // Calculate total scores (lower is better for differences, higher is better for flavours)
    const marzTotalDiff = marzDiff.lightBold + marzDiff.smoothTannic + 
                         marzDiff.drySweet + marzDiff.softAcidic + marzDiff.rating;
    const juneTotalDiff = juneDiff.lightBold + juneDiff.smoothTannic + 
                         juneDiff.drySweet + juneDiff.softAcidic + juneDiff.rating;

    // Final scores (lower is better)
    const marzFinalScore = marzTotalDiff - marzDiff.flavourScore;
    const juneFinalScore = juneTotalDiff - juneDiff.flavourScore;

    // Calculate who won each category
    const categories = {
        rating: { name: "Overall Wine Rating", marz: marzDiff.rating, june: juneDiff.rating },
        lightBold: { name: "Light or Bold", marz: marzDiff.lightBold, june: juneDiff.lightBold },
        smoothTannic: { name: "Smooth or Tannic", marz: marzDiff.smoothTannic, june: juneDiff.smoothTannic },
        drySweet: { name: "Dry or Sweet", marz: marzDiff.drySweet, june: juneDiff.drySweet },
        softAcidic: { name: "Soft or Acidic", marz: marzDiff.softAcidic, june: juneDiff.softAcidic },
        flavours: { name: "Flavour Notes", marz: marzDiff.flavourScore, june: juneDiff.flavourScore }
    };

    // Count total wins
    let marzWins = 0;
    let juneWins = 0;

    // Build the result string
    let breakdownText = "";
    
    Object.values(categories).forEach(category => {
        let winner;
        if (category.name === "Flavour Notes") {
            // For flavour matches, higher is better
            if (category.marz > category.june) {
                winner = "Marz";
                marzWins++;
            } else if (category.june > category.marz) {
                winner = "June";
                juneWins++;
            } else {
                winner = "Tie";
                if (category.marz > 0) { // If there's a tie and both got points, count it for both
                    marzWins++;
                    juneWins++;
                }
            }
        } else {
            // For all other categories, lower difference is better
            if (category.marz < category.june) {
                winner = "Marz";
                marzWins++;
            } else if (category.june < category.marz) {
                winner = "June";
                juneWins++;
            } else {
                winner = "Tie";
                if (category.marz === category.june) { // If there's a perfect tie, count it for both
                    marzWins++;
                    juneWins++;
                }
            }
        }
        breakdownText += `${category.name} - ${winner}<br>`;
    });

    // Display results
    const resultElement = document.getElementById('result');
    const breakdownElement = document.getElementById('pointsBreakdown');

    // First show who won
    if (marzFinalScore === juneFinalScore) {
        resultElement.innerHTML = "It's a tie! 😮<br><br>";
    } else {
        const winner = marzFinalScore < juneFinalScore ? "Marz" : "June";
        resultElement.innerHTML = `${winner} Wins! 🎉<br><br>`;
    }

    // Then add the points totals (changed from /6 to /7)
    resultElement.innerHTML += `Marz Points = ${marzWins}/7<br>June Points = ${juneWins}/7`;
    breakdownElement.innerHTML = breakdownText;
}

// Initialize everything when the DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
    // Initialize star ratings
    initializeStarRating('marz-stars');
    initializeStarRating('june-stars');
    initializeStarRating('actual-stars');

    // Initialize sliders
    initializeSliders();

    // Add star button click handlers
    document.getElementById('marzStarPlus').addEventListener('click', () => {
        handleStarButtonClick('marz-stars', 0.1);
    });
    document.getElementById('marzStarMinus').addEventListener('click', () => {
        handleStarButtonClick('marz-stars', -0.1);
    });
    document.getElementById('juneStarPlus').addEventListener('click', () => {
        handleStarButtonClick('june-stars', 0.1);
    });
    document.getElementById('juneStarMinus').addEventListener('click', () => {
        handleStarButtonClick('june-stars', -0.1);
    });
    document.getElementById('actualStarPlus').addEventListener('click', () => {
        handleStarButtonClick('actual-stars', 0.1);
    });
    document.getElementById('actualStarMinus').addEventListener('click', () => {
        handleStarButtonClick('actual-stars', -0.1);
    });

    // Add click event listener to the calculate button
    document.querySelector('.calculate-button').addEventListener('click', calculateWinner);
});
