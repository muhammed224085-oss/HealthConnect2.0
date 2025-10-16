import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);
    const [activeTab, setActiveTab] = useState('stats');
    const [stats, setStats] = useState({});
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [medicines, setMedicines] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const adminData = localStorage.getItem('adminData');
        if (!adminData) {
            navigate('/admin/login');
            return;
        }
        setAdmin(JSON.parse(adminData));
        loadStats();
    }, [navigate]);

    const loadStats = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/admin/stats');
            setStats(response.data);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const loadDoctors = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/admin/doctors');
            setDoctors(response.data);
        } catch (error) {
            console.error('Error loading doctors:', error);
        }
        setLoading(false);
    };

    const loadPatients = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/admin/patients');
            setPatients(response.data);
        } catch (error) {
            console.error('Error loading patients:', error);
        }
        setLoading(false);
    };

    const loadAppointments = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/admin/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error('Error loading appointments:', error);
        }
        setLoading(false);
    };

    const loadMedicines = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/admin/medicines');
            setMedicines(response.data);
        } catch (error) {
            console.error('Error loading medicines:', error);
        }
        setLoading(false);
    };

    const loadOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/admin/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error loading orders:', error);
        }
        setLoading(false);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        switch (tab) {
            case 'doctors':
                loadDoctors();
                break;
            case 'patients':
                loadPatients();
                break;
            case 'appointments':
                loadAppointments();
                break;
            case 'medicines':
                loadMedicines();
                break;
            case 'orders':
                loadOrders();
                break;
            default:
                loadStats();
        }
    };

    const deleteDoctor = async (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/doctors/${id}`);
                loadDoctors();
                alert('Doctor deleted successfully!');
            } catch (error) {
                alert('Error deleting doctor');
            }
        }
    };

    const deletePatient = async (id) => {
        if (window.confirm('Are you sure you want to delete this patient?')) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/patients/${id}`);
                loadPatients();
                alert('Patient deleted successfully!');
            } catch (error) {
                alert('Error deleting patient');
            }
        }
    };

    const deleteAppointment = async (id) => {
        if (window.confirm('Are you sure you want to delete this appointment?')) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/appointments/${id}`);
                loadAppointments();
                alert('Appointment deleted successfully!');
            } catch (error) {
                alert('Error deleting appointment');
            }
        }
    };

    const deleteMedicine = async (id) => {
        if (window.confirm('Are you sure you want to delete this medicine?')) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/medicines/${id}`);
                loadMedicines();
                alert('Medicine deleted successfully!');
            } catch (error) {
                alert('Error deleting medicine');
            }
        }
    };

    const deleteOrder = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/orders/${id}`);
                loadOrders();
                alert('Order deleted successfully!');
            } catch (error) {
                alert('Error deleting order');
            }
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/orders/${id}/status`, { status });
            loadOrders();
            alert('Order status updated!');
        } catch (error) {
            alert('Error updating order status');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminData');
        navigate('/admin/login');
    };

    if (!admin) return <div>Loading...</div>;

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <h1>🛡️ Admin Dashboard - HealthConnect</h1>
                <div style={styles.adminInfo}>
                    <span style={styles.adminName}>{admin.name} ({admin.role})</span>
                    <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div style={styles.tabNav}>
                <button 
                    style={{...styles.tab, ...(activeTab === 'stats' ? styles.activeTab : {})}}
                    onClick={() => handleTabChange('stats')}
                >
                    📊 Statistics
                </button>
                <button 
                    style={{...styles.tab, ...(activeTab === 'doctors' ? styles.activeTab : {})}}
                    onClick={() => handleTabChange('doctors')}
                >
                    👨‍⚕️ Doctors
                </button>
                <button 
                    style={{...styles.tab, ...(activeTab === 'patients' ? styles.activeTab : {})}}
                    onClick={() => handleTabChange('patients')}
                >
                    👤 Patients
                </button>
                <button 
                    style={{...styles.tab, ...(activeTab === 'appointments' ? styles.activeTab : {})}}
                    onClick={() => handleTabChange('appointments')}
                >
                    📅 Appointments
                </button>
                <button 
                    style={{...styles.tab, ...(activeTab === 'medicines' ? styles.activeTab : {})}}
                    onClick={() => handleTabChange('medicines')}
                >
                    💊 Medicines
                </button>
                <button 
                    style={{...styles.tab, ...(activeTab === 'orders' ? styles.activeTab : {})}}
                    onClick={() => handleTabChange('orders')}
                >
                    🛒 Orders
                </button>
            </div>

            {/* Content Area */}
            <div style={styles.content}>
                {loading && <div style={styles.loading}>Loading...</div>}

                {/* Statistics Tab */}
                {activeTab === 'stats' && (
                    <div style={styles.statsGrid}>
                        <div style={styles.statCard}>
                            <h3>👨‍⚕️ Total Doctors</h3>
                            <p style={styles.statNumber}>{stats.totalDoctors || 0}</p>
                        </div>
                        <div style={styles.statCard}>
                            <h3>👤 Total Patients</h3>
                            <p style={styles.statNumber}>{stats.totalPatients || 0}</p>
                        </div>
                        <div style={styles.statCard}>
                            <h3>📅 Total Appointments</h3>
                            <p style={styles.statNumber}>{stats.totalAppointments || 0}</p>
                        </div>
                        <div style={styles.statCard}>
                            <h3>💊 Total Medicines</h3>
                            <p style={styles.statNumber}>{stats.totalMedicines || 0}</p>
                        </div>
                        <div style={styles.statCard}>
                            <h3>🛒 Total Orders</h3>
                            <p style={styles.statNumber}>{stats.totalOrders || 0}</p>
                        </div>
                        <div style={styles.statCard}>
                            <h3>📋 Total Prescriptions</h3>
                            <p style={styles.statNumber}>{stats.totalPrescriptions || 0}</p>
                        </div>
                    </div>
                )}

                {/* Doctors Tab */}
                {activeTab === 'doctors' && (
                    <div style={styles.tableContainer}>
                        <h2>All Doctors</h2>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Specialization</th>
                                    <th>Phone</th>
                                    <th>Experience</th>
                                    <th>Fee (₹)</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map(doctor => (
                                    <tr key={doctor.id}>
                                        <td>{doctor.name}</td>
                                        <td>{doctor.email}</td>
                                        <td>{doctor.specialization}</td>
                                        <td>{doctor.phone}</td>
                                        <td>{doctor.experience}</td>
                                        <td>₹{doctor.consultationFee}</td>
                                        <td>
                                            <button 
                                                onClick={() => deleteDoctor(doctor.id)}
                                                style={styles.deleteBtn}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Patients Tab */}
                {activeTab === 'patients' && (
                    <div style={styles.tableContainer}>
                        <h2>All Patients</h2>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Age</th>
                                    <th>Address</th>
                                    <th>Medical History</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map(patient => (
                                    <tr key={patient.id}>
                                        <td>{patient.name}</td>
                                        <td>{patient.email}</td>
                                        <td>{patient.phone}</td>
                                        <td>{patient.age}</td>
                                        <td>{patient.address}</td>
                                        <td>{patient.medicalHistory}</td>
                                        <td>
                                            <button 
                                                onClick={() => deletePatient(patient.id)}
                                                style={styles.deleteBtn}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Appointments Tab */}
                {activeTab === 'appointments' && (
                    <div style={styles.tableContainer}>
                        <h2>All Appointments</h2>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Patient</th>
                                    <th>Doctor</th>
                                    <th>Date</th>
                                    <th>Time</th>
                                    <th>Type</th>
                                    <th>Fee</th>
                                    <th>Payment</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(apt => (
                                    <tr key={apt.id}>
                                        <td>{apt.patientName}</td>
                                        <td>{apt.doctorName}</td>
                                        <td>{apt.date}</td>
                                        <td>{apt.time}</td>
                                        <td>{apt.consultationType === 'VIDEO_CALL' ? '📹 Video' : apt.consultationType === 'AUDIO_CALL' ? '📞 Audio' : '👤 In-Person'}</td>
                                        <td>₹{apt.consultationFee}</td>
                                        <td>{apt.paymentStatus}</td>
                                        <td><span style={getStatusBadge(apt.status)}>{apt.status}</span></td>
                                        <td>
                                            <button 
                                                onClick={() => deleteAppointment(apt.id)}
                                                style={styles.deleteBtn}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Medicines Tab */}
                {activeTab === 'medicines' && (
                    <div style={styles.tableContainer}>
                        <h2>All Medicines</h2>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Price (₹)</th>
                                    <th>Stock</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicines.map(med => (
                                    <tr key={med.id}>
                                        <td>{med.name}</td>
                                        <td>{med.description}</td>
                                        <td>{med.category}</td>
                                        <td>₹{med.price}</td>
                                        <td>{med.stock}</td>
                                        <td>
                                            <button 
                                                onClick={() => deleteMedicine(med.id)}
                                                style={styles.deleteBtn}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div style={styles.tableContainer}>
                        <h2>All Orders</h2>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th>Total (₹)</th>
                                    <th>Order Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.patientName}</td>
                                        <td>{order.patientAddress}</td>
                                        <td>{order.patientPhone}</td>
                                        <td>₹{order.totalAmount}</td>
                                        <td>{order.orderDate}</td>
                                        <td>
                                            <select 
                                                value={order.status} 
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                                style={styles.statusSelect}
                                            >
                                                <option value="PLACED">PLACED</option>
                                                <option value="PROCESSING">PROCESSING</option>
                                                <option value="SHIPPED">SHIPPED</option>
                                                <option value="DELIVERED">DELIVERED</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button 
                                                onClick={() => deleteOrder(order.id)}
                                                style={styles.deleteBtn}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

const getStatusBadge = (status) => {
    const baseStyle = {
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600'
    };
    
    switch (status) {
        case 'CONFIRMED':
            return { ...baseStyle, backgroundColor: '#d4edda', color: '#155724' };
        case 'PENDING':
            return { ...baseStyle, backgroundColor: '#fff3cd', color: '#856404' };
        case 'CANCELLED':
            return { ...baseStyle, backgroundColor: '#f8d7da', color: '#721c24' };
        default:
            return { ...baseStyle, backgroundColor: '#e2e3e5', color: '#383d41' };
    }
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f5f5f5'
    },
    header: {
        backgroundColor: '#667eea',
        color: 'white',
        padding: '20px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    adminInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    adminName: {
        fontSize: '16px',
        fontWeight: '600'
    },
    logoutBtn: {
        backgroundColor: 'white',
        color: '#667eea',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        fontWeight: '600',
        cursor: 'pointer'
    },
    tabNav: {
        backgroundColor: 'white',
        padding: '0 40px',
        display: 'flex',
        gap: '5px',
        borderBottom: '2px solid #e0e0e0'
    },
    tab: {
        padding: '15px 25px',
        border: 'none',
        background: 'transparent',
        fontSize: '15px',
        fontWeight: '600',
        color: '#666',
        cursor: 'pointer',
        borderBottom: '3px solid transparent',
        transition: 'all 0.3s'
    },
    activeTab: {
        color: '#667eea',
        borderBottom: '3px solid #667eea'
    },
    content: {
        padding: '40px'
    },
    loading: {
        textAlign: 'center',
        fontSize: '18px',
        padding: '40px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
    },
    statCard: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        textAlign: 'center'
    },
    statNumber: {
        fontSize: '48px',
        fontWeight: '700',
        color: '#667eea',
        margin: '10px 0 0 0'
    },
    tableContainer: {
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '20px'
    },
    deleteBtn: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px'
    },
    statusSelect: {
        padding: '6px 10px',
        borderRadius: '6px',
        border: '1px solid #ddd',
        fontSize: '13px'
    }
};

// Add table styling
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    table th, table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
    }
    table th {
        background-color: #f8f9fa;
        font-weight: 600;
        color: #333;
    }
    table tr:hover {
        background-color: #f8f9fa;
    }
`;
document.head.appendChild(styleSheet);

export default AdminDashboard;
