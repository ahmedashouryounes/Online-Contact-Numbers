const express = require('express');
const router = express.Router();
const Contact = require('../../models/contact.model');
const { authenticateToken } = require('../../middleware/auth.middleware');

// Get contacts with pagination and filters
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    
    let filter = {};
    if (req.query.name) filter.name = new RegExp(req.query.name, 'i');
    if (req.query.phone) filter.phone = new RegExp(req.query.phone, 'i');
    if (req.query.address) filter.address = new RegExp(req.query.address, 'i');

    const contacts = await Contact.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Contact.countDocuments(filter);

    res.json({
      contacts,
      total,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create contact
router.post('/', authenticateToken, async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update contact
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    if (contact.lockedBy && contact.lockedBy !== req.user.username) {
      return res.status(423).json({ message: 'Contact is locked by another user' });
    }

    Object.assign(contact, req.body);
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete contact
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await contact.deleteOne();
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Lock contact
router.post('/:id/lock', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    if (contact.lockedBy && contact.lockedBy !== req.user.username) {
      return res.status(423).json({ message: 'Contact is already locked by another user' });
    }

    contact.lockedBy = req.user.username;
    contact.lockedAt = new Date();
    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Unlock contact
router.post('/:id/unlock', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    if (contact.lockedBy === req.user.username) {
      contact.lockedBy = null;
      contact.lockedAt = null;
      await contact.save();
    }
    
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
