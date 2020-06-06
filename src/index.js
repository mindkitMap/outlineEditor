import React from "react";
import "./spreadsheet.css";
import ReactDOM from "react-dom";
import { EditableGrid } from "./EditableGrid";

export const LETTERS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const rootElement = document.getElementById("root");
ReactDOM.render(<EditableGrid />, rootElement);
