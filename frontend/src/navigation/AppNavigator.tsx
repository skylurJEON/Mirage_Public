import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

import MainScreen from '../screens/MainScreen';
import LoginScreen from '../screens/LoginScreen';
import DataScreen from '../screens/DataScreen';
import ModelSelectionScreen from '../screens/ModelSelectionScreen';

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Data: undefined;
  ModelSelection: undefined;
}; 

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Main" 
            screenOptions={{ headerShown: false,
                transitionSpec: {
                    open : {
                        animation: 'timing',
                        config: {
                            duration: 1000,
                        }
                    },
                    close : {
                        animation: 'timing',
                        config: {
                            duration: 1000,
                        }
                    }
                }
             }}>
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Data" component={DataScreen} />
                <Stack.Screen name="ModelSelection" component={ModelSelectionScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}