import React, { Component } from "react";
import PropTypes from "prop-types";

import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";

import "./transform.css";
import "@webscopeio/react-textarea-autocomplete/style.css";

import cls from "classnames";

const Loading = ({ data }) => <div>Loading</div>;

const defaultTrigger = {
 
};

const style = {
  fontSize: "1em",
  lineHeight: "1.2em",
  padding: 0,
};
const containerStyle = {
  // marginTop: 20,
  // width: 400,
  // height: 100,
  // margin: "20px auto",
};

class TransformEdit extends Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props?.value ?? "" };
  }
  focus = () => {
    this.textareaRef.focus();
    // this.setState({focus:true})
  };
  blur = () => {
    this.textareaRef.blur();
  };
  transform = (inputtedHtml) => {
    const fun = this.props.transform ?? defaultTransform();
    return fun(inputtedHtml);
  };
  onEditing = (e) => {
    this.displayRef?.innerHTML = this.transform(e.target.value);
    this.setState({ value: e.target.value });
    this.props.onChange?.(e);
  };
  onFocus = (e) => {
    this.props.onFocus?.(e);
    this.setState({ focus: true });
  };
  onBlur = (e) => {
    this.props.onBlur?.(e);
    this.setState({ focus: false });
  };
  render() {
    return (
      <div className="transform-editor">
        <ReactTextareaAutocomplete
          containerClassName={cls(
            this.props.className,
            "transform-inputting",
            { shown: this.state?.focus },
            { hidden: !(this.state?.focus ?? false) }
          )}
          loadingComponent={Loading}
          style={this.props.style ?? style}
          innerRef={(textarea) => {
            this.textareaRef = textarea;
          }}
          containerStyle={containerStyle}
          minChar={0}
          trigger={this.props.trigger ?? defaultTrigger}
          value={this.state.value}
          onKeyDown={(e) => this.props.onKeyDown?.(e)}
          onChange={(e) => this.onEditing(e)}
          onFocus={(e) => this.onFocus(e)}
          onBlur={(e) => this.onBlur(e)}
        />
        <div
          ref={(r) => (this.displayRef = r)}
          className={cls('transform-display',
            { hidden: this.state?.focus },
            { shown: !(this.state?.focus ?? false) }
          )}
          dangerouslySetInnerHTML={{ __html: this.transform(this.state.value) }}
        />
      </div>
    );
  }
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onKeyDown: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    transform: PropTypes.func,
  };
}

export default TransformEdit;
function defaultTransform() {
  return ((v) => v);
}

