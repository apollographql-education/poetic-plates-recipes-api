const utils = {
  transformInstructions: (originalInstructionsString) => {
    const stringArray = originalInstructionsString.split("\n");

    // remove numbers
    const cleanedStringArray = stringArray.map((str) => {
      const newStr = str.replace(/^\d+\. /, "").trim();
      return newStr;
    });

    // remove empty strings in array
    return cleanedStringArray.filter((s) => s);
  },
  formattedRecipe: (r) => {
    return {
      id: r.id,
      ...r.fields,
      instructions: utils.transformInstructions(r.fields.preparation),
    };
  },
};

module.exports = utils;
