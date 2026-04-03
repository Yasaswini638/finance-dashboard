export const getUsers = () => {
  return JSON.parse(localStorage.getItem("finance_users")) || [];
};

export const saveUsers = (users) => {
  localStorage.setItem("finance_users", JSON.stringify(users));
};

export const signupUser = (userData) => {
  const users = getUsers();

  const existingUser = users.find((user) => user.email === userData.email);
  if (existingUser) {
    return { success: false, message: "User already exists with this email." };
  }

  const newUser = {
    ...userData,
    role: "viewer",
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true };
};

export const signinUser = (email, password) => {
  const users = getUsers();

  const foundUser = users.find(
    (user) => user.email === email && user.password === password
  );

  if (!foundUser) {
    return { success: false, message: "Invalid email or password." };
  }

  localStorage.setItem("finance_current_user", JSON.stringify(foundUser));
  return { success: true, user: foundUser };
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("finance_current_user"));
};

export const logoutUser = () => {
  localStorage.removeItem("finance_current_user");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("finance_current_user");
};