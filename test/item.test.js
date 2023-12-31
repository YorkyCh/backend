const axios = require("axios");

// users data
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

// setup starting data
beforeAll(async function () {
  await axios.delete("http://localhost:4000/api/users/delete");
  await axios.delete("http://localhost:4000/api/shopping-lists/delete");
  await axios.delete("http://localhost:4000/api/items/delete");
  await axios.post("http://localhost:4000/api/users/signup", ownerData);
  await axios.post("http://localhost:4000/api/users/signup", memberData);
});

afterAll(async function () {
  await axios.delete("http://localhost:4000/api/users/delete");
  await axios.delete("http://localhost:4000/api/shopping-lists/delete");
  await axios.delete("http://localhost:4000/api/items/delete");
});

let userToken;
let userId;
let listId;
let itemId;
// get all items
describe("get all items", () => {
  beforeAll(async function () {
    const user = await axios.post("http://localhost:4000/api/users/login", {
      email: ownerData.email,
      password: ownerData.password,
    });

    userToken = user.data.token;
    userId = user.data.data.user;

    // create list
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
    listId = list.data.data.data._id;
  });

  it("should return all items", async () => {
    // get all items

    const items = await axios.get("http://localhost:4000/api/items", {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    expect(items.data.status).toBe("success");
    expect(items.data.data.items).toBeDefined();
  });

  // test for unanauthorized user
  it("should return error 401", async () => {
    try {
      // get all items
      const items = await axios.get("http://localhost:4000/api/items", {
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGI1MDM5ODZhMzlkZDQzZWY0NzMzYiIsImlhdCI6MTcwMzYyODkxMiwiZXhwIjoxNzA2MjIwOTEyfQ.Qf0CmwBPPgzzJWbWsEnOTNmz-FJtpCrUDGUceF9_p6M`,
        },
      });
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.status).toBe("fail");
    }
  });
});

// create item

describe("create item", () => {
  it("should create item", async () => {
    // create item
    const item = await axios.post(
      "http://localhost:4000/api/items",
      {
        name: "carrot",
        list: listId,
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    itemId = item.data.data.data._id;

    expect(item.data.status).toBe("success");
    expect(item.data.data.data.list).toBe(listId);
  });

  // test without token
  it("should return error 401", async () => {
    try {
      // create item
      const item = await axios.post("http://localhost:4000/api/items", {
        name: "carrot",
        list: listId,
      });
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.status).toBe("fail");
      expect(err.response.data.message).toBe("You need to be logged in!");
    }
  });
});

// update item

describe("update item", () => {
  it("should update an item", async () => {
    const itemData = {
      resolved: "true",
    };

    const item = await axios.patch(
      `http://localhost:4000/api/items/${itemId}`,
      itemData,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(item.data.status).toBe("success");
    expect(item.data.data.data.resolved).toBe(true);
  });

  // test without token
  it("test without token", async () => {
    try {
      const itemData = {
        resolved: "true",
      };

      const item = await axios.patch(
        `http://localhost:4000/api/items/${itemId}`,
        itemData
      );
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.status).toBe("fail");
      expect(err.response.data.message).toBe("You need to be logged in!");
    }
  });

  // test for invalid token

  it("test for invalid token", async () => {
    try {
      const itemData = {
        resolved: "true",
      };

      const item = await axios.patch(
        `http://localhost:4000/api/items/${itemId}`,
        itemData,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGI1MDM5ODZhMzlkZDQzZWY0NzMzYiIsImlhdCI6MTcwMzYyODkxMiwiZXhwIjoxNzA2MjIwOTEyfQ.Qf0CmwBPPgzzJWbWsEnOTNmz-FJtpCrUDGUceF9_p6M`,
          },
        }
      );
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.status).toBe("fail");
      expect(err.response.data.message).toBe(
        "The user belonging to this token does no longer exist."
      );
    }
  });
});

// get all items in a given list

describe("get all items in a given list", () => {
  it("should return all items in a given list", async () => {
    // get all items in a given list
    const items = await axios.get(
      `http://localhost:4000/api/shopping-lists/${listId}/items`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(items.data.status).toBe("success");
    expect(items.data.data.items).toBeDefined();
  });

  // test without token

  it("test without token", async () => {
    try {
      // get all items in a given list
      const items = await axios.get(
        `http://localhost:4000/api/shopping-lists/${listId}/items`
      );
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.status).toBe("fail");
      expect(err.response.data.message).toBe("You need to be logged in!");
    }
  });

  // test for invalid token
  it("test for invalid token", async () => {
    try {
      // get all items in a given list
      const items = await axios.get(
        `http://localhost:4000/api/shopping-lists/${listId}/items`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGI1MDM5ODZhMzlkZDQzZWY0NzMzYiIsImlhdCI6MTcwMzYyODkxMiwiZXhwIjoxNzA2MjIwOTEyfQ.Qf0CmwBPPgzzJWbWsEnOTNmz-FJtpCrUDGUceF9_p6M`,
          },
        }
      );
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.status).toBe("fail");
      expect(err.response.data.message).toBe(
        "The user belonging to this token does no longer exist."
      );
    }
  });
});

// get item

describe("get item", () => {
  it("should get item", async () => {
    // get item
    const item = await axios.get(`http://localhost:4000/api/items/${itemId}`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    expect(item.data.status).toBe("success");
    expect(item.data.data.data._id).toBe(itemId);
  });

  // test without token

  it("test without token", async () => {
    try {
      // get item
      const item = await axios.get(`http://localhost:4000/api/items/${itemId}`);
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.status).toBe("fail");
      expect(err.response.data.message).toBe("You need to be logged in!");
    }
  });

  //test for invalid token

  it("test for invalid token", async () => {
    try {
      const item = await axios.get(
        `http://localhost:4000/api/items/${itemId}`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGI1MDM5ODZhMzlkZDQzZWY0NzMzYiIsImlhdCI6MTcwMzYyODkxMiwiZXhwIjoxNzA2MjIwOTEyfQ.Qf0CmwBPPgzzJWbWsEnOTNmz-FJtpCrUDGUceF9_p6M`,
          },
        }
      );
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.status).toBe("fail");
      expect(err.response.data.message).toBe(
        "The user belonging to this token does no longer exist."
      );
    }
  });
});

// add iten for a given list
describe("add item for a given list", () => {
  it("should add item for a given list", async () => {
    // add item for a given list
    const item = await axios.post(
      `http://localhost:4000/api/shopping-lists/${listId}/items`,
      {
        name: "carrot",
      },
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    expect(item.data.status).toBe("success");
    expect(item.data.data.data.list).toBe(listId);
  });

  // test without token

  it("test without token", async () => {
    try {
      // add item for a given list
      const item = await axios.post(
        `http://localhost:4000/api/shopping-lists/${listId}/items`,
        {
          name: "carrot",
        }
      );
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.status).toBe("fail");
      expect(err.response.data.message).toBe("You need to be logged in!");
    }
  });

  // test for invalid token

  it("test for invalid token", async () => {
    try {
      // add item for a given list
      const item = await axios.post(
        `http://localhost:4000/api/shopping-lists/${listId}/items`,
        {
          name: "carrot",
        },
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGI1MDM5ODZhMzlkZDQzZWY0NzMzYiIsImlhdCI6MTcwMzYyODkxMiwiZXhwIjoxNzA2MjIwOTEyfQ.Qf0CmwBPPgzzJWbWsEnOTNmz-FJtpCrUDGUceF9_p6M`,
          },
        }
      );
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.status).toBe("fail");
      expect(err.response.data.message).toBe(
        "The user belonging to this token does no longer exist."
      );
    }
  });
});

// delete item

describe("delete item", () => {
  it("should delete item", async () => {
    const item = await axios.delete(
      `http://localhost:4000/api/items/${itemId}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    expect(item.status).toBe(204);
  });

  // test without token

  it("test without token", async () => {
    try {
      const item = await axios.delete(
        `http://localhost:4000/api/items/${itemId}`
      );
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.status).toBe("fail");
    }
  });

  // test for invalid token

  it("test for invalid token", async () => {
    try {
      const item = await axios.delete(
        `http://localhost:4000/api/items/${itemId}`,
        {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OGI1MDM5ODZhMzlkZDQzZWY0NzMzYiIsImlhdCI6MTcwMzYyODkxMiwiZXhwIjoxNzA2MjIwOTEyfQ.Qf0CmwBPPgzzJWbWsEnOTNmz-FJtpCrUDGUceF9_p6M`,
          },
        }
      );
    } catch (err) {
      expect(err.response.status).toBe(401);
      expect(err.response.data.status).toBe("fail");
    }
  });
});
