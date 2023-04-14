const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Configuração da Skill da Alexa
app.post('/alexa', async (req, res) => {
  try {
    const userInput = req.body.request.intent.slots.UserInput.value;
    // Captura a entrada do usuário da Skill da Alexa

    // Chama a API do ChatGPT com a entrada do usuário
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      prompt: `Usuário: ${userInput}\nAssistente: `,
      max_tokens: 100
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer <SUA_CHAVE_DE_API_DO_CHATGPT>`
      }
    });

    const assistantResponse = response.data.choices[0].text.trim();
    // Extrai a resposta gerada pelo ChatGPT

    // Cria a resposta da Skill da Alexa com a resposta do ChatGPT
    const alexaResponse = {
      version: '1.0',
      response: {
        outputSpeech: {
          type: 'PlainText',
          text: `Assistente: ${assistantResponse}`
        }
      }
    };

    res.json(alexaResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao processar a requisição' });
  }
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
