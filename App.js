import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, ActivityIndicator} from 'react-native';
import * as Location from 'expo-location';

const  {width :SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY ="cf4a9714e1841a29d6093eb23d206d94";

export default function App() {
  const [city, setCity] = useState("Loading..")
  const [days, setDays] = useState([]);
  const [ok, setok] = useState(true);
  const getWeather = async () => {
    const {granted} =  await Location.requestForegroundPermissionsAsync();
    if(!granted) {
      setok(false);
    }
    const {coords : {latitude , longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false})
    setCity(location[0].city)
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`)
    const json = await response.json()
    const arr = json.weather[0]
    Object.assign(arr, json.main);
    console.log(arr);
    setDays(arr);

  
  };
  useEffect(() => {
    getWeather();
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar style='light'/>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        pagingEnabled     //페이지처럼 넘겨짐
        horizontal        //수평으로 만들기
        contentContainer  //scrollView 영역만큼 영역 확보
        showsHorizontalScrollIndicator={false}  //scrollView의 스크롤바 없애기
        ActivityInd
        Style={styles.weather}
        >
          {days.length === 0 ? (
            <View style={styles.day}>
              <ActivityIndicator color="white" size="large" style={{marginTop:10}} />
            </View> ) : 
          <>
            <View style={styles.day}>
              <Text style={styles.content}>
                {parseFloat(days.temp).toFixed(1)}
              </Text>
            </View>
            <View style={styles.day}>
              <Text style={styles.content}>{days.main}</Text>
            </View> 
            <View style={styles.day}>
              <Text style={styles.content}>{days.description}</Text>
            </View> 
          </>
            
            
          } 
         
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex : 1, 
    backgroundColor : "#CCFFCC"
  },
  city : {
    flex : 1, 
    justifyContent : "center",
    alignItems : "center"
  },
  cityName : {
    fontSize : 55,
    fontWeight : "500",
  },
  weather : {
  
  },
  day : {
    width:SCREEN_WIDTH,
    alignItems : "center",
  },
  temp : {
    fontSize : 178,
    marginTop : 50,
  },
  description : {
    marginTop: -30,
    fontSize : 60,
  },
  content : {
    fontSize : 60,
    marginTop : 70,
  }

});
