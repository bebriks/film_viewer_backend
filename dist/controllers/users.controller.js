"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.postUser = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
/* export const getUser: Handler = (req, res) => {
    const data = getConnection().get("users").value()
    res.send(res.json(data))
} */
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    //const newUser = { name, id: uuid() }
    try {
        yield exports.prisma.user.create({
            data: {
                name
            }
        });
        res.send(yield exports.prisma.user.findMany());
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.postUser = postUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield exports.prisma.user.findMany();
    res.send(allUsers);
});
exports.getUsers = getUsers;
/* getUser()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e)
      await prisma.$disconnect()
      process.exit(1)
    }) */ 
