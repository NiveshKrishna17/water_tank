/**
 * Main function triggered when the user clicks the visualize button.
 * It reads the input, calculates the trapped water, and updates the UI.
 */
function handleVisualizeClick() {
    const inputElement = document.getElementById('heightInput');
    const containerElement = document.getElementById('svgContainer');
    const outputElement = document.getElementById('output');

    const rawInput = inputElement.value.trim();
    if (!rawInput) {
        alert("Please enter some block heights.");
        return;
    }

    const blockHeights = rawInput.split(',').map(item => Number(item.trim()));

    if (blockHeights.some(isNaN) || blockHeights.some(h => h < 0)) {
        alert("Please enter a valid comma-separated list of positive numbers.");
        return;
    }
    const { waterLevels, totalWater } = calculateTrappedWater(blockHeights);

    outputElement.innerText = `Total Trapped Water: ${totalWater} Units`;

    const svgMarkup = generateVisualizationSVG(blockHeights, waterLevels);
    containerElement.innerHTML = svgMarkup;
}

/**
 * Calculates the amount of water trapped between blocks.
 * @param {number[]} heights - Array of block heights.
 * @returns {Object} An object containing the water level at each index and the total water.
 */
function calculateTrappedWater(heights) {
    const numberOfBlocks = heights.length;
    if (numberOfBlocks === 0) {
        return { waterLevels: [], totalWater: 0 };
    }

    const highestFromLeft = new Array(numberOfBlocks).fill(0);
    const highestFromRight = new Array(numberOfBlocks).fill(0);
    const waterLevels = new Array(numberOfBlocks).fill(0);
    let totalWater = 0;

    highestFromLeft[0] = heights[0];
    for (let i = 1; i < numberOfBlocks; i++) {
        highestFromLeft[i] = Math.max(highestFromLeft[i - 1], heights[i]);
    }

    highestFromRight[numberOfBlocks - 1] = heights[numberOfBlocks - 1];
    for (let i = numberOfBlocks - 2; i >= 0; i--) {
        highestFromRight[i] = Math.max(highestFromRight[i + 1], heights[i]);
    }

    for (let i = 0; i < numberOfBlocks; i++) {
        const boundaryLevel = Math.min(highestFromLeft[i], highestFromRight[i]);
        if (boundaryLevel > heights[i]) {
            waterLevels[i] = boundaryLevel - heights[i];
            totalWater += waterLevels[i];
        } else {
            waterLevels[i] = 0;
        }
    }

    return { waterLevels, totalWater };
}

/**
 * Generates an HTML table grid to visually represent the blocks and trapped water.
 * @param {number[]} heights - Array of block heights.
 * @param {number[]} waterLevels - Array of trapped water depths at each index.
 * @returns {string} The HTML markup for the grid table.
 */
function generateVisualizationSVG(heights, waterLevels) {
    const numberOfBlocks = heights.length;
    if (numberOfBlocks === 0) return '';

    const maxOverall = Math.max(...heights.map((h, i) => h + waterLevels[i])) || 1;

    const totalRows = Math.max(8, maxOverall + 2);
    const totalCols = numberOfBlocks;

    let htmlMarkup = '<table class="water-grid">\n';

    for (let r = totalRows - 1; r >= 0; r--) {
        htmlMarkup += '    <tr>\n';
        for (let c = 0; c < totalCols; c++) {
            const blockHeight = heights[c];
            const waterHeight = waterLevels[c];

            let cellClass = 'empty';
            if (r >= blockHeight && r < blockHeight + waterHeight) {
                cellClass = 'water';
            } else if (r < blockHeight) {
                cellClass = 'block';
            }

            htmlMarkup += `        <td class="${cellClass}"></td>\n`;
        }
        htmlMarkup += '    </tr>\n';
    }

    htmlMarkup += '</table>';
    return htmlMarkup;
}

// Attach the event listener when the document logic has loaded
document.addEventListener("DOMContentLoaded", () => {
    const button = document.getElementById('calculateBtn');
    if (button) {
        button.addEventListener('click', handleVisualizeClick);
    }
});