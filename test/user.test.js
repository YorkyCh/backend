const axios = require("axios");
let userId;

let token;
let ownerId;

beforeAll(async function () {
  await axios.delete("http://localhost:4000/api/users/delete");
});

// REGISTER

describe("Register new user", () => {
  it("should add a new owner", async () => {
    try {
      const userData = {
        name: "John Doe",
        email: "owner@example.com",
        password: "password",
        passwordConfirm: "password",
        role: "owner",
      };

      const response = await axios.post(
        "http://localhost:4000/api/users/signup",
        userData
      );

      ownerId = response.data.data.user._id;

      expect(response.data.token).toBeDefined();
      expect(response.status).toBe(201);
      expect(response.data.data.user.role).toBe("owner");
    } catch (err) {
      throw err;
    }
  });

  // register new member

  it("should add a new user", async () => {
    try {
      const userData = {
        name: "John Doe",
        email: "member@example.com",
        password: "password",
        passwordConfirm: "password",
      };

      const response = await axios.post(
        "http://localhost:4000/api/users/signup",
        userData
      );

      userId = response.data.data.user._id;

      expect(response.data.token).toBeDefined();
      expect(response.status).toBe(201);
    } catch (err) {
      throw err;
    }
  });

  // test validation error

  it("should give validation error if there is an missing user data", async () => {
    try {
      const userData = {
        email: "owner@example.com",
        password: "password",
        passwordConfirm: "password",
      };
      const response = await axios.post(
        "http://localhost:4000/api/users/signup",
        userData
      );
      expect(true).toBe(false);
    } catch (err) {
      expect(err.response.data.message).toBe(
        "User validation failed: name: Name is required"
      );
    }
  });

  /// test duplicated key error

  it("should duplicate key error when we try to register a user with a same email", async () => {
    try {
      const userData = {
        name: "John Doe",
        email: "owner@example.com",
        password: "password",
        passwordConfirm: "password",
      };

      const response = await axios.post(
        "http://localhost:4000/api/users/signup",
        userData
      );
      expect(true).toBe(false);
    } catch (err) {
      expect(err.response.data.message).toBe(
        'E11000 duplicate key error collection: test.users index: email_1 dup key: { email: "owner@example.com" }'
      );
    }
  });
});

////// LOG IN

describe("Log in user", () => {
  it("should log in", async () => {
    try {
      const userData = {
        email: "owner@example.com",
        password: "password",
      };

      const response = await axios.post(
        "http://localhost:4000/api/users/login",
        userData
      );

      token = response.data.token;

      expect(response.data.token).toBeDefined();
      expect(response.status).toBe(200);
    } catch (err) {
      throw err;
    }
  });

  // test incorrect email or password

  it("should send 'Incorrect email or password' error", async () => {
    try {
      const userData = {
        email: "johndo@example.com",
        password: "password",
      };

      const response = await axios.post(
        "http://localhost:4000/api/users/login",
        userData
      );
      expect(true).toBe(false);
    } catch (err) {
      expect(err.response.data.message).toBe("Incorrect email or password");
    }
  });

  // Check error if user wont input password or email

  it("should send 'Please provide email and password!'", async () => {
    try {
      const userData = {
        password: "password",
      };

      const response = await axios.post(
        "http://localhost:4000/api/users/login",
        userData
      );
      expect(true).toBe(false);
    } catch (err) {
      expect(err.response.data.message).toBe(
        "Please provide email and password!"
      );
    }
  });
});

// GET MY DATA (USER ME)

describe("Get me", () => {
  it("should get currect user data", async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(200);
      expect(response.data.data.data.name).toBe("John Doe");
      expect(response.data.data.data.email).toBe("owner@example.com");
    } catch (err) {
      throw err;
    }
  });

  // test without token

  it("should throw an error", async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/users/me");
      expect(true).toBe(false);
    } catch (err) {
      expect(err.response.data.message).toBe("You need to be logged in!");
    }
  });

  // test for invalid token

  it("should throw an error", async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/users/me", {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGI1MDM5ODZhMzlkZDQzZWY0NzMzYiIsImlhdCI6MTcwMzYyODkxMiwiZXhwIjoxNzA2MjIwOTEyfQ.Qf0CmwBPPgzzJWbWsEnOTNmz-FJtpCrUDGUceF9_p6M`,
        },
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.response.data.message).toBe(
        "The user belonging to this token does no longer exist."
      );
    }
  });
});

// GET all users

describe("Get all users", () => {
  it("should get all users", async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      expect(response.status).toBe(200);
    } catch (err) {
      throw err;
    }
  });

  // test without token

  it("should throw an error", async () => {
    try {
      await axios.get("http://localhost:4000/api/users");
      expect(true).toBe(false);
    } catch (err) {
      expect(err.message).toBe("Request failed with status code 401");
    }
  });

  // Test for invalid token

  it("should throw an error", async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/users", {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGI1MDM5ODZhMzlkZDQzZWY0NzMzYiIsImlhdCI6MTcwMzYyODkxMiwiZXhwIjoxNzA2MjIwOTEyfQ.Qf0CmwBPPgzzJWbWsEnOTNmz-FJtpCrUDGUceF9_p6M`,
        },
      });
      expect(true).toBe(false);
    } catch (err) {
      expect(err.response.data.message).toBe(
        "The user belonging to this token does no longer exist."
      );
    }
  });
});

// update currect user password

describe("Update Current user Password", () => {
  it("should update users password", async () => {
    try {
      const userData = {
        passwordCurrent: "password",
        password: "password",
        passwordConfirm: "password",
      };

      const response = await axios.patch(
        "http://localhost:4000/api/users/updateMyPassword",
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expect(response.status).toBe(200);
      expect(response.data.data.user.email).toBe("owner@example.com");
    } catch (err) {
      throw err;
    }
  });
  // test for incorrect currect password

  it("should throw 'Your current password is incorrect.'", async () => {
    try {
      const userData = {
        passwordCurrent: "passworddddd",
        password: "new_password",
        passwordConfirm: "new_password",
      };

      const response = await axios.patch(
        "http://localhost:4000/api/users/updateMyPassword",
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expect(true).toBe(false);
    } catch (err) {
      expect(err.response.data.error.statusCode).toBe(401);
      expect(err.response.data.message).toBe(
        "Your current password is incorrect."
      );
    }
  });

  // test with wrong confirmation password
  it("should throw 'User validation failed: passwordConfirm: Passwords do not match'", async () => {
    try {
      const userData = {
        passwordCurrent: "password",
        password: "new_passworddsdsds",
        passwordConfirm: "new_password",
      };

      const response = await axios.patch(
        "http://localhost:4000/api/users/updateMyPassword",
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expect(true).toBe(false);
    } catch (err) {
      expect(err.response.data.error.statusCode).toBe(500);
      expect(err.response.data.message).toBe(
        "User validation failed: passwordConfirm: Passwords do not match"
      );
    }
  });
});

// update current user data
describe("Update user", () => {
  it("should update users role", async () => {
    try {
      const userData = {
        role: "member",
      };

      const response = await axios.patch(
        `http://localhost:4000/api/users/${userId}`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      expect(response.data.data.data.role).toBe("member");
    } catch (err) {
      throw err;
    }
  });

  // test for invalid token
  it("should throw an 401 error", async function () {
    try {
      const currentUser = await axios.get(
        "http://localhost:4000/api/users/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData = {
        role: "member",
      };

      const response = await axios.patch(
        `http://localhost:4000/api/users/${currentUser.data.data.data._id}`,
        userData,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGI1MDM5ODZhMzlkZDQzZWY0NzMzYiIsImlhdCI6MTcwMzYyODkxMiwiZXhwIjoxNzA2MjIwOTEyfQ.Qf0CmwBPPgzzJWbWsEnOTNmz-FJtpCrUDGUceF9_p6M`,
          },
        }
      );

      expect(true).toBe(false);
    } catch (err) {
      expect(err.response.data.error.statusCode).toBe(401);
      expect(err.response.data.message).toBe(
        "The user belonging to this token does no longer exist."
      );
    }
  });
});

// Delete User
