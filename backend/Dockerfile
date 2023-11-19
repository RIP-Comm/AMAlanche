# syntax=docker/dockerfile:1

FROM golang:1.21.4

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY *.go ./

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /amalanche-backend

EXPOSE 8080

# Run
CMD ["/amalanche-backend"]