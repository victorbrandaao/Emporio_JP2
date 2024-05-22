<?php
// Verifica se o método da requisição é POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Recebe os dados JSON do corpo da requisição
    $data = json_decode(file_get_contents('php://input'), true);

    if ($data) {
        // Converte os dados de volta para JSON e salva no arquivo data.json
        $json_data = json_encode($data, JSON_PRETTY_PRINT);
        file_put_contents('data.json', $json_data);

        // Retorna uma resposta de sucesso
        http_response_code(200);
        echo 'Dados salvos com sucesso.';
    } else {
        // Retorna um erro se os dados não puderem ser decodificados
        http_response_code(400);
        echo 'Erro: Dados inválidos recebidos.';
    }
} else {
    // Retorna um erro se o método da requisição não for POST
    http_response_code(405);
    echo 'Erro: Método não permitido. Apenas POST é permitido neste endpoint.';
}
?>
