import React, { PureComponent } from 'react';
import Autosuggest from 'react-autosuggest';
import './Searchbar.css';

var matchlist = [];

const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0 ? [] : matchlist.filter(lang =>
        lang.name.toLowerCase().slice(0, inputLength) === inputValue
    );
};

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => (
  <div>
    {suggestion.name + " - " + suggestion.artists[0].name}
  </div>
);

class Searchbar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {value: '', matches: []};
    }

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            matches: getSuggestions(value)
        });
    };
    
    onSuggestionsClearRequested = () => {
        this.setState({
            matches: []
        });
    };

    onChange = (event, { newValue }) => {
        this.setState({
          value: newValue
        });
        //Update search here
    };

    render() {
        const { value, matches } = this.state;
        const inputProps = {
            placeholder: 'Search...',
            value,
            onChange: this.onChange
        };
        return (
            <Autosuggest
                suggestions={matches}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
        );
    }
}

export default Searchbar;