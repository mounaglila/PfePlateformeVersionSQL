const express = require('express');
const router = express.Router();
const {fetchData, getTableNames, getItemById, updateItemById,deleteItemById,deleteTableByName} = require('../Config/services');

router.get('/getall', async (req, res) => {
try {
    const data = await fetchData();
    res.json(data);
} catch (err) {
  console.error('Error fetching data:', err);
  res.status(500).json({ error: 'Server error while fetching data' });
}
});
//route to get the table names
router.get('/tablenames', async (req, res) => {
  try {
    const names = await getTableNames();
    console.log(names);
    res.json(names);
  } catch (err) {
    console.error('Error fetching table names:', err);
    res.status(500).json({ error: 'Server error while fetching table names' });
  }
});

router.get('/:table/:id', async (req, res) => {
  const { table, id } = req.params;
  try {
    const item = await getItemById(table, id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/update/:table/:id', async (req, res) => {
const { table, id } = req.params;
  try {
    const result = await updateItemById(table, id, req.body);
    res.json({ success: result.affectedRows > 0, result });
  } catch (err) {
    console.error('Error updating item:', err);
    res.status(500).json({ error: 'Server error while updating item' });
  }
});
router.delete('/delete/:table/:id', async (req, res) => {
    const { table, id } = req.params; 
    try { 
      const result = await deleteItemById(table, id);
      res.json({ success: result.affectedRows > 0 });
    } catch (err) {
        console.error('Error deleting item:', err); 
        res.status(500).json({ error: 'Server error while deleting item' });  
    }
});
router.delete('/delete/:table', async (req, res) => {
  const { table } = req.params;
  try {
    await deleteTableByName(table);
    res.json({ message: 'Table  deleted successfully' });
  } catch (err) {
    console.error('Error deleting table:', err);
    res.status(500).json({ error: 'Server error while deleting table' }); 
  }
});
module.exports = router;
