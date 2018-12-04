import {createAppContainer, createStackNavigator} from "react-navigation";
import MemoHome from "./pages/home";
import MemoCreate from "./pages/create";

const AppNavigator = createStackNavigator({
    Home: {screen: MemoHome},
    Create: {screen: MemoCreate},
});

export default createAppContainer(AppNavigator);