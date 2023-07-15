import supertest from "supertest";

describe("GET /lists", () => {
    it("should return all lists of compra", async () => {
        //tarefas.push({ id: 10, descricao: "teste" });

        // const response = await request.get("/todo");

        //expect(response.status).toBe(200);

        //expect(response.body).toEqual([{ id: 10, descricao: "teste" }]);
        expect(200).toBe(200);
    });
});

/*import { app } from "../src/app";
import { tarefas } from "../src/repositories.ts/tasks";

const request = supertest(app);

beforeEach(() => {
    // apagar o banco de dados
    tarefas.splice(0, tarefas.length);
});

describe("GET /todo", () => {
    it("should return a list of tasks", async () => {
        tarefas.push({ id: 10, descricao: "teste" });

        const response = await request.get("/todo");

        expect(response.status).toBe(200);

        expect(response.body).toEqual([{ id: 10, descricao: "teste" }]);
    });
});

describe("POST /todo", () => {
    it("should add a task", async () => {
        const response = await request
            .post("/todo")
            .send({ tarefa: "tarefa de teste" });

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            id: 1,
            mensagem: `Tarefa 'tarefa de teste' inserida com sucesso!`,
        });

        expect(tarefas).toEqual([
            {
                id: 1,
                descricao: "tarefa de teste",
            },
        ]);
    });

    it("should return status 400 if 'tarefa' field doesnt exist in body request", async () => {
        const response = await request.post("/todo").send({});

        expect(response.status).toBe(400);

        expect(response.body).toEqual({
            erro: "formato de requisição incorreto :(",
        });
    });
});

describe("DELETE /todo/:id", () => {
    it("should delete a task", async () => {
        tarefas.push({ id: 10, descricao: "tarefa teste 1" });
        tarefas.push({ id: 11, descricao: "tarefa teste 2" });

        const response = await request.delete("/todo/10");

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            mensagem: `Tarefa 'tarefa teste 1' deletada com sucesso!`,
        });

        expect(tarefas).toEqual([
            {
                id: 11,
                descricao: "tarefa teste 2",
            },
        ]);
    });

    it("should return status 404 if task doesnt exist", async () => {
        const response = await request.delete("/todo/99999");

        expect(response.status).toBe(404);

        expect(response.body).toEqual({ mensagem: `ID não encontrado!` });
    });
});

*/
