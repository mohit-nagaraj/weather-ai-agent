export const getWeatherDetails = async (city) => {
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}&aqi=no`);
    const data = await response.json();
    return data;
}