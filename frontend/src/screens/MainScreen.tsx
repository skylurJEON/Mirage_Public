import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// 네비게이션 타입 정의 (별도 파일로 분리해도 좋습니다)
type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Data: undefined;
  ModelSelection: undefined;
};

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export default function MainScreen() {
    const navigation = useNavigation<MainScreenNavigationProp>();
    const [isAnimating, setIsAnimating] = useState(false);
    const translateX = useRef(new Animated.Value(0)).current;

    const handleAnimateBox = () => {
        if(isAnimating) return;
        setIsAnimating(true);
        console.log('Animating box...'); 
        Animated.timing(translateX, {
          toValue: -600,
          duration: 2000,
          useNativeDriver: true, 
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }).start(() => {console.log('Animation Done!'); setIsAnimating(false);}); 
      };

    useFocusEffect(
        useCallback(() => {
            console.log('Returning to MainScreen, resetting box position...');
            Animated.timing(translateX, {
                toValue: 0, // 원래 위치로 복귀
                duration: 1200,
                useNativeDriver: true,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            }).start();
        }, [])
    );

    return (
        <View style={styles.container}>
            <View style={styles.animatebox}>
                <View style={styles.buttonContainer}>
                    <View style={styles.LogoContainer}>
                        <Text style={styles.logotext}>MI'{'\n'}Ra{'\n'}GE{'\n'}</Text>
                    </View>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => {handleAnimateBox();navigation.navigate('ModelSelection');}}
                >
                   <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => {handleAnimateBox();navigation.navigate('Data');}}
                >
                    <Text style={styles.buttonText}>Data</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => {handleAnimateBox();navigation.navigate('Login');}}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <View style={styles.smallbuttonContainer}>
                    <TouchableOpacity style={styles.smallbutton}>
                        <Text style={styles.smallbuttontext}>Setting</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.smallbutton}>
                        <Text style={styles.smallbuttontext}>Help</Text>
                    </TouchableOpacity>
                </View>
                </View>
                <Animated.View style={[styles.box, { transform: [{ translateX }] }]}></Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logotext: {
        fontSize: 24,
        color: 'black',
        fontWeight: '800',
        marginBottom: 30,
        marginLeft: 20,
        marginTop: 40,
    },

    animatebox: {
        width: '100%',
        height: '80%',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
    },
    box: {
        width: '160%',
        height: '80%',
        backgroundColor: '#e3e3e3',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: -8, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 5,
    },
    LogoContainer: {
        marginBottom: '80%',
    },

    buttonContainer: {
        width: '50%',
        height: '80%',
        justifyContent: 'flex-end',
    },
    button: {
        padding: 5,
    },
    buttonText: {
        color: 'black',
        fontSize: 40,
        fontWeight: '300',
    },
    smallbuttonContainer: {
        marginTop: 10,
    },
    smallbutton: {
        //marginLeft: 5,
    },
    smallbuttontext: {
        fontSize: 18,
        padding: 8,
        fontWeight: '300',
    },
});