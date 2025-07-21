package main

import (
	"log"
	"net"

    "google.golang.org/grpc"
    "google.golang.org/grpc/reflection"

	"github.com/software-architecture-proj/nova-backend-user-product-service/config"
	"github.com/software-architecture-proj/nova-backend-user-product-service/internal/repos"
	"github.com/software-architecture-proj/nova-backend-user-product-service/internal/server"	
    pb "github.com/software-architecture-proj/nova-backend-common-protos/gen/go/user_product_service"
)

func main() {
	log.Println("🔧 Starting user product service...")

	if err := config.InitDB(); err != nil {
		log.Fatalf("DB initialization failed: %v", err)
	}
	log.Println("DB initialized successfully")

	db := config.DB
	if db == nil {
		log.Fatalf("DB instance is nil")
	}

	// Initialize repositories
	userRepo := repos.NewUserRepository(db)
	favoriteRepo := repos.NewFavoriteRepository(db)
	pocketRepo := repos.NewPocketRepository(db)

	// Create gRPC server instance
	service := &server.UserProductService{
		UserRepo:     userRepo,
		FavoriteRepo: favoriteRepo,
		PocketRepo:   pocketRepo,
	}
    
    // Listen TCP
	lis, err := net.Listen("tcp", ":50052")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	// Initialize gRPC server
	grpcServer := grpc.NewServer()
	pb.RegisterUserProductServiceServer(grpcServer, service)
    
    // Enable reflection
    reflection.Register(grpcServer)

	log.Println("gRPC server listening on :50052")
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
