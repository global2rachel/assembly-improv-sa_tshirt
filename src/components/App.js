import NewYearCanvas from './NewYearCanvas';

function App() {
  const bgImages = [
    {
      alt:'bg_2022newyear_01.png',
      src: '/images/bg_2022newyear_01.png'
    },
    {
      alt:'bg_2022newyear_02.png',
      src: '/images/bg_2022newyear_02.png'
    },
    {
      alt:'bg_2022newyear_03.png',
      src: '/images/bg_2022newyear_03.png'
    },
  ]

  return (
    <div className="App">
      <NewYearCanvas bgImages={bgImages} />
      
    </div>
  );
}

export default App;
