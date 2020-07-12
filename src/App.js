import React from "react";
import { EditableTree } from "./EditableTree";

import { data } from "./data";
import FocusContainer from "./FocusContainer";

function toPrint(data){
  return {
    text: data.text,
    children: data.children?.map(toPrint) ??[]
  }
}

function App() {
  return (
    <>
      <FocusContainer
        onBlur={(e) => console.log(e)}
        onFocus={(e) => console.log(e)}
      >
        <EditableTree
          treeData={data}
          onDataChange={(data) => {
            // console.log(JSON.stringify(data.map(toPrint), null, 2));
          }}
        />
      </FocusContainer>
      <input placeholder="focus me"></input>
    </>
  );
}

export default App;
