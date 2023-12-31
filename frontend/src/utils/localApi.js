import axios from "axios";
import { postToOpenAI } from "./openai";
import { getConversationId, setConversationId } from "./localStorageUtils";
import { contextPrompt } from "./contextPrompt";
import { v4 as uuidv4 } from "uuid";

const HISTORY_LENGTH = import.meta.env.VITE_HISTORY_LENGTH;
const api = axios.create({
  baseURL: "/api",
});

export const initConversation = async (playerInfos) => {
  const conversationId = getConversationId();

  if (conversationId) {
    const response = await api.get(`/conversation`, {
      params: { conversationId: conversationId },
    });

    return response.data;
  } else {
    const newConversation = [
      { role: "system", content: contextPrompt },
      { role: "system", content: JSON.stringify(playerInfos) },
    ];

    const newMessage = await postToOpenAI(newConversation);
    newConversation.push({ role: "assistant", content: newMessage.content });

    const response = await api.post(`/conversation`, {
      id: uuidv4(),
      messages: newConversation,
    });

    setConversationId(response.data._id);
    return response.data.messages;
  }
};

export const updateConversation = async (playerResponse, playerInfos) => {
  const conversationId = getConversationId();
  let updatedConversation = [];

  const response = await api.get(`/conversation`, {
    params: { conversationId: conversationId },
  });

  updatedConversation = [
    ...response.data,
    { role: "user", content: playerResponse },
  ];

  //Update player infos
  updatedConversation[1].content = JSON.stringify(playerInfos);

  updatedConversation = updatedConversation.map((message) => {
    return { role: message.role, content: message.content };
  });

  const newMessage = await postToOpenAI(updatedConversation);
  updatedConversation.push({ role: "assistant", content: newMessage.content });

  if (updatedConversation.length > HISTORY_LENGTH) {
    const messageToRemove = updatedConversation.length - HISTORY_LENGTH;

    updatedConversation = [
      ...updatedConversation.slice(0, 2),
      ...updatedConversation.slice(2 + messageToRemove),
    ];
  }

  await api.put(`/conversation`, {
    id: conversationId,
    messages: updatedConversation,
  });

  return updatedConversation;
};

export const deleteConversation = async () => {
  const conversationId = getConversationId();

  await api.delete(`/conversation`, {
    data: { id: conversationId },
  });

  localStorage.removeItem("conversationId");
};
