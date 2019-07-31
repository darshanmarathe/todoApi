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
        }
      };

      const res = {
          status: sinon.spy(),
          send:sinon.spy(),
          json: sinon.spy()
      }
    });
    res.status.calledWith(400).should.equal(true);
  });
});
