// import class will be mocked to unit testing
import IUser from "../../../server/src/interfaces/user";
import { IUserUpdate } from "../../../server/src/interfaces/user";

import UsersRepositories from "../../../server/src/repositories/users";

//import class will be tested
import UsersServices from "../../../server/src/services/users";

jest.mock("../../../server/src/repositories/users");

describe("Users Services", () => {
    //first method from UsersServices will be tested
    describe("getAllUsers", () => {
        it("should retrieve all users", async () => {
            const usersFromRepo: IUser[] = [
                {
                    _id: "1119e8640bf34fa1112da871",
                    username: "user1",
                    email: "user1repo@alpha.com",
                    password: "$2b$10$y01G/oBlC1s",
                    firstName: "user1",
                    lastName: "repo",
                    createdAt: new Date("2023-07-21T02:07:32.658Z"),
                    updatedAt: new Date("2023-07-22T05:03:55.403Z"),
                },
                {
                    _id: "2229e8640bf34fa1112da871",
                    username: "user2",
                    email: "user2repo2@alpha.com",
                    password: "$GEJzzIpOvIWW7KMn5W0S",
                    firstName: "user2",
                    lastName: "repo2",
                    createdAt: new Date("2023-07-22T02:02:20.750Z"),
                    updatedAt: new Date("2023-07-23T02:07:32.863Z"),
                },
            ];

            // return a pre-defined value instead true methodtaht need dependencies database
            jest.mocked(UsersRepositories.getAllUsers).mockResolvedValue(
                usersFromRepo
            );

            // call the function under test
            const users = await UsersServices.getAllUsers();

            // assertions
            expect(users).toEqual(usersFromRepo);
            expect(jest.mocked(UsersRepositories.getAllUsers)).toBeCalledTimes(
                1
            );
            //ex. to functions without return
            //expect(jest.mocked(UsersRepositories.getAllUsers)).toBeCalledWith("para1",2);
        });
    });

    describe("getUserById", () => {
        it("should retrieve a user by id", async () => {
            const userFromRepo: IUser = {
                _id: "1119e8640bf34fa1112da871",
                username: "user1",
                email: "user1repo@alpha.com",
                password: "$2b$10$y01G/oBlC1s",
                firstName: "user1",
                lastName: "repo",
                createdAt: new Date("2023-07-21T02:07:32.658Z"),
                updatedAt: new Date("2023-07-22T05:03:55.403Z"),
            };

            // return a pre-defined value instead true method
            jest.mocked(UsersRepositories.getUserById).mockResolvedValue(
                userFromRepo
            );

            // call the function under test
            const user = await UsersServices.getUserById(
                "1119e8640bf34fa1112da871"
            );

            // assertions
            expect(user).toEqual(userFromRepo);
            expect(jest.mocked(UsersRepositories.getUserById)).toBeCalledTimes(
                1
            );
            //ex. to functions without return
            //expect(jest.mocked(UsersRepositories.getAllUsers)).toBeCalledWith("para1",2);
        });

        it("should throw a error if user doesnt exist", async () => {
            // mocked function about repositories that return null when user doesnt exist in db
            jest.mocked(UsersRepositories.getUserById).mockResolvedValue(null);

            // call the function under test
            await expect(() => {
                return UsersServices.getUserById("1234567890ab");
            }).rejects.toMatchObject({ name: "NotFoundError" });

            await expect(() => {
                return UsersServices.getUserById("1234567890ab");
            }).rejects.toMatchObject({
                message: "There is no user with the given id",
            });

            //ex. to functions without return
            //expect(jest.mocked(UsersRepositories.getAllUsers)).toBeCalledWith("para1",2);
        });
    });

    describe("updateUser", () => {
        it("should retrieve a user updated", async () => {
            const oldUserFromRepo: IUser = {
                _id: "1119e8640bf34fa1112da871",
                username: "user1old",
                email: "user1old@alpha.com",
                password:
                    "$2b$10$dQcbTQ3O6ei6VwKV8TUkP.akt7TQA1uytf.WRZ2ZMRwwUlS14AW2G", //123 encryp,
                firstName: "user1",
                lastName: "old",
                createdAt: new Date("2023-07-21T02:07:32.658Z"),
                updatedAt: new Date("2023-07-22T05:03:55.403Z"),
            };
            const updatedUserFromRepo: IUser = {
                _id: "1119e8640bf34fa1112da871",
                username: "user1updated",
                email: "user1updated@alpha.com",
                password:
                    "$2b$10$dQcbTQ3O6ei6VwKV8TUkP.akt7TQA1uytf.WRZ2ZMRwwUlS14AW2G", //123 encryp
                firstName: "user1",
                lastName: "updated",
                createdAt: new Date("2023-07-21T02:07:32.658Z"),
                updatedAt: new Date("2023-07-22T05:03:55.403Z"),
            };

            const userId = "1119e8640bf34fa1112da871";

            // return a pre-defined value instead true method
            jest.mocked(UsersRepositories.getUserById).mockResolvedValue(
                oldUserFromRepo
            );

            // means email is unique
            jest.mocked(UsersRepositories.getUserByEmail).mockResolvedValue(
                null
            );

            // means username is unique
            jest.mocked(UsersRepositories.getUserByUsername).mockResolvedValue(
                null
            );

            // means email is unique
            jest.mocked(UsersRepositories.updateUser).mockResolvedValue(
                updatedUserFromRepo
            );

            const loggedUserId = "1119e8640bf34fa1112da871";
            const userIdParams = "1119e8640bf34fa1112da871";
            // call the function under test
            const updatedUser = await UsersServices.updateUser(
                loggedUserId,
                userIdParams,
                {
                    username: "user1updated",
                    email: "user1updated@alpha.com",
                    oldPassword: "123",
                    newPassword: "1234",
                    firstName: "user1",
                    lastName: "updated",
                } as IUserUpdate
            );

            // assertions
            expect(updatedUser).toEqual(updatedUserFromRepo);
            ////expect(jest.mocked(UsersRepositories.updateUser)).toBeCalledTimes(1);
        });

        it("should throw a error if user doesnt exist", async () => {
            // mocked function about repositories that return null when user doesnt exist in db
            jest.mocked(UsersRepositories.getUserById).mockResolvedValue(null);
            const userIdParams = "idNotExist!!";
            const loggedUserId = "idNotExist!!";
            const userUpdateInfo: IUserUpdate = {
                username: "user1updated",
                email: "user1updated@alpha.com",
                oldPassword: "123",
                newPassword: "1234",
                firstName: "user1",
                lastName: "updated",
            };
            // call the function under test
            await expect(() => {
                return UsersServices.updateUser(
                    loggedUserId,
                    userIdParams,
                    userUpdateInfo
                );
            }).rejects.toMatchObject({ name: "NotFoundError" });

            await expect(() => {
                return UsersServices.updateUser(
                    loggedUserId,
                    userIdParams,
                    userUpdateInfo
                );
            }).rejects.toMatchObject({
                message: "There is no user with the given id",
            });

            //ex. to functions without return
            //expect(jest.mocked(UsersRepositories.getAllUsers)).toBeCalledWith("para1",2);
        });

        it("should throw an error if user logged is not  owner", async () => {
            const oldUserFromRepo: IUser = {
                _id: "1119e8640bf34fa1112da871",
                username: "user1old",
                email: "user1old@alpha.com",
                password:
                    "$2b$10$dQcbTQ3O6ei6VwKV8TUkP.akt7TQA1uytf.WRZ2ZMRwwUlS14AW2G", //123 encryp,
                firstName: "user1",
                lastName: "old",
                createdAt: new Date("2023-07-21T02:07:32.658Z"),
                updatedAt: new Date("2023-07-22T05:03:55.403Z"),
            };
            // mocked function about repositories that return null when user doesnt exist in db
            jest.mocked(UsersRepositories.getUserById).mockResolvedValue(
                oldUserFromRepo
            );
            const userIdParams = oldUserFromRepo._id?.toString() || "";
            const loggedUserId = "thisIdAdiff!";
            const userUpdateInfo: IUserUpdate = {
                username: "user1updated",
                email: "user1updated@alpha.com",
                oldPassword: "123",
                newPassword: "1234",
                firstName: "user1",
                lastName: "updated",
            };
            // call the function under test
            await expect(() => {
                return UsersServices.updateUser(
                    loggedUserId,
                    userIdParams,
                    userUpdateInfo
                );
            }).rejects.toMatchObject({ name: "ForbiddenError" });

            await expect(() => {
                return UsersServices.updateUser(
                    loggedUserId,
                    userIdParams,
                    userUpdateInfo
                );
            }).rejects.toMatchObject({
                message: `User ${loggedUserId} does not have access`,
            });
        });

        it("should throw an error if new email is being used by another user", async () => {
            const oldUserFromRepo: IUser = {
                _id: "1119e8640bf34fa1112da871",
                username: "user1old",
                email: "user1old@alpha.com",
                password:
                    "$2b$10$dQcbTQ3O6ei6VwKV8TUkP.akt7TQA1uytf.WRZ2ZMRwwUlS14AW2G", //123 encryp,
                firstName: "user1",
                lastName: "old",
                createdAt: new Date("2023-07-21T02:07:32.658Z"),
                updatedAt: new Date("2023-07-22T05:03:55.403Z"),
            };
            // mocked function about repositories that return null when user doesnt exist in db
            jest.mocked(UsersRepositories.getUserById).mockResolvedValue(
                oldUserFromRepo
            );

            jest.mocked(UsersRepositories.getUserByEmail).mockResolvedValue({
                username: "anotheruser",
                email: "user1updated@alpha.com",
            } as IUser);
            const userIdParams = oldUserFromRepo._id?.toString() || "";
            const loggedUserId = "1119e8640bf34fa1112da871";
            const userUpdateInfo: IUserUpdate = {
                username: "user1updated",
                email: "user1updated@alpha.com",
                oldPassword: "123",
                newPassword: "1234",
                firstName: "user1",
                lastName: "updated",
            };
            // call the function under test
            await expect(() => {
                return UsersServices.updateUser(
                    loggedUserId,
                    userIdParams,
                    userUpdateInfo
                );
            }).rejects.toMatchObject({ name: "Conflict" });

            await expect(() => {
                return UsersServices.updateUser(
                    loggedUserId,
                    userIdParams,
                    userUpdateInfo
                );
            }).rejects.toMatchObject({
                message: "This e-mail is already in use",
            });
        });

        it("should throw an error if new username is already used by another user", async () => {
            const oldUserFromRepo: IUser = {
                _id: "1119e8640bf34fa1112da871",
                username: "user1old",
                email: "user1old@alpha.com",
                password:
                    "$2b$10$dQcbTQ3O6ei6VwKV8TUkP.akt7TQA1uytf.WRZ2ZMRwwUlS14AW2G", //123 encryp,
                firstName: "user1",
                lastName: "old",
                createdAt: new Date("2023-07-21T02:07:32.658Z"),
                updatedAt: new Date("2023-07-22T05:03:55.403Z"),
            };
            // mocked function about repositories that return null when user doesnt exist in db
            jest.mocked(UsersRepositories.getUserById).mockResolvedValue(
                oldUserFromRepo
            );

            jest.mocked(UsersRepositories.getUserByEmail).mockResolvedValue(
                null
            );

            jest.mocked(UsersRepositories.getUserByUsername).mockResolvedValue({
                username: "nickalreadyused",
                email: "nickused@alpha.com",
            } as IUser);

            const userIdParams = oldUserFromRepo._id?.toString() || "";

            const loggedUserId = "1119e8640bf34fa1112da871";
            const userUpdateInfo: IUserUpdate = {
                username: "user1updated",
                email: "user1updated@alpha.com",
                oldPassword: "123",
                newPassword: "1234",
                firstName: "user1",
                lastName: "updated",
            };
            // call the function under test
            await expect(() => {
                return UsersServices.updateUser(
                    loggedUserId,
                    userIdParams,
                    userUpdateInfo
                );
            }).rejects.toMatchObject({ name: "Conflict" });

            await expect(() => {
                return UsersServices.updateUser(
                    loggedUserId,
                    userIdParams,
                    userUpdateInfo
                );
            }).rejects.toMatchObject({
                message: "This username is already in use",
            });
        });

        it("should throw an error if old password does not match", async () => {
            const oldUserFromRepo: IUser = {
                _id: "1119e8640bf34fa1112da871",
                username: "user1old",
                email: "user1old@alpha.com",
                password:
                    "$2b$10$dQcbTQ3O6ei6VwKV8TUkP.akt7TQA1uytf.WRZ2ZMRwwUlS14AW2G", //123 encryp,
                firstName: "user1",
                lastName: "old",
                createdAt: new Date("2023-07-21T02:07:32.658Z"),
                updatedAt: new Date("2023-07-22T05:03:55.403Z"),
            };
            // mocked function about repositories that return null when user doesnt exist in db
            jest.mocked(UsersRepositories.getUserById).mockResolvedValue(
                oldUserFromRepo
            );

            jest.mocked(UsersRepositories.getUserByEmail).mockResolvedValue(
                null
            );

            jest.mocked(UsersRepositories.getUserByUsername).mockResolvedValue(
                null
            );

            const userIdParams = oldUserFromRepo._id?.toString() || "";
            const loggedUserId = "1119e8640bf34fa1112da871";
            const userUpdateInfo: IUserUpdate = {
                username: "user1updated",
                email: "user1updated@alpha.com",
                oldPassword: "123wrong",
                newPassword: "1234",
                firstName: "user1",
                lastName: "updated",
            };
            // call the function under test
            await expect(() => {
                return UsersServices.updateUser(
                    loggedUserId,
                    userIdParams,
                    userUpdateInfo
                );
            }).rejects.toMatchObject({ name: "UnauthorizedError" });

            await expect(() => {
                return UsersServices.updateUser(
                    loggedUserId,
                    userIdParams,
                    userUpdateInfo
                );
            }).rejects.toMatchObject({
                message: "Old password is wrong",
            });
        });
    });
});
