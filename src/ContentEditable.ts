import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

function normalizeHtml(str: string): string {
  return str && str.replace(/&nbsp;|\u202F|\u00A0/g, " ");
}
//FIXME 显然有问题，每次都把光标放在最后。因为在onchange里面被rerender了，所以需要手动重置光标位置。
//FIXME rerender是重置了html、onChange、onBlur等属性造成的。
//FIXME onChange等应该是因为在parent中每次重新生成了函数。

function replaceCaret(el: HTMLElement) {
  // Place the caret at the end of the element
  const target = document.createTextNode("");
  el.appendChild(target);
  // do not move caret if element was not focused
  const isTargetFocused = document.activeElement === el;
  if (target !== null && target.nodeValue !== null && isTargetFocused) {
    var sel = window.getSelection();
    if (sel !== null) {
      var range = document.createRange();
      range.setStart(target, target.nodeValue.length);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }
    if (el instanceof HTMLElement) el.focus();
  }
}

/**
 * A simple component for an html element with editable contents.
 */
export default class ContentEditable extends React.Component<Props> {
  lastHtml: string = this.props.html;
  originalHTML: string = this.props.html;
  el: any =
    typeof this.props.innerRef === "function"
      ? { current: null }
      : React.createRef<HTMLElement>();

  transform = (inputtedHtml: string): string => {
    const fun = this.props.transform ?? ((v) => v);
    return fun(inputtedHtml);
  };
  getEl = () =>
    (this.props.innerRef && typeof this.props.innerRef !== "function"
      ? this.props.innerRef
      : this.el
    ).current;

  render() {
    const { tagName, html, innerRef, transform, ...props } = this.props;
    // eslint-disable-next-line react/no-danger-with-children
    return React.createElement(
      tagName || "div",
      {
        ...props,
        ref:
          typeof innerRef === "function"
            ? (current: HTMLElement) => {
                innerRef(current);
                this.el.current = current;
              }
            : innerRef || this.el,
        //NOTE 只有input会fire change， 其他不会，比如程序去改变。
        onInput: (e) => {
          if (!e.nativeEvent.isComposing) {
            this.debChange(e);
          }
        },
        onFocus: (event) => {
          const el = this.getEl();
          if (el) {
            el.innerHTML = this.originalHTML ?? this.props.html;
          }
          this.props.onFocus?.(event);
        },
        onBlur: (event) => {
          this.emitChange(event);
          const el = this.getEl();
          if (el) {
            this.originalHTML = el.innerHTML;
            el.innerHTML = this.transform(this.originalHTML);
          }

          this.props.onBlur?.(event);
        },
        onKeyUp: (event) => {
          this.props.onKeyUp?.(event);
        },
        onKeyDown: (event) => {
          this.props.onKeyDown?.(event);
        },

        contentEditable: !this.props.disabled,
        dangerouslySetInnerHTML: {
          __html: this.transform(html),
        },
      },
      this.props.children
    );
  }

  emitChange = (originalEvt: React.SyntheticEvent<any>) => {
    const el = this.getEl();
    if (!el) return;

    const html = el.innerHTML;
    if (this.props.onChange && html !== this.lastHtml) {
      // Clone event with Object.assign to avoid
      // "Cannot assign to read only property 'target' of object"
      originalEvt.persist();
      const evt = {
        ...originalEvt,
        target: {
          ...originalEvt.target,
          value: html,
        },
      };
      // console.log("emit change onchange");
      this.props.onChange(evt);
    }
    this.lastHtml = html;
  };
  debChange = _.debounce(this.emitChange, 100);

  //NOTE 之前原文中有实现shouldupdate， 只在props.html与dom里面html不同的时候才去rerender，这样可以避免控制光标的问题。
  //NOTE 现在基本上不用这个控件了，所以不关注这个。
  //NOTE 如果需要，可以把原文重新拖过来一次。
  componentDidUpdate() {
    const el = this.getEl();
    if (!el) return;

    // // Perhaps React (whose VDOM gets outdated because we often prevent
    // // rerendering) did not update the DOM. So we update it manually now.
    // if (this.props.html !== el.innerHTML) {
    //   el.innerHTML = this.props.html;
    // }
    // this.lastHtml = this.props.html;
    replaceCaret(el);
  }

  static propTypes = {
    html: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    tagName: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    transform: PropTypes.func,
  };
}

export type ContentEditableEvent = React.SyntheticEvent<any, Event> & {
  target: { value: string };
};
type Modify<T, R> = Pick<T, Exclude<keyof T, keyof R>> & R;
type DivProps = Modify<
  JSX.IntrinsicElements["div"],
  { onChange: (event: ContentEditableEvent) => void }
>;

export interface Props extends DivProps {
  html: string;
  disabled?: boolean;
  tagName?: string;
  className?: string;
  style?: Object;
  innerRef?: React.RefObject<HTMLElement> | Function;
  transform?: (string) => string;
}
