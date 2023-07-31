import supertest from "supertest";
import App from "../../server/src/app";
import { connectDatabase, closeDatabase, clearDatabase } from "../helpers/db";
import { generateCookieForUser } from "../helpers/cookieGenerator";
import UsersRepositories from "../../server/src/repositories/users";
import IUser from "../../server/src/interfaces/user";
import bcrypt from "bcrypt";
import { connectRedis, closeRedis } from "../helpers/cache";

const applicationObj = new App();
const request = supertest(applicationObj.app);

beforeAll(async () => {
  await connectDatabase();
  await connectRedis();
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
  await closeRedis();
});

describe("GET /api/users/:userId", () => {
  it("should return status 401 if user cookie is missing", async () => {
    const response = await request.get("/api/users/1");
    expect(response.status).toBe(401);
  });

  it("should return status 401 if user cookie is invalid", async () => {
    const jtwCookie = "invalidcookie";

    const response = await request
      .get("/api/users/1")
      .set("Cookie", `session=${jtwCookie}`);

    expect(response.status).toBe(401);
  });

  it("should return status 404 if doesnt exist a user with id informed", async () => {
    const userInfo: IUser = {
      username: "letstest",
      password: "123",
      email: "letstest@alpha.com",
      firstName: "lets",
      lastName: "test",
    };

    const userExample: IUser = await UsersRepositories.createNewUser(userInfo);

    const jtwCookie = generateCookieForUser(userExample);

    const response = await request
      .get(`/api/users/99999999999d`)
      .set("Cookie", `session=${jtwCookie}`);

    expect(response.status).toBe(404);
    //expect(response.body.data).toEqual(userExample);
  });

  it("should return status 200 and user  infos", async () => {
    const userInfo: IUser = {
      username: "letsuserold",
      password: "123",
      email: "letstest@alpha.com",
      firstName: "lets",
      lastName: "test",
    };

    const userExample: IUser = await UsersRepositories.createNewUser(userInfo);

    const jtwCookie = generateCookieForUser(userExample);

    const response = await request
      .get(`/api/users/${userExample._id}`)
      .set("Cookie", `session=${jtwCookie}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual(userExample);
  });
});

describe("PATCH /api/users/:userId", () => {
  it("should return status 401 if user cookie is missing", async () => {
    const response = await request.patch("/api/users/1").send({
      username: "user1updated",
      email: "user1updated@alpha.com",
      oldPassword: "123",
      newPassword: "1234",
      firstName: "user1",
      lastName: "updated",
    });

    expect(response.status).toBe(401);
  });

  it("should return status 401 if user cookie is invalid", async () => {
    const jtwCookie = "invalidcookie";
    const response = await request
      .patch("/api/users/1")
      .set("Cookie", `session=${jtwCookie}`)
      .send({
        username: "user1updated",
        email: "user1updated@alpha.com",
        oldPassword: "123",
        newPassword: "1234",
        firstName: "user1",
        lastName: "updated",
      });

    expect(response.status).toBe(401);
  });

  it("should return status 422 if userId is invalid", async () => {
    const userInfo: IUser = {
      username: "lets",
      password: "123",
      email: "letstest@alpha.com",
      firstName: "lets",
      lastName: "test",
    };

    const userExample: IUser = await UsersRepositories.createNewUser(userInfo);

    const jtwCookie = generateCookieForUser(userExample);

    // request passing a id without user associated
    const response = await request
      .patch(`/api/users/123`)
      .set("Cookie", `session=${jtwCookie}`)
      .send({
        username: "user1updated",
        email: "user1updated@alpha.com",
        oldPassword: "123",
        newPassword: "1234",
        firstName: "user1",
        lastName: "updated",
      });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ name: "UnprocessableEntity" });
    expect(Array.isArray(response.body.message)).toBe(true);
    //message need tobe a string array message:["string1",...]
    // where at least one is "The id must be a valid ObjectId."
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.stringContaining("The id must be a valid ObjectId."),
      ])
    );
  });

  it("should return status 422 if new username is invalid", async () => {
    const userInfo: IUser = {
      username: "lets",
      password: "123",
      email: "letstest@alpha.com",
      firstName: "lets",
      lastName: "test",
    };

    const userExample: IUser = await UsersRepositories.createNewUser(userInfo);

    const jtwCookie = generateCookieForUser(userExample);

    // request passing a id without user associated
    const response = await request
      .patch(`/api/users/${userExample._id}`)
      .set("Cookie", `session=${jtwCookie}`)
      .send({
        username: "invalid#$@@%username",
        email: "user1updated@alpha.com",
        oldPassword: "123",
        newPassword: "1234",
        firstName: "user1",
        lastName: "updated",
      });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ name: "UnprocessableEntity" });
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          "username must contain only letters and digits."
        ),
      ])
    );
  });

  it("should return status 422 if new email is invalid", async () => {
    const userInfo: IUser = {
      username: "lets",
      password: "123",
      email: "letstest@alpha.com",
      firstName: "lets",
      lastName: "test",
    };

    const userExample: IUser = await UsersRepositories.createNewUser(userInfo);

    const jtwCookie = generateCookieForUser(userExample);

    // request passing a id without user associated
    const response = await request
      .patch(`/api/users/${userExample._id}`)
      .set("Cookie", `session=${jtwCookie}`)
      .send({
        username: "user1updated",
        email: "emailinvalid.com",
        oldPassword: "123",
        newPassword: "1234",
        firstName: "user1",
        lastName: "updated",
      });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ name: "UnprocessableEntity" });
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining([expect.stringContaining("Invalid email format.")])
    );
  });

  it("should return status 422 if new firstName is invalid", async () => {
    const userInfo: IUser = {
      username: "lets",
      password: "123",
      email: "letstest@alpha.com",
      firstName: "lets",
      lastName: "test",
    };

    const userExample: IUser = await UsersRepositories.createNewUser(userInfo);

    const jtwCookie = generateCookieForUser(userExample);

    // request passing a id without user associated
    const response = await request
      .patch(`/api/users/${userExample._id}`)
      .set("Cookie", `session=${jtwCookie}`)
      .send({
        username: "user1updated",
        email: "emailup@alpha.com",
        oldPassword: "123",
        newPassword: "1234",
        firstName: "user1##@",
        lastName: "updated",
      });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ name: "UnprocessableEntity" });
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          "firstName must contain only letters and digits."
        ),
      ])
    );
  });

  it("should return status 422 if new lastName is invalid", async () => {
    const userInfo: IUser = {
      username: "lets",
      password: "123",
      email: "letstest@alpha.com",
      firstName: "lets",
      lastName: "test",
    };

    const userExample: IUser = await UsersRepositories.createNewUser(userInfo);

    const jtwCookie = generateCookieForUser(userExample);

    // request passing a id without user associated
    const response = await request
      .patch(`/api/users/${userExample._id}`)
      .set("Cookie", `session=${jtwCookie}`)
      .send({
        username: "user1updated",
        email: "emailup@alpha.com",
        oldPassword: "123",
        newPassword: "1234",
        firstName: "user1",
        lastName: "updated#$#",
      });

    expect(response.status).toBe(422);
    expect(response.body).toMatchObject({ name: "UnprocessableEntity" });
    expect(Array.isArray(response.body.message)).toBe(true);
    expect(response.body.message).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          "lastName must contain only letters and digits."
        ),
      ])
    );
  });

  it("should return status 404 if doesnt exist a user with id informed", async () => {
    const userInfo: IUser = {
      username: "lets",
      password: "123",
      email: "letstest@alpha.com",
      firstName: "lets",
      lastName: "test",
    };

    const userExample: IUser = await UsersRepositories.createNewUser(userInfo);

    const jtwCookie = generateCookieForUser(userExample);

    // request passing a id without user associated
    const response = await request
      .patch(`/api/users/64c4111111111111111119f0`)
      .set("Cookie", `session=${jtwCookie}`)
      .send({
        username: "user1updated",
        email: "user1updated@alpha.com",
        oldPassword: "123",
        newPassword: "1234",
        firstName: "user1",
        lastName: "updated",
      });

    expect(response.status).toBe(404);
  });

  it("should return status 403 if userId logged is different from userId in database", async () => {
    const userInfo1: IUser = {
      username: "numberone",
      password: "123",
      email: "number1@alpha.com",
      firstName: "number",
      lastName: "one",
    };
    const userInfo2: IUser = {
      username: "numbertwo",
      password: "123",
      email: "number2@alpha.com",
      firstName: "number",
      lastName: "two",
    };

    //saving two user in database
    const userExample1: IUser = await UsersRepositories.createNewUser(
      userInfo1
    );
    const userExample2: IUser = await UsersRepositories.createNewUser(
      userInfo2
    );

    const jtwCookie1 = generateCookieForUser(userExample1);

    // trying to change user 2 data using user1 account
    const response = await request
      .patch(`/api/users/${userExample2._id}`)
      .set("Cookie", `session=${jtwCookie1}`)
      .send({
        username: "user1updated",
        email: "user1updated@alpha.com",
        oldPassword: "123",
        newPassword: "1234",
        firstName: "user1",
        lastName: "updated",
      });

    expect(response.status).toBe(403);
    expect(response.body.error).toMatchObject({ name: "ForbiddenError" });
  });

  it("should return status 409 if new email is already used by another one user", async () => {
    const userInfo1: IUser = {
      username: "numberone",
      password: "123",
      email: "number1@alpha.com",
      firstName: "number",
      lastName: "one",
    };
    const userInfo2: IUser = {
      username: "numbertwo",
      password: "123",
      email: "number2@alpha.com",
      firstName: "number",
      lastName: "two",
    };

    //saving two user in database
    const userExample1: IUser = await UsersRepositories.createNewUser(
      userInfo1
    );
    const userExample2: IUser = await UsersRepositories.createNewUser(
      userInfo2
    );

    const jtwCookie1 = generateCookieForUser(userExample1);

    // trying to change user 2 data using user1 account
    const response = await request
      .patch(`/api/users/${userExample1._id}`)
      .set("Cookie", `session=${jtwCookie1}`)
      .send({
        username: "user1updated",
        email: "number2@alpha.com",
        oldPassword: "123",
        newPassword: "1234",
        firstName: "user1",
        lastName: "updated",
      });

    expect(response.status).toBe(409);
    expect(response.body.error).toMatchObject({ name: "Conflict" });
  });

  it("should return status 409 if new username is already used by another one user", async () => {
    const userInfo1: IUser = {
      username: "numberone",
      password: "123",
      email: "number1@alpha.com",
      firstName: "number",
      lastName: "one",
    };
    const userInfo2: IUser = {
      username: "numbertwo",
      password: "123",
      email: "number2@alpha.com",
      firstName: "number",
      lastName: "two",
    };

    //saving two user in database
    const userExample1: IUser = await UsersRepositories.createNewUser(
      userInfo1
    );
    const userExample2: IUser = await UsersRepositories.createNewUser(
      userInfo2
    );

    const jtwCookie1 = generateCookieForUser(userExample1);

    // trying to change user 2 data using user1 account
    const response = await request
      .patch(`/api/users/${userExample1._id}`)
      .set("Cookie", `session=${jtwCookie1}`)
      .send({
        username: "numbertwo",
        email: "user1updated@alpha.com",
        oldPassword: "123",
        newPassword: "1234",
        firstName: "user1",
        lastName: "updated",
      });

    expect(response.status).toBe(409);
    expect(response.body.error).toMatchObject({ name: "Conflict" });
  });

  it("should return status 401 if old password is wrong", async () => {
    const userInfo1: IUser = {
      username: "numberone",
      password: await bcrypt.hash("123", 10),
      email: "number1@alpha.com",
      firstName: "number",
      lastName: "one",
    };
    const userInfo2: IUser = {
      username: "numbertwo",
      password: await bcrypt.hash("123456", 10),
      email: "number2@alpha.com",
      firstName: "number",
      lastName: "two",
    };

    //saving two user in database
    const userExample1: IUser = await UsersRepositories.createNewUser(
      userInfo1
    );
    const userExample2: IUser = await UsersRepositories.createNewUser(
      userInfo2
    );

    const jtwCookie1 = generateCookieForUser(userExample1);

    // trying to change user 2 data using user1 account
    const response = await request
      .patch(`/api/users/${userExample1._id}`)
      .set("Cookie", `session=${jtwCookie1}`)
      .send({
        username: "userupdated1",
        email: "user1updated@alpha.com",
        oldPassword: "1wrongpass",
        newPassword: "4321",
        firstName: "user1",
        lastName: "updated",
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toMatchObject({
      name: "UnauthorizedError",
    });
  });

  it("should return status 200 and update user info", async () => {
    const userInfo: IUser = {
      username: "lets",
      password: await bcrypt.hash("123", 10),
      email: "letstest@alpha.com",
      firstName: "lets",
      lastName: "test",
    };

    const userExample: IUser = await UsersRepositories.createNewUser(userInfo);

    const jtwCookie = generateCookieForUser(userExample);

    const response = await request
      .patch(`/api/users/${userExample._id}`)
      .set("Cookie", `session=${jtwCookie}`)
      .send({
        username: "letsupdated",
        email: "letsupdated@alpha.com",
        oldPassword: "123",
        newPassword: "54321",
        firstName: "lets",
        lastName: "updated",
      });

    expect(response.status).toBe(200);
    expect(response.body.data).toBe(
      `User with id ${userExample._id} updated successfully!`
    );
  });
});
