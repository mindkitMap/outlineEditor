import React, { Component, cloneElement, createElement } from "react";
import PropTypes from "prop-types";
import ReactTextareaAutocomplete from "@webscopeio/react-textarea-autocomplete";
import "./transform.css";
import "@webscopeio/react-textarea-autocomplete/style.css";
import cls from "classnames";
import { fromOneFunction } from "./Transform3Model";
import Debugging from "./Debugging";

const Loading = ({ data }) => <div>Loading</div>;

const defaultTrigger = {};

const style = {
  fontSize: "1em",
  lineHeight: "1.2em",
  padding: 0,
  overflow: "hidden",
  resize: "none",
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
  static getDerivedStateFromProps(newProps) {
    return { value: newProps.value ?? "" };
  }
  focus = () => {
    this.textareaRef.focus();
  };
  blur = () => {
    this.textareaRef.blur();
  };

  transform3Model = () => {
    if (this.props.transform3Model) return this.props.transform3Model;
    if (this.props.transform) return fromOneFunction(this.props.transform);
    return fromOneFunction(defaultTransform);
  };
  onEditing = (e) => {
    const newValue = this.transform3Model().fromInputting(
      e.target.value,
      this.state.value
    );
    this.props.onChange?.(e, newValue);
    this.setState({
      value: newValue,
    });
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
    // const debugging = false;
    return (
      <Debugging.Consumer>
        {(debugging) => (
          <div
            className="transform-editor"
            children={[
              <ReactTextareaAutocomplete
                key="editing"
                containerClassName={cls(
                  this.props.className,
                  "transform-inputting",
                  debugging.editing
                    ? {}
                    : {
                        shown: this.state?.focus,
                        hidden: !(this.state?.focus ?? false),
                      }
                )}
                loadingComponent={Loading}
                style={this.props.style ?? style}
                innerRef={(textarea) => {
                  this.textareaRef = textarea;
                }}
                containerStyle={containerStyle}
                minChar={0}
                trigger={this.props.trigger ?? defaultTrigger}
                value={this.transform3Model().toInputting(this.state.value)}
                onKeyDown={(e) => this.props.onKeyDown?.(e)}
                onChange={(e) => this.onEditing(e, this.state.value)}
                onFocus={(e) => this.onFocus(e)}
                onBlur={(e) => this.onBlur(e)}
              />,

              createElement(
                "div",
                {
                  key: "viewing",
                  // ref: (r) => (this.displayRef = r),
                  className: cls(
                    "transform-display",
                    debugging.editing
                      ? {}
                      : {
                          hidden: this.state?.focus,
                          shown: !(this.state?.focus ?? false),
                        }
                  ),
                },
                createElement(
                  "div",
                  { key: "what" },
                  this.transform3Model().toView(this.state.value)
                )
                // createElement('div',{dangerouslySetInnerHTML:{__html:transformed.raw}})
              ),
            ]}
          ></div>
        )}
      </Debugging.Consumer>
    );
  }
  static propTypes = {
    value: PropTypes.object.isRequired,
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
  return (v) => v;
}
