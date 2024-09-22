import React from "react";
function validateEmailAndPassword(email, password) {
  // check if password exists
  let isPasswordExist = !!password;
  // check if password exists
  let isEmailExist = !!email;

  if (!isEmailExist || !isPasswordExist) {
    const errorMessage =
      !isPasswordExist && !isEmailExist
        ? "Please enter your email address and password"
        : !isPasswordExist
          ? "Please enter your password"
          : "Please enter your email";
    return { isError: true, error: errorMessage };
  }

  // check if email is valid
  let emailRegex = /^\w+([.-]\w+)*@\w+([.-]\w+)*(\.\w{2,})+$/;
  let isEmailValid = emailRegex.test(email);

  // add error messages based on each condition
  if (!isEmailValid) {
    return { isError: true, error: "Please enter a valid email address" };
  }

  // check if password is at least 6 characters long
  let isPasswordLongEnough = password.length >= 6;

  // check if password contains special characters, numbers, and alphabets
  let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/;
  let isPasswordComplexEnough = passwordRegex.test(password);

  if (!isPasswordLongEnough) {
    return {
      isError: true,
      error: "Password must be at least 6 characters long.",
    };
  }
  if (!isPasswordComplexEnough) {
    return {
      isError: true,
      error: (
        <div
          style={{
            fontSize: "13px",
            paddingLeft: "5rem",
            border: "1px solid transparent",
          }}
        >
          <p>
            Password must meet the following requirements:
            <br />
            - At least 6 characters long.
            <br />
            - Contains at least one uppercase letter.
            <br />
            - Contains at least one lowercase letter.
            <br />
            - Contains at least one number.
            <br />- Contains at least one special character (e.g., @, #, $, %,
            etc.).
          </p>
        </div>
      ),
    };
  }

  return { isError: false };
}

const validateDateAndWorkspace = ({ date, workspace, entry }) => {
  const givenDate = new Date(date);
  const entryCreatedAt = new Date(entry.createdAt);
  const isDateMatch =
    givenDate.toDateString() === entryCreatedAt.toDateString();
  const isWorkspaceMatch = workspace === entry.workspace;
  return isDateMatch && isWorkspaceMatch;
};

export { validateEmailAndPassword, validateDateAndWorkspace };
