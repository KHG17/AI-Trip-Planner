import React, { useEffect, useState } from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { Input } from '@/components/ui/input';
import { AI_PROMPT, SelectBudgetOptions, SelectTravelsList } from '@/constants/options';
import { Button } from '@/components/ui/button'
import { toast } from 'sonner';
import { chatSession } from '@/service/AIModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader
} from "@/components/ui/dialog"
import { FcGoogle } from "react-icons/fc";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/service/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import logo from '../../src/assets/logo.svg';

function CreateTrip() {
  const [ place, setPlace ] = useState();
  const [ formData, setFormData ] = useState([]);
  const [ openDialog, setOpenDialog ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  
  const navigate = useNavigate();

  const handleInputChange = (name,value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => GetUserProfile(codeResponse),
    onError: (error) => console.log(error)
  });

  const OnGenerateTrip = async () => {

    const user = localStorage.getItem('user');

    if (!user) {
      setOpenDialog(true)
      return ;
    }

    if (formData?.numberOfDays > 5 && !formData?.location || !formData?.budget || !formData?.people) {
      toast("Please fill out all of the details!")
      return ;
    }

    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT
    .replace('{location}',formData?.location?.label)
    .replace('{totalDays}',formData?.numberOfDays)
    .replace('{people}',formData?.people)
    .replace('{budget}',formData?.budget)
    .replace('{totalDays}',formData?.numberOfDays)

    const result = await chatSession.sendMessage(FINAL_PROMPT);

    console.log("--",result?.response?.text());
    setLoading(false);
    SaveAiTrip(result?.response?.text())
  };

  const SaveAiTrip = async (TripData) => {
    
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();

    await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: JSON.parse(TripData),
      userEmail: user.email,
      id: docId
    });
    setLoading(false);
    navigate('/view-trip/'+docId);
  };

  const GetUserProfile = (tokenInfo) => {
    
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo.access_token}`,{
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'application/json'
      }
    }).then((response) => {
      console.log(response);
      localStorage.setItem('user',JSON.stringify(response.data));
      setOpenDialog(false);
      OnGenerateTrip();
    })
  };

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10'>
      <h2 className='font-bold text-3xl'>Tell us your travel preferences</h2>
      <p className='mt-3 text-gray-500 text-xl'>Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.</p>

      <div className='mt-20 flex flex-col gap-9'>
        <div>
          <h2 className='text-xl my-3 font-medium'>What is your destination of choice?</h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange:(value) => { setPlace(value); handleInputChange('location',value)}
            }}
          />
        </div>

        <div>
          <h2 className='text-xl my-3 font-medium'>How many days are you planning your trip?</h2>
          <Input placeholder={'Ex.4'} type='number'
            onChange={(e) => handleInputChange('numberOfDays',e.target.value)}
          />
        </div>
      </div>

      <div>
        <h2 className='text-xl my-3 font-medium'>What is your budget?</h2>
        <div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectBudgetOptions.map((item,index) => (
            <div key={index} 
              onClick={() => handleInputChange('budget',item.title)}
            className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg
            ${formData.budget === item.title && 'shadow-lg border-black'}
            `}>
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.description}</h2>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className='text-xl my-3 font-medium'>Who do you plan on traveling with?</h2>
        <div className='grid grid-cols-3 gap-5 mt-5'>
          {SelectTravelsList.map((item,index) => (
            <div key={index} 
              onClick={() => handleInputChange('people',item.people)}
            className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg
            ${formData.people === item.people && 'shadow-lg border-black'}
            `}>
              <h2 className='text-4xl'>{item.icon}</h2>
              <h2 className='font-bold text-lg'>{item.title}</h2>
              <h2 className='text-sm text-gray-500'>{item.description}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className='my-10 justify-end flex'>
      <Button disabled={loading} onClick={OnGenerateTrip}>
        {loading ? (
          <div className="flex items-center gap-2">
            <AiOutlineLoading3Quarters className="h-5 w-5 animate-spin" />
            <span>Generating, please wait!</span>
          </div>
        ) : (
          'Generate Trip'
        )}
      </Button>
      </div>

      {/* Sign-In Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogDescription>
              <img src={logo} alt="logo" className="h-12 mx-auto" />
              <h2 className="font-bold text-lg mt-7 text-center text-gray-900 dark:text-white">
                Sign In With Google
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-center">
                Sign into the app with Google authentication securely.
              </p>
              <Button
                onClick={login}
                className="w-full mt-5 bg-white text-gray-700 font-semibold border border-gray-300 hover:bg-gray-100 flex items-center gap-2 py-2 px-4 rounded-lg shadow-md"
              >
                <FcGoogle className="text-2xl" />
                Sign In With Google
              </Button>
              <Button variant="outline" className="w-full mt-2" onClick={() => setOpenDialog(false)}>
                Close
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateTrip
