# --- Estágio 1: Build ---
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# 1. Copia o pom e baixa dependências (Cache inteligente)
COPY pom.xml .
RUN mvn dependency:go-offline

# 2. Copia o código e faz o build
COPY src ./src
RUN mvn clean package -DskipTests

# --- Estágio 2: Execução ---
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# 3. Copia o JAR gerado (usando * para aceitar qualquer versão)
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# 4. O SEGREDO ESTÁ AQUI EMBAIXO:
# Adicionamos "-Dspring.profiles.active=prod" para obrigar o uso do seu arquivo
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
