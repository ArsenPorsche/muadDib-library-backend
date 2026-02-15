const userRepo = require("../repositories/userRepository");
const bcrypt = require("bcrypt");

async function register(userData) {
    const existingUser = await userRepo.findByEmail(userData.email);
    if (existingUser)
        return { error: { status: 400, message: "Email already in use" } };

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    const newUser = await userRepo.create({ ...userData, password: hashedPassword });
    const token = newUser.generateAuthToken();
    return { data: token, message: "Registration successful" };
}

async function login(email, password) {
  const user = await userRepo.findByEmail(email);
  if (!user)
    return { error: { status: 401, message: "Invalid Email or Password" } };

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return { error: { status: 401, message: "Invalid Email or Password" } };

  const token = user.generateAuthToken();
  return { data: token, message: "logged in successfully" };
}

async function getMe(userId) {
  const user = await userRepo.findById(userId);
  if (!user)
    return { error: { status: 404, message: "User not found" } };

  return {
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
}

module.exports = { register, login, getMe };