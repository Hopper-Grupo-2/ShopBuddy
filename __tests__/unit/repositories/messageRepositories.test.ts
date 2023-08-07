import {
    connectDatabase,
    closeDatabase,
    clearDatabase,
} from "../../helpers/db";
import Models from "../../../server/src/database/models";
import MessagesRepositories from "../../../server/src/repositories/messages";
  
beforeAll(async () => {
await connectDatabase();
});

afterEach(async () => {
await clearDatabase();
});

afterAll(async () => {
await closeDatabase();
});
  
describe("Messagess Repositories", () => {
    describe("getAllMessages", () => {
        it("should retrieve all lists from the database", async () => {
            //Creation of user owner of the list
            const userModel = Models.getInstance().userModel;
            const user = await userModel.create({
                username: "userTest",
                email: "test@mail.com",
                password: "123",
                firstName: "userf",
                lastName: "userl",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            // insert some lists into database
            const listModel = Models.getInstance().listModel;
            const listFist = await listModel.create({
                listName: "list One",
                owner: user._id,
            });
            const listSecond = await listModel.create({
                listName: "list Two",
                owner: user._id,
            });

            // insert some messages into database
            const messageModel = Models.getInstance().messageModel;
            const messageFist = await messageModel.create({
                listId: listFist._id,
                userId: user._id,
                textContent: "First message",
                createdAt: Date.now(),
            });

            const messageSecond = await messageModel.create({
                listId: listSecond._id,
                userId: user._id,
                textContent: "Second message",
                createdAt: Date.now(),
            });

            // call the method to get all lists from the repository
            const allMessages = await MessagesRepositories.getAllMessages();

            // assert that the result contains the inserted lists
            expect(allMessages).toHaveLength(2);

            // Check if the array is not null before accessing its elements
            if (allMessages) {
            expect(allMessages[0].textContent).toBe("First message");
            expect(allMessages[1].textContent).toBe("Second message");
            }
        });
        
        it("should return an empty array if no messages exist", async () => {
            // call the function being tested
            const allMessages = await MessagesRepositories.getAllMessages();

            // assert the expected results
            expect(allMessages).toEqual([]);
        });
    });


    describe("getMessageByListId", () => {
        it("should retrieve all lists associated with the list", async () => {
            //Creation of user owner of the list
            const userModel = Models.getInstance().userModel;
            const user = await userModel.create({
                username: "userTest",
                email: "test@mail.com",
                password: "123",
                firstName: "userf",
                lastName: "userl",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });

            // insert a list into database
            const listModel = Models.getInstance().listModel;
            const list = await listModel.create({
                listName: "lista",
                owner: user._id,
            });

            // insert some messages on the list into database
            const messageModel = Models.getInstance().messageModel;
            const messageFist = await messageModel.create({
                listId: list._id,
                userId: user._id,
                textContent: "First message",
                createdAt: Date.now(),
            });

            const messageSecond = await messageModel.create({
                listId: list._id,
                userId: user._id,
                textContent: "Second message",
                createdAt: Date.now(),
            });

            // call the method to get all messages from the repository
            const allMessages = await MessagesRepositories.getMessageByListId(list._id as string);

            // assert that the result contains the inserted messages
            expect(allMessages).toHaveLength(2);

            // Check if the array is not null before accessing its elements
            if (allMessages) {
                expect(allMessages[0].textContent).toBe("First message");
                expect(allMessages[1].textContent).toBe("Second message");
            }
        });

        it("should return an empty array there is no messages associated with the list", async () => {
            //Creation of user owner of the list
            const userModel = Models.getInstance().userModel;
            const user = await userModel.create({
                username: "userTest",
                email: "test@mail.com",
                password: "123",
                firstName: "userf",
                lastName: "userl",
                createdAt: Date.now(),
                updatedAt: Date.now(),
            });
    
            // insert a list into database
            const listModel = Models.getInstance().listModel;
            const list = await listModel.create({
                listName: "lista",
                owner: user._id,
            });
    
            // call the method to get all messages from the repository
            const allMessages = await MessagesRepositories.getMessageByListId(list._id as string);
    
            // Assert the expected results
            expect(allMessages).toEqual([]);
        });

        it("should return an empty array if the list ID does not exist", async () => {
            // Call the function being tested with a non-existent list ID
            const nonExistentListId = "1a3f5b2e9c7d0f8e6b4a9c8e";
            const allMessages = await MessagesRepositories.getMessageByListId(nonExistentListId);
    
            // Assert the expected results
            expect(allMessages).toEqual([]);
        });
    });

    describe("createMessage", () => {
        it("should create a new message and return it", async () => {
            const userId = "64baecd19a6976beff14b5db";
            const listId = "1a3f5b2e9c7d0f8e6b4a9c8e";
            const messageText = "Message test";
        
            // Call the function to create a new message
            const createdmessage = await MessagesRepositories.createMessage(messageText, listId, userId);
        
            // Assert that the created message matches the expected values
            expect(createdmessage).toHaveProperty("_id");
            expect(createdmessage.textContent).toBe(messageText);
            expect(createdmessage.userId.toString()).toBe(userId);
            expect(createdmessage.listId.toString()).toBe(listId);
            expect(createdmessage.createdAt).toBeInstanceOf(Date);
        });
    });
});
