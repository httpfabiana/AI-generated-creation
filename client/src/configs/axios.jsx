import axios from 'axios';

export const testarGeracaoArtigo = async () => {
  try {
    // 1. Gera o token oficial de sessão (pode ser o normal ou o do template)
    // O Clerk do Front-end gerencia isso perfeitamente
    const token = await window.Clerk.session.getToken();

    // 2. Faz a chamada usando o Axios enviando o cabeçalho Bearer
    const response = await axios.post(
      'http://localhost:3000/api/ai/generate-article',
      {
        prompt: 'Escreva um artigo curto sobre tecnologia',
        length: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Passa o token aqui
        },
      }
    );

    console.log('🎉 SUCESSO NO FRONTEND:', response.data);
    alert('Artigo gerado com sucesso! Olhe o console.');

  } catch (error) {
    console.error('❌ ERRO NO FRONTEND:', error.response?.data || error.message);
    alert('Erro ao gerar artigo: ' + (error.response?.data?.message || error.message));
  }
};
