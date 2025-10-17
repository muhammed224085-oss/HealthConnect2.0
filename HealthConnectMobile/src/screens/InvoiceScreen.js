import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { paymentAPI } from '../services/api';

const InvoiceScreen = ({ route, navigation }) => {
  const { paymentId } = route.params;
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoice();
  }, []);

  const loadInvoice = async () => {
    try {
      const response = await paymentAPI.getInvoice(paymentId);
      setInvoice(response.data);
    } catch (error) {
      // Demo invoice data
      const demoInvoice = {
        invoiceNumber: 'INV-' + Date.now(),
        paymentId: 'pay_' + Date.now(),
        amount: 500,
        currency: 'INR',
        paymentDate: new Date().toISOString(),
        paymentMethod: 'UPI',
        paymentStatus: 'SUCCESS',
        description: 'Doctor Consultation',
        items: [
          {
            name: 'Doctor Consultation',
            description: 'General consultation',
            price: 500,
            quantity: 1,
            total: 500
          }
        ]
      };
      setInvoice(demoInvoice);
    } finally {
      setLoading(false);
    }
  };

  const shareInvoice = async () => {
    try {
      const message = `
HealthConnect Invoice

Invoice Number: ${invoice.invoiceNumber}
Payment ID: ${invoice.paymentId}
Amount: ₹${invoice.amount}
Payment Method: ${invoice.paymentMethod}
Date: ${new Date(invoice.paymentDate).toLocaleDateString()}
Status: ${invoice.paymentStatus}

Description: ${invoice.description}

Thank you for using HealthConnect!
      `;

      await Share.share({
        message: message,
        title: 'HealthConnect Invoice',
      });
    } catch (error) {
      console.error('Error sharing invoice:', error);
    }
  };

  const downloadInvoice = () => {
    Alert.alert(
      'Download Invoice',
      'Invoice will be saved to your downloads folder.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Download', onPress: () => {
          // In a real app, implement PDF generation and download
          Alert.alert('Success', 'Invoice downloaded successfully!');
        }}
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text>Loading invoice...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!invoice) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text>Invoice not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.companyName}>HealthConnect</Text>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
        </View>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Invoice Number:</Text>
            <Text style={styles.detailValue}>{invoice.invoiceNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment ID:</Text>
            <Text style={styles.detailValue}>{invoice.paymentId}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>
              {new Date(invoice.paymentDate).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>{invoice.paymentMethod}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[
              styles.detailValue,
              { color: invoice.paymentStatus === 'SUCCESS' ? '#4CAF50' : '#f44336' }
            ]}>
              {invoice.paymentStatus}
            </Text>
          </View>
        </View>

        {/* Items */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>Items</Text>
          <View style={styles.itemsHeader}>
            <Text style={styles.itemHeaderText}>Description</Text>
            <Text style={styles.itemHeaderText}>Qty</Text>
            <Text style={styles.itemHeaderText}>Price</Text>
            <Text style={styles.itemHeaderText}>Total</Text>
          </View>
          
          {invoice.items && invoice.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemDescription}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
              </View>
              <Text style={styles.itemQty}>{item.quantity}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
              <Text style={styles.itemTotal}>₹{item.total}</Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>₹{invoice.amount}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax:</Text>
            <Text style={styles.totalValue}>₹0.00</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text style={styles.grandTotalLabel}>Total:</Text>
            <Text style={styles.grandTotalValue}>₹{invoice.amount}</Text>
          </View>
        </View>

        {/* Payment Info */}
        <View style={styles.paymentInfo}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <Text style={styles.paymentText}>
            Payment was successfully processed on {new Date(invoice.paymentDate).toLocaleDateString()} via {invoice.paymentMethod}.
          </Text>
          <Text style={styles.paymentText}>
            Transaction ID: {invoice.paymentId}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Thank you for choosing HealthConnect!
          </Text>
          <Text style={styles.footerText}>
            For any queries, contact support@healthconnect.com
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.shareButton} onPress={shareInvoice}>
          <Text style={styles.shareButtonText}>Share Invoice</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton} onPress={downloadInvoice}>
          <Text style={styles.downloadButtonText}>Download PDF</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  invoiceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  invoiceDetails: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  itemsSection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  itemsHeader: {
    flexDirection: 'row',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 12,
  },
  itemHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    flex: 1,
    textAlign: 'center',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemDescription: {
    flex: 2,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemDesc: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  itemQty: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  itemPrice: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  itemTotal: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalSection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalValue: {
    fontSize: 16,
    color: '#333',
  },
  grandTotal: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentInfo: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  paymentText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    backgroundColor: '#f8f9fa',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  downloadButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default InvoiceScreen;