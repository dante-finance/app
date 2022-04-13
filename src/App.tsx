import React, { Suspense, lazy, useMemo } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { ThemeProvider as TP } from '@material-ui/core/styles';
import { ThemeProvider as TP1 } from 'styled-components';
import { UseWalletProvider } from 'use-wallet';
import usePromptNetwork from './hooks/useNetworkPrompt';
import BanksProvider from './contexts/Banks';
import TombFinanceProvider from './contexts/TombFinanceProvider';
import ModalsProvider from './contexts/Modals';
import store from './state';
import theme from './theme';
import newTheme from './newTheme';
import config from './config';
import Updaters from './state/Updaters';
import Loader from './components/Loader';
import Popups from './components/Popups';
import Regulations from './views/Regulations/Regulations';
import { App404 } from './components/App/App404';
import { AppQueryClient } from './queryClient';

const Home = lazy(() => import('./views/Home'));
const Cemetery = lazy(() => import('./views/Cemetery'));
const Masonry = lazy(() => import('./views/Masonry'));
const Pit = lazy(() => import('./views/Pit'));
const Vaults = lazy(() => import('./views/Vaults/Vaults'));
const Autocompounders = lazy(() => import('./views/Autocompounders/Autocompounders'));
const Minting = lazy(() => import('./views/Minting/Minting'));

const App: React.FC = () => {
  // Clear localStorage for mobile users
  if (typeof localStorage.version_app === 'undefined' || localStorage.version_app !== '1.0') {
    localStorage.clear();
    localStorage.setItem('connectorId', '');
    localStorage.setItem('version_app', '1.0');
  }

  usePromptNetwork();

  return (
    <Providers>
      <Router>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/purgatory">
              <Cemetery />
            </Route>
            <Route path="/eden">
              <Masonry />
            </Route>
            <Route path="/inferno">
              <Pit />
            </Route>
            <Route path="/regulations">
              <Regulations />
            </Route>
            <Route path="/vaults">
              <Vaults />
            </Route>
            <Route path="/autocompounders">
              <Autocompounders />
            </Route>
            <Route path="/minting">
              <Minting />
            </Route>
            <Route path="*">
              <App404 />
            </Route>
          </Switch>
        </Suspense>
      </Router>
    </Providers>
  );
};

const Providers: React.FC = ({ children }) => {
  const connectors = useMemo(
    () => ({
      walletconnect: { rpcUrl: config.defaultProvider },
    }),
    [],
  );

  return (
    <TP1 theme={theme}>
      <TP theme={newTheme}>
        <UseWalletProvider chainId={config.chainId} connectors={connectors}>
          <QueryClientProvider client={AppQueryClient}>
            <Provider store={store}>
              <Updaters />
              <TombFinanceProvider>
                <ModalsProvider>
                  <BanksProvider>
                    <Popups />
                    {children}
                  </BanksProvider>
                </ModalsProvider>
              </TombFinanceProvider>
            </Provider>
          </QueryClientProvider>
        </UseWalletProvider>
      </TP>
    </TP1>
  );
};

export default App;
