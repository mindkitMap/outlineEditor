import moment from "moment";
import { v4 as uuidv4 } from "uuid";

export function momentString(): string {
  return moment().format("HH:mm:ss");
}
export function uuid(): string {
  return uuidv4().toString();
}

export function equalsStringArray(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (var i = 0, l = a.length; i < l; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}
