const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;
app.use(bodyParser.json());

// Connecting to Db
mongoose.connect('mongodb://localhost:27017/employeeDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Creating Employee Schema
const employeeSC = new mongoose.Schema({
    Name: String,
    ID: number,
    Position: String,
});

// Model
const Employee = mongoose.model('Employee', employeeSC);

//Post
app.post('/api/employee', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.json(employee);
    }

    catch (error) {
        console.error('unable to add employee')
    }
});

//Updating Employee Details
app.put('/api/employees/:ID', async (re, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(employee);
    }

    catch(error) 
    { console.error('unable to update employee details') };
});

//Deleting Employee

app.delete('/api/employees/:ID', async(req,res) => {
    try{
        await Employee.findByIdAndDelete(req.params.id);
            res.json({success:true});
    }
    catch(error){
        console.error('Unable to delete employee')   
    }
});

// Searching employees
app.get('/api/employees',async(req,res){
    try{
        const{page = 1, limit = 5,search = ''} = req.query;
        const regex = new RegExp(search,'i');

        const employees = await Employee.find({
            $or:[{ Name: regex},
                 {Position: regex}]
        })
        .skip((page - 1)*limit)
        .limit(parseInt(limit));
    res.json(employees);
    }
    catch(error){
        console.error('Unable to fetch employee')
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
