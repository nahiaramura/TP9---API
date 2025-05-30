import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView, // agregado correctamente
} from "react-native";

import axios from "axios";

const API_KEY = "7b62fa5d"; // Reemplaza con tu propia API key de OMDb

const App = () => {
  const [imdbId, setImdbId] = useState("tt0317219");
  const [movieData, setMovieData] = useState(null);
  const [loading, setLoading] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const fetchMovieData = async () => {
    if (!imdbId.trim()) {
      Alert.alert("Error", "Por favor, ingresa un ID de IMDb válido.");
      return;
    }

    setLoading(true);
    setMovieData(null);

    try {
      const response = await axios.get(`http://www.omdbapi.com/`, {
        params: {
          i: imdbId,
          apikey: API_KEY,
        },
        timeout: 5000,
      });

      await sleep(3000);

      if (response.data.Response === "True") {
        setMovieData(response.data);
      } else {
        Alert.alert(
          "No encontrado",
          response.data.Error || "Película no encontrada"
        );
      }
    } catch (error) {
      console.log("Error: ", error);
      if (error.code === "ECONNABORTED") {
        Alert.alert(
          "Timeout",
          "La solicitud ha tardado demasiado en responder."
        );
      } else {
        Alert.alert("Error", "Hubo un problema al consultar la API.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <Text style={styles.title}>Buscar Película por IMDb ID</Text>

      <TextInput
        style={styles.input}
        placeholder="Ej: tt0111161"
        value={imdbId}
        onChangeText={setImdbId}
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={fetchMovieData}>
        <Text style={styles.buttonText}>Buscar</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {movieData && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.result}>
          <Image
            source={{ uri: movieData.Poster }}
            style={styles.poster}
            resizeMode="contain"
          />
          <Text style={styles.movieTitle}>{movieData.Title}</Text>

          <Text style={styles.detail}>
            <Text style={styles.label}>Actors:</Text> {movieData.Actors}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.label}>Director:</Text> {movieData.Director}
          </Text>
          <Text style={styles.detail}>
            <Text style={styles.label}>Genre:</Text> {movieData.Genre}
          </Text>

          <Text style={[styles.label, { marginTop: 12 }]}>Ratings:</Text>
          {movieData.Ratings &&
            movieData.Ratings.map((rating, index) => (
              <Text key={index} style={styles.rating}>
                {rating.Source}: {rating.Value}
              </Text>
            ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    marginTop: 16,
    marginBottom: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  result: {
    alignItems: "center",
    marginTop: 16,
    paddingBottom: 32,
  },
  poster: {
    width: "100%",
    height: 400,
    marginBottom: 12,
    borderRadius: 8,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  detail: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
  },
  rating: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 4,
  },
});

export default App;
