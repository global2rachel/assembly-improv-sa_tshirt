import React, {useEffect} from 'react';
import NewYearCanvas from './NewYearCanvas';
import ReactGA from 'react-ga';

function App() {

  useEffect(()=>{
    ReactGA.pageview(window.location.pathname);
  },[])

  const bgImages = [
    {
      alt:'bg_2022newyear_01.png',
      src: './images/bg_2022newyear_01.png'
    },
    {
      alt:'bg_2022newyear_02.png',
      src: './images/bg_2022newyear_02.png'
    },
    {
      alt:'bg_2022newyear_03.png',
      src: './images/bg_2022newyear_03.png'
    },
  ]

  const stickers = [
    {
      alt:'sticker_hand',
      src: './images/sticker_hand.png'
    },
    {
      alt:'sticker_hat',
      src: './images/sticker_hat.png'
    },
  ]

  return (
    <div className="App">
      <NewYearCanvas bgImages={bgImages} stickers={stickers}/>
    </div>
  );
}

export default App;
