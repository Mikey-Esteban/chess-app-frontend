const toTitleCase = string => {
  const array = string.split(" ");
  const titledArray = array.map(word => {
    return `${word[0].toUpperCase()}${word.substring(1)}`;
  });

  return titledArray.join(" ");
};

export default toTitleCase;
