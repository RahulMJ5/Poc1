import _ from "lodash";


export const contains = ({ name }, query) => {
  if (name.includes(query) ||  email.includes(query)) {
    return true;
  }

  return false;
};