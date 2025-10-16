import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';

function Orders() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');
    
    if (!userData || userType !== 'patient') {
      navigate('/patient/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    loadOrders(parsedUser.id);
  }, [navigate]);

  const loadOrders = async (patientId) => {
    try {
      const response = await orderAPI.getByPatient(patientId);
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PLACED': return '#ffc107';
      case 'PROCESSING': return '#17a2b8';
      case 'SHIPPED': return '#007bff';
      case 'DELIVERED': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <div className="navbar">
        <h2>🏥 HealthConnect - My Orders</h2>
        <button 
          onClick={() => navigate('/patient/dashboard')} 
          className="btn" 
          style={{ background: 'white', color: '#007bff' }}
        >
          Back to Dashboard
        </button>
      </div>

      <div className="container">
        <h2>Order History</h2>
        
        {orders.length === 0 ? (
          <div className="card">
            <p>No orders yet. Visit the medicine shop to place your first order!</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/medicines')}
            >
              Go to Medicine Shop
            </button>
          </div>
        ) : (
          <div>
            {orders.map(order => (
              <div key={order.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3>Order #{order.id}</h3>
                    <p><strong>Order Date:</strong> {order.orderDate}</p>
                    <p><strong>Delivery Date:</strong> {order.deliveryDate}</p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span 
                        style={{ 
                          padding: '5px 10px', 
                          borderRadius: '12px', 
                          backgroundColor: getStatusColor(order.status),
                          color: 'white',
                          fontSize: '14px'
                        }}
                      >
                        {order.status}
                      </span>
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h3>₹{order.totalAmount.toFixed(2)}</h3>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                    >
                      {selectedOrder?.id === order.id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>

                {selectedOrder?.id === order.id && (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #ddd' }}>
                    <h4>Order Items:</h4>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.medicineName}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price}</td>
                            <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    <div style={{ marginTop: '15px' }}>
                      <h4>Delivery Information:</h4>
                      <p><strong>Name:</strong> {order.patientName}</p>
                      <p><strong>Address:</strong> {order.patientAddress}</p>
                      <p><strong>Phone:</strong> {order.patientPhone}</p>
                    </div>
                    
                    <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                      <h4>Order Timeline:</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                        {['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status, index) => (
                          <React.Fragment key={status}>
                            <div 
                              style={{
                                padding: '8px 15px',
                                borderRadius: '20px',
                                backgroundColor: order.status === status || 
                                  ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(order.status) > index
                                  ? getStatusColor(status) 
                                  : '#e0e0e0',
                                color: 'white',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}
                            >
                              {status}
                            </div>
                            {index < 3 && (
                              <div 
                                style={{
                                  flex: 1,
                                  height: '2px',
                                  backgroundColor: ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].indexOf(order.status) > index
                                    ? '#28a745'
                                    : '#e0e0e0'
                                }}
                              />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
