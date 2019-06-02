
console.info('weather endpoint script picks up the request');

const weatherForm = document.querySelector('form');
const searchInput = document.querySelector('input');
const output = document.getElementById('output');

const fetchWeather = (address) => {
  fetch(`/weatherEndpoint?address=${address}`).then((response)=>{
    console.info('response plain:', response);
    response.json().then((data)=>{
      let out = '';
      console.info('DATA:', data, data.error);
      if (data.error) {
        console.log('returned errir', data.error);
        out = `${data.error}`;
      } else {
        out = `${data.address}<br/>${data.location}<br/>${data.forecast}`;
      }
      output.innerHTML = out;
    });
  });
}

weatherForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const searchValue = searchInput.value;
  let haveValue = !!searchValue;
  if (haveValue) {
    fetchWeather(searchValue);
  } else {
    console.info('kidding');
  }
});