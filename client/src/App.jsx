import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import './App.css'
import FrontPage from './pages/FrontPage';
import Home from './pages/Home';
import Login from './pages/Login';
import Product from './pages/Product';
import MyCart from './pages/MyCart';
import RegisterPage from './pages/RegisterPage';
import ShippingDetails from './pages/ShippingDetails';
import Header from './components/Header/Header';
import Favourites from './pages/Favourites';
import Casual from './pages/Casual';
import Sport from "./pages/Sport";
import Formal from "./pages/Formal";
import DefaultHeader from './components/DefaultHeader/DefaultHeader';
import Footer from './components/footer/Footer';
import ThankYou from './pages/ThankYou';



function App() {
  
  const [user, setUserLogin] = useState({})
  // check is user is store in local storage
  useEffect(() => {
    setUserLogin(JSON.parse(localStorage.getItem("MyUser")))
  }, [])
  const stayLogedin = (user) => {
    localStorage.setItem("MyUser", JSON.stringify(user))
    setUserLogin(user)
  }
  const [favourites, setFavourites] = useState([])
  const [shoppingList, setShoppingList] = useState([]);

  const onAdd = (product) => {
    const exist = favourites.find(favourite => favourite._id === product._id);
    setFavourites([...favourites, { ...product }])
    if (exist) {
      setFavourites(
        favourites.map(favourite =>
          favourite._id === product._id ? { ...exist, quantity: exist.quantity + 1 }
            : favourite
        )
      )
    } else {
      setFavourites([...favourites, product])
    }
  }
  const onRemove = (product) => {
    const exist = favourites.find(favourite => favourite._id === product._id);
    if (exist.quantity === 1) {
      setFavourites(favourites.filter(favourite => favourite._id !== product._id))
    } else {
      setFavorites(
        favourites.map(favourite =>
          favourite._id === product._id
            ? { ...exist, quantity: exist.quantity - 1 }
            : favourite
        )
      )
    }
  }

  const addToShoppingList = (product) => {
    const exist = shoppingList.find(shoppingItem => shoppingItem._id === product._id);
    setShoppingList([...shoppingList, { ...product }])
    if (exist) {
      setShoppingList(
        shoppingList.map(shoppingItem =>
          shoppingItem._id === product._id ? { ...exist, quantity: exist.quantity + 1 }
            : shoppingItem
        )
      )
    } else {
      setShoppingList([...shoppingList, product])
    }
    
  }
  const removeFromShoppingList = (product) => {
    const exist = shoppingList.find(shoppingItem => shoppingItem._id === product._id);
    if (exist.quantity === 1) {
      setShoppingList(shoppingList.filter(shoppingItem => shoppingItem._id !== product._id))
    } else {
      setShoppingList(
        shoppingList.map(shoppingItem =>
          shoppingItem._id === product._id
            ? { ...exist, quantity: exist.quantity - 1 }
            : shoppingItem
        )
      )
    }
  }
  return (

    <div className="App">
      
      <Router>
        {user && user._id ? <Header stayLogedin={stayLogedin} userName={user.name}/>
          : <DefaultHeader />}
        <Switch>
          <Route exact path="/">
            <FrontPage />   
           </Route>
          <Route path="/home">
              {
              user && user._id ?
                <Home stayLogedin={stayLogedin} userName={user.name} favourites={favourites} onAdd={onAdd} />
                : <Login stayLogedin={stayLogedin} />
            }
          </Route>
          <Route path="/login">
              <Login stayLogedin={stayLogedin}/>
            </Route> 
            <Route path="/register">
              <RegisterPage/>
            </Route>
          <Route path="/casual">
            <Casual favourites={favourites} onAdd={onAdd} />
          </Route>
          <Route path="/sport">
            <Sport favourites={favourites} onAdd={onAdd}/>
          </Route>
          <Route path="/formal">
            <Formal favourites={favourites} onAdd={onAdd}/>
          </Route>
          <Route path="/register">
            <RegisterPage/>
          </Route>
          <Route exact path="/products">
            <Home favourites={favourites} onAdd={onAdd} /> 
          </Route>
          <Route path="/products/:id">
            <Product
              favourites={favourites}
              shoppingList={shoppingList}
              onAdd={onAdd}
              addToShoppingList={addToShoppingList}
            />
          </Route>
          <Route path="/favourites">
             {
               user && user._id ? <Favourites
              favourites={favourites}
              onAdd={onAdd}
              onRemove={onRemove}
            /> : <Login stayLogedin={stayLogedin}/>
             }
          </Route>
          <Route path="/checkout">
            {
              user && user._id ? <ShippingDetails/> : <RegisterPage/>
            }    
          </Route>
          <Route path="/mycart">
            {
              user && user._id ? <MyCart/> : <Login stayLogedin={stayLogedin}/>
            }
          </Route>
          <Route exact path="/thankyou">
            <ThankYou/>
          </Route>

        </Switch>
      </Router>
    </div>
  )}

export default App;
    


