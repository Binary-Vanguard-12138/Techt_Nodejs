const request = require("supertest");
const fs = require("fs");
const { app, server } = require("../server");
const { JSON_FILE_PATH } = require("../constant/path");

let jwt;

/**
 * disable console.error in jest
 */
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    fs.rmSync(JSON_FILE_PATH);
});

afterAll(() => {
    console.error.mockRestore();
});

afterEach(() => {
    console.error.mockClear();
});

describe("POST /auth/register", () => {
    it("Register a new user", async () => {
        const res = await request(app).post(`/auth/register`)
            .send({ email: "test1@test.com", password: "password1" })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(201);
        expect(res.body.email).toBe("test1@test.com");
    });

    it("Register a new duplicated user", async () => {
        const res = await request(app).post(`/auth/register`)
            .send({ email: "test1@test.com", password: "password1" })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(409);
    });
});

describe("POST /auth/login", () => {
    it("Try to login with non-existing user", async () => {
        const res = await request(app).post(`/auth/login`)
            .send({ email: "test2@test.com", password: "password2" })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(404);
    });

    it("Try to login with wrong password", async () => {
        const res = await request(app).post(`/auth/login`)
            .send({ email: "test1@test.com", password: "password2" })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(400);
    });

    it("Login with correct email and password", async () => {
        const res = await request(app).post(`/auth/login`)
            .send({ email: "test1@test.com", password: "password1" })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(200);
        expect(res.body.email).toBe("test1@test.com");
        expect(res.body.token?.length).toBeGreaterThan(0);
        jwt = res.body.token;
    });
});


describe("POST /notes", () => {
    it("Try to create a new note without jwt", async () => {
        const res = await request(app).post(`/notes`)
            .send({ title: "Title1", content: "Content1" })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(401);
    });

    it("Create a new note with proper jwt", async () => {
        const res = await request(app).post(`/notes`)
            .set("Authorization", `Bearer ${jwt}`)
            .send({ title: "Title1", content: "Content1" })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe("Title1");
        expect(res.body.user_id).toBe("test1@test.com");
    });
});

describe("GET /notes", () => {
    it("Try to get all notes without jwt", async () => {
        const res = await request(app).get(`/notes`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(401);
    });

    it("Get all notes with proper jwt", async () => {
        const res = await request(app).get(`/notes`)
            .set("Authorization", `Bearer ${jwt}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].user_id).toBe("test1@test.com");
    });
});

describe("GET /notes/:note_id", () => {
    it("Try to get one note without jwt", async () => {
        const res = await request(app).get(`/notes/0`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(401);
    });

    it("Try to get a note which does not exist", async () => {
        const res = await request(app).get(`/notes/1`)
            .set("Authorization", `Bearer ${jwt}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(404);
    });

    it("Get a note which exists", async () => {
        const res = await request(app).get(`/notes/0`)
            .set("Authorization", `Bearer ${jwt}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(200);
        expect(res.body.user_id).toBe("test1@test.com");
    });
});

describe("PUT /notes/:note_id", () => {
    it("Try to update one note without jwt", async () => {
        const res = await request(app).put(`/notes/0`)
            .send({ title: "Title1", content: "Content1" })
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(401);
    });

    it("Try to update a note which does not exist", async () => {
        const res = await request(app).put(`/notes/1`)
            .send({ title: "Title1", content: "Content1" })
            .set("Authorization", `Bearer ${jwt}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(404);
    });

    it("Update a note which exists", async () => {
        const res = await request(app).put(`/notes/0`)
            .send({ title: "Title2", content: "Content2" })
            .set("Authorization", `Bearer ${jwt}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe("Title2");
    });

    it("Check if it is changed actually", async () => {
        const res = await request(app).get(`/notes/0`)
            .set("Authorization", `Bearer ${jwt}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe("Title2");
    });
});

describe("DELETE /notes/:note_id", () => {
    it("Try to delete one note without jwt", async () => {
        const res = await request(app).delete(`/notes/0`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(401);
    });

    it("Try to delete a note which does not exist", async () => {
        const res = await request(app).delete(`/notes/1`)
            .set("Authorization", `Bearer ${jwt}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(404);
    });

    it("Delete a note which exists", async () => {
        const res = await request(app).delete(`/notes/0`)
            .set("Authorization", `Bearer ${jwt}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe("Title2");
    });

    it("Check if it is deleted actually", async () => {
        const res = await request(app).get(`/notes/0`)
            .set("Authorization", `Bearer ${jwt}`)
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json');
        expect(res.statusCode).toBe(404);
    });
});


afterAll(() => {
    server.close();
});