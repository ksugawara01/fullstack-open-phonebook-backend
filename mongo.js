const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
} else if (process.argv.length !== 5 && process.argv.length !==3) {
    console.log('you must include a password, name, and number to add a person to the database')
    process.exit(1)
}

//const password = encodeURI(process.argv[2])
const password = process.argv[2]
console.log("password", password)

const url = `mongodb+srv://ksugawara01:${password}@cluster0.p7a4jf4.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

//This is an object constructor
const Person = mongoose.model('Person', personSchema)

//print persons
if (process.argv.length === 3) {
    console.log("phonebook")
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })

} else if (process.argv.length === 5) { //save person to 
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })
    person.save().then((result) => {
        console.log(`${person.name} has been saved to the database.`)
        mongoose.connection.close()
    })
}