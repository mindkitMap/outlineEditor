import React from "react";
import emoji from "@jukben/emoji-search";

const Item = ({ entity: { name, char } }) => <div>{`${name}: ${char}`}</div>;
const Loading = ({ data }) => <div>Loading</div>;

export const trigger = {
  ":": {
    dataProvider: (token) => {
      return emoji(token)
        .slice(0, 10)
        .map(({ name, char }) => ({ name, char }));
    },
    component: Item,
    output: (item, trigger) => item.char,
  },
};
