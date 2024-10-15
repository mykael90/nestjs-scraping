#!/bin/bash

echo "Entrou no start.sh"

# Verifica se a variável ENV está definida
if [ -z "$ENV" ]; then
  echo "A variável ENV não está definida."
  exit 1
fi

# Condicionais baseadas no valor de ENV
if [ "$ENV" == "dev" ]; then
  echo "Ambiente de desenvolvimento detectado. Rodando script de desenvolvimento..."
  /home/node/nestjs-scraping/.docker/start-dev.sh  # Substitua pelo script para o ambiente de dev
elif [ "$ENV" == "prod" ]; then
  echo "Ambiente de produção detectado. Rodando script de produção..."
  /home/node/nestjs-scraping/.docker/start-prod.sh  # Substitua pelo script para o ambiente de prod
else
  echo "Valor de ENV desconhecido: $ENV"
  exit 1
fi
