const fs = require('fs');
const path = require('path');

// Read the historical data
const historicalPath = path.join(__dirname, 'public', 'historical');
const historicalData = JSON.parse(fs.readFileSync(historicalPath, 'utf8'));

console.log(`Total daily entries: ${historicalData.length}`);

// Group data by week and take the last entry of each week
const weeklyData = [];
let currentWeek = null;
let weekEntries = [];

historicalData.forEach((entry, index) => {
    const date = new Date(entry.date);
    // Get the start of the week (Monday)
    const weekStart = new Date(date);
    const day = weekStart.getDay();
    const diff = weekStart.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);

    const weekKey = weekStart.toISOString().split('T')[0];

    if (currentWeek === null) {
        currentWeek = weekKey;
    }

    if (currentWeek !== weekKey || index === historicalData.length - 1) {
        // Save the last entry of the previous week
        if (weekEntries.length > 0) {
            // Use the last entry of the week (most recent data for that week)
            const lastEntry = weekEntries[weekEntries.length - 1];
            weeklyData.push(lastEntry);
        }

        // Start a new week
        currentWeek = weekKey;
        weekEntries = [entry];
    } else {
        weekEntries.push(entry);
    }
});

// Handle the last week
if (weekEntries.length > 0) {
    const lastEntry = weekEntries[weekEntries.length - 1];
    weeklyData.push(lastEntry);
}

console.log(`Weekly entries: ${weeklyData.length}`);
console.log(`First entry: ${weeklyData[0].date}`);
console.log(`Last entry: ${weeklyData[weeklyData.length - 1].date}`);

// Write the weekly data back to the historical file
fs.writeFileSync(historicalPath, JSON.stringify(weeklyData));
console.log('✅ Successfully aggregated data to weekly values');
