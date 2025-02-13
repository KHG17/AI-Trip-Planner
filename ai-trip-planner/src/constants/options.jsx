export const SelectTravelsList = [
    {
        id: 1,
        title: 'Just Me',
        description: 'A single traveler',
        icon: '✈️',
        people: '1 person'
    },
    {
        id: 2,
        title: 'Me + Significant Other ',
        description: 'A couple traveling',
        icon: '👯',
        people: '2 people'
    },
    {
        id: 3,
        title: 'Me + Family',
        description: 'A family of travelers',
        icon: '🏡',
        people: '3 to 5 or more people'
    },
    {
        id: 4,
        title: 'Me + Friends',
        description: 'A group of travelers',
        icon: '🥳',
        people: '4 to 6 or more people'
    },
]

export const SelectBudgetOptions = [
    {
        id: 1,
        title: 'Cheap',
        description: 'Keep cost on the cheaper side',
        icon: '💰',
    },
    {
        id: 2,
        title: 'Moderate',
        description: 'Keep cost on the reasonable side',
        icon: '💸',
    },
    {
        id: 3,
        title: 'Luxury',
        description: `Don't worry about cost`,
        icon: '🤑',
    },
]

export const AI_PROMPT='Generate Travel Plan for Location : {location}, for {totalDays} Days for {people} with a {budget} budget, give me Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket Pricing, Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format.'