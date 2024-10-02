// script.js

// Function to update the value display for sliders
function updateSliderValue(slider, circleId) {
    const valueDisplay = document.getElementById(circleId);
    valueDisplay.textContent = slider.value;
}

// Add event listeners for all sliders
const sliders = document.querySelectorAll('.slider');
sliders.forEach(slider => {
    slider.addEventListener('input', function() {
        const valueDisplay = document.getElementById(`circle${this.id.slice(-1)}`);
        valueDisplay.textContent = this.value; // Update the circle display
    });
});

// Add event listeners for Marz sliders
const marzSliders = document.querySelectorAll('#marzSlider1, #marzSlider2, #marzSlider3, #marzSlider4');
marzSliders.forEach(slider => {
    slider.addEventListener('input', function() {
        updateSliderValue(this, `marzCircle${this.id.slice(-1)}`);
    });
});

// Add event listeners for June sliders
const juneSliders = document.querySelectorAll('#juneSlider1, #juneSlider2, #juneSlider3, #juneSlider4');
juneSliders.forEach(slider => {
    slider.addEventListener('input', function() {
        updateSliderValue(this, `juneCircle${this.id.slice(-1)}`);
    });
});

// Add event listeners for Actual sliders
const actualSliders = document.querySelectorAll('#actualSlider1, #actualSlider2, #actualSlider3, #actualSlider4');
actualSliders.forEach(slider => {
    slider.addEventListener('input', function() {
        updateSliderValue(this, `actualCircle${this.id.slice(-1)}`);
    });
});

// Function to calculate the winner
document.querySelector('.calculate-button').addEventListener('click', function() {
    const actualValues = [
        parseFloat(document.getElementById('actualSlider1').value),
        parseFloat(document.getElementById('actualSlider2').value),
        parseFloat(document.getElementById('actualSlider3').value),
        parseFloat(document.getElementById('actualSlider4').value)
    ];

    const marzValues = [
        parseFloat(document.getElementById('marzSlider1').value),
        parseFloat(document.getElementById('marzSlider2').value),
        parseFloat(document.getElementById('marzSlider3').value),
        parseFloat(document.getElementById('marzSlider4').value)
    ];

    const juneValues = [
        parseFloat(document.getElementById('juneSlider1').value),
        parseFloat(document.getElementById('juneSlider2').value),
        parseFloat(document.getElementById('juneSlider3').value),
        parseFloat(document.getElementById('juneSlider4').value)
    ];

    let marzScore = 0;
    let juneScore = 0;
    const pointsBreakdown = []; // Points breakdown for display

    // Calculate scores based on differences
    for (let i = 0; i < actualValues.length; i++) {
        const marzDiff = Math.abs(actualValues[i] - marzValues[i]);
        const juneDiff = Math.abs(actualValues[i] - juneValues[i]);

        if (marzDiff < juneDiff) {
            marzScore++;
            pointsBreakdown.push(`Marz wins category ${i + 1} (1 point)`);
        } else if (juneDiff < marzDiff) {
            juneScore++;
            pointsBreakdown.push(`June wins category ${i + 1} (1 point)`);
        } else {
            // Tie-breaker logic
            pointsBreakdown.push(`Category ${i + 1} is a tie (0 points)`);
        }
    }

    // Flavor comparison
    const marzFlavor1 = document.getElementById('marzFlavor1').value.trim().toLowerCase();
    const marzFlavor2 = document.getElementById('marzFlavor2').value.trim().toLowerCase();
    const juneFlavor1 = document.getElementById('juneFlavor1').value.trim().toLowerCase();
    const juneFlavor2 = document.getElementById('juneFlavor2').value.trim().toLowerCase();
    const actualFlavor1 = document.getElementById('actualFlavor1').value.trim().toLowerCase();
    const actualFlavor2 = document.getElementById('actualFlavor2').value.trim().toLowerCase();

    // Check Marz flavors
    if (marzFlavor1 === actualFlavor1 || marzFlavor1 === actualFlavor2) {
        marzScore++;
        pointsBreakdown.push(`Marz gets a point for flavor: ${marzFlavor1} (1 point)`);
    }
    if (marzFlavor2 === actualFlavor1 || marzFlavor2 === actualFlavor2) {
        marzScore++;
        pointsBreakdown.push(`Marz gets a point for flavor: ${marzFlavor2} (1 point)`);
    }

    // Check June flavors
    if (juneFlavor1 === actualFlavor1 || juneFlavor1 === actualFlavor2) {
        juneScore++;
        pointsBreakdown.push(`June gets a point for flavor: ${juneFlavor1} (1 point)`);
    }
    if (juneFlavor2 === actualFlavor1 || juneFlavor2 === actualFlavor2) {
        juneScore++;
        pointsBreakdown.push(`June gets a point for flavor: ${juneFlavor2} (1 point)`);
    }

    // Determine the result
    let resultText = '';
    if (marzScore > juneScore) {
        resultText = `Marz wins! Final Score: Marz ${marzScore}, June ${juneScore}`;
    } else if (juneScore > marzScore) {
        resultText = `June wins! Final Score: Marz ${marzScore}, June ${juneScore}`;
    } else {
        resultText = `It's a tie! Final Score: Marz ${marzScore}, June ${juneScore}`;
    }

    // Update the result and points breakdown in the DOM
    document.getElementById('result').textContent = resultText;
    document.getElementById('pointsBreakdown').innerHTML = pointsBreakdown.join('<br>');
});

function calculateResults() {
    // Get values from sliders for each section
    const marzLight = document.getElementById('marzSlider1').value;
    const marzBold = document.getElementById('marzSlider2').value;

    const juneLight = document.getElementById('juneSlider1').value;
    const juneBold = document.getElementById('juneSlider2').value;

    const actualLight = document.getElementById('actualSlider1').value;
    const actualBold = document.getElementById('actualSlider2').value;

    // Initialize results
    let marzResult = marzLight > marzBold ? 'Light' : 'Bold';
    let juneResult = juneLight > juneBold ? 'Light' : 'Bold';
    let actualResult = actualLight > actualBold ? 'Light' : 'Bold';

    // Display the results
    document.getElementById('result').innerText = `Marz: ${marzResult}, June: ${juneResult}, Actual: ${actualResult}`;
}
