'use client'
import WebApp from "@twa-dev/sdk";
import { initUtils } from '@tma.js/sdk';
import React, { useEffect, useState } from "react";
import { generateInviteCode } from "./utils/encode_decode";

const API_BASE_URL = process.env.NODE_ENV === 'development' ? 'http://139.177.202.65:6543' : '/api';

console.log("env 0", process.env.NODE_ENV);

interface UserRegistration {
  id: number;
  registrationDate: string;  // format: "YYYY.MM"
}

const userRegistrations: UserRegistration[] = [
  { id: 100000000, registrationDate: "2015.06" },
  { id: 250000000, registrationDate: "2016.06" },
  { id: 410000000, registrationDate: "2017.06" },
  { id: 630000000, registrationDate: "2018.07" },
  { id: 970000000, registrationDate: "2019.07" },
  { id: 1370000000, registrationDate: "2020.06" },
  { id: 1930000000, registrationDate: "2021.07" },
  { id: 5500000000, registrationDate: "2022.06" },
  { id: 6245952118, registrationDate: "2023.07" }
];

export default function Home() {
  const [tokenToTake, setTokenToTake] = useState(0);
  const [btcToTake, setBtcToTake] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [registerYears, setRegisterYears] = useState(0);
  const [recommender, setRecommender] = useState<string>("0");
  const [userData, setUserData] = useState<string | null>("null");
  const [userToken, setUserToken] = useState<string>("0");
  const [firstImage, setFirstImage] = useState<string>('');
  const [thirdValue, setThirdValue] = useState<number>(3);
  
  useEffect(() => {
    const initializeApp = () => {
      if (WebApp.initDataUnsafe.user) {
        const user = WebApp.initDataUnsafe.user;
        setUserId(user.id.toString());
        const yearIdx = binarySearch(user.id);
        setRegisterYears(Math.floor(calculateYearsSince(userRegistrations[yearIdx].registrationDate)));
      }

      setUserData(encodeURIComponent(JSON.stringify(WebApp.initData).slice(1, -1)));
      console.log("data", userData);

      // setUserId("1390026482");
      // setRegisterYears(4);

      // const recommender = "0";
      if (WebApp.initDataUnsafe.start_param) {
        setRecommender(WebApp.initDataUnsafe.start_param);
      }
    };

    const fetchData = async () => {
      if (!userId) return;

      try {
        const scoreResponse = await fetch(`${API_BASE_URL}/api/user/score?user_id=${userId}&years=${registerYears}&user_data=${userData}`);
        console.log("scoreResponse", scoreResponse);
        if (!scoreResponse.ok) {
          console.log("score failed");
          throw new Error('API request failed');
        }
        const response = await scoreResponse.json();
        setTokenToTake(response.token_score);
        const btcScore = response.btc_score;
        setBtcToTake(btcScore || 3);
        setUserToken(response.token);
        console.log("response", response);

        // Call /api/recommend after receiving the response from /api/user/score
        await callRecommendAPI(response.token);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const callRecommendAPI = async (token: string) => {
      try {
        const encryptedNewUser = generateInviteCode(Number(userId));
        const refParams = {
          old_user: recommender,
          new_user: encryptedNewUser,
          token: token
        };

        const refResponse = await fetch(`${API_BASE_URL}/api/recommend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...refParams })
        });
        if (!refResponse.ok) {
          throw new Error('API request failed');
        }
      } catch (error) {
        console.error('Error calling recommend API:', error);
      }
    };

    initializeApp();
    fetchData();
    
  }, [userId, registerYears, recommender]);

  useEffect(() => {
    const dealBtcToTake = async() => {
      console.log("dealBtcToTake - btcToTake", btcToTake)
      const n = btcToTake;
      const selftFirstImage = `v${getMagnitude(n)}.svg`
      const selfThirdValue = Math.floor(n / (10 ** (getMagnitude(n) - 1)))

      console.log(selftFirstImage, selfThirdValue)
      setFirstImage(selftFirstImage)
      setThirdValue(selfThirdValue)
    }
    dealBtcToTake();
  }, [btcToTake]);

  function calculateYearsSince(dateString: string) {
    const now = new Date();
    const [year, month] = dateString.split('.').map(Number);
    const registrationDate = new Date(year, month - 1);
    const diff = now.getTime() - registrationDate.getTime();
    return diff / (1000 * 60 * 60 * 24 * 365);  // returns decimal registerYears
  }

  function binarySearch(userId: number): number {
    let low = 0;
    let high = userRegistrations.length - 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midValue = userRegistrations[mid].id;

      if (midValue === userId) {
        return mid;
      } else if (midValue < userId) {
        if (mid === userRegistrations.length - 1 || userRegistrations[mid + 1].id > userId) {
          return mid;
        }
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }

    return userRegistrations.length - 1; // Return 1 if userId is smaller than all IDs in the array
  }

  

  function getMagnitude(n: number) {
    return n === 0 ? 0 : Math.floor(Math.log(n) / Math.log(10)) + 1;
  }

  async function handleInvite() {
    
    const inviteResponse = await fetch(`${API_BASE_URL}/api/user/referral-code?user_id=${userId}&token=${userToken}`)
    if (!inviteResponse.ok) {
      throw new Error('API request failed');
    }
    const response = await inviteResponse.json();
    const utils = initUtils();
    utils.openLink(`https://t.me/share/url?url=https://t.me/huhthevirus_bot/virus?startapp=${encodeURIComponent(`${response.referral_code}\n\nInfect as many people as possible.`)}`,
      {
        tryInstantView: true,
        tryBrowser: false
      }
    )
    // utils.openTelegramLink(
    //   `https://t.me/share/url?url=https://t.me/ppppooogg_bot/pdd123?startapp=${response.referral_code}`
    // );
  }

  return (
    <div className="bg-black h-screen px-8 py-10 flex flex-col gap-8">
      <img className='w-32 h-28 mx-auto' src="/images/final.webp" alt="" />
      
      {/* Referral Reward group */}
      {btcToTake && <div className="border-2 border-gray-700 rounded-lg p-4">
        <h3 className='text-white text-center mb-4'>Referral Reward</h3>
        <div className="flex justify-between items-center">
          <img className="w-20" src={`/images/${firstImage}`} alt="" />
          <img className="w-[32px]" src="/images/mul.svg" alt="" />
          <img className="w-20" src={`/images/${thirdValue}.svg`} alt="" />
        </div>
      </div>}

      {/* Token Reward group */}
      <div className="border-2 border-gray-700 rounded-lg p-4">
        <p className="text-white text-center mb-4">Token Reward</p>
        <p className="text-white text-center">
          <span className="text-lime-600">{tokenToTake}</span> $VIRUS
        </p>
      </div>

      <div className="bg-lime-500 text-black text-center mt-auto h-10 leading-10 rounded-lg" onClick={handleInvite}>
        Infect Others
      </div>
    </div>
  );
}