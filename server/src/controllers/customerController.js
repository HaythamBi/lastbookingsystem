import { getDb } from '../config/database.js';

export async function getCustomers(req, res) {
  try {
    const db = await getDb();
    const customers = await db.all(
      `SELECT u.*, 
              COUNT(DISTINCT b.id) as total_sessions
       FROM users u
       LEFT JOIN bookings b ON u.id = b.customer_id 
       WHERE u.role = 'customer'
       GROUP BY u.id
       ORDER BY u.name`
    );

    res.json({
      success: true,
      data: customers.map(customer => ({
        id: customer.id,
        name: customer.name,
        phoneNumber: customer.phone_number,
        email: customer.email,
        totalSessions: customer.total_sessions
      }))
    });
  } catch (error) {
    console.error('Error getting customers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get customers'
    });
  }
}

export async function updateCustomer(req, res) {
  const { id } = req.params;
  const { name, email } = req.body;

  try {
    const db = await getDb();
    await db.run(
      `UPDATE users 
       SET name = ?, email = ?
       WHERE id = ? AND role = 'customer'`,
      [name, email, id]
    );

    res.json({
      success: true,
      message: 'Customer updated successfully'
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer'
    });
  }
}

export async function deleteCustomer(req, res) {
  const { id } = req.params;

  try {
    const db = await getDb();
    
    // Start transaction
    await db.run('BEGIN TRANSACTION');

    // Delete customer's bookings
    await db.run(
      'DELETE FROM bookings WHERE customer_id = ?',
      [id]
    );

    // Delete customer
    await db.run(
      'DELETE FROM users WHERE id = ? AND role = ?',
      [id, 'customer']
    );

    await db.run('COMMIT');

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    await db.run('ROLLBACK');
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer'
    });
  }
}