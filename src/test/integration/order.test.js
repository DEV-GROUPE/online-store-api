import { createToken } from "../../helpers/functions.js";
import Category from "../../models/category.model.js";
import Product from "../../models/product.model.js";
import User from "../../models/user.model.js";
import request from "supertest";
import { server } from "../../index.js";
import mongoose from "mongoose";
import { httpStatusText } from "../../utils/httpStatusText.js";
import Order from "../../models/order.model.js";
import { ORDER_STATUS } from "../../utils/orderStatus.js";
describe("Order API", () => {
    let token, user, product, cart, order;
    beforeAll(async () => {
        await User.deleteMany();
        await Category.deleteMany();
        await Product.deleteMany();
    });
    afterAll(async () => {
        await mongoose.disconnect();
        server.close();
    });
    beforeEach(async () => {
        user = await User.createUser(
            "user Order",
            "userOrder@user.gmail",
            "12345678",
            "admin"
        );
        token = createToken(user._id);
        const newCategory = { name: "New Category" };
        const category = await Category.create(newCategory);
        const newProduct = {
            title: "product test",
            brand: "brand test",
            description: "test description",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images",
            price: 120,
            totalStock: 100,
            category: category._id,
        };
        product = await Product.create(newProduct);
        cart = { product: product._id, quantity: 2 };
        user.cart = [cart];
        await user.save();
        order = await Order.create({
            user: user._id,
            cartItems: [
                { product: product._id, price: product.price, quantity: 2 },
            ],
            totalAmount: 200,
            address: "123 Test Street",
            city: "Test City",
            pincode: "12345",
            phone: "1234567890",
        });
    });
    afterEach(async () => {
        await Category.deleteMany();
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
    });
    describe("Creating a new order", () => {
        it("should create a new order with valid token", async () => {
            const newOrder = {
                address: "difiide",
                city: "city 1",
                pincode: 34844,
                phone: "6384820380",
                notes: "notes1",
            };

            const response = await request(server)
                .post("/api/orders")
                .set("Authorization", `Bearer ${token}`)
                .send(newOrder);

            expect(response.status).toBe(201);
            expect(response.body.status).toMatch(httpStatusText.SUCCESS);

            expect(response.body.data.totalAmount).toBe(
                cart.quantity * product.price
            );

            const userAfterOrder = await User.findById(response.body.data.user);
            expect(userAfterOrder.cart).toHaveLength(0);

            const productAfterOrder = await Product.findById(cart.product);
            expect(productAfterOrder.totalStock).toBe(
                product.totalStock - cart.quantity
            );

            const orderInDb = await Order.findById(response.body.data._id);
            expect(orderInDb).toBeDefined();
            expect(orderInDb.address).toBe(newOrder.address);
            expect(orderInDb.city).toBe(newOrder.city);
            expect(orderInDb.totalAmount).toBe(cart.quantity * product.price);
        });
    });
    describe("Update status of order", () => {
        it("should update the status of an order to 'shipped'", async () => {
            const updatedStatus = { status: ORDER_STATUS.SHIPPED };

            const response = await request(server) 
                .patch(`/api/orders/${order._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(updatedStatus);
            console.log("response.body", response.body.data);     

            expect(response.status).toBe(200);
            expect(response.body.status).toBe(httpStatusText.SUCCESS);
            expect(response.body.data.status).toMatch(ORDER_STATUS.SHIPPED);

        });
        it("should return 400 for invalid status", async () => {
            const invalidStatus = { status: "InvalidStatus" };

            const response = await request(server)
                .patch(`/api/orders/${order._id}`)
                .set("Authorization", `Bearer ${token}`)
                .send(invalidStatus);

            expect(response.status).toBe(400);
            expect(response.body.message).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        msg: "Order status must be one of: pending, processing, shipped, delivered, cancelled.",
                    }),
                ])
            );
        });
    });
});
