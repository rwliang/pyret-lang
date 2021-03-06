var r = require("requirejs")

define(["js/namespace"], function (NamespaceLib) {

  var Namespace = NamespaceLib.namespace;

  function performTest() {
    describe("Namespaces", function() {
      describe("normal fields", function() {
        it("should update", function() {
          var n = Namespace({});
          n2 = n.set("x", 5);
          expect(n2.get("x")).toEqual(5);
        });

        it("should merge many", function() {
          var n = Namespace({x: 5, y: 10, z: 6});
          n2 = n.merge(Namespace({x: 42, y: 7}));
          expect(n2.get("x")).toEqual(42);
          expect(n2.get("y")).toEqual(7);
          expect(n2.get("z")).toEqual(6);
        });

        it("should merge and add", function() {
          var n = Namespace({x: 5, y: 10, z: 6});
          n2 = n.merge(Namespace({x: 42, y: 7, w: 8}));
          expect(n2.get("x")).toEqual(42);
          expect(n2.get("y")).toEqual(7);
          expect(n2.get("z")).toEqual(6);
          expect(n2.get("w")).toEqual(8);
        });

      });
      describe("the proto field", function() {
        it("should handle __proto__ correctly for one update", function() {
          var n = Namespace({}); 
          var n2 = n.set("__proto__", 5);
          expect(n2.get("__proto__")).toEqual(5);
        });

        it("should error on initial proto fetch", function() {
          var n = Namespace({});
          expect(function() { n.get("__proto__"); }).toThrow();
        });

        it("should error on initial proto fetch even with __proto__ in object", function() {
          var n = Namespace({__proto__: 42});
          expect(function() { n.get("__proto__"); }).toThrow();
        });

        it("should allow updating proto functionally", function() {
          var n = Namespace({}); 
          var n2 = n.set("__proto__", 5);
          expect(n2.get("__proto__")).toEqual(5);
          var n3 = n.set("__proto__", 10);
          expect(n2.get("__proto__")).toEqual(5);
          expect(n3.get("__proto__")).toEqual(10);
        });

        it("should merge proto with noProto in both directions", function() {
          var n = Namespace({});
          var n2 = Namespace({}).set("__proto__", 5);
          var n3 = n.merge(n2);
          expect(n3.get("__proto__")).toEqual(5);
          var n4 = n.merge(n2);
          expect(n4.get("__proto__")).toEqual(5);
        });

        it("should override old proto", function() {
          var n = Namespace({}).set("__proto__", 5);
          var n2 = Namespace({}).set("__proto__", 10);

          var n3 = n.merge(n2);
          expect(n3.get("__proto__")).toEqual(10);
          var n4 = n2.merge(n);
          expect(n4.get("__proto__")).toEqual(5);
        });
      });

      describe("mixed fields", function() {

        it("should update both regular fields and proto", function() {
          var n = Namespace({x: 5});
          var n2 = n.set("__proto__", 22);
          expect(n.get("x")).toEqual(5);
          expect(n2.get("__proto__")).toEqual(22);
          expect(function() { return n.get("__proto__"); }).toThrow();
        });

        it("should handle many updates on each, then merging", function() {
          var n = Namespace({x: 5, y: 10}).set("x", 22).set("x", 45);
          var n2 = Namespace({z: 5}).set("y", 42).set("y", 6);
          
          var n3 = n.merge(n2);
          expect(n3.get("x")).toEqual(45);
          expect(n3.get("z")).toEqual(5);
          expect(n3.get("y")).toEqual(6);

          var n4 = n2.merge(n);
          expect(n4.get("x")).toEqual(45);
          expect(n4.get("z")).toEqual(5);
          expect(n4.get("y")).toEqual(10);
        });

      });
    })
  }
  return { performTest: performTest };
});
