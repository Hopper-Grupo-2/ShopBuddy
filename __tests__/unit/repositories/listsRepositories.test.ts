import {
    connectDatabase,
    closeDatabase,
    clearDatabase,
  } from "../../helpers/db";
  import Models from "../../../server/src/database/models";
  import ListRepositories from "../../../server/src/repositories/lists";
  
  beforeAll(async () => {
    await connectDatabase();
  });
  
  afterEach(async () => {
    await clearDatabase();
  });
  
  afterAll(async () => {
    await closeDatabase();
  });
  
  describe("Lists Repositories", () => {
    describe("getAllLists", () => {
      it("should retrieve all lists from the database", async () => {
         // Criar um usuário para ser o owner das listas
      const userModel = Models.getInstance().userModel;
      const user = await userModel.create({
        username: "testuser1",
        email: "testuser1@alpha.com",
        password: "123",
        firstName: "test",
        lastName: "user1",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
        const Model = Models.getInstance().listModel;
  
        // insert some lists into database
        const list1 = await Model.create({
            listName: "lista1",
            owner: user._id,
          });
    
          const list2 = await Model.create({
            listName: "lista2",
            owner: user._id,
          });
    
  
        // call the method to get all lists from the repository
        const allLists = await ListRepositories.findAllLists();
  
        // assert that the result contains the inserted lists
        expect(allLists).toHaveLength(2);
  
        // Check if the array is not null before accessing its elements
        if (allLists) {
          expect(allLists[0].listName).toBe("lista1");
          expect(allLists[1].listName).toBe("lista2");
        }
      });
  
      it("should return an empty array if no lists exist", async () => {
        // call the function being tested
        const lists = await ListRepositories.findAllLists();
  
        // assert the expected results
        expect(lists).toEqual([]);
      });
    });
  });

    describe("findAllListsByUserId", () => {
    it("should retrieve all lists associated with the user", async () => {
      const Model = Models.getInstance().listModel;

      // Create a user and two lists associated with the user
      const user = await Models.getInstance().userModel.create({
        username: "testuser1",
        email: "testuser1@alpha.com",
        password: "123",
        firstName: "test",
        lastName: "user1",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      const list1 = await Model.create({
        listName: "lista1",
        owner: user._id, // Set the owner to the user's ID
        members: [{ userId: user._id }], // Add the user as a member
        // Add other list properties as needed
      });

      const list2 = await Model.create({
        listName: "lista2",
        owner: user._id, // Set the owner to the user's ID
        members: [{ userId: user._id }], // Add the user as a member
        // Add other list properties as needed
      });

      // Call the method to get all lists associated with the user
      const allLists = await ListRepositories.findAllListsByUserId(user.id);

      // Assert that the result contains the inserted lists
      expect(allLists).toHaveLength(2);
      if (allLists) {
        expect(allLists[0].listName).toBe("lista1");
        expect(allLists[1].listName).toBe("lista2");
      }
    });

    it("should return an empty array if no lists are associated with the user", async () => {
      // Create a user, but no lists associated with the user
      const user = await Models.getInstance().userModel.create({
        username: "testuser1",
        email: "testuser1@alpha.com",
        password: "123",
        firstName: "test",
        lastName: "user1",
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });

      // Call the function being tested
      const lists = await ListRepositories.findAllListsByUserId(user.id);

      // Assert the expected results
      expect(lists).toEqual([]);
    });

    it("should return an empty array if the user ID does not exist", async () => {
      // Call the function being tested with a non-existent user ID
      const nonExistentUserId = "1a3f5b2e9c7d0f8e6b4a9c8e";
      const lists = await ListRepositories.findAllListsByUserId(
        nonExistentUserId
      );

      // Assert the expected results
      expect(lists).toEqual([]);
    });
  });

  describe("getListById", () => {
    it("should retrieve the list with the given ID", async () => {
      // Crie uma lista no banco de dados
      const Model = Models.getInstance().listModel;
      const newList = await Model.create({
        listName: "Test List",
        owner: "64baecd19a6976beff14b5db",
        members: [
          {
            userId: "64baecd19a6976beff14b5db",
          },
        ],
      });

      // Chame a função para obter a lista pelo ID
      const list = await ListRepositories.getListById(newList.id);

      // Assert que a lista retornada corresponde à lista inserida
      expect(list).not.toBeNull();
      expect(list?._id.toString()).toBe(newList._id.toString());
      expect(list?.listName).toBe("Test List");
      expect(list?.owner.toString()).toBe("64baecd19a6976beff14b5db"); // Converter para string
    });

    it("should return null if no list exists with the given ID", async () => {
      // Chame a função com um ID de lista que não existe
      const nonExistentUserId = "1a3f5b2e9c7d0f8e6b4a9c8e";
      const list = await ListRepositories.getListById(
        nonExistentUserId
      );
      // Assert que a função retorna null
      expect(list).toBeNull();
    });
  });
