import React from "react";
import ReactDOM from "react-dom";
import "react-sortable-tree/style.css";

import { EditableTree } from "./EditableTree";

const rootElement = document.getElementById("root");
ReactDOM.render(<EditableTree />, rootElement);
