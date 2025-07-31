const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const Item = require('./models/Item');
const Movement = require('./models/Movement');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error MongoDB:', err));

app.get('/api/items/:nfcCode', async (req, res) => {
  try {
    const item = await Item.findOne({ nfcCode: req.params.nfcCode });
    if (!item) return res.status(404).json({ error: 'Artículo no encontrado' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/api/items/:id/move', async (req, res) => {
  const { change } = req.body;
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Artículo no encontrado' });
    item.quantity += change;
    await item.save();
    const movement = new Movement({ item: item._id, change });
    await movement.save();
    res.json({ success: true, quantity: item.quantity });
  } catch (err) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
});
// Endpoint para crear o actualizar artículos desde Frontend
app.post('/api/items', async (req, res) => {
  try {
    const { nfcCode, name, reference, quantity } = req.body;
    const item = await Item.findOneAndUpdate(
      { nfcCode },
      { name, reference, quantity },
      { upsert: true, new: true }
    );
    res.json({ success: true, item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
