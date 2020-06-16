import React from 'react';
import { EditableTree } from "./EditableTree";

import { data } from "./data";


function App() {
  return <EditableTree treeData={data} 
  onDataChange={data=>console.log(data)}
  />;
}

export default App;
