import { IElement, INode } from "happy-dom";
import { ATTR_VALUE_PREFIX, TEXT_VALUE_PREFIX } from "./page";
import { Scope } from "./scope";

export interface ValueProps {
  key: string;
  val: any;
}

export class Value {
  props: ValueProps;
  key?: string;
  dom?: INode;
  cb?: (v: any) => void;

  constructor(scope: Scope, props: ValueProps) {
    this.props = props;
    const key = props.key;
    if (key.startsWith(ATTR_VALUE_PREFIX)) {
      this.key = key.substring(ATTR_VALUE_PREFIX.length);
      this.dom = scope.dom;
      this.cb = Value.attrCB;
    } else if (key.startsWith(TEXT_VALUE_PREFIX)) {
      const i = parseInt(key.substring(TEXT_VALUE_PREFIX.length));
      this.dom = scope.texts ? scope.texts[i] : undefined;
      this.cb = Value.textCB;
    }
  }

  static attrCB(v: Value) {
    if (v.props.val != null) {
      (v.dom as IElement).setAttribute(v.key as string, `${v.props.val}`);
    } else {
      (v.dom as IElement).removeAttribute(v.key as string);
    }
  }

  static textCB(v: Value) {
    (v.dom as INode).nodeValue = (v.props.val != null ? `${v.props.val}` : '');
  }
}
