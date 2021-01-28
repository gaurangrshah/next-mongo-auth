const allowedFields = {
  user: ["name", "username", "email", "password", "age"],
  task: ["description", "completed"],
};

// all fields must exist for this to return true
export function isValidOperation(type, fields) {
  const updates = Object.keys(fields);
  const isValid = updates.every((update) => {
    // only returns true if each and every iteration evaluates to truthy,
    // if any one iteration evaluates to false then it returns false.
    return allowedFields[type].includes(update); // ensures fields are allowed to be updated
  });
  console.log("🚀 ~ file: validate-update.js ~ line 14 ~ isValid ~ isValid", isValid)
  return isValid
}
