import React from "react";
import ContentEditable from "./ContentEditable";

export class EditableNode extends React.Component {
  render = () => {
    return (
      <ContentEditable
      className='node-text'
        html={this.props.title} // innerHTML of the editable div
        disabled={false} // use true to disable edition
        onChange={this.props.onChange} // handle innerHTML change
        onKeyDown={this.props.onKeyDown}
        onBlur={this.props.onBlur}
        innerRef={this.props.innerRef}
      />
    );
  };
}
