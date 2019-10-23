import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Home from './Pages/Home';
import KeysFilter from './Pages/Filters/KeysFilter';
import ResourcesFilter from './Pages/Filters/ResourcesFilter';
import Room from './Pages/Room';
import RoomsFilter from './Pages/Filters/RoomsFilter';
import Swap from './Pages/User/Swap';
import Loans from './Pages/Admin/Loans';
import Requests from './Pages/Admin/Requests'

const Routes = createAppContainer(
    createStackNavigator({
        Home,
        KeysFilter,
        ResourcesFilter,
        Room,
        RoomsFilter,
        Swap,
        Loans,
        Requests
    }, {
        headerMode: 'none',
        navigationOptions: {headerVisible: false,}
    })
);

export default Routes;