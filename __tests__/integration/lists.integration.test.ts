import supertest from "supertest";
import App from "../../server/src/app";
import { connectDatabase, closeDatabase, clearDatabase } from "../helpers/db";
import { generateCookieForUser } from "../helpers/cookieGenerator";
import ListRepositories from "../../server/src/repositories/lists";
import IUser from "../../server/src/interfaces/user";
import IList from "../../server/src/interfaces/list";
import UsersRepositories from "../../server/src/repositories/users";

const applicationObj = new App();
const request = supertest(applicationObj.app);

beforeAll(async () => {
  await connectDatabase();
});

beforeEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe("GET /api/lists:listid", () => {
  it("should return status 200 and the list with the given ID", async () => {
    const userInfo: IUser = {
        username: "joaoteste12",
        password: "123",
        email: "joaots@alpha.com",
        firstName: "joao",
        lastName: "test",
      };
  
      const userExample: IUser = await UsersRepositories.createNewUser(userInfo);

      const listName = "Listinha";

      const jtwCookie = generateCookieForUser(userExample);

      const userid = userExample._id?.toString() || "";

    const createdList = await ListRepositories.createNewList(listName, userid);
    const response = await request
      .get(`/api/lists/${createdList._id}`)
      .set("Cookie", `session=${jtwCookie}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toMatchObject(createdList);
     
  });
  it("should return status 404 if the provided list ID is invalid", async () => {
    const userInfo: IUser = {
        username: "joaoteste12",
        password: "123",
        email: "joaots@alpha.com",
        firstName: "joao",
        lastName: "test",
      };
      const userExample: IUser = await UsersRepositories.createNewUser(userInfo);
      const listName = "Listinha";
      const jtwCookie = generateCookieForUser(userExample);
      const userid = userExample._id?.toString() || "";

    const createdList = await ListRepositories.createNewList(listName, userid);
    const invalidListId = "88888888888d";

    const response = await request
      .get(`/api/lists/${invalidListId}`)
      .set("Cookie", `session=${jtwCookie}`);

    expect(response.status).toBe(404);
})});

describe("POST /api/lists", () => {
  it("should create a new list with valid data", async () => {
    const userInfo = {
      username: "joaoteste12",
      password: "123",
      email: "joaots@alpha.com",
      firstName: "joao",
      lastName: "test",
    };
    const userExample = await UsersRepositories.createNewUser(userInfo);

    const jtwCookie = generateCookieForUser(userExample);

    const newListData = {
      listName: "Nova Lista de Compras",
      owner: userExample._id,
    };

    const response = await request
      .post("/api/lists")
      .set("Cookie", `session=${jtwCookie}`)
      .send(newListData);
      expect(response.status).toBe(200);
      expect(response.body);
  })
  it("should return status 500 if listName is missing", async () => {
    const userInfo = {
      username: "joaoteste12",
      password: "123",
      email: "joaots@alpha.com",
      firstName: "joao",
      lastName: "test",
    };
    const userExample = await UsersRepositories.createNewUser(userInfo);
    const jtwCookie = generateCookieForUser(userExample);

    const newListData = {
      listName: "",
      owner: userExample._id,
    };

    const response = await request
      .post("/api/lists")
      .set("Cookie", `session=${jtwCookie}`)
      .send(newListData);

    expect(response.status).toBe(500);
  });
});