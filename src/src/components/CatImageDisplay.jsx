import React, { useState, useEffect } from 'react';

// URL da API para buscar imagens aleatórias de gatos
const API_URL = 'https://api.thecatapi.com/v1/images/search';

function CatImageDisplay() {
  // Estado para armazenar os dados da imagem (URL, width, height)
  const [catImage, setCatImage] = useState(null);
  // Estado para controlar se a requisição está em andamento
  const [isLoading, setIsLoading] = useState(false);
  // Estado para armazenar mensagens de erro
  const [error, setError] = useState(null);

  // Função assíncrona para buscar a imagem do gato
  const fetchCatImage = async () => {
    setIsLoading(true); // Inicia o estado de carregamento
    setError(null);      // Limpa erros anteriores
    setCatImage(null);   // Limpa a imagem anterior

    try {
      // 1. Faz a requisição HTTP
      const response = await fetch(API_URL);

      // Trata erros de status HTTP (404, 500, etc.)
      if (!response.ok) {
        throw new Error(`Erro ao buscar imagem. Status: ${response.status}`);
      }

      // 2. Converte a resposta para JSON
      const data = await response.json();

      // A API retorna um array, pegamos o primeiro item
      if (data && data.length > 0) {
        setCatImage(data[0]);
      } else {
        throw new Error('A busca não retornou nenhuma imagem.');
      }

    } catch (err) {
      // 3. Captura e armazena erros de rede ou de processamento
      console.error('Erro na requisição:', err);
      setError('Ops! Não foi possível carregar o gato. Verifique sua conexão.');
    } finally {
      // Finaliza o estado de carregamento, independentemente do sucesso ou falha
      setIsLoading(false);
    }
  };

  // Efeito para carregar a primeira imagem quando o componente é montado
  useEffect(() => {
    fetchCatImage();
  }, []); // Array de dependências vazio: executa apenas na montagem

  return (
    <div className="cat-display-container">
      <h1>🐈 Imagens Aleatórias de Gatos</h1>

      {/* Exibe o estado de carregamento */}
      {isLoading && <p className="loading-message">Carregando novo gatinho... 🐾</p>}

      {/* Exibe mensagem de erro se houver */}
      {error && <p className="error-message">🚨 {error}</p>}

      {/* Renderiza a imagem se ela estiver carregada e não houver erro */}
      {catImage && !isLoading && (
        <div className="cat-image-box">
          <img
            src={catImage.url}
            alt="Um gato aleatório da The Cat API"
            // Define o tamanho máximo para que a imagem não seja gigante
            style={{ maxWidth: '100%', height: 'auto' }}
            className="cat-image"
          />
          <p className="image-info">
            Dimensões: {catImage.width}x{catImage.height}px
          </p>
        </div>
      )}

      {/* Botão para buscar a próxima imagem */}
      <button 
        onClick={fetchCatImage} 
        disabled={isLoading} // Desabilita o botão enquanto carrega
        className="next-image-button"
      >
        {isLoading ? 'Buscando...' : 'Próxima Imagem'}
      </button>
    </div>
  );
}

export default CatImageDisplay;