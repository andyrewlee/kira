import React, { Component } from 'react';

import {
  ActivityIndicator,
  AppRegistry,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import {
  Cell,
  Section,
  TableView,
} from 'react-native-tableview-simple';

// Example component for section:headerComponent
const CustomSectionHeader = () => (
  <View>
    <Text>Custom header!</Text>
  </View>
);

// eslint-disable-next-line react/prefer-stateless-function
export default class Diaries extends Component {
  // eslint-disable-next-line class-methods-use-this
  render() {
    return (
      <ScrollView contentContainerStyle={styles.stage}>
        <TableView>
          <Section sectionTintColor='rgba(8, 88, 90, 0.4)'>
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
            <Cell backgroundColor="#ddc7b4" cellStyle="RightDetail" title="RightDetail" detail="Detail" />
          </Section>
        </TableView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  stage: {
    backgroundColor: '#dec7b3',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  }
});
