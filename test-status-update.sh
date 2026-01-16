#!/bin/bash

# Script para testar atualização de status de reclamação

echo "=== Teste de Atualização de Status de Reclamação ==="
echo ""

# 1. Login como SINDICO
echo "1. Fazendo login como SINDICO..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sindico@sindicoonline.com",
    "password": "test123"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Erro ao fazer login. Tentando com admin..."
  LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "admin@sindicoonline.com",
      "password": "test123"
    }')
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
  echo "❌ Erro ao obter token de autenticação"
  echo "Resposta: $LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login realizado com sucesso"
echo "Token: ${TOKEN:0:20}..."
echo ""

# 2. Listar reclamações para pegar um ID
echo "2. Listando reclamações..."
COMPLAINTS=$(curl -s -X GET http://localhost:3000/complaints \
  -H "Authorization: Bearer $TOKEN")

echo "Reclamações encontradas:"
echo "$COMPLAINTS" | jq -r '.complaints[0:2] | .[] | "ID: \(.id) | Status: \(.status)"' 2>/dev/null || echo "$COMPLAINTS"
echo ""

# Pegar o primeiro ID de reclamação
COMPLAINT_ID=$(echo "$COMPLAINTS" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$COMPLAINT_ID" ]; then
  echo "❌ Nenhuma reclamação encontrada"
  exit 1
fi

echo "✅ Usando reclamação ID: $COMPLAINT_ID"
echo ""

# 3. Tentar atualizar o status
echo "3. Tentando atualizar status para EM_ANALISE..."
echo "Payload enviado:"
echo '{
  "newStatus": "EM_ANALISE",
  "reason": "Teste de atualização via script"
}'
echo ""

UPDATE_RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X PATCH \
  "http://localhost:3000/complaints/$COMPLAINT_ID/status" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "newStatus": "EM_ANALISE",
    "reason": "Teste de atualização via script"
  }')

HTTP_STATUS=$(echo "$UPDATE_RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
RESPONSE_BODY=$(echo "$UPDATE_RESPONSE" | sed '/HTTP_STATUS/d')

echo "Status HTTP: $HTTP_STATUS"
echo "Resposta:"
echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
echo ""

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "201" ]; then
  echo "✅ Atualização realizada com sucesso!"
else
  echo "❌ Erro ao atualizar status (HTTP $HTTP_STATUS)"
  echo ""
  echo "Detalhes do erro:"
  echo "$RESPONSE_BODY" | jq '.' 2>/dev/null || echo "$RESPONSE_BODY"
fi
