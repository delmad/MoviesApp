import React, { useEffect, useState } from 'react';
import { StyleSheet,Image, Dimensions, ActivityIndicator, Text,View, Modal,Pressable } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {getMovie} from '../services/services';
import StarRating from 'react-native-star-rating';
import dateFormat from 'dateformat';
import PlayButton from '../components/PlayButton';


const placeholderImage = require('../assets/images/placeholder.png');
const height = Dimensions.get('screen').height;

const Detail = ({route, navigation}) => {
    const movieId = route.params.movieId;

    const [movieDetail, setMovieDetail] = useState();
    const [loaded, setLoaded] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
  


useEffect(()=>{
    getMovie(movieId).then(movieData =>{
        setMovieDetail(movieData);
        setLoaded(true);
    });
}, [movieId]);
  
const videoShow =() =>{
    setModalVisible(!modalVisible);
};

    return (
        <React.Fragment>
            {loaded &&(
                <View>
                <ScrollView>
            <Image 
                style={styles.image}
                source={
                    movieDetail.poster_path ? 
                    {uri:'https://image.tmdb.org/t/p/w500' + movieDetail.poster_path}
                    : placeholderImage
                }
                />
                <View style={styles.container}>
                    <View style={styles.playButton}>
                        <PlayButton handlePress={videoShow}/>
                    </View>
                <Text style={styles.movieTitle}>{movieDetail.title}</Text>
                {movieDetail.genres && (
                    <View style={styles.genresContainer}>
                        {movieDetail.genres.map(genre =>{
                            return (
                                <Text style={styles.genre} key={genre.id}>{genre.name}</Text>
                            );
                        })}
                    </View>
                )}
                <StarRating 
                disabled={true} 
                maxStars={5} 
                rating={movieDetail.vote_average /2}
                fullStarColor={'gold'}
                starSize={30}
                />
                <Text style={styles.overview}>{movieDetail.overview}</Text>
                <Text style={styles.release}>{'Relese date:' + dateFormat(movieDetail.release_date, 'mmmm dS, yyyy')}</Text>
                </View>
            </ScrollView>
            <Modal animationType="slide" visible={modalVisible}>
                <View style={styles.videoModal}>
                <Pressable onPress={()=> videoShow()}>
                    <Text>{'Hide Modal'}</Text>
                </Pressable>
                </View>
                </Modal>    
            </View>
            )}
            {!loaded &&<ActivityIndicator size="large" color="#00ff00"/>}
        </React.Fragment>
    );
};

const styles = StyleSheet.create({

    image: {
        height:height / 2.5,
    },
    movieTitle:{
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    container:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    genresContainer:{
        flexDirection: 'row',
        alignContent: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    genre :{
        marginRight:10,
        fontWeight:'bold',
    },
    overview:{
        padding: 15,
    },
    release:{
         fontWeight: 'bold',   
    },
    playButton:{
        position:'absolute',
        top: -12,
        right: 10,
    },
    videoModal:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Detail;