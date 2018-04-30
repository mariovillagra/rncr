import PropType from 'prop-types';
import React, { Component } from 'react';
import { View, FlatList, StatusBar } from 'react-native';
import { connect } from "react-redux";

import { ListItem, Separator } from '../components/List';
import currencies from '../data/currencies';
import { changeBaseCurrency, changeQuoteCurrency } from "../actions/currencies";

class CurrencyList extends Component {
    static propType = {
        navigation: PropType.object,
        dispatch: PropType.func,
        baseCurrency: PropType.string,
        quoteCurrency: PropType.string,
        primaryColor: PropType.string,
    };
    handlePress = (currency) => {
        const { type } = this.props.navigation.state.params;
        if (type === 'base') {
            this.props.dispatch(changeBaseCurrency(currency));
        } else if (type === 'quote') {
            this.props.dispatch(changeQuoteCurrency(currency));
        }
        this.props.navigation.goBack(null);
    };

    render() {
        let comparasionCurrency = this.props.baseCurrency;
        if (this.props.navigation.state.params.type === 'quote') {
            comparasionCurrency = this.props.quoteCurrency
        }
        return (
            <View style={{ flex: 1 }}>
                <StatusBar barStyle="default" translucent={false} />
                <FlatList
                    data={currencies}
                    renderItem={({ item }) => (
                        <ListItem
                            text={item}
                            selected={item === comparasionCurrency}
                            onPress={() => this.handlePress(item)}
                            iconBackground={this.props.primaryColor}
                        />
                    )}
                    keyExtractor={(item) => item}
                    ItemSeparatorComponent={Separator}
                />
            </View>
        );
    }

};

const mapStateToProps = (state) => {
    return {
        baseCurrency: state.currencies.baseCurrency,
        quoteCurrency: state.currencies.quoteCurrency,
        primaryColor: state.themes.primaryColor,
    }
};

export default connect(mapStateToProps)(CurrencyList);