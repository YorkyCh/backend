const axios = require("axios");

const ownerData = {
  name: "owner",
  email: "owner@example.com",
  password: "password1234",
  passwordConfirm: "password1234",
  role: "owner",
};

const memberData = {
  name: "member",
  email: "member@example.com",
  password: "password1234",
  passwordConfirm: "password1234",
};

let userToken;
let userId;

beforeAll(async function () {
  await axios.delete("http://localhost:4000/api/users/delete");
  await axios.delete("http://localhost:4000/api/shopping-lists/delete");
  await axios.post("http://localhost:4000/api/users/signup", ownerData);
  await axios.post("http://localhost:4000/api/users/signup", memberData);
});

describe("get all lists", () => {
  it("should return all lists", async () => {
    // login
    const user = await axios.post("http://localhost:4000/api/users/login", {
      email: ownerData.email,
      password: ownerData.password,
    });

    userToken = user.data.token;
    userId = user.data.data.user;

    // get all lists

    const lists = await axios.get("http://localhost:4000/api/shopping-lists", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    expect(lists.data.status).toBe("success");
  });

  // test for unanauthorized user
  it("should return error 401", async () => {
    try {
      // get all lists
      const lists = await axios.get(
        "http://localhost:4000/api/shopping-lists",
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGI1MDM5ODZhMzlkZDQzZWY0NzMzYiIsImlhdCI6MTcwMzYyODkxMiwiZXhwIjoxNzA2MjIwOTEyfQ.Qf0CmwBPPgzzJWbWsEnOTNmz-FJtpCrUDGUceF9_p6M`,
          },
        }
      );
      // If the request succeeds, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // If the request fails, check if it's because of a 401 status code
      expect(error.response.status).toBe(401);
      expect(error.response.data.message).toBe(
        "The user belonging to this token does no longer exist."
      );
    }
  });
});

describe("create a list", () => {
  // create new list
  it("should create a list", async () => {
    // create a list
    const list = await axios.post(
      "http://localhost:4000/api/shopping-lists",
      {
        name: "test",
        owner: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(list.data.status).toBe("success");
  });

  // test for unanauthorized user

  it("should return error 401", async () => {
    try {
      // create a list
      const list = await axios.post(
        "http://localhost:4000/api/shopping-lists",
        {
          name: "test",
          owner: userId,
        }
      );
      // If the request succeeds, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // If the request fails, check if it's because of a 401 status code
      expect(error.response.status).toBe(401);
      expect(error.response.data.message).toBe("You need to be logged in!");
    }
  });

  // test for missing data
  it("should return error 404", async () => {
    try {
      // create a list
      const list = await axios.post(
        "http://localhost:4000/api/shopping-lists",
        {
          name: "test",
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      // If the request succeeds, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // If the request fails, check if it's because of a 404 status code
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toBe(
        "Owner must be a user with a role of owner!"
      );
    }
  });
});

// update list

describe("update a list", () => {
  let listId;

  beforeAll(async () => {
    // Create a list and get its id
    const list = await axios.post(
      `http://localhost:4000/api/shopping-lists`,
      {
        name: "test list",
        owner: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    listId = list.data.data.data.id;
  });
  afterAll(async () => {
    await axios.delete("http://localhost:4000/api/shopping-lists/delete");
  });

  it("should update the given list", async () => {
    // update list
    const list = await axios.patch(
      `http://localhost:4000/api/shopping-lists/${listId}`,
      {
        name: "updated list",
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(list.data.status).toBe("success");
    expect(list.data.data.data.name).toBe("updated list");
  });

  // test for invalid token

  it("should return error 401", async () => {
    try {
      // update list
      const list = await axios.patch(
        `http://localhost:4000/api/shopping-lists/${listId}`,
        {
          name: "updated list",
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGI1MDM5ODZhMzlkZDQzZWY0NzMzYiIsImlhdCI6MTcwMzYyODkxMiwiZXhwIjoxNzA2MjIwOTEyfQ.Qf0CmwBPPgzzJWbWsEnOTNmz-FJtpCrUDGUceF9_p6M`,
          },
        }
      );
      // If the request succeeds, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // If the request fails, check if it's because of a 401 status code
      expect(error.response.status).toBe(401);
      expect(error.response.data.message).toBe(
        "The user belonging to this token does no longer exist."
      );
    }
  });
});

// get list by id

describe("get list by id", () => {
  let listId;

  beforeAll(async () => {
    // Create a list and get its id
    const list = await axios.post(
      `http://localhost:4000/api/shopping-lists`,
      {
        name: "test list",
        owner: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    listId = list.data.data.data.id;
  });
  afterAll(async () => {
    await axios.delete("http://localhost:4000/api/shopping-lists/delete");
  });

  it("should return the given list", async () => {
    // get list
    const list = await axios.get(
      `http://localhost:4000/api/shopping-lists/${listId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(list.data.status).toBe("success");
    expect(list.data.data.data.id).toBe(listId);
  });

  // test for invalid id

  it("should return error 404", async () => {
    try {
      // get list
      const list = await axios.get(
        `http://localhost:4000/api/shopping-lists/658d77d0d8a997c80e08ac32`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      // If the request succeeds, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // If the request fails, check if it's because of a 404 status code
      expect(error.response.status).toBe(404);
      expect(error.response.data.message).toBe(
        "No document found with that ID"
      );
    }
  });
});

// delete list by id

describe("delete list by id", () => {
  let listId;

  beforeEach(async () => {
    // Create a list and get its id
    const list = await axios.post(
      `http://localhost:4000/api/shopping-lists`,
      {
        name: "test list",
        owner: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    listId = list.data.data.data.id;
  });
  // Delete user
  it("should delete the given list", async () => {
    const list = await axios.delete(
      `http://localhost:4000/api/shopping-lists/${listId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(list.status).toBe(204);
  });
  // Try deleting as a member
  it("should return error 403", async () => {
    try {
      const member = await axios.post("http://localhost:4000/api/users/login", {
        email: memberData.email,
        password: memberData.password,
      });

      // get list
      const list = await axios.delete(
        `http://localhost:4000/api/shopping-lists/${listId}`,
        {
          headers: {
            Authorization: `Bearer ${member.data.token}`,
          },
        }
      );
      // If the request succeeds, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // If the request fails, check if it's because of a 403 status code
      expect(error.response.status).toBe(403);
      expect(error.response.data.message).toBe(
        "You do not have permission to perform this action"
      );
    }
  });
});
