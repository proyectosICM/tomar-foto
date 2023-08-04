import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-elements';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library'; // Importamos la librería

const App = () => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la cámara y la galería.');
      }
    })();
  }, []);

  const uploadImageToImgur = async (imageUri) => {
    try {
      const base64Image = await convertImageToBase64(imageUri);

      const response = await axios.post(
        'https://api.imgur.com/3/image',
        { image: base64Image },
        {
          headers: {
            'Authorization': 'Client-ID ee0c72edd17d07a',
          },
        }
      );

      if (response.status === 200) {
        // La imagen se ha subido exitosamente.
        const uploadedImageUrl = response.data.data.link;
        console.log('Imagen subida con éxito:', uploadedImageUrl);
        // Aquí puedes hacer lo que desees con la URL de la imagen subida (por ejemplo, guardarla en tu base de datos, mostrarla en tu aplicación, etc.).
      } else {
        console.log('Error al subir la imagen:', response.data);
      }
    } catch (error) {
      console.log('Error al subir la imagen:', error);
    }
  };

  const convertImageToBase64 = async (imageUri) => {
    try {
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return `data:image/jpeg;base64,${base64Image}`;
    } catch (error) {
      throw new Error('Error al convertir la imagen a base64: ' + error);
    }
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri);
      }
    } catch (error) {
      console.log('Error al tomar la foto:', error);
    }
  };

  const handleEnviar = () => {
    if (image) {
      // Subir la imagen al servidor antes de establecerla en null.
      uploadImageToImgur(image);
    }
    //setImage(null);
  };

  const handleGuardar = async () => {
    if (image) {
      try {
        const asset = await MediaLibrary.createAssetAsync(image); // Guardar la imagen en la galería
        if (asset) {
          Alert.alert('Imagen guardada', 'La imagen se ha guardado en la galería.');
        }
      } catch (error) {
        Alert.alert('Error', 'Hubo un error al guardar la imagen: ' + error);
      }
    }
  };

  return (
    <View style={styles.container}>
      {image ? (
        <>
          <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
          <View style={styles.buttonsContainer}>
            <Button title={'Ed'} onPress={handleEnviar} />
            <Button title={'Guardar'} onPress={handleGuardar} />
          </View>
        </>
      ) : (
        <View style={styles.previewContainer}>
          <Button title="Tomar Foto" onPress={handleImagePicker} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    width: '80%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
  },
  image: {
    width: '50%',
    height: '50%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
});

export default App;
