const express = require('express');
const path = require('path');

const todosController
  = require(path.join(__dirname, '../controllers/todosController'));

const router = express.Router();

router.delete('/todos', todosController.delete);
router.get('/todos', todosController.getIndex);
router.post('/todos', todosController.create);
router.put('/todos', todosController.update);

module.exports = router;
