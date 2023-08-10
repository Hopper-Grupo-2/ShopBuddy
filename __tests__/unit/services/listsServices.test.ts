// import class will be mocked to unit testing
import IList from "../../../server/src/interfaces/list";

import ListRepositories from "../../../server/src/repositories/lists";
import UsersRepositories from "../../../server/src/repositories/users";
//import class will be tested
import ListsServices from "../../../server/src/services/lists";

jest.mock("../../../server/src/repositories/lists");

describe("Lists Services", () => {
    //first method from UsersServices will be tested
    describe("getAllLists", () => {
        it("should retrieve all lists", async () => {
            const listsFromRepo: IList[] = [
                {
                    _id: "64bc28f2e97fdb0fbd61c076",
                    listName: "Meu senhor",
                    products: [
                        {
                            "name": "oad",
                            "quantity": 12,
                            "unit": "g",
                            "price": 121,
                            "checked": false,
                            "_id": "64c01a558c586b987b4a081a"
                        }
                    ],
                    owner: "64baecd19a6976beff14b5db",
                    members: [
                        {
                            userId: "64baecd19a6976beff14b5db"
                        }
                    ],
                    createdAt:  new Date("2023-07-22T19:07:30.172Z"),
                    updatedAt:  new Date("2023-07-22T19:08:59.033Z"),
                },
                {
                    _id: "64bc28f2e97fdb0fbd61c076",
                    listName: "Meu Deus",
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
                    owner: "64baecd19a6976beff14b5db",
                    members: [
                        {
                            userId: "64baecd19a6976beff14b5db"
                        }
                    ],
                    createdAt:  new Date("2023-07-22T19:07:30.172Z"),
                    updatedAt:  new Date("2023-07-22T19:08:59.033Z"),
                },
            ];

            // return a pre-defined value instead true methodtaht need dependencies database
            jest.mocked(ListRepositories.findAllLists).mockResolvedValue(
                listsFromRepo
            );

            // call the function under test
            const lists = await ListsServices.getAllLists();

            // assertions
            expect(lists).toEqual(listsFromRepo);
            expect(jest.mocked(ListRepositories.findAllLists)).toBeCalledTimes(
                1
            );
            //ex. to functions without return
            //expect(jest.mocked(UsersRepositories.getAllUsers)).toBeCalledWith("para1",2);
        });
    })});


    describe("getListById", () => {
        it("should retrieve a list by id", async () => {
            const listsFromRepo: IList =
                {
                    _id: "64bc28f2e97fdb0fbd61c076",
                    listName: "Meu Deus",
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
                    owner: "64baecd19a6976beff14b5db",
                    members: [
                        {
                            userId: "64baecd19a6976beff14b5db"
                        }
                    ],
                    createdAt:  new Date("2023-07-22T19:07:30.172Z"),
                    updatedAt:  new Date("2023-07-22T19:08:59.033Z"),
                }
            ;
            // return a pre-defined value instead true method
            jest.mocked(ListRepositories.getListById).mockResolvedValue(
                listsFromRepo
            );

            // call the function under test
            const list = await ListsServices.getListByListId(
                "64bc28f2e97fdb0fbd61c076",
                "64baecd19a6976beff14b5db"
            );

            // assertions
            // console.log("=========================================================")
            expect(list).toEqual(listsFromRepo);
            // expect(jest.mocked(ListRepositories.findAllListsByUserId).toBeCalledTimes(
            //     1
            // ));
            //ex. to functions without return
            //expect(jest.mocked(UsersRepositories.getAllUsers)).toBeCalledWith("para1",2);
        });

        it("should throw a error if list doesnt exist", async () => {
            // mocked function about repositories that return null when user doesnt exist in db
            jest.mocked(ListRepositories.getListById).mockResolvedValue(null);

            // call the function under test
            await expect(() => {
                return ListsServices.getListByListId("1234567890ab","1920392913bdea");
            }).rejects.toMatchObject({ name: "NotFoundError" });

            await expect(() => {
                return ListsServices.getListByListId("1234567890ab","aaaaaaaaaaaa12");
            }).rejects.toMatchObject({
                message: "List does not exist",
            });

            //ex. to functions without return
            //expect(jest.mocked(UsersRepositories.getAllUsers)).toBeCalledWith("para1",2);
        });
    });
    describe("getListsByUserId", () => {
        it("should retrieve lists by userid", async () => {
            const userId = "64baecd19a6976beff14b5db";
            const listsFromRepo: IList[] = [
                {
                    _id: "64bc28f2e97fdb0fbd61c076",
                    listName: "Meu Deus",
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
                    owner: "64baecd19a6976beff14b5db",
                    members: [
                        {
                            userId: "64baecd19a6976beff14b5db"
                        }
                    ],
                    createdAt: new Date("2023-07-22T19:07:30.172Z"),
                    updatedAt: new Date("2023-07-22T19:08:59.033Z"),
                }
            ];
    
            // Mocking the repository function
            jest.mocked(ListRepositories.findAllListsByUserId).mockResolvedValue(
                listsFromRepo
            );
    
            // Call the function under test
            const lists = await ListsServices.getListsByUserId(userId);
    
            // Assertions
            expect(lists).toEqual(listsFromRepo);
            // You can also check if the mocked function was called with the correct parameter
            expect(ListRepositories.findAllListsByUserId).toBeCalledWith(userId);
        });
    
        it("should return null if user has no lists", async () => {
            const userId = "64baecd19a6976beff14b5db";
    
            // Mocking the repository function to return null
            jest.mocked(ListRepositories.findAllListsByUserId).mockResolvedValue(null);
    
            // Call the function under test
            const lists = await ListsServices.getListsByUserId(userId);
    
            // Assertions
            expect(lists).toBeNull();
            // You can also check if the mocked function was called with the correct parameter
            expect(ListRepositories.findAllListsByUserId).toBeCalledWith(userId);
        });
    
        it("should throw an error if the repository function throws an error", async () => {
            const userId = "64baecd19a6976beff14b5db";
            const errorMessage = "Database error";
    
            // Mocking the repository function to throw an error
            jest.mocked(ListRepositories.findAllListsByUserId).mockRejectedValue(new Error(errorMessage));
    
            // Call the function under test
            await expect(ListsServices.getListsByUserId(userId)).rejects.toThrow(errorMessage);
            // You can also check if the mocked function was called with the correct parameter
            expect(ListRepositories.findAllListsByUserId).toBeCalledWith(userId);
        });
    });

    describe("createNewList", () => {
        const userId = "64baecd19a6976beff14b5db";
        const listName = "Listinha";
    
        it("should create a new list and return it", async () => {
            const newListFromRepo = {
                _id: "64bc28f2e97fdb0fbd61c076",
                listName: "Listinha",
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
    
            // Mocking the repository functions
            jest.spyOn(UsersRepositories, "getUserById").mockResolvedValue({
                _id: userId,
                username: "jongas",
                email: "jongas@teste.com",
                password: "123",
                firstName: "jongas",
                lastName: "teste",
            });
    
            jest.spyOn(ListRepositories, "createNewList").mockResolvedValue(newListFromRepo);
    
            // Call the function under test
            const createdList = await ListsServices.createNewList(listName, userId);
    
            // Assertions
            expect(createdList).toEqual(newListFromRepo);
            expect(UsersRepositories.getUserById).toBeCalledWith(userId);
            expect(ListRepositories.createNewList).toBeCalledWith(listName, userId);
        });
    
        it("should throw an error if user does not exist", async () => {
            jest.spyOn(UsersRepositories, "getUserById").mockResolvedValue(null);
    
            await expect(() => {
                return ListsServices.createNewList(listName, userId);
            }).rejects.toMatchObject({ name: "UnauthorizedError" });
    
            await expect(() => {
                return ListsServices.createNewList(listName, userId);
            }).rejects.toMatchObject({
                message: "User does not exist",
            });
        });
    
        it("should throw an error if there is an error while creating the list", async () => {
            jest.spyOn(UsersRepositories, "getUserById").mockResolvedValue({
                _id: userId,
                username: "jongas",
                email: "jongas@teste.com",
                password: "123",
                firstName: "jongas",
                lastName: "teste",
            });
    
            jest.spyOn(ListRepositories, "createNewList").mockRejectedValue(new Error("Database error"));
    
            await expect(() => {
                return ListsServices.createNewList(listName, userId);
            }).rejects.toThrowError("Database error");
    
            expect(UsersRepositories.getUserById).toBeCalledWith(userId);
            expect(ListRepositories.createNewList).toBeCalledWith(listName, userId);
        });
    });
    
    
    