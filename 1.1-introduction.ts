/*
    1. Introduction
*/

// Hello, World!
console.log("Hello, World!");

// Variables
const hello = "Hello";
let message = hello;
message += ", World!";
console.log(message);

/*
    2. Types
*/

// Primitive Types
let motd: string = `Today is a great day :D
Nice to meet you!`;
let age: number = 9_000; // Equivelent to 9000
let isHappy: boolean = true;

// Comparison
// 0 == "0" // true
// 0 === "0" // false
// true && false // false
// true || false // true

// Arrays
let names: string[] = ["Alice", "Bob", "Charlie"];
console.log(names[0]);
console.log(names.length);

// Array - Tuples
type Coordinates = [number, number, number?];
const coords: Coordinates = [1, 2, 1];
const coords2d: Coordinates = [1, 1];

// Objects
type Person = {
  name: string;
  age: number;
  dob?: number;
  languages: { name: string; proficiency: string }[];
};
let person: Person = {
  name: "Alice",
  age: (((18 + 2) * 2) / 2) % 100,
  languages: [
    { name: "Chinese", proficiency: "Native" },
    { name: "English", proficiency: "Fluent" },
  ],
};
console.log(Object.keys(person));
console.log(Object.values(person));
console.log(Object.entries(person));
console.log(Object.fromEntries([["name", "Alice"]]));
console.log(JSON.stringify(person.languages[0]));

// Object - Index Signatures
let math: { [key: string]: number } = {
  "1x1": 1,
  "1x2": 2,
  "1x3": 3,
};

// 'any' Type
let anything: any = "This could be a string or a number";
anything = 42;

// 'unknown' Type
const result: unknown = JSON.parse(`{"name":"Chinese","proficiency":"Native"}`);
// result.name // 'result' is of type 'unknown'

// undefined and null
// undefined usually means a variable that has not been defined
// null usually means that a value has been explicitly set to null

// void and never
const sayHi = () => {
  console.log("Hi");
}; // void: functions that don't return anything
const throwError = () => {
  throw new Error();
}; // never: functions that never returns
const infLoop = () => {
  while (true) {
    console.log();
  }
};

// Union Types
const clouds: string | number = "Overcast";

// Type Casting
const stringResult: { name: string; proficiency: string } = result as {
  name: string;
  proficiency: string;
};

// enums
enum Proficiency {
  Native = "N",
  Fluent = "F",
  Beginner = "B",
}

/*
    3. Functions
*/

// Functions
function getGreeting(name: string) {
  return `Hello, ${name}!`;
}
console.log(getGreeting("World"));

// Anonymous Functions
const sayHello = function (name: string) {
  console.log(`Hello, ${name}!`);
};
const sayHelloArrow = (name: string) => console.log(`Hello, ${name}!`);
sayHelloArrow("World");
