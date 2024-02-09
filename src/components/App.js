import React, {useEffect} from 'react';
import NewYearCanvas from './NewYearCanvas';
import ReactGA from 'react-ga';

function App() {

  useEffect(()=>{
    ReactGA.pageview(window.location.pathname);
  },[])

  const bgImages = [
    {
      alt:'dragon-bg-1',
      src: './images/dragon-bg-1.png'
    },
    {
      alt:'dragon-bg-2',
      src: './images/dragon-bg-2.png'
    },
    {
      alt:'dragon-bg-3',
      src: './images/dragon-bg-3.png'
    }
  ]

  const stickers = [
    {
      alt:'sticker_hand',
      src: './images/dragon-head.png'
    },
    {
      alt:'sticker_tail',
      src: './images/dragon-tail.png'
    },
    {
      alt:'sticker-money-1',
      src: './images/sticker-money-1.png'
    },
    {
      alt:'sticker-money-2',
      src: './images/sticker-money-2.png'
    },
    {
      alt:'sticker-dragon-1',
      src: './images/sticker-dragon-1.png'
    },
    {
      alt:'sticker-dragon-2',
      src: './images/sticker-dragon-2.png'
    },
    {
      alt:'sticker-dragon-3',
      src: './images/sticker-dragon-3.png'
    },
    {
      alt:'sticker-dragon-4',
      src: './images/sticker-dragon-4.png'
    }
  ]

  return (
    <div className="App">
      <NewYearCanvas bgImages={bgImages} stickers={stickers}/>
    </div>
  );
}

export default App;
