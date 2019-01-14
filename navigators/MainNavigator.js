import {createStackNavigator, createAppContainer} from 'react-navigation';
import Detail from "../screens/Detail";
import Home from "../screens/Home";
import Tags from '../screens/Tags';

const MainNavigator = createStackNavigator({
  Home,
  Detail,
  Tags
}, {
  initialRouteName: "Home"
});

export default createAppContainer(MainNavigator);