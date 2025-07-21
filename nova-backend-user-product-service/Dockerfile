FROM golang:1.24 AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 go build -o user_product_service ./main.go

FROM alpine:latest
RUN apk add --no-cache postgresql-client
WORKDIR /root/
COPY --from=builder /app/user_product_service .
CMD ["./user_product_service"]
EXPOSE 50052