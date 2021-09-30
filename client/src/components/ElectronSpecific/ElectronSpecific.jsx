import React, {useState, useEffect, useContext} from "react";
import {ElectronButtonWrapper, ElectronButton, ElectronLoadMessage} from './ElectronSpecificStyle';
import ApiUrlContext from '../../ApiUrlContext.js';

export default function ElectronSpecific({setFavourites, favouritesLists}) {
  const ApiUrl = useContext(ApiUrlContext);
  const [favouritesFile, setFavouritesFile] = useState('');
  const [showMessage, setShowMessage] = useState('');
  const [wishList, setWishList] = useState();

  const require = window.require;
  // Dialog and remote from electron
  const remote = require('@electron/remote');
  const {dialog} = remote;

  // Use the fs and paths modules from node
  const fs = require('fs');
  const path = require('path');

  const saveFavouritesAsFile = async () => {
    let text = '';
    const data = await dialog.showSaveDialog({
      properties: ['createDirectory'],
      title: 'Select the File Path to save',
      defaultPath: path.join(__dirname, '../desktop/wishlist.txt'),
      buttonLabel: 'Save',
      filters: [
        {
          name: 'Text Files',
          extensions: ['txt', 'docx']
        },]
    }).then(file => {
      // Stating whether dialog operation was cancelled or not.
      if (!file.canceled) {
        for (let i = 0; i < favouritesLists.length; i++) {
          text += favouritesLists[i].name + '\n';
          fs.writeFile(file.filePath.toString(),
            text, function (err) {
              if (err) throw err;
              console.log('Saved!');
            });
        }
        setFavouritesFile(path.basename(file.filePath));
        setShowMessage('write')
      }
    }).catch(err => {
      console.log(err)
    });
    setWishList(favouritesLists);
  }

  const loadFavouritesFromFile = async () => {
    const data = await dialog.showOpenDialog({
      properties: ['openFile'],
    });

    if (!data.canceled) {
      const filePath = data.filePaths[0];
      console.log(path);

      // Get and set filename from path
      const fileName = path.basename(data.filePaths[0]);
      setFavouritesFile(fileName);

      // Extract file content and format it
      const content = fs.readFileSync(filePath, {encoding: 'utf-8'});
      const formattedContent = content.split('\n');
      setFileAsFavourites(formattedContent);
    }
  }

  const setFileAsFavourites = async (favourites) => {
    const userId = JSON.parse(window.localStorage.getItem('MyUser'))._id;
    const response = await fetch(`${ApiUrl}/favourites/addFile/${userId}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({favourites})
    });
    const data = await response.json();
    setFavourites(data);
    setShowMessage('read');
  }

  const writeMessage = () => (
    <ElectronLoadMessage>Created the favourites file {favouritesFile}</ElectronLoadMessage>
  )

  const readMessage = () => (
    <ElectronLoadMessage>Loaded favourites from {favouritesFile}</ElectronLoadMessage>
  )

  return (
    <>
      <ElectronButtonWrapper>
        <ElectronButton onClick={saveFavouritesAsFile}>Save favourites to file</ElectronButton>
        <ElectronButton onClick={loadFavouritesFromFile}>Load favourites from file</ElectronButton>
      </ElectronButtonWrapper>
      {
        showMessage === 'write'
          ? writeMessage()
          : showMessage === 'read'
            ? readMessage()
            : null
      }
    </>
  )
}
