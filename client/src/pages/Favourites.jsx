import React, {useState, useEffect} from 'react'
import DefaultHeader from '../components/DefaultHeader/DefaultHeader';
import {
  Grid,
  Typography,
  Paper,
  Box,
} from '@material-ui/core'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { FavouritesWraper, FavouritesLists, FavouriteCard, FavouriteImg } from './FavouritesStyle';

const Favourites = () => {
  const paperStyle = {
    padding: 20,
    width: 320,
    height: 'auto',
    margin: '25px'
  }

  const [favourites, setFavourites] = useState([]);
  // const [showAddToCartMessage, setShowAddToCartMessage] = useState(false); // to be added in sprint 2

  useEffect(() => {
    fetchFavourites();
    // setShowAddToCartMessage(false);
  }, [])


  const fetchFavourites = async () => {
    const TEMP_WISHLIST_ID = '6142f237423da20abed34513';
    const response = await fetch(`http://localhost:4000/favourites/${TEMP_WISHLIST_ID}`);
    const data = await response.json();

    setFavourites(data.products);
  }

  const removeProduct = async (productId) => {
    const TEMP_WISHLIST_ID = '6142f237423da20abed34513';
    const response = await fetch(`http://localhost:4000/favourites/remove/${TEMP_WISHLIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "productId": productId
      })
    });

    const data = await response.json();

    // Update cart information
    setFavourites(data.products);
  }

  // // Not fully working, will fix next sprint
  // const addFavouritesToCart = async () => {
  //   const TEMP_CART_ID = '613f3abe06c475e0525cee9b';
  //   await fetch('http://localhost:4000/favourites/addToCart', {
  //     method: 'PATCH',
  //     headers: {
  //       'Accept': 'application/json',
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify({
  //       "favourites": favourites,
  //       "cartId": TEMP_CART_ID
  //     })
  //   });

  //   setShowAddToCartMessage(true);
  // }

  return (
    <div>
      <h2>Favourites</h2>
      <FavouritesWraper>
        {favourites.length ? (
          <FavouritesLists>
            {
              favourites.map(product => (
                <FavouriteCard key={product._id} display="flex" paddingY="5px" alignItems="center" style={{justifyContent: 'space-between'}}>
                  <FavouriteImg src={product.image} alt={product.name} />
                  <div style={{ paddingTop: '20%' }}>
                    <Typography variant="h7" >{product.name}</Typography>
                    <br />
                    <br />
                    <Typography variant="h7" style={{ marginTop: '20%' }}>${product.price}</Typography>
                  </div>
                  <HighlightOffIcon size="20" style={{cursor: 'pointer'}} onClick={() => removeProduct(product._id)} />
                </FavouriteCard>
              ))
            }
          </FavouritesLists>
        ) : null}
        {/* To be added next sprint
        {<button style={{whiteSpace: "nowrap"}} onClick={addFavouritesToCart}>Add all to cart</button>
          showAddToCartMessage ? <p style={{margin: 0, color: '#555'}}>Added {favourites.length} item(s) to your cart</p> : null
        } */}
      </FavouritesWraper>
    </div>
  )
}

export default Favourites;
