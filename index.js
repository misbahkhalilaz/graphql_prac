const express = require("express");
const express_graphql = require("express-graphql");
const { buildSchema } = require("graphql");
let { coursesData } = require("./data");

let app = express();

let schema = buildSchema(`
    type Query {
		course(id: Int!): Course!
		courses(topic: String!): [Course]
	}
	type Mutation {
		updateTopic(id: Int!, topic: String!): Course
		addCourse(id: Int!, title: String!, author: String!, description: String, topic: String!, url: String): Course
	}
	type Course {
		id: Int
		title: String
		author: String
		description: String
		topic: String
		url: String
	}
`);

let getCourse = (args) => {
	return coursesData.filter((course) => course.id === args.id)[0];
};

let getCourses = (args) =>
	coursesData.filter((course) => course.topic === args.topic);

let updateTopic = (args) => {
	coursesData.map((course) => {
		if (course.id === args.id) course.topic = args.topic;
		return course;
	});
	return coursesData.filter((course) => course.id === args.id)[0];
};

let addCourse = (args) => {
	coursesData.push(args);
	return coursesData.filter((course) => course.id === args.id)[0];
};

let root = {
	course: getCourse,
	courses: getCourses,
	updateTopic: updateTopic,
	addCourse: addCourse,
};

app.use(
	"/graphql",
	express_graphql({
		schema: schema,
		rootValue: root,
		graphiql: true,
	})
);
app.listen(4000, () => console.log(`localhost:4000/graphql`));
