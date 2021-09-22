import React, {useState, useEffect, useContext} from 'react';
import ApiUrlContext from '../ApiUrlContext.js';
import {
  Grid,
  Typography,
  Paper,
  Box,
} from '@material-ui/core'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const Favourites = () => {
  const paperStyle = {
    padding: 20,
    width: 320,
    height: 'auto',
    margin: '25px'
  }

  const ApiUrl = useContext(ApiUrlContext);
  const [favourites, setFavourites] = useState([]);
  // const [showAddToCartMessage, setShowAddToCartMessage] = useState(false); // to be added in sprint 2

  useEffect(() => {
    fetchFavourites();
    // setShowAddToCartMessage(false);
  }, [])


  const fetchFavourites = async () => {
    const userId = JSON.parse(window.localStorage.getItem('MyUser'))._id;
    const response = await fetch(`${ApiUrl}/favourites/${userId}`);
    const data = await response.json();

    setFavourites(data);
  }

  const removeProduct = async (productId) => {
    const userId = JSON.parse(window.localStorage.getItem('MyUser'))._id;
    const response = await fetch(`${ApiUrl}/favourites/remove/${userId}`, {
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
    setFavourites(data);
  }

  // // Not fully working, will fix next sprint
  // const addFavouritesToCart = async () => {
  //   const TEMP_CART_ID = '613f3abe06c475e0525cee9b';
  //   await fetch(`${ApiUrl}/favourites/addToCart`, {
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
      <Grid container direction="column" alignItems="center">
        {favourites.length ? (
          <Paper elevation={10} style={paperStyle}>
            {
              favourites.map(product => (
                <Box key={product._id} display="flex" paddingY="5px" alignItems="center" style={{justifyContent: 'space-between'}}>
                  <img src={product.image} alt={product.name} />
                  <Typography variant="h6">{product.name}</Typography>
                  <HighlightOffIcon size="20" style={{cursor: 'pointer'}} onClick={() => removeProduct(product._id)} />
                </Box>
              ))
            }
          </Paper>
        ) : null}
        {/* To be added next sprint
        {<button style={{whiteSpace: "nowrap"}} onClick={addFavouritesToCart}>Add all to cart</button>
          showAddToCartMessage ? <p style={{margin: 0, color: '#555'}}>Added {favourites.length} item(s) to your cart</p> : null
        } */}
      </Grid>
    </div>
  )
}

export default Favourites;
