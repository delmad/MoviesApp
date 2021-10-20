import React, { useEffect, useState } from 'react';
import {ActivityIndicator, Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import {getPopularMovies, getUpcomingMovies, getPopularTv,getFamilyMovies, getDocumentaryMovie} from '../services/services';
import { SliderBox } from "react-native-image-slider-box";
import List from '../components/List';
import Error from '../components/Error';

//dimensija mobitela ili ekrana 
const dimentions = Dimensions.get('screen');

const Home = ({navigation }) => {
    const[moviesImages, setMoviesImages] = useState();
    const[upcomingMovies, setUpcomingMovies] = useState();
    const[popularMovies, setPopularMovies] = useState();
    const[popularTv, setPopularTv] = useState();
    const[familyMovies, setFamilyMovies] = useState();
    const[documentaryMovie, setDocumentaryMovie] = useState();

    const[error, setError] = useState(false);
    const[loaded, setLoaded] = useState(false);


    const getData =() =>{
        return Promise.all([
          getUpcomingMovies(),
          getPopularMovies(),
          getPopularTv(),
          getFamilyMovies(),
          getDocumentaryMovie(),
        ]);
    };

    useEffect (() => {
      getData()
      .then(
        ([
          upcomingMoviesData,
          popularMoviesData,
          popularTvData,
          familyMoviesData,
          documentaryMovieData,
        ])=>{
          const moivesImagesArray = [];
          upcomingMoviesData.forEach(movie => {
              moivesImagesArray.push(
                'https://image.tmdb.org/t/p/w500'+movie.poster_path
                );  
          });
          
          setMoviesImages(moivesImagesArray);
          setPopularMovies(popularMoviesData);
          setPopularTv(popularTvData);
          setFamilyMovies(familyMoviesData);
          setDocumentaryMovie(documentaryMovieData);
          
        },
        )
        .catch(() =>{
          setError(true);
        })
        .finally(()=>{
          setLoaded(true);
        });

    }, []);
  
    return (
        <React.Fragment>
          {loaded && !error && (<ScrollView>
            {moviesImages && (<View style={styles.sliderContainer}>
            <SliderBox 
                images={moviesImages} 
                dotStyle={styles.sliderStyle}
                sliderBoxHeight={dimentions.height / 1.5} 
                autoplay={true} 
                circleLoop={true} 
            />
        </View>)}

         {popularMovies && (<View style={styles.carousel}>
          <List navigation={navigation} title="Popular Movies" content={popularMovies}/>
        </View>)}

        {popularTv && (<View style={styles.carousel}>
          <List navigation={navigation} title="Popular TV Shows" content={popularTv}/>
        </View>)}
        {familyMovies && (<View style={styles.carousel}>
          <List navigation={navigation} title="Family Movies" content={familyMovies}/>
        </View>)}
        {documentaryMovie && (<View style={styles.carousel}>
          <List navigation={navigation} title="Documentary Movies" content={documentaryMovie}/>
        </View>)}
        
        </ScrollView>)}
        {!loaded &&<ActivityIndicator size="large" color="#00ff00"/>}
        {error && <Error/>}
        </React.Fragment>    
   
    );
};

const styles = StyleSheet.create({
    sliderContainer:{
        flex: 1,
          justifyContent: "center",
          alignItems: "center"
           
    },
    sliderStyle:{
        height:0
    },
    carousel:{
        flex: 1,
          justifyContent: "center",
          alignItems: "center"
           
    },
});

export default Home;