import api from './api';

export const chat = async (question) => {
    const response = await api.post('/chat', { question });
    return response.data;
};

export const generateQuiz = async (payload) => {
    const response = await api.post('/quiz/generate', payload);
    return response.data;
};

export const submitQuiz = async (payload) => {
    const response = await api.post('/quiz/submit', payload);
    return response.data;
};

export const generateVivaQuestions = async (payload) => {
    const response = await api.post('/viva/questions', payload);
    return response.data;
};

export const evaluateVivaAnswer = async (payload) => {
    const response = await api.post('/viva/evaluate', payload);
    return response.data;
};

export const compareConcepts = async (payload) => {
    const response = await api.post('/study-tools/compare', payload);
    return response.data;
};

export const generateDiagram = async (payload) => {
    const response = await api.post('/study-tools/diagram', payload);
    return response.data;
};
