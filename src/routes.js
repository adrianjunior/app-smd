import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Home from './Pages/Home';
import KeysFilter from './Pages/Filters/KeysFilter';
import ResourcesFilter from './Pages/Filters/ResourcesFilter';
import Room from './Pages/Room';
import RoomsFilter from './Pages/Filters/RoomsFilter';
import Swap from './Pages/User/Swap';
import Loans from './Pages/Admin/Loans';
import Requests from './Pages/Admin/Requests';
import AdminKeys from './Pages/Admin/AdminKeys';
import AdminResources from './Pages/Admin/AdminResources';

const Routes = createAppContainer(
    createStackNavigator({
        Home,
        KeysFilter,
        ResourcesFilter,
        Room,
        RoomsFilter,
        Swap,
        Loans,
        Requests,
        AdminKeys,
        AdminResources
    }, {
        headerMode: 'none',
        navigationOptions: {headerVisible: false,}
    })
);

export default Routes;