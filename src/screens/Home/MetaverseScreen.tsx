import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

// ...
class MetaverseScreen extends Component {
  render() {
    return <WebView source={{ uri: 'http://localhost:3000/' }} />;
  }
}

export default MetaverseScreen