const request = require("supertest");
const app = require("../app");

test("Register User", async () => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ name: "Test", email: "t@test.com", password: "123" });

  expect(res.statusCode).toBe(200);
});
