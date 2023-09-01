describe('Login and Save Cookies Test', () => {
  it('json Objects', () => {
    const json = {"Name": "Azher", "Profession": "QA"};
    const user = {
      name: "John Doe",
      age: 30,
      email: "john.doe@example.com",
      students: [
        {
          name: "Alice",
          age: 20,
          grade: "A",
        },
        {
          name: "Bob",
          age: 22,
          grade: "B+",
        },
        {
          name: "Charlie",
          age: 19,
          grade: "A-",
        },
      ],
    };
    
    // // Accessing user properties
    // cy.log("User's Name: " + user.name);
    // cy.log("User's Age: " + user.age);
    // cy.log("User's Email: " + user.email);
    
    // Accessing student properties
    cy.log("First Student's Name: " + user.students[0].name);
    cy.log("Second Student's Grade: " + user.students[1].grade);
    


    cy.log(json["Name"]);
    cy.log(json["Profession"]);
    cy.log(json.Name);
    cy.log(json.Profession);

    const arrayOfObjects = [
      { name: "Alice", age: 20, grade: "A" },
      { name: "Bob", age: 22, grade: "B+" },
      { name: "Charlie", age: 19, grade: "A-" },
      { name: "David", age: 21, grade: "A+" }
    ];
    
    // Accessing the elements in the array
    cy.log(arrayOfObjects[0].name); // Output: "Alice"
    cy.log(arrayOfObjects[1].grade); // Output: "B+"
    cy.log(arrayOfObjects[2].age);   
  });
  });
  