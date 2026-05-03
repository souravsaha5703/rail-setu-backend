export const getSmartRouteAvailability = async (junctions, date) => {

    const results = [];

    for (const junction of junctions) {
        try {
            const leg1Source = junction.leg1.from.code;
            const leg1Destination = junction.leg1.to.code;
            const leg2Source = junction.leg2.from.code;
            const leg2Destination = junction.leg2.to.code;

            const options = {
                method: 'GET',
                headers: {
                    'x-rapidapi-key': process.env.IRCTC_API_KEY,
                    'x-rapidapi-host': 'irctc-api2.p.rapidapi.com',
                    'Content-Type': 'application/json'
                }
            };

            const leg1Url = `https://irctc-api2.p.rapidapi.com/trainAvailability?source=${leg1Source}&destination=${leg1Destination}&date=${date}`;
            const leg2Url = `https://irctc-api2.p.rapidapi.com/trainAvailability?source=${leg2Source}&destination=${leg2Destination}&date=${date}`;

            // Fetch both legs in parallel
            const [leg1Response, leg2Response] = await Promise.all([
                fetch(leg1Url, options),
                fetch(leg2Url, options)
            ]);

            const leg1Result = await leg1Response.json();
            const leg2Result = await leg2Response.json();

            results.push({
                rank: junction.rank,
                stationCode: junction.stationCode,
                stationName: junction.stationName,
                leg1: {
                    from: junction.leg1.from,
                    to: junction.leg1.to,
                    data: leg1Result
                },
                leg2: {
                    from: junction.leg2.from,
                    to: junction.leg2.to,
                    data: leg2Result
                }
            });

        } catch (error) {
            console.error(`⚠️ Failed for junction ${junction.stationCode}:`, error.message);
            throw new Error(`Failed to fetch availability for junction ${junction.stationCode}: ${error.message}`);
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    return results;
};