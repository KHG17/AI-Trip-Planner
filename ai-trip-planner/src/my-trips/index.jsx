import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';

function MyTrips() {

  const [ userTrips, setUserTrips ] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const GetUserTrips = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/');
        return;
      }

      const user = JSON.parse(storedUser);
      const q = query(collection(db, 'AITrips'), where('userEmail', '==', user?.email));

      try {
        const querySnapshot = await getDocs(q);
        const tripsArray = querySnapshot.docs.map(doc => doc.data());
        setUserTrips(tripsArray);
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    };

    GetUserTrips();
  }, [navigate]);

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>My Trips</h2>

      <div className='grid grid-cols-2 mt-10 md:grid-cols-3 gap-5'>
        {userTrips?.length > 0 ? userTrips.map((trip, index) => (
            <UserTripCardItem trip={trip} key={index}/>
        ))
        :Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className='h-[220px] w-full bg-slate-200 animate-pulse rounded-xl'></div>
        ))}
      </div>
    </div>
  )
}

export default MyTrips
