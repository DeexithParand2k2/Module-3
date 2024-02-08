//import logo from './logo.svg';
import './App.css';
import Webcam from 'react-webcam'
import { useEffect, useRef, useState } from 'react';

function App() {

  const webcamref = useRef(null)
  const inputBoxRef = useRef(null)
  const [images,storeImages] = useState([])
  const [username,setUsername] = useState('')
  const [nouser, setNouser] = useState(false)
  const [closedCam,setClosedCam] = useState(true) 

  function captureFrame() {
    const imageSrc = webcamref.current.getScreenshot();
    const blob = dataURItoBlob(imageSrc);
    const file = new File([blob], `${Date.now()}.png`, { type: 'image/png' });

    const updatedArray = [...images, file];
    storeImages(updatedArray);
  }

  // function dataURItoBlob(dataURI) {
  //   dataURI = dataURI.replace(/^data:/, '');

  //   const type = dataURI.match(/image\/[^;]+/);
  //   const base64 = dataURI.replace(/^[^,]+,/, '');
  //   const arrayBuffer = new ArrayBuffer(base64.length);
  //   const typedArray = new Uint8Array(arrayBuffer);

  //   for (let i = 0; i < base64.length; i++) {
  //       typedArray[i] = base64.charCodeAt(i);
  //   }

  //   return new Blob([arrayBuffer], {type});
  // }

  function dataURItoBlob(dataURI) {
    // Split the data URI to get the MIME type and the data
    const [mime, data] = dataURI.split(',');
  
    // Extract the base64 encoded data
    const byteString = atob(data);
  
    // Create a typed array from the base64 data
    const byteNumbers = new Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      byteNumbers[i] = byteString.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
  
    // Create a Blob with the data and MIME type
    return new Blob([byteArray], { type: mime });
  }

  function storeRequest() {
    if (username !== '') {
      setNouser(false);
  
      const formData = new FormData();
      formData.append('username', username);
      images.forEach((image, index) => {
        formData.append('images', image);
      });
      
      for (var key of formData.entries()) {
        console.log(key[0] + ', ' + key[1])
      }
  
      fetch('http://localhost:8000/uploads', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          // Handle the response from the server
          if (response.status === 200) {
            console.log('Images uploaded successfully.');
            storeImages([])
            setUsername('')
            inputBoxRef.current.value = ""
          } else {
            console.error('Failed to upload images.');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      setNouser(true);
    }
  }
  

  function closecam(){
    setClosedCam(!closedCam)
  }

  useEffect(()=>{
    console.log('updated array of images', images)
  },[images])

  return (
    <div className="App">
      <header className="App-header">

        <input ref={inputBoxRef} type="text" onChange={(e)=>{
          setUsername(e.target.value)
        }} placeholder='username'/>
        
        {
          !closedCam ? (
            <Webcam ref={webcamref} height={600} width={600} />
          ) : (
            <div style={{backgroundColor:"inherit", height:"600px", width:"600px"}}>
            </div>
          )
        }
          
        
        <div style={{display:'flex',flexDirection:'row',gap:'20px'}}>
          <button onClick={captureFrame}>capture</button>
          <button onClick={closecam}>close-cam</button>
          <button onClick={storeRequest}>store</button>
        </div>

        {nouser && <h1>Don't leave the username empty</h1>}
        
      </header>
    </div>
  );
}

export default App;
