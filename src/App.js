import logo from './logo.svg';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './fire config';
import { useState } from 'react';


firebase.initializeApp(firebaseConfig);
function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email:'',
    photo:'',
  })

  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();

  const handleSignIn = ()=>{
    firebase.auth().signInWithPopup(googleProvider)
    .then(res =>{
      const {displayName, photoURL, email}=res.user;
      const signedInUser={
        isSignedIn: true,
        name: displayName,
        email: email,
        password: '',
        photo: photoURL
      }
      setUser(signedInUser);
    })
    .catch(error =>{
      console.log(error);
      console.log(error.message);
    })
  }

  const handleFbSignIn = () =>{
    firebase.auth().signInWithPopup(fbProvider)
  .then((result) => {
    
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    // ...
    console.log('user', user);
  })
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });
  }

  const handleSignOut =() => {
   firebase.auth().signOut()
   .then(res =>{
     const signedOutUser ={
       isSignedIn: false,
       name: '',
       email:'',
        photo:'',
        error:'',
        success:''
     }
     setUser(signedOutUser);
   })
   .catch(error =>{
     console.log(error);
   })
  }

  const handleBlur = (e) => {
   let isFieldValid = true;
    if(e.target.name === 'email'){
    
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }
    if(e.target.name === 'password'){
    const isPasswordValid = e.target.value.length > 6;
    const passwordHasNumber =/\d{1}/.test(e.target.value);
    isFieldValid =isPasswordValid && passwordHasNumber;
    }
    if(isFieldValid){
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }
  const handleSubmit = (e) => {
    // console.log(user.email, user.password)
    if(newUser && user.email && user.password){
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
   .then(res => {
    const newUserInfo = {...user};
    newUserInfo.error = '';
    newUserInfo.success = true;
    setUser(newUserInfo);
    updateUserName(user.name);
  })
  .catch((error) => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success= false;
    setUser(newUserInfo);
  });
    }

 if(!newUser && user.email && user.password){
    firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    .then(res => {
      const newUserInfo = {...user};
      newUserInfo.error = '';
      newUserInfo.success= true;
      setUser(newUserInfo);
      console.log('sign in user info', res.user);
  })
  .catch(error => {
    const newUserInfo = {...user};
    newUserInfo.error = error.message;
    newUserInfo.success= false;
    setUser(newUserInfo);
  });

    }
      e.preventDefault();
  }

  const updateUserName = name => {
    const user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: name
     
    }).then(function() {
    console.log('user name update successfully')
    }).catch(function(error) {
      console.log(error)
    });
  }

  return (
    <div className="App">
   {
     user.isSignedIn ? <button onClick={handleSignOut} >Sign out</button>:
    <button onClick={handleSignIn} >Sign in</button>
   }
   <br/>
   <button onClick={handleFbSignIn}>Sign in using Facebook</button>
    {
      user.isSignedIn && <div>
         <p>welcome,{user.name}</p>
         <p>Your email{user.email}</p>
         <img src={user.photo} alt=""/>
         </div>
    }

    <h1>Our own Authentication</h1>
    <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
    <label htmlFor="newUser">New User Sign Up</label>
    <form onSubmit={handleSubmit}>
   {newUser && <input name="name" type="text" onBlur={handleBlur} placeholder="Your name"/>}
      <br/>
    <input type="text" onBlur={handleBlur} name="email" placeholder="Your Email address" required/>
    <br/>
    <input type="password" onBlur={handleBlur} name="password" placeholder="Your Password" required/>
    <br/>
   <input type="submit" value={newUser ? 'Sign Up' : 'Sing In'}/>
    </form>
    <p style={{color:'red'}}>{user.error}</p>
    {
      user.success && <p style={{color:'green'}}>User {newUser ? 'created' : 'Logged In ' }successfully</p>
    }
    </div>
  );
}

export default App;
