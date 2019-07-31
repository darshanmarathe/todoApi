const should = require("should");
const sinon = require("sinon");

const todoController = require("../controller/todos");

describe("todos controller tests:", () => {
  describe("Post", () => {
    it("it should not allow empty title", () => {
      const req = {
        body: {
          todo: {
            description: "its really fancy"
          }
        },
        checkBody: sinon.spy(),
        validateAndRespond : sinon.spy()
      };
      const res = {
          status: sinon.spy(),
          send:sinon.spy(),
          json: sinon.spy()
      }
      const db = {}

      const controller = todoController(db);
      controller.addTodo(req, res);

      res.status.calledWith(400).should.equal(true);
    });

    it("it should not allow empty description", () => {
        const req = {
          body: {
            todo: {
              title: "its really fancy"
            }
          },
          checkBody: sinon.spy(),
          validateAndRespond : sinon.spy()
        };
        const res = {
            status: sinon.spy(),
            send:sinon.spy(),
            json: sinon.spy()
        }
        const db = {}
  
        const controller = todoController(db);
        controller.addTodo(req, res);
  
        res.status.calledWith(400).should.equal(true, );
      });
  });
});
