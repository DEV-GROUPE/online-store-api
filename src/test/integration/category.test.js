import request from "supertest";
import { server } from "../../index.js";
import mongoose from "mongoose";
import Category from "../../models/category.model.js";
import User from "../../models/user.model.js";
import { createToken } from "../../helpers/functions.js";
import { httpStatusText } from "../../utils/httpStatusText.js";

describe("Category API", () => {
    let categoryId;
    let token;
    beforeAll(async () => {
        await User.deleteMany();
        const user = await User.createUser(
            "admin",
            "admin@admin.gmail",
            "12345678",
            "admin"
        );
        token = createToken(user._id);
    });
    beforeEach(async () => {
        await Category.deleteMany();

        const categories = await Category.insertMany([
            { name: "category 1" },
            { name: "category 2" },
            { name: "category 3" },
        ]);

        categoryId = categories[0]._id;
    });
    afterAll(async () => {
        await mongoose.disconnect();
        server.close();
    });
    afterEach(async () => {
        await Category.deleteMany();
        await User.deleteMany({ role: "user" });
    });
    describe("getting categories", () => {
        it("should return all categories", async () => {
            const response = await request(server).get("/api/categories");

            expect(response.body.status).toMatch(httpStatusText.SUCCESS);
            expect(response.body.data.categories.docs).toHaveLength(3);
            expect(response.body.data.categories.docs).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({ name: "category 1" }),
                    expect.objectContaining({ name: "category 2" }),
                    expect.objectContaining({ name: "category 3" }),
                ])
            );
        });
        it("should return an empty array if no categories exist", async () => {
            await Category.deleteMany();
            const response = await request(server).get("/api/categories");

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(httpStatusText.SUCCESS);
            expect(response.body.data.categories.docs).toHaveLength(0);
        });
        it("should return a single category by ID", async () => {
            const response = await request(server).get(
                `/api/categories/${categoryId}`
            );

            expect(response.body.status).toBe(httpStatusText.SUCCESS);
            expect(response.body.data.category).toEqual(
                expect.objectContaining({ name: "category 1" })
            );
        });
        it("should fail if the category is not found", async () => {
            const invalidCategoryId = new mongoose.Types.ObjectId();

            const response = await request(server).get(
                `/api/categories/${invalidCategoryId}`
            );

            expect(response.status).toBe(404);
            expect(response.body.status).toBe(httpStatusText.FAIL);
            expect(response.body.message).toBe("category not found");
        });
        it("should fail if the category ID format is invalid", async () => {
            const invalidCategoryId = "12345";

            const response = await request(server).get(
                `/api/categories/${invalidCategoryId}`
            );

            expect(response.status).toBe(400);
            expect(response.body.status).toBe(httpStatusText.ERROR);
            expect(response.body.message).toBe("Invalid category ID format");
        });
        it("should return paginated categories", async () => {
            const response = await request(server).get(
                "/api/categories?limit=2&page=1"
            );

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(httpStatusText.SUCCESS);
            expect(response.body.data.categories.docs).toHaveLength(2);
        });
    });
    describe("Creating a new category", () => {
        it("should delete a category with valid token", async () => {
            const newCategory = { name: "New Category" };
            const response = await request(server)
                .post("/api/categories")
                .set("Authorization", `Bearer ${token}`)
                .send(newCategory);
            expect(response.status).toBe(201);
            expect(response.body.status).toMatch(httpStatusText.SUCCESS);
            expect(response.body.data.category.name).toMatch(newCategory.name);
        });
        it("should fail to create a category without a token", async () => {
            const newCategory = { name: "Unauthorized Category" };

            const response = await request(server)
                .post("/api/categories")
                .send(newCategory);

            expect(response.status).toBe(401);
            expect(response.body.status).toBe(httpStatusText.FAIL);
            expect(response.body.message).toMatch(
                "Authorization token required"
            );
        });
        it("should fail to create a category name is missing", async () => {
            const invalidCategory = {};

            const response = await request(server)
                .post("/api/categories")
                .set("Authorization", `Bearer ${token}`)
                .send(invalidCategory);

            expect(response.status).toBe(400);
            expect(response.body.status).toBe(httpStatusText.FAIL);
            expect(response.body.message).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        msg: "Category name is required.",
                    }),
                    expect.objectContaining({
                        msg: "Category name must be at least 3 characters long.",
                    }),
                ])
            );
        });
        it("should fail to create a category name already exists", async () => {
            const existingCategory = { name: "Existing Category" };

            await Category.create(existingCategory);

            const response = await request(server)
                .post("/api/categories")
                .set("Authorization", `Bearer ${token}`)
                .send(existingCategory);

            expect(response.status).toBe(409);
            expect(response.body.status).toBe(httpStatusText.FAIL);
            expect(response.body.message).toBe("category already exists");
        });
        it("should fail if the user does not have permission", async () => {
            const newCategory = { name: "Category for user" };
            const user = await User.create({
                email: "user@user.com",
                password: "password123",
                username: "user",
                role: "user",
            });

            const token = createToken(user._id);

            const response = await request(server)
                .post(`/api/categories`)
                .set("Authorization", `Bearer ${token}`)
                .send(newCategory);

            expect(response.status).toBe(403);
            expect(response.body.status).toBe(httpStatusText.FAIL);
            expect(response.body.message).toBe("You Are Not Authorized");
        });
    });
    describe("Deleting a category", () => {
        it("should delete a category with valid token", async () => {
            const response = await request(server)
                .delete(`/api/categories/${categoryId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.body.status).toBe(httpStatusText.SUCCESS);

            // Verify the category is deleted
            const deletedCategory = await Category.findById(categoryId);
            expect(deletedCategory).toBeNull();
        });
        it("should fail to delete a category without a token", async () => {
            const response = await request(server).delete(
                `/api/categories/${categoryId}`
            );

            expect(response.status).toBe(401);
            expect(response.body.status).toBe(httpStatusText.FAIL);
            expect(response.body.message).toMatch(
                "Authorization token required"
            );
        });
        it("should fail if the user does not have permission", async () => {
            const user = await User.create({
                email: "user@user.com",
                password: "password123",
                username: "user",
                role: "user",
            });

            const token = createToken(user._id);

            const response = await request(server)
                .delete(`/api/categories/${categoryId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(403);
            expect(response.body.status).toBe(httpStatusText.FAIL);
            expect(response.body.message).toBe("You Are Not Authorized");
        });
        it("should fail to delete a non-existing category", async () => {
            const invalidId = new mongoose.Types.ObjectId();
            const response = await request(server)
                .delete(`/api/categories/${invalidId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
            expect(response.body.status).toBe(httpStatusText.FAIL);
            expect(response.body.message).toBe("category not found");
        });
        it("should return error if category ID format is invalid", async () => {
            const invalidCategoryId = "12345";

            const response = await request(server)
                .delete(`/api/categories/${invalidCategoryId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.status).toBe(httpStatusText.ERROR);
            expect(response.body.message).toBe("Invalid category ID format");
        });
    });
    describe("Updating a category", () => {
        it("should upadte a category with valid token", async () => {
            const response = await request(server)
                .put(`/api/categories/${categoryId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "Updated Category Name" });

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(httpStatusText.SUCCESS);
            expect(response.body.data.category.name).toBe(
                "Updated Category Name"
            );

            // Verify that the category is updated in the database
            const updatedCategory = await Category.findById(categoryId);
            expect(updatedCategory.name).toBe("Updated Category Name");
        });
        it("should fail to delete a category without a token", async () => {
            const response = await request(server).put(
                `/api/categories/${categoryId}`
            );

            expect(response.status).toBe(401);
            expect(response.body.status).toBe(httpStatusText.FAIL);
            expect(response.body.message).toMatch(
                "Authorization token required"
            );
        });
        it("should fail if the user does not have permission", async () => {
            const user = await User.create({
                email: "user@user.com",
                password: "password123",
                username: "user",
                role: "user",
            });

            const token = createToken(user._id);

            const response = await request(server)
                .put(`/api/categories/${categoryId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(403);
            expect(response.body.status).toBe(httpStatusText.FAIL);
            expect(response.body.message).toBe("You Are Not Authorized");
        });
        it("should fail to update a non-existing category", async () => {
            const invalidCategoryId = new mongoose.Types.ObjectId();
            const response = await request(server)
                .put(`/api/categories/${invalidCategoryId}`)
                .set("Authorization", `Bearer ${token}`)
                .send({ name: "New Category Name" });

            expect(response.status).toBe(404);
            expect(response.body.status).toBe(httpStatusText.FAIL);
            expect(response.body.message).toBe("category not found");
        });
        it("should return error if category ID format is invalid", async () => {
            const invalidCategoryId = "12345";

            const response = await request(server)
                .put(`/api/categories/${invalidCategoryId}`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.status).toBe(httpStatusText.ERROR);
            expect(response.body.message).toBe("Invalid category ID format");
        });
    });
});
