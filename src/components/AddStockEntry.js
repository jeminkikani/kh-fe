import { useState } from 'react';
import axios from 'axios';

export default function AddStockEntry() {
  const [form, setForm] = useState({
    date: '',
    shopName: '',
    openingStock: '',
    standby: [{ name: '', qty: '' }],
    sale: '',
    closingStock: ''
  });

  const handleChange = (e, i = null) => {
    if (e.target.name.includes('standby') && i !== null) {
      const standby = [...form.standby];
      const key = e.target.name.split('.')[1];
      standby[i][key] = e.target.value;
      setForm({ ...form, standby });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const addStandby = () => {
    setForm({ ...form, standby: [...form.standby, { name: '', qty: '' }] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8989/api/stock/add-stock', form);
      alert('Entry saved!');
    } catch (err) {
      alert('Error saving entry');
    }
  };

  return (
    <div>
      <h2>Add Stock Entry</h2>
      <form onSubmit={handleSubmit}>
        <input name="date" placeholder="Date" value={form.date} onChange={handleChange} required />
        <input name="shopName" placeholder="Shop Name" value={form.shopName} onChange={handleChange} required />
        <input name="openingStock" placeholder="Opening Stock" value={form.openingStock} onChange={handleChange} required />

        <h4>Standby</h4>
        {form.standby.map((s, i) => (
          <div key={i}>
            <input name="standby.name" placeholder="Name" value={s.name} onChange={(e) => handleChange(e, i)} required />
            <input name="standby.qty" placeholder="Qty" value={s.qty} onChange={(e) => handleChange(e, i)} required />
          </div>
        ))}
        <button type="button" onClick={addStandby}>Add More Standby</button>

        <input name="sale" placeholder="Sale" value={form.sale} onChange={handleChange} required />
        <input name="closingStock" placeholder="Closing Stock" value={form.closingStock} onChange={handleChange} required />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
