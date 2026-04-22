FROM maven:3.9.9-eclipse-temurin-21-alpine AS backend-builder
WORKDIR /workspace/backend
COPY backend/pom.xml pom.xml
COPY backend/src src
RUN mvn -B -DskipTests package

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend-builder /workspace/backend/target/backend-0.1.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
