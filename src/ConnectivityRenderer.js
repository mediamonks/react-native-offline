/* @flow */

import { Component } from 'react';
import { NetInfo, Platform } from 'react-native';
import PropTypes from 'prop-types';
import checkInternetAccessInfinity from './checkInternetAccessInfinity';
import reactConnectionStore from './reactConnectionStore';

type DefaultProps = {
  timeout?: number,
  pingServerUrl?: string,
};

type Props = DefaultProps & {
  children: (isConnected: boolean) => React$Element<any>,
};

type State = {
  isConnected: boolean,
};

class ConnectivityRenderer extends Component<DefaultProps, Props, State> {
  static propTypes = {
    children: PropTypes.func.isRequired,
    timeout: PropTypes.number,
    pingServerUrl: PropTypes.string,
  };

  static defaultProps: DefaultProps = {
    timeout: 3000,
    pingServerUrl: 'https://google.com',
  };

  state = {
    isConnected: reactConnectionStore.getConnection(),
  };

  componentWillMount() {
    if (typeof this.props.children !== 'function') {
      throw new Error('You should pass a function as a children');
    }
    if (typeof this.props.timeout !== 'number') {
      throw new Error('you should pass a number as timeout prop');
    }
    if (typeof this.props.pingServerUrl !== 'string') {
      throw new Error('you should pass a string as pingServerUrl prop');
    }
  }

  componentDidMount() {
    NetInfo.isConnected.addEventListener('connectionChange', this.checkInternet);
    // On Android the listener does not fire on startup
    if (Platform.OS === 'android') {
      NetInfo.isConnected.fetch().then((isConnected: boolean) => this.checkInternet(isConnected));
    }
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener('connectionChange', this.checkInternet);
  }

  checkInternet = (isConnected: boolean) => {
    checkInternetAccessInfinity(
      hasInternetAccess => {
        this.handleConnectivityChange(hasInternetAccess);
      },
      isConnected,
      this.props.timeout,
      this.props.pingServerUrl
    );
  };

  handleConnectivityChange = (isConnected: boolean) => {
    reactConnectionStore.setConnection(isConnected);
    if (isConnected !== this.state.isConnected) {
      this.setState({
        isConnected,
      });
    }
  };

  render() {
    return this.props.children(this.state.isConnected);
  }
}

export default ConnectivityRenderer;
