import React from 'react'
import PlaceCardItem from './PlaceCardItem';

function Places({ trip }) {
  const itineraryArray = trip?.tripData?.itinerary 
  ? Object.entries(trip.tripData.itinerary).map(([key, value]) => ({
    day: `Day ${key.replace("day", "")}`,
    dayNumber: Number(key.replace("day", "")),
    ...value
  }))
  .sort((a,b) => a.dayNumber - b.dayNumber)
  : [];

  return (
    <div>
      <h2 className='font-bold text-lg'>Places to Visit</h2>

      <div>
        {itineraryArray.map((item,index) => (
            <div key={index} className='mt-5'>
                <h2 className='font-medium text-lg'>{item.day}</h2>
                <div className='grid md:grid-cols-2 gap-5'>
                {item.activities.map((place,index) => (
                    <div className='my-3' key={index}>
                        <h2 className='font-medium text-sm text-orange-600'>{place.time}</h2>
                        <PlaceCardItem place={place} />
                    </div>
                ))}
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}

export default Places
