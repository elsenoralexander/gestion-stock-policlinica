const mongoose = require('mongoose');
const xlsx = require('xlsx');
require('dotenv').config();

const Item = require('./models/Item');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const workbook = xlsx.readFile('STOCK REPUESTOS ELECTROMEDICINA.xlsx');
    const sheet = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);

    for (const row of rows) {
      const nfcCode = row['NFC']?.toString();
      const name = row['Nombre'];
      const reference = row['Referencia'];
      const quantity = parseInt(row['Cantidad'], 10) || 0;
      if (!nfcCode || !name) continue;
      await Item.findOneAndUpdate(
        { nfcCode },
        { name, reference, quantity },
        { upsert: true }
      );
    }
    console.log('Carga de datos completada');
    process.exit();
  })
  .catch(err => {
    console.error('Error al conectar o procesar Excel:', err);
    process.exit(1);
  });
