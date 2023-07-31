import {
    connectDatabase,
    closeDatabase,
    clearDatabase,
} from "../../helpers/db";
import Models from "../../../server/src/database/models";
import UserRepositories from "../../../server/src/repositories/users";

beforeAll(async () => {
    await connectDatabase();
});

afterEach(async () => {
    await clearDatabase();
});

afterAll(async () => {
    await closeDatabase();
});

describe("Users Repositories", () => {
    describe("getAllUsers", () => {
        it("should retrieve all users from the database", async () => {
            const Model = Models.getInstance().userModel;

            // insert some users into database
            const user1 = await Model.create({
                username: "testuser1",
                email: "testuser1@alpha.com",
                password: "123",
                firstName: "test",
                lastName: "user1",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
            const user2 = await Model.create({
                username: "testuser2",
                email: "testuser2@alpha.com",
                password: "123",
                firstName: "test",
                lastName: "user2",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            // call the method to get all users from the repository
            const allUsers = await UserRepositories.getAllUsers();

            // assert that the result contains the inserted users
            expect(allUsers).toHaveLength(2);
            expect(allUsers[0].username).toBe("testuser1");
            expect(allUsers[1].username).toBe("testuser2");
        });

        it("should return an empty array if no users exist", async () => {
            // call the function being tested
            const users = await UserRepositories.getAllUsers();

            // assert the expected results
            expect(users).toHaveLength(0);
        });
    });

    describe("getUserById", () => {
        it("should retrieve a user by ID from the database", async () => {
            const Model = Models.getInstance().userModel;

            // insert a user into the database
            const insertedUser = await Model.create({
                username: "testuser1",
                email: "testuser1@alpha.com",
                password: "123",
                firstName: "test",
                lastName: "user1",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            // call the function being tested
            const user = await UserRepositories.getUserById(
                insertedUser._id.toString()
            );

            // assert the expected results
            expect(user).toBeDefined();
            expect(user?.username).toBe("testuser1");
            expect(user?.email).toBe("testuser1@alpha.com");
        });

        it("should return null if the user does not exist", async () => {
            //need to pass a valid mongodb _id
            // 24 hexcharacter - ex: "1a3f5b2e9c7d0f8e6b4a9c8e"
            // 12 bytes string - ex: "Hello World!"

            // call the function being tested
            const user = await UserRepositories.getUserById(
                "1a3f5b2e9c7d0f8e6b4a9c8e"
            );

            // assert the expected results
            expect(user).toBeNull();
        });
    });

    describe("createNewUser", () => {
        it("should create a new user in the database", async () => {
            // call the function being tested
            const createdUser = await UserRepositories.createNewUser({
                username: "testuser1",
                email: "testuser1@alpha.com",
                password: "123",
                firstName: "test",
                lastName: "user1",
            });

            // assert the expected results
            expect(createdUser).toBeDefined();
            expect(createdUser?.username).toBe("testuser1");
            expect(createdUser?.email).toBe("testuser1@alpha.com");
        });
    });

    describe("updateUser", () => {
        it("should update an existing user in the database", async () => {
            const Model = Models.getInstance().userModel;

            // insert a user into the database
            const insertedUser = await Model.create({
                username: "testuser1",
                email: "testuser1@alpha.com",
                password: "123",
                firstName: "test",
                lastName: "user1",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            // call the function being tested
            const userId = insertedUser._id.toString();
            const updatedUser = await UserRepositories.updateUser(userId, {
                username: "testuser1upd",
                email: "testuser1upd@alpha.com",
                password: "1234",
                firstName: "test",
                lastName: "user1upd",
            });

            // assert the expected results
            expect(updatedUser).toBeDefined();
            expect(updatedUser.username).toBe("testuser1upd");
            expect(updatedUser.email).toBe("testuser1upd@alpha.com");
            expect(updatedUser.password).toBe("1234");
            expect(updatedUser.firstName).toBe("test");
            expect(updatedUser.lastName).toBe("user1upd");
        });

        it("should throw an error if the user to update does not exist", async () => {
            //need to pass a valid mongodb _id
            // 24 hexcharacter - ex: "1a3f5b2e9c7d0f8e6b4a9c8e"
            // 12 bytes string - ex: "Hello World!"

            // Call the function being tested and expect it to throw an error

            await expect(() => {
                return UserRepositories.updateUser("notexistid!!", {
                    username: "testusernotexist",
                    email: "testusernotexist@alpha.com",
                    password: "1234",
                    firstName: "test",
                    lastName: "notexist",
                });
            }).rejects.toMatchObject({ name: "InternalServerError" });

            await expect(() => {
                return UserRepositories.updateUser("notexistid!!", {
                    username: "testusernotexist",
                    email: "testusernotexist@alpha.com",
                    password: "1234",
                    firstName: "test",
                    lastName: "notexist",
                });
            }).rejects.toMatchObject({ message: "Internal server error" });
        });
    });
});
