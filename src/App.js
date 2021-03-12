import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './fire config';
import { useState } from 'react';


firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email:'',
    photo:'',
  })


  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = ()=>{
    firebase.auth().signInWithPopup(provider)
    .then(res =>{
      const {displayName, photoURL, email}=res.user;
      const signedInUser={
        isSignedIn: true,
        name:displayName,
        email: email,
        photo: photoURL
      }
      setUser(signedInUser);
      console.log(res)

    })
    .catch(error =>{
      console.log(error);
      console.log(error.message);
    })
  }

  const handleSignOut =() => {
   firebase.auth().signOut()
   .then(res =>{
     const signedOutUser ={
       isSignedIn: false,
       name: '',
       photo:'',
       email:''
     }
     setUser(signedOutUser);
   })
   .catch(error =>{
     console.log(error);
   })
  }

  const handleBlur = (e) => {
   let isFormValid;
    if(e.target.name === 'email'){
      const isEmailValid = /\S+@\S+\.\S+/.test(e.target.value);
      console.log(isEmailValid)
    }
    if(e.target.name === 'password'){
    const isPasswordValid = e.target.value.length > 6;
    const passwordHasNumber =/\d{1}/.test(e.target.value);
    console.log(isPasswordValid)
    }
  }
  const handleSubmit = () => {

  }

  return (
    <div className="App">
   {
     user.isSignedIn ? <button onClick={handleSignOut} >Sign out</button>:
    <button onClick={handleSignIn} >Sign in</button>
   }
    {
      user.isSignedIn && <div>
         <p>welcome,{user.name}</p>
         <p>{user.email}</p>
         <img src={user.photo} alt=""/>
         </div>
    }

    <h1>Our own Authentication</h1>
    <form onSubmit={handleSubmit}>
    <input type="text" onBlur={handleBlur} name="email" placeholder="Your Email address" required/>
    <br/>
    <input type="password" onBlur={handleBlur} name="password" placeholder="Your Password" required/>
    <br/>
   <input type="submit" value="Submit"/>
    </form>
    </div>
  );
}

export default App;
