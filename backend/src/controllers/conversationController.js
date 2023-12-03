const Conversation = require("../models/Conversation");

const conversationController = {
  getConversation: async (req, res) => {
    try {
      const { conversationId } = req.query;

      console.log(conversationId);
      !conversationId && res.status(400).send("Missing conversationId");

      const conversation = await Conversation.findById(conversationId);

      res.json(conversation.messages);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error while fetching conversation");
    }
  },

  createConversation: async (req, res) => {
    try {
      const { id, messages } = req.body;

      const conversation = await Conversation.create({
        _id: id,
        messages,
      });

      res.json(conversation);
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  },

  updateConversation: async (req, res) => {
    try {
      const { id, messages } = req.body;
      const conversation = await Conversation.findById(id);

      if (!conversation) {
        console.log('error')
        return res.status(404).send("Conversation not found");
      }

      conversation.messages = [...messages];
      await conversation.save();

      res.send();
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  },
};

module.exports = conversationController;
