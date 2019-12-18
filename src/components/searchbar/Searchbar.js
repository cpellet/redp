import React, { PureComponent } from 'react';
import Autosuggest from 'react-autosuggest';
import './Searchbar.css';
var Tidal = require('tidal-api-wrapper');
var tidal = new Tidal();
var matchlist = [];
var fetched=true;

const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : matchlist;
};

const getSuggestionValue = suggestion => suggestion;

const renderSuggestion = suggestion => (
    <div>
        <img className="rthumb" src={suggestion.thumburl} width="50" height="50" align="left"></img>
        <div className="ralbum">
        {suggestion.title}
        </div>
        <div className="rartist">
        {suggestion.artists[0].name}
        </div>
    </div>
);

class Searchbar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {value: '', matches: []};
    }

    onSuggestionsFetchRequested = ({ value }) => {
        this.displaymatches(value);
    };

    displaymatches(value){
        if(fetched==false){return new Promise(resolve => setTimeout(resolve, 100)).then(() => {
            this.displaymatches(value);
        })
        }
        this.setState({
            matches: getSuggestions(value)
        });
        console.log(this.state.matches.length);
    }
    
    onSuggestionsClearRequested = () => {
        this.setState({
            matches: []
        });
    };

    onChange = (event, { newValue }) => {
        fetched=false;
        this.setState({
          value: newValue,
          matches: []
        });
        matchlist=[];
        if(newValue.length<3) return;
        tidal.search(newValue, 'artists', 1)
            .then(artists => tidal.getArtistAlbums(artists[0].id))
            .then((albums) => {
                albums.forEach(album => {
                    if(matchlist.includes(album)) return;
                    album.thumburl = "https://resources.tidal.com/images/"+album.cover.replace(/-/g, "/")+"/80x80.jpg";
                    matchlist.push(album);
                });
                fetched=true;
                return albums;
            })
            .catch((err) => {
                console.log(err);
        });
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