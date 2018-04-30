import PropType from 'prop-types';
import React, { Component } from 'react';
import { StatusBar, Text, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';

import { Container } from '../components/Container';
import { Logo } from '../components/Logo';
import { InputWithButton } from '../components/TextInput';
import { ClearButton } from '../components/Buttons';
import { LastConverted } from '../components/Text';
import { Header } from '../components/Header';

import { swapCurrency, changeCurrencyAmount } from '../actions/currencies';

class Home extends Component {
    static propTypes = {
        navigation: PropType.object,
        dispatch: PropType.func,
        baseCurrency: PropType.string,
        quoteCurrency: PropType.string,
        amount: PropType.number,
        conversionRate: PropType.number,
        isFetching: PropType.bool,
        LastConvertedDate: PropType.object,
        primaryColor: PropType.string,
    };

    handlePressBaseCurrency = () => {
        this.props.navigation.navigate('CurrencyList', { title: 'Base Currency', type: 'base' });
    };
    handlePressQuoteCurrency = () => {
        this.props.navigation.navigate('CurrencyList', { title: 'Quote Currency', type: 'quote' });
    };
    handleTextChange = (amount) => {
        this.props.dispatch(changeCurrencyAmount(amount));
    };
    handleSwapCurrency = () => {
        this.props.dispatch(swapCurrency());
    };
    handleOptionPress = () => {
        this.props.navigation.navigate('Options');
    };

    render() {
        let quotePrice = (this.props.amount * this.props.conversionRate).toFixed(2);
        if (this.props.isFetching) {
            quotePrice = '...';
        };
        return (
            <Container backgroundColor={this.props.primaryColor}>
                <StatusBar translucent={false} barStyle="light-content" />
                <Header
                    onPress={this.handleOptionPress}
                />
                <KeyboardAvoidingView behavior="padding">
                    <Logo tintColor={this.props.primaryColor} />
                    <InputWithButton
                        buttonText={this.props.baseCurrency}
                        onPress={this.handlePressBaseCurrency}
                        defaultValue={this.props.amount.toString()}
                        keyboardType="numeric"
                        onChangeText={this.handleTextChange}
                    />
                    <InputWithButton
                        onPress={this.handlePressQuoteCurrency}
                        buttonText={this.props.quoteCurrency}
                        editable={false}
                        value={quotePrice}
                    />
                    <LastConverted
                        base={this.props.baseCurrency}
                        quote={this.props.quoteCurrency}
                        date={this.props.LastConvertedDate}
                        conversionRate={this.props.conversionRate}
                    />
                    <ClearButton
                        text="Reverse Currencies"
                        onPress={this.handleSwapCurrency}
                    />
                </KeyboardAvoidingView>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    const baseCurrency = state.currencies.baseCurrency;
    const quoteCurrency = state.currencies.quoteCurrency;
    const conversionSelector = state.currencies.conversions[baseCurrency] || {};
    const rates = conversionSelector.rates || {};
    return {
        baseCurrency,
        quoteCurrency,
        amount: state.currencies.amount,
        conversionRate: rates[quoteCurrency] || 0,
        isFetching: conversionSelector.isFetching,
        LastConvertedDate: conversionSelector.date ? new Date
            (conversionSelector.date) : new Date(),
        primaryColor: state.themes.primaryColor,

    };
};

export default connect(mapStateToProps)(Home);
