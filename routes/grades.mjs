import express from 'express'
import db from '../db/conn.mjs'
import { ObjectId } from 'mongodb'

const router = express.Router()


// Grades Routes

router.post('/', async(req,res)=>{

    try{
        let collection = await db.collection("grades")
        let newDocument = req.body

        // rename field for compatibility (in case we still have a student_id)
        if(newDocument.student_id){
            newDocument.learner_id = newDocument.student_id
            delete newDocument.student_id
        }

        let result = await collection.insertOne(newDocument)
        res.status(201).json(result)

    }catch(err){
        res.status(400).send(err)
    }

})

// Get a single grade entry by Id
router.get('/:id', async (req, res) => { // use async!! 
    try {
        let id;
        try {
            id = new ObjectId(req.params.id);
        } catch (err) {
            res.status(400).send('Object Id not valid');
            return;
        }
        // get our collection (table) from the database
        let collection = await db.collection('grades');
        let query = { _id: id };
        // find the Id object on the collection and send it as response 

        let result = await collection.findOne(query);

        if (!result) {
            throw error('Not Found', 404);
        } else {
            res.status(200).json(result);
        }
    } catch (err) {
        console.log(err);
        res.status(err.status).send(err.message);
    }
});



router.get('/student/:id', (req,res)=>{
    res.redirect(`grades/learner${req.params.id}`)
})

// Get a student's grade data
router.get('/learner/:id', async (req,res)=> {
    try{
        let collection = await db.collection("grades")
        let query ={ learner_id: Number(req.params.id)}
        let result = await collection.find(query).toArray()
        
        if (!result.length) {
            throw error('Not Found', 404);
        } else {
            res.status(200).json(result);
        }

    }catch(err){
        res.status(err.status).send(err.message)
    }
})

// Get a class's grade data
router.get('/class/:id', async (req,res)=>{
    try{
        let collection = await db.collection("grades")
        let query ={ class_id: Number (req.params.id)}
        let result = await collection.find(query).toArray()
        
        if (!result.length) {
            throw error('Not Found', 404);
        } else {
            res.status(200).json(result);
        }

    }catch(err){
        res.status(err.status).send(err.message)
    }

})



// Helper function
function error(message, status) {
    const error = new Error("Not Found")
    error.status = 404
    return error

}

export default router