import React, {useState, useEffect, useContext} from 'react';
import ApiUrlContext from '../ApiUrlContext.js';
import {Grid, Typography, Paper, Box, } from '@material-ui/core'
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import {AddtoCartButton, SizeButtonWrapper, SizeButton} from './ProductStyle.jsx';
import {FavouritesWrapper, Backdrop, Modal, ModalHeading, InvertedAddtoCartButton} from './FavouritesStyle.jsx';

const Favourites = () => {
  const paperStyle = {
    padding: 20,
    width: 320,
    height: 'auto',
    margin: '25px'
  }

  const ApiUrl = useContext(ApiUrlContext);
  const [favourites, setFavourites] = useState([]);
  const [size, setSize] = useState(null);
  const [showSizePicker, setShowSizePicker] = useState(false);

  useEffect(() => {
    fetchFavourites();
    setShowSizePicker(false);
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

  // Not fully working, will fix next sprint
  const addFavouritesToCart = async () => {
    const userId = JSON.parse(window.localStorage.getItem('MyUser'))._id;
    // await fetch(`${ApiUrl}/favourites/addToCart/${userId}`, {
    //   method: 'PATCH',
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     "favourites": favourites,
    //     "cartId": TEMP_CART_ID
    //   })
    // });
    setShowSizePicker(true);
  }

  return (
    <FavouritesWrapper>
      <h2>Favourites</h2>
      <Grid container direction="column" alignItems="center">
        {favourites.length ? (
          <>
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
            <AddtoCartButton style={{whiteSpace: "nowrap"}} onClick={addFavouritesToCart}>Add favourites to cart</AddtoCartButton>
          </>
        ) : null}
        {showSizePicker ? (
          <>
            <Backdrop onClick={() => setShowSizePicker(false)} />
            <Modal>
              <ModalHeading>What is your size?</ModalHeading>
              <SizeButtonWrapper> {/* conditional styling will be added when size matches button */}
                <SizeButton selected={size === 37} onClick={() => setSize(37)}>37</SizeButton>
                <SizeButton selected={size === 38} onClick={() => setSize(38)}>38</SizeButton>
                <SizeButton selected={size === 39} onClick={() => setSize(39)}>39</SizeButton>
                <SizeButton selected={size === 40} onClick={() => setSize(40)}>40</SizeButton>
                <SizeButton selected={size === 41} onClick={() => setSize(41)}>41</SizeButton>
                <SizeButton selected={size === 42} onClick={() => setSize(42)}>42</SizeButton>
                <SizeButton selected={size === 43} onClick={() => setSize(43)}>43</SizeButton>
                <SizeButton selected={size === 44} onClick={() => setSize(44)}>44</SizeButton>
                <SizeButton selected={size === 45} onClick={() => setSize(45)}>45</SizeButton>
                <SizeButton selected={size === 46} onClick={() => setSize(46)}>46</SizeButton>
              </SizeButtonWrapper>
              <InvertedAddtoCartButton>Confirm</InvertedAddtoCartButton>
            </Modal>
          </>
        ) : null}
      </Grid>
    </FavouritesWrapper>
  )
}

export default Favourites;
