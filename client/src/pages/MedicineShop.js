import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { medicineAPI, orderAPI } from '../services/api';

function MedicineShop() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');
    
    if (!userData || userType !== 'patient') {
      navigate('/patient/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    loadMedicines();
  }, [navigate]);

  const loadMedicines = async () => {
    try {
      const response = await medicineAPI.getAll();
      setMedicines(response.data);
    } catch (error) {
      console.error('Error loading medicines:', error);
    }
  };

  const addToCart = (medicine) => {
    const existing = cart.find(item => item.medicineId === medicine.id);
    
    if (existing) {
      setCart(cart.map(item =>
        item.medicineId === medicine.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        medicineId: medicine.id,
        medicineName: medicine.name,
        quantity: 1,
        price: medicine.price
      }]);
    }
    
    alert('Added to cart!');
  };

  const removeFromCart = (medicineId) => {
    setCart(cart.filter(item => item.medicineId !== medicineId));
  };

  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(medicineId);
      return;
    }
    
    setCart(cart.map(item =>
      item.medicineId === medicineId
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    const orderData = {
      patientId: user.id,
      patientName: user.name,
      patientAddress: user.address,
      patientPhone: user.phone,
      items: cart,
      totalAmount: parseFloat(calculateTotal()),
      status: 'PLACED',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    try {
      await orderAPI.create(orderData);
      alert('Order placed successfully!');
      setCart([]);
      setShowCart(false);
      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div className="navbar">
        <h2>🏥 HealthConnect - Medicine Shop</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={() => setShowCart(!showCart)} 
            className="btn" 
            style={{ background: 'white', color: '#007bff' }}
          >
            🛒 Cart ({cart.length})
          </button>
          <button 
            onClick={() => navigate('/patient/dashboard')} 
            className="btn" 
            style={{ background: 'white', color: '#007bff' }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <div className="container">
        <h2>Available Medicines</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {medicines.map(medicine => (
            <div key={medicine.id} className="card">
              <h3>{medicine.name}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>{medicine.description}</p>
              <p><strong>Category:</strong> {medicine.category}</p>
              <p><strong>Price:</strong> ₹{medicine.price}</p>
              <p><strong>In Stock:</strong> {medicine.stock} units</p>
              <button 
                className="btn btn-success" 
                onClick={() => addToCart(medicine)}
                disabled={medicine.stock === 0}
              >
                {medicine.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          ))}
        </div>

        {showCart && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div className="card" style={{ maxWidth: '600px', width: '90%', maxHeight: '80vh', overflow: 'auto' }}>
              <h3>Shopping Cart</h3>
              
              {cart.length === 0 ? (
                <p>Your cart is empty.</p>
              ) : (
                <>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map(item => (
                        <tr key={item.medicineId}>
                          <td>{item.medicineName}</td>
                          <td>₹{item.price}</td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.medicineId, parseInt(e.target.value))}
                              style={{ width: '60px', padding: '5px' }}
                            />
                          </td>
                          <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                          <td>
                            <button 
                              className="btn btn-danger"
                              onClick={() => removeFromCart(item.medicineId)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <h3>Total: ₹{calculateTotal()}</h3>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button className="btn btn-success" onClick={handleCheckout}>
                      Place Order
                    </button>
                    <button className="btn btn-danger" onClick={() => setShowCart(false)}>
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MedicineShop;
