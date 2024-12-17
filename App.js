import AppNavigator from './src/AppNavigator';
import {PaperProvider} from 'react-native-paper';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

export default function App() {
  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
      </GestureHandlerRootView>
    </>
  );
}

function AppWithTheme() {
  const {theme} = useContext(ThemeContext);
  if (!theme) {
    return null; // or a loading spinner if desired
  }

  return (
    <>
      <AuthContextProvider>
          <AppNavigator />
      </AuthContextProvider>
    </>
  );
}
