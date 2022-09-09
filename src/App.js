import React, {useState, useEffect,useRef, memo} from 'react';
import axios from "axios";

import {
  IoMdSunny,
  IoMdRainy,
  IoIosCloudy,
  IoMdSnow,
  IoIosThunderstorm,
  IoMdSearch,
  IoMdCloudy,
  IoMdThunderstorm
} from "react-icons/io";
import {BsCloudHaze2Fill, BsCloudDrizzleFill, BsEye, BsWater, BsThermometer, BsWind} from "react-icons/bs";
import {TbTemperatureCelsius} from "react-icons/tb";
import {ImSpinner8} from "react-icons/im";

const API_KEY = "a1b2f8e24d47ad6ac9f67d034181f8dd";

const App = memo(() => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState("Odessa")
  const [inputValue, setInputValue] = useState("");
  const [animation, setAnimation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const ref = useRef(null)

  useEffect(() => {
    setLoading(true);

    const url=  `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${API_KEY}`;

    axios.get(url).then((res) => {
      setTimeout(() => {
        setData(res.data);

        setLoading(false);
      }, 750)
    }).catch((error) => {
      setLoading(false);
      setErrorMsg(error);
    });
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg("");
    }, 1000)
    return() => clearTimeout(timer);
  }, [errorMsg])

  const handleInput = (q) => {
    setInputValue(q.target.value);
  };

  const handleSubmit = (q) => {
    q.preventDefault();

    if (inputValue !== "") {
      setLocation(inputValue);
    }

    if (ref.current.value === "") {
      setAnimation(true);

      setTimeout(() => {
        setAnimation(false);
      }, 500)
    }

    ref.current.value = "";
  };

  if (!data) {
    return (
        <div className = "w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center
    flex flex-col items-center justify-center">
          <div className = "">
            <ImSpinner8 className = "text-5xl lg:text-7xl animate-spin text-white"/>
          </div>
        </div>
    );
  }

  let icon;
//data.weather[0].main
  switch (data.weather[0].main) {
    case "Clouds":
      icon = <IoMdCloudy/>;
      break;
    case "Haze":
      icon = <BsCloudHaze2Fill className = "text-indigo-200"/>;
      break;
    case "Rain":
      icon = <IoMdRainy className = "text-blue-500"/>;
      break;
    case "Clear":
      icon = <IoMdSunny className = "text-yellow-400"/>;
      break;
    case "Drizzle":
      icon = <BsCloudDrizzleFill className = "text-blue-500"/>
      break;
    case "Snow":
      icon = <IoMdSnow className = "text-sky-500"/>;
      break;
    case "Thunderstorm":
      icon = <IoMdThunderstorm className = "text-yellow-200"/>;
      break;
  }

  const date = new Date();

  return (
    <div className = "w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center
    flex flex-col items-center justify-center px-4 lg:px-0">
      {errorMsg && (
        <div className = "w-full max-w[90vw] lg:max-w-[300px] min-h-[40px] bg-red-800 top-2 lg:top-10
        absolute capitalize rounded-full flex justify-center items-center text-white text-lg font-semibold">
          {`${errorMsg.response.data.message}`}
        </div>
      )}
      <form className = {`${animation ? `animate-shake` : `animate-none`}
      h-16 bg-black/30 w-full max-w-sm rounded-full backdrop-blur-[32px] mb-4`}>
        <div className = "h-full relative flex justify-between items-center p-2">
          <input onChange = {(q) => handleInput(q)}
              className = "flex-1 bg-transparent outline-none placeholder:text-black text-lg px-2 h-full"
              type = "text"
              placeholder = "Search by country/city"
              ref = {ref}
          />
          {/*bg-violet-600 bg-indigo-50*/}
          <button onClick = {(q) => handleSubmit(q)}
              className = "bg-violet-600 hover:bg-violet-700 w-20 h-12 rounded-full flex justify-center items-center transition">
            <IoMdSearch className = "text-2xl"/>
          </button>
        </div>
      </form>
      <div className = "w-full max-w-[450px] bg-black/25 min-h-[600px] text-white
      backdrop-blur-[32px] rounded-[32px] py-10 px-8">
        {loading ?
            (<div className = "w-full h-full flex justify-center items-center">
                  <ImSpinner8 className = "text-4xl animate-spin text-white"/>
            </div>
            )
            :
            (
                <div>
                  {/* card top */}
                  <div className = "flex items-center gap-x-5">
                    <div className = "text-[100px]">{icon}</div>
                    <div>
                      <div className = "text-[25px] font-semibold">
                        {data.name}, {data.sys.country}
                      </div>
                      <div>
                        {date.getUTCDate()}/{date.getUTCMonth() + 1}/{date.getUTCFullYear()}
                      </div>
                    </div>
                  </div>
                  <div className = "my-20">
                    <div className = "flex justify-center items-start">
                      {/*  temp */}
                      <div className = "text-[120px] leading-none font-light">
                        {parseInt(data.main.temp)}
                      </div>
                      {/*  celsius icon*/}
                      <div className = "text-6xl -ml-4 -mt-4 ">
                        <TbTemperatureCelsius/>
                      </div>
                    </div>
                    {/*  weather descr  */}
                    <div className = "capitalize text-center mr-10">{data.weather[0].description}</div>
                  </div>
                  <div className = "max-w-[390px] mx-auto flex flex-col gap-y-6">
                    <div className = "flex justify-between">
                      <div className = "flex items-center gap-x-1">
                        {/*  icon */}
                        <div className = "text-xl">
                          <BsEye/>
                        </div>
                        <div>
                          Visibility <span className = "ml-1">{data.visibility / 1000} km</span>
                        </div>
                      </div>
                      <div className = "flex items-center gap-x-1">
                        {/*  icon */}
                        <div className = "text-xl">
                          <BsThermometer/>
                        </div>
                        <div className = "flex text-[17px] ">
                          Feels like <span className = "ml-1.5">{parseInt(data.main.feels_like)}</span>
                          <TbTemperatureCelsius/>
                        </div>
                      </div>
                    </div>
                    <div className = "flex justify-between">
                      <div className = "flex items-center gap-x-1">
                        {/*  icon */}
                        <div className = "text-xl">
                          <BsWater/>
                        </div>
                        <div>
                          Humidity <span className = "ml-1">{data.main.humidity} %</span>
                        </div>
                      </div>
                      <div className = "flex items-center gap-x-1">
                        {/*  icon */}
                        <div className = "text-xl">
                          <BsWind/>
                        </div>
                        <div className = "">
                          Wind<span className = "ml-1 font-light">{data.wind.speed} m/s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            )
        }
      </div>
    </div>
  );
});

export default App;