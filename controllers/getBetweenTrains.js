export const getBetweenTrains = async (req, res) => {
    const { source, destination, date } = req.query;
    const url = `https://irctc-api2.p.rapidapi.com/trainAvailability?source=${source}&destination=${destination}&date=${date}`;

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.IRCTC_API_KEY,
            'x-rapidapi-host': 'irctc-api2.p.rapidapi.com',
            'Content-Type': 'application/json'
        }
    };

    const trainsInfo = []

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (result.success === false || result.error === "No trains found") {
            return res.status(200).json({
                status: 404,
                response: [],
                message: "No direct trains found."
            });
        }

        res.status(200).json({
            status: 200,
            response: result,
            message: "Available Train Fetched"
        });
    } catch (error) {
        console.error("External api error ", error);
        res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        });
    }
}