import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import SignUp from '../App/Screens/SignUpScreen';
import Login from '../App/Screens/LoginScreen';
import Dashboard from '../App/Screens/DashboardScreen';

const AuthStack = createStackNavigator({
    Login: Login,
    SignUp: SignUp,
}, {
    headerMode: 'none', initialRouteName: 'Login'
});

const DashboardStack = createStackNavigator({
    Dashboard: Dashboard,
}, {
    initialRouteName: 'Dashboard', headerMode: 'none'
});

const App = createSwitchNavigator({
    Auth: AuthStack,
    Dashboard: DashboardStack
},
    { initialRouteName: 'Auth' }
);


export default createAppContainer(App);