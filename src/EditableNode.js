import React from "react";
import ContentEditable from "react-contenteditable";

export class EditableNode extends React.Component {
 

  render = () => {
    return (
      <ContentEditable
        html={this.props.title} // innerHTML of the editable div
        disabled={false} // use true to disable edition
        onChange={this.props.onChange} // handle innerHTML change
        onKeyDown = {this.props.onKeyDown}
        onBlur={this.props.onBlur}
      />
    );
  };
}
