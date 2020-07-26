var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

const { Schema } = mongoose;

const students = new Schema({
  // _id: '',
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: { type: String, required: true },
  join_date: { type: Date, default: Date.now() }
});

// students.pre('save', function () {
//     this._id = this.first_name+"-"+this.last_name;
// });

const StudentSchema = mongoose.model('students', students);


/* GET home page. */
router.get('/', async function (req, res, next) {
  const students = await StudentSchema.find({});
  res.render('index', { title: 'Add Student', students });
});
router.get('/add', async function (req, res, next) {
  res.render('addStudent', { title: 'Add Student', students });

  
});
router.get('/student/:id', async function (req, res, next) {
  const id = req.params.id;
  try {
    const student = await StudentSchema.findById(id).exec();
    res.render('updateStudent', { title: 'Edit Student', student });
  }
  catch (e) {
    res.status(500).send('Failed');
  }
});
router.post('/', async (req, res) => {
  let student = null
  const studentObj = new StudentSchema({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gender: req.body.gender
  })
  if (studentObj.first_name && studentObj.last_name && studentObj.gender) {
    let gender = (studentObj.gender).toLowerCase()
    if (gender === 'female' || gender === 'male' || gender === 'other')
      student = await studentObj.save();
      if(student) res.redirect('/');
    else
      res.render('addStudent', { message: "Invalid Gender Try again" });

  }
  else
    return res.status(500).send('All Fields must be filled');
  if (student) {
    res.redirect('/');
  };
})

router.get('/:id', function (req, res) {
  const id = req.params.id;
  StudentSchema.findById({ _id: id }, function (err, student) {
    if (err)
    return res.status(500).send('Student Not Found');
    // res.json(student);
    res.send("I am here")

  });

});
router.post('/update/:id', (req, res) => {
  const id = req.params.id;
  const studentObj = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gender: req.body.gender
  }
  StudentSchema.findByIdAndUpdate({ _id: id }, studentObj, function (err, student) {
    if (err) res.status(500).send('Student Not Found');
    else{
      res.redirect('/');
    }
  })
})
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const studentObj = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gender: req.body.gender
  }
  StudentSchema.findByIdAndUpdate({ _id: id }, studentObj, function (err, student) {
    if (err) return res.status(500).send('Student Not Found');


    res.send('Successfully! Student updated - ' + studentObj.first_name + ' ' + studentObj.last_name);
  })

})

router.get('/delete/:id', function (req, res) {
  const id = req.params.id;
  StudentSchema.findOneAndDelete({ _id: id }, function (err, student) {
    if (err)
      return res.status(500).send('FAILED');


    if (!student)
      res.status(404).send("Student Not Found")

    res.redirect('/');

  })
});

router.delete('/:id', function (req, res) {
  const id = req.params.id;
  StudentSchema.findOneAndDelete({ _id: id }, function (err, student) {
    if (err)
      return res.status(500).send('FAILED');


    if (!student)
      res.status(404).send("Student Not Found")

    res.send('Successfully! Student deleted');

  })
});

module.exports = router;

