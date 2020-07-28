import React, { Component } from "react";

import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import emoji from "@jukben/emoji-search";

import "./index.css";
import "@webscopeio/react-textarea-autocomplete/style.css";

const Item = ({ entity: { name, char } }) => <div>{`${name}: ${char}`}</div>;
const Loading = ({ data }) => <div>Loading</div>;

const trigger = {
  ":": {
    dataProvider: (token) => {
      return emoji(token)
        .slice(0, 10)
        .map(({ name, char }) => ({ name, char }));
    },
    component: Item,
    output: (item, trigger) => item.char,
  },
};

const style = {
  fontSize: "18px",
  lineHeight: "20px",
  padding: 5,
};
const containerStyle = {
  marginTop: 20,
  width: 400,
  height: 100,
  margin: "20px auto",
};
class AutoComplete extends Component {
  render() {
    return (
      <div className="App">
        <ReactTextareaAutocomplete
          className="my-textarea"
          loadingComponent={Loading}
          style={style}
          ref={(rta) => {
            this.rta = rta;
          }}
          innerRef={(textarea) => {
            this.textarea = textarea;
          }}
          containerStyle={containerStyle}
          minChar={0}
          trigger={trigger}
        />
      </div>
    );
  }
}
class AutoCompleteWithCE extends Component {
    render() {
        return (
          <div className="App">
            <ReactTextareaAutocomplete
              className="my-textarea"
              loadingComponent={Loading}
              style={style}
              ref={(rta) => {
                this.rta = rta;
              }}
              innerRef={(textarea) => {
                this.textarea = textarea;
              }}
              containerStyle={containerStyle}
              minChar={0}
              trigger={trigger}
            />
          </div>
        );
    }
}

export default {
  title: "AutoComplete",
  component: AutoComplete,
};

export const Default = () => <AutoComplete />;