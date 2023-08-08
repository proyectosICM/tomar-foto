import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from 'react-native-elements';
import axios from 'axios';

const App = () => {
  const [image, setImage] = useState(null);
  const userAccessToken = 'e7eefedec49196bf8229bedb7324c29d72ef4bd3'; // Reemplaza 'YOUR_USER_ACCESS_TOKEN' con el token de acceso de usuario obtenido.

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la cámara y la galería.');
      }
    })();
  }, []);

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

  const handleEnviar = async () => {
    if (image) {
      try {
        const formData = new FormData();
        formData.append('image', { uri: image, name: 'image.jpg', type: 'image/jpeg' });
        
        const response = await axios.post('https://api.imgur.com/3/image', formData, {
          headers: {
            'Authorization': `Bearer ${userAccessToken}`, // Incluye el token de acceso de usuario en el encabezado de autorización.
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          // La imagen se ha subido exitosamente.
          const uploadedImageUrl = response.data.data.link;
          console.log('Imagen subida con éxito:', uploadedImageUrl);
          setImage(null);
        } else {
          console.log('Error al subir la imagen:', response.data);
        }
      } catch (error) {
        console.log('Error al subir la imagen:', error);
      }
    }
  };

  const handleVerImagen = () => {
    alert('AKER')
  }

  return (
    <View style={styles.container}>
      {image ? (
        <>
          <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
          <Button title={'Enviar'} onPress={handleEnviar} />
        </>
      ) : (
        <View style={styles.previewContainer}>
          <Button title="Tomar Foto" onPress={handleImagePicker} />
        </View>
      )}
      <Button title={'Ver imagen'} onPress={() => handleVerImagen()} />
      {/* zona para la imagen */}
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
});

export default App;
