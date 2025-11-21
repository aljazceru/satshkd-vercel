const axios = require('axios')
const fs = require('fs');

module.exports = {
    bfx: async function() {
        const btcDataURL = "https://api-pub.bitfinex.com/v2/ticker/tBTCEUR"
        const response = await axios.get(btcDataURL)
        const data = response.data
            //console.log(data[6])

        const satDenominator = 100000000
            // see docs : https://docs.bitfinex.com/reference#rest-public-ticker
        const btcLastPrice = data[6] // LAST_PRICE in EUR

        const sateur = Math.round(satDenominator / btcLastPrice)
            //console.log("bitfinex last price: ", btcLastPrice, "current satEUR: ", sateur)
        return sateur
    },

    get10yr: async function() {
        //        console.log("get10yr")
        try {
            // const content = await fs.readFile('./public/historical')
            const content = fs.readFileSync('./public/historical', { encoding: 'utf8' })

            const historical = JSON.parse(content)
            hist_entries = []
            let datelist = []

            // Get all years from 2011 to previous year (skip current year since it's shown at top)
            const currentDate = new Date()
            const currentYear = currentDate.getFullYear()
            const previousYear = currentYear - 1
            const startYear = 2011

            for (let year = startYear; year <= previousYear; year++) {
                let targetDate
                let targetDateStr

                // For all years, use January 1st (or close to it) to find historical data
                targetDate = new Date(year, 0, 1) // January 1st of target year
                targetDateStr = targetDate.toISOString().slice(0, 10)

                // Find the closest date in historical data for this specific year
                let closestEntry = null
                let minDiff = Infinity

                for (let j = 0; j < historical.length; j++) {
                    const entryDate = new Date(historical[j]['date'])
                    // Only consider entries from the target year
                    if (entryDate.getFullYear() === year) {
                        const diff = Math.abs(entryDate - targetDate)

                        if (diff < minDiff) {
                            minDiff = diff
                            closestEntry = historical[j]
                        }
                    }
                }

                if (closestEntry) {
                    hist_entries.push(closestEntry)
                }
            }
            //  console.log(hist_entries)
            let final_list = []

            // Try to get current price from API, fallback to latest historical data if API fails
            let today_sats
            try {
                today_sats = await this.bfx()
            } catch (apiError) {
                console.log("API failed, using latest historical data as fallback")
                // Use the most recent entry in historical data as today's price
                today_sats = historical[historical.length - 1]['sateur_rate']
            }

            for (var v = 0; v < hist_entries.length; v++) {
                const date = new Date(hist_entries[v]['date'])
                year = date.getFullYear();
                rawsat = hist_entries[v]['sateur_rate']
                percentage = (-100 * ((rawsat - today_sats) / rawsat)).toFixed(3)
                final_list.push({ "year": date.toLocaleDateString(), "sats": rawsat.toLocaleString("en-US"), "percent": percentage });
            }
            return final_list
        } catch (error) {
            console.error("Error trying to read file ", error)
        }
    }

}
