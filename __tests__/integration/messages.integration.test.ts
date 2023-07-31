import supertest from "supertest";
import App from "../../server/src/app";
import { connectDatabase, closeDatabase, clearDatabase } from "../helpers/db";
import { generateCookieForUser } from "../helpers/cookieGenerator";
import MessagesRepositories from "../../server/src/repositories/messages";
import UsersRepositories from "../../server/src/repositories/users";
import IUser from "../../server/src/interfaces/user";
import IMessage from "../../server/src/interfaces/message";
import bcrypt from "bcrypt";
import ListsServices from "../../server/src/services/lists";
import IList from "../../server/src/interfaces/list";
import ListsRepositories from "../../server/src/repositories/lists";

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

describe("GET /api/messages/:listId", () => {
    it("should return status 401 if user cookie is missing", async () => {
        const response = await request.get("/api/messages/1");
        expect(response.status).toBe(401);
    });

    it("should return status 401 if user cookie is invalid", async () => {
        const jtwCookie = "invalidcookie";

        const response = await request
            .get("/api/messages/1")
            .set("Cookie", `session=${jtwCookie}`);

        expect(response.status).toBe(401);
    });

    it("should return status 401 if doesnt exist a list with id informed", async () => {
        const userInfo: IUser = {
            username: "user",
            password: "123",
            email: "user@mail.com",
            firstName: "userf",
            lastName: "userl",
        };
        const userExample: IUser = await UsersRepositories.createNewUser(
            userInfo
        );

        const jtwCookie = generateCookieForUser(userExample);

        const listInfo = { listName: "listTest" };
        const listExample = await ListsRepositories.createNewList(
            listInfo.listName,
            userExample._id as string
        );

        const messageInfo = "Message test!" 
        const messageExample = await MessagesRepositories.createMessage(
            messageInfo, 
            listExample._id as string, 
            userExample._id as string
        )

        const response = await request
        .get(`/api/messages/999999999999`)
        .set("Cookie", `session=${jtwCookie}`);

        expect(response.status).toBe(401);
    });

    it("should return status 200 and message  infos", async () => {
        const userInfo: IUser = {
            username: "user",
            password: "123",
            email: "user@mail.com",
            firstName: "userf",
            lastName: "userl",
        };
        const userExample: IUser = await UsersRepositories.createNewUser(
            userInfo
        );

        const jtwCookie = generateCookieForUser(userExample);

        const listInfo = { listName: "listTest" };
        const listExample = await ListsRepositories.createNewList(
            listInfo.listName,
            userExample._id as string
        );

        const messageInfo = "Message test!" 
        const messageExample = await MessagesRepositories.createMessage(
            messageInfo, 
            listExample._id as string, 
            userExample._id as string
        )

        const response = await request
            .get(`/api/messages/${listExample._id}`)
            .set("Cookie", `session=${jtwCookie}`);

        expect(response.status).toBe(200);
        //expect(response.body.data).toEqual(messageExample);
    });
});

describe("POST /api/messages/:listId", () => {
    it("should return status 401 if user cookie is missing", async () => {
        const response = await request.post("/api/messages/1");
        expect(response.status).toBe(401);
    });

    it("should return status 401 if user cookie is invalid", async () => {
        const jtwCookie = "invalidcookie";

        const response = await request
            .post("/api/messages/1")
            .set("Cookie", `session=${jtwCookie}`);

        expect(response.status).toBe(401);
    });

    it("should return status 401 if doesnt exist a list with id informed", async () => {
        const userInfo: IUser = {
            username: "user",
            password: "123",
            email: "user@mail.com",
            firstName: "userf",
            lastName: "userl",
        };
        const userExample: IUser = await UsersRepositories.createNewUser(
            userInfo
        );

        const jtwCookie = generateCookieForUser(userExample);

        const listInfo = { listName: "listTest" };
        const listExample = await ListsRepositories.createNewList(
            listInfo.listName,
            userExample._id as string
        );

        const messageInfo = "Message test!" 
        const messageExample = await MessagesRepositories.createMessage(
            messageInfo, 
            listExample._id as string, 
            userExample._id as string
        )
        messageExample

        const response = await request
        .post(`/api/messages/999999999999`)
        .set("Cookie", `session=${jtwCookie}`);

        expect(response.status).toBe(401);
    });

    it("should return status 200 and message infos", async () => {
        const userInfo: IUser = {
            username: "user",
            password: "123",
            email: "user@mail.com",
            firstName: "userf",
            lastName: "userl",
        };
        const userExample: IUser = await UsersRepositories.createNewUser(userInfo);

        const jtwCookie = generateCookieForUser(userExample);

        const listInfo = { listName: "listTest" };
        const listExample = await ListsRepositories.createNewList(
            listInfo.listName,
            userExample._id as string
        );

        const messageInfo = {
            textContent: 'Message test!'
        };
        const messageExample = await MessagesRepositories.createMessage(
            messageInfo.textContent, 
            listExample._id as string, 
            userExample._id as string
        )

        const response = await request
            .post(`/api/messages/${listExample._id}`)
            .send(messageInfo)
            .set("Cookie", `session=${jtwCookie}`);
        expect(response.status).toBe(200);
        //expect(response.body.data).toEqual(messageExample);
    });
});
