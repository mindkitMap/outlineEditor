import React, { Component } from "react";

interface ContainerProps {
  onBlur?: Function;
  onFocus?: Function;
}

class FocusContainer extends Component<ContainerProps> {
  private isManagingFocus = false;
  private _timeoutID: any;
  private _onB = (e) => {
    this._timeoutID = setTimeout(() => {
      if (this.isManagingFocus) {
        this.isManagingFocus = false;
        // console.log("isManagingFocus - " + this.isManagingFocus);
        this.props.onBlur?.(e);
      }
    }, 0);
  };
  private _onF = (e) => {
    clearTimeout(this._timeoutID);
    if (!this.isManagingFocus) {
      this.isManagingFocus = true;
      //   console.log("isManagingFocus - " + this.isManagingFocus);
      this.props.onFocus?.(e);
    }
  };

  render() {
    return React.cloneElement(this.props.children as React.ReactElement<any>, {
      ...this.props,
      onBlur: this._onB,
      onFocus: this._onF,
    });
  }
}

export default FocusContainer;
