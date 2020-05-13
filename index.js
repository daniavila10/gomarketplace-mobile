import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';

import App from './src';

AppRegistry.registerComponent(appName, () => App);
