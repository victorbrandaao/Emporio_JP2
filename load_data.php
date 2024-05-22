<?php
// Lê o conteúdo do arquivo data.json
$json_data = file_get_contents('data.json');

// Retorna os dados como JSON
header('Content-Type: application/json');
echo $json_data;
?>
