// import class will be mocked to unit testing
import IList from "../../../server/src/interfaces/list";

import ListRepositories from "../../../server/src/repositories/lists";

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
                "64bc28f2e97fdb0fbd61c076"
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
                return ListsServices.getListByListId("1234567890ab");
            }).rejects.toMatchObject({ name: "NotFoundError" });

            await expect(() => {
                return ListsServices.getListByListId("1234567890ab");
            }).rejects.toMatchObject({
                message: "List does not exist",
            });

            //ex. to functions without return
            //expect(jest.mocked(UsersRepositories.getAllUsers)).toBeCalledWith("para1",2);
        });
    });