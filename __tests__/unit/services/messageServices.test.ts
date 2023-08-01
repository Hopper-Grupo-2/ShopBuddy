// import class will be mocked to unit testing
import IMessage from "../../../server/src/interfaces/message";

import ListRepositories from "../../../server/src/repositories/lists";
import UsersRepositories from "../../../server/src/repositories/users";
import MessagesRepositories from "../../../server/src/repositories/messages";
//import class will be tested
import MessagesServices from "../../../server/src/services/messages";

jest.mock("../../../server/src/repositories/messages");

describe("Messages Services", () => {
    describe("getAllMessages", () => {
        it("should retrieve all messages", async () => {
            const messagesFromRepo: IMessage[] = [
                {
                    _id: "64bc28f2e97fdb0fbd61c070",
                    listId: "64bc28f2e97fdb0fbd61c071",
                    userId: "64bc28f2e97fdb0fbd61c072",
                    textContent:"Message one",
                    createdAt: new Date("2023-07-22T19:07:30.172Z"),
                },
                {
                    _id: "64bc28f2e97fdb0fbd61c073",
                    listId: "64bc28f2e97fdb0fbd61c074",
                    userId: "64bc28f2e97fdb0fbd61c075",
                    textContent:"Message two",
                    createdAt: new Date("2023-07-23T19:07:30.172Z"),
                },
            ];

            // return a pre-defined value instead true method that need dependencies database
            jest.mocked(MessagesRepositories.getAllMessages).mockResolvedValue(
                messagesFromRepo
            );

            // call the function under test
            const messages = await MessagesServices.getAllMessages();

            // assertions
            expect(messages).toEqual(messagesFromRepo);
            expect(jest.mocked(MessagesRepositories.getAllMessages)).toBeCalledTimes(1);
            //ex. to functions without return
            //expect(jest.mocked(UsersRepositories.getAllUsers)).toBeCalledWith("para1",2);
        });
    })

    describe("getMessageByListId", () => {
        const userId = "64bc28f2e97fdb0fbd61c072";
        const listId = "64bc28f2e97fdb0fbd61c071";

        const userFromRepo = {
            _id: userId,
            username: "user1old",
            email: "user1old@alpha.com",
            password:
                "$2b$10$dQcbTQ3O6ei6VwKV8TUkP.akt7TQA1uytf.WRZ2ZMRwwUlS14AW2G", //123 encryp,
            firstName: "userl",
            lastName: "old",
            createdAt: new Date("2023-07-21T02:07:32.658Z"),
            updatedAt: new Date("2023-07-22T05:03:55.403Z")
        }

        const listFromRepo = {
            _id: listId,
            listName: "List",
            products: [
                {
                    "name": "dado",
                    "quantity": 10,
                    "unit": "Kg",
                    "price": 200,
                    "checked": false,
                    "_id": "64c0a1558c586b987b4a018a"
                }
            ],
            owner: userId,
            members: [{ userId }],
            createdAt: new Date("2023-07-31T12:34:56.789Z"),
            updatedAt: new Date("2023-07-31T12:34:56.789Z"),
        };

        const messagesFromRepo: IMessage[] = [
            {
                _id: "64bc28f2e97fdb0fbd61c070",
                listId: listId,
                userId: userId,
                textContent:"Message one",
                createdAt: new Date("2023-07-22T19:07:30.172Z"),
            },
            {
                _id: "64bc28f2e97fdb0fbd61c073",
                listId: listId,
                userId: userId,
                textContent:"Message two",
                createdAt: new Date("2023-07-23T19:07:30.172Z"),
            },
        ];

        it('should throw an error if user does not exist', async () => {
            jest.spyOn(UsersRepositories, 'getUserById').mockResolvedValue(null);
            
            const result = MessagesServices.getMessageByListId(listId, userId);
            await expect(result).rejects.toMatchObject({ name: "UnauthorizedError" })
        })
        
        it('should throw an error if list does not exist', async () => {
            jest.spyOn(UsersRepositories, 'getUserById').mockResolvedValue(userFromRepo);
            jest.spyOn(ListRepositories, 'getListById').mockResolvedValue(null);
        
            const result = MessagesServices.getMessageByListId('listId', 'userId');
            await expect(result).rejects.toMatchObject({ name: "UnauthorizedError" })
        });

        it('should throw an error if user is not a member of the list', async () => {
            jest.spyOn(UsersRepositories, 'getUserById').mockResolvedValue(userFromRepo);
            jest.spyOn(ListRepositories, 'getListById').mockResolvedValue(listFromRepo);
            jest.spyOn(ListRepositories, 'isMember').mockResolvedValue(false);

            const result = MessagesServices.getMessageByListId('listId', 'userId');
            await expect(result).rejects.toMatchObject({ name: "UnauthorizedError" })
        });

        it('should return messages if user is a member of the list with the id', async () => {
            jest.spyOn(UsersRepositories, 'getUserById').mockResolvedValue(userFromRepo);
            jest.spyOn(ListRepositories, 'getListById').mockResolvedValue(listFromRepo);
            jest.spyOn(ListRepositories, 'isMember').mockResolvedValue(true);
            jest.spyOn(MessagesRepositories, 'getMessageByListId').mockResolvedValue(messagesFromRepo);
        
            const result = await MessagesServices.getMessageByListId('listId', 'userId');
            expect(result).toEqual(messagesFromRepo);
        });
    })

    describe("createMessage", () => {
        const userId = "64bc28f2e97fdb0fbd61c072";
        const listId = "64bc28f2e97fdb0fbd61c071";

        const userFromRepo = {
            _id: userId,
            username: "user1old",
            email: "user1old@alpha.com",
            password:
                "$2b$10$dQcbTQ3O6ei6VwKV8TUkP.akt7TQA1uytf.WRZ2ZMRwwUlS14AW2G", //123 encryp,
            firstName: "userl",
            lastName: "old",
            createdAt: new Date("2023-07-21T02:07:32.658Z"),
            updatedAt: new Date("2023-07-22T05:03:55.403Z")
        }

        const listFromRepo = {
            _id: listId,
            listName: "List",
            products: [
                {
                    "name": "dado",
                    "quantity": 10,
                    "unit": "Kg",
                    "price": 200,
                    "checked": false,
                    "_id": "64c0a1558c586b987b4a018a"
                }
            ],
            owner: userId,
            members: [{ userId }],
            createdAt: new Date("2023-07-31T12:34:56.789Z"),
            updatedAt: new Date("2023-07-31T12:34:56.789Z"),
        };

        const messagesFromRepo: IMessage = 
            {
                _id: "64bc28f2e97fdb0fbd61c070",
                textContent:"Message one",
                userId: userId,
                listId: listId,
                createdAt: new Date("2023-07-22T19:07:30.172Z"),
            };

        const message = "Message one"

        it('should throw an error if user does not exist', async () => {
            jest.spyOn(UsersRepositories, 'getUserById').mockResolvedValue(null);
            
            const result = MessagesServices.createMessage('message', 'listId', 'userId');
            await expect(result).rejects.toMatchObject({ name: "UnauthorizedError" })
        })
        
        it('should throw an error if list does not exist', async () => {
            jest.spyOn(UsersRepositories, 'getUserById').mockResolvedValue(userFromRepo);
            jest.spyOn(ListRepositories, 'getListById').mockResolvedValue(null);
        
            const result = MessagesServices.createMessage('message', 'listId', 'userId');
            await expect(result).rejects.toMatchObject({ name: "UnauthorizedError" })
        });

        it('should return message if list and user exist', async () => {
            jest.spyOn(UsersRepositories, "getUserById").mockResolvedValue(userFromRepo);
            jest.spyOn(ListRepositories, "getListById").mockResolvedValue(listFromRepo);

            jest.spyOn(MessagesRepositories, "createMessage").mockResolvedValue(messagesFromRepo);

            const result = await MessagesServices.createMessage(message, listId, userId);
            expect(result).toEqual(messagesFromRepo);
        });
    });
});