const express = require("express");
const router = express.Router();
const Contact = require("../../models/contact.model");
const { authenticateToken } = require("../../middleware/auth.middleware");
const { getIO } = require("../../socket");


router.get("/", authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;

    const total = await Contact.countDocuments();
    if (page > Math.ceil(total / limit)) {
      return res.status(404).json({ message: "Invalid Page" });
    }
    const contacts = await Contact.find()
      .lean()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      contacts,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    const existContact = await Contact.findOne({phone:req.body.phone});

    if (existContact) {
      return res.status(404).json({ message: "Phone exist already" });
    }

    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).lean();
    const existContact = await Contact.findOne({phone:req.body.phone}).lean();

    if (existContact._id.toString() != contact._id.toString()) {
      return res.status(404).json({ message: "Phone exist already" });
    }

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await Contact.findByIdAndUpdate(req.params.id, req.body)
    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    if (contact.locked) {
      return res.status(404).json({ message: "Contact locked for now" });
    }

    res.json(contact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/:id/lock", authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).lean();

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await Contact.findByIdAndUpdate(req.params.id, {locked: true}, {new: true}).lean();

    getIO().emit('contactLocked', {
      contactId: req.params.id
    });

    setTimeout(async()=>{
      await Contact.findByIdAndUpdate(req.params.id, {locked: false});
      getIO().emit('contactUnlocked', {
        contactId: req.params.id,
      });
    },2*60*1000);

    res.json({ message: "Contact locked successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/:id/unlock", authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).lean();

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await Contact.findByIdAndUpdate(req.params.id, {locked: false}, {new: true}).lean();

    getIO().emit('contactUnlocked', {
      contactId: req.params.id,
    });

    res.json({ message: "Contact unlocked successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
