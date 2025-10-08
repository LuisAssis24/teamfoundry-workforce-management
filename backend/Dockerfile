FROM gradle:8.7-jdk21 AS build
WORKDIR /home/gradle/app

# Copy only the Gradle wrapper and build files first for dependency caching
COPY gradlew gradlew
COPY gradle gradle
COPY build.gradle settings.gradle ./
RUN chmod +x gradlew

# Download dependencies (optional but speeds up subsequent builds)
RUN ./gradlew --no-daemon dependencies

# Copy the rest of the project and build the application
COPY . .
RUN ./gradlew --no-daemon clean bootJar

FROM eclipse-temurin:21-jre AS runtime
WORKDIR /app

# Copy the Spring Boot fat jar for execution
COPY --from=build /home/gradle/app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
