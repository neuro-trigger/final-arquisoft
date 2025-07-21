package server

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	pb "github.com/software-architecture-proj/nova-backend-common-protos/gen/go/user_product_service"
	"github.com/software-architecture-proj/nova-backend-user-product-service/internal/models"
	"github.com/software-architecture-proj/nova-backend-user-product-service/internal/repos"
)

type UserProductService struct {
	pb.UnimplementedUserProductServiceServer
	UserRepo     repos.UserRepository
	FavoriteRepo repos.FavoriteRepository
	PocketRepo   repos.PocketRepository
}

// Country Codes
func (s *UserProductService) GetCountryCodes(ctx context.Context, req *pb.GetCountryCodesRequest) (*pb.GetCountryCodesResponse, error) {
	codes, err := s.UserRepo.ListCountryCodes()
	if err != nil {
		return nil, err
	}
	var response []*pb.CountryCode
	for _, c := range codes {
		response = append(response, &pb.CountryCode{
			Id:   c.ID.String(),
			Name: c.Name,
			Code: fmt.Sprintf("%d", c.Code)})
	}
	return &pb.GetCountryCodesResponse{
		Success: true,
		Message: "Country codes retrieved successfully",
		Codes:   response}, nil
}

// User Management
func (s *UserProductService) CreateUser(ctx context.Context, req *pb.CreateUserRequest) (*pb.CreateUserResponse, error) {
	codeID, err := uuid.Parse(req.GetCodeId())
	if err != nil {
		return nil, fmt.Errorf("invalid code ID: %w", err)
	}
	user := &models.User{
		ID:        uuid.MustParse(req.GetUserId()),
		Email:     req.GetEmail(),
		Username:  req.GetUsername(),
		Phone:     stringToInt64(req.GetPhone()),
		CodeID:    codeID,
		FirstName: req.GetFirstName(),
		LastName:  req.GetLastName(),
		Birthdate: parseDate(req.GetBirthdate()),
	}
	if err := s.UserRepo.CreateUser(user); err != nil {
		return nil, err
	}
	return &pb.CreateUserResponse{
		Success: true,
		Message: "User created successfully",
		UserId:  req.GetUserId(),
	}, nil
}

func (s *UserProductService) GetUserById(ctx context.Context, req *pb.GetUserByIdRequest) (*pb.GetUserByIdResponse, error) {
	id, err := uuid.Parse(req.GetUserId())
	if err != nil {
		return nil, err
	}
	user, err := s.UserRepo.GetUserById(id)
	if err != nil {
		return nil, err
	}
	return &pb.GetUserByIdResponse{
		Success:   true,
		Message:   "User retrieved successfully",
		Email:     user.Email,
		Username:  user.Username,
		Phone:     fmt.Sprintf("%d", user.Phone),
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Birthdate: user.Birthdate.Format("2006-01-02"),
	}, nil
}

func (s *UserProductService) GetUserByUsername(ctx context.Context, req *pb.GetUserByUsernameRequest) (*pb.GetUserByUsernameResponse, error) {
	uname := req.GetUsername()
	user, err := s.UserRepo.GetUserByUsername(uname)
	if err != nil {
		return nil, err
	}
	return &pb.GetUserByUsernameResponse{
		Success: true,
		Message: "User retrieved successfully",
		Email:   user.Email,
		UserId:  user.ID.String(),
	}, nil
}

func (s *UserProductService) UpdateUserById(ctx context.Context, req *pb.UpdateUserByIdRequest) (*pb.UpdateUserByIdResponse, error) {
	id, err := uuid.Parse(req.GetId())
	if err != nil {
		return nil, err
	}
	user := &models.User{
		ID:        id,
		Email:     req.GetEmail(),
		Username:  req.GetUsername(),
		Phone:     stringToInt64(req.GetPhone()),
		FirstName: req.GetFirstName(),
		LastName:  req.GetLastName(),
		Birthdate: parseDate(req.GetBirthdate()),
	}
	if err := s.UserRepo.UpdateUser(user); err != nil {
		return nil, err
	}
	return &pb.UpdateUserByIdResponse{
		Success:   true,
		Message:   "User updated",
		Email:     user.Email,
		Username:  user.Username,
		Phone:     fmt.Sprintf("%d", user.Phone),
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Birthdate: user.Birthdate.Format("2006-01-02"),
	}, nil
}

func (s *UserProductService) DeleteUserById(ctx context.Context, req *pb.DeleteUserByIdRequest) (*pb.DeleteUserByIdResponse, error) {
	id, err := uuid.Parse(req.GetId())
	if err != nil {
		return nil, err
	}
	if err := s.UserRepo.DeleteUserById(id); err != nil {
		return nil, err
	}
	return &pb.DeleteUserByIdResponse{
		Success: true,
		Message: "User deleted",
	}, nil
}

// Favorites
func (s *UserProductService) CreateFavorite(ctx context.Context, req *pb.CreateFavoriteRequest) (*pb.CreateFavoriteResponse, error) {
	favoriteID := uuid.New()

	userID, err := uuid.Parse(req.GetUserId())
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %w", err)
	}

	favoriteUserID, err := uuid.Parse(req.GetFavoriteUserId())
	if err != nil {
		return nil, fmt.Errorf("invalid favorite user ID: %w", err)
	}

	favorite := &models.Favorite{
		ID:             favoriteID,
		UserID:         userID,
		FavoriteUserID: favoriteUserID,
		Alias:          req.GetAlias(),
	}
	if err := s.FavoriteRepo.CreateFavorite(favorite); err != nil {
		return nil, err
	}
	return &pb.CreateFavoriteResponse{
		Success:    true,
		Message:    "Favorite created successfully",
		FavoriteId: favoriteID.String(),
	}, nil
}

func (s *UserProductService) GetFavoritesByUserId(ctx context.Context, req *pb.GetFavoritesByUserIdRequest) (*pb.GetFavoritesByUserIdResponse, error) {
	userID, err := uuid.Parse(req.GetUserId())
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %w", err)
	}

	favs, err := s.FavoriteRepo.GetFavoritesByUserID(userID)
	if err != nil {
		return nil, err
	}
	var response []*pb.Favorite
	for _, f := range favs {
		response = append(response, &pb.Favorite{
			Id:               f.ID.String(),
			UserId:           f.UserID.String(),
			FavoriteUserId:   f.FavoriteUserID.String(),
			FavoriteUsername: f.FavoriteUser.Username,
			Alias:            f.Alias})
	}
	return &pb.GetFavoritesByUserIdResponse{
		Success:   true,
		Message:   "Favorites retrieved successfully",
		Favorites: response}, nil
}

func (s *UserProductService) UpdateFavoriteById(ctx context.Context, req *pb.UpdateFavoriteByIdRequest) (*pb.UpdateFavoriteByIdResponse, error) {
	id, err := uuid.Parse(req.GetId())
	if err != nil {
		return nil, err
	}

	fav := &models.Favorite{ID: id, Alias: req.GetAlias()}
	if err := s.FavoriteRepo.UpdateFavorite(fav); err != nil {
		return nil, err
	}
	return &pb.UpdateFavoriteByIdResponse{Success: true, Message: "Favorite updated", NewAlias: fav.Alias}, nil
}

func (s *UserProductService) DeleteFavoriteById(ctx context.Context, req *pb.DeleteFavoriteByIdRequest) (*pb.DeleteFavoriteByIdResponse, error) {
	id, err := uuid.Parse(req.GetId())
	if err != nil {
		return nil, err
	}

	if err := s.FavoriteRepo.DeleteFavoriteByID(id); err != nil {
		return nil, err
	}
	return &pb.DeleteFavoriteByIdResponse{Success: true, Message: "Favorite deleted"}, nil
}

// Pockets
func (s *UserProductService) CreatePocket(ctx context.Context, req *pb.CreatePocketRequest) (*pb.CreatePocketResponse, error) {
	pocketID := uuid.New()

	userID, err := uuid.Parse(req.GetUserId())
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %w", err)
	}

	pocket := &models.Pocket{
		ID:       pocketID,
		UserID:   userID,
		Name:     req.GetName(),
		Category: models.PocketCategory(req.GetCategory()),
		Amount:   int64(req.GetMaxAmount()),
	}
	if err := s.PocketRepo.CreatePocket(pocket); err != nil {
		return nil, err
	}
	return &pb.CreatePocketResponse{
		Success:  true,
		Message:  "Pocket created",
		PocketId: pocketID.String(),
	}, nil
}

func (s *UserProductService) GetPocketsByUserId(ctx context.Context, req *pb.GetPocketsByUserIdRequest) (*pb.GetPocketsByUserIdResponse, error) {
	userID, err := uuid.Parse(req.GetUserId())
	if err != nil {
		return nil, fmt.Errorf("invalid user ID: %w", err)
	}

	pockets, err := s.PocketRepo.GetPocketsByUserID(userID)
	if err != nil {
		return nil, err
	}
	var res []*pb.Pocket
	for _, p := range pockets {
		res = append(res, &pb.Pocket{
			Id:        p.ID.String(),
			UserId:    p.UserID.String(),
			Name:      p.Name,
			Category:  string(p.Category),
			MaxAmount: int32(p.Amount),
		})
	}
	return &pb.GetPocketsByUserIdResponse{
		Success: true,
		Message: "Pockets retrieved",
		Pockets: res,
	}, nil
}

func (s *UserProductService) UpdatePocketById(ctx context.Context, req *pb.UpdatePocketByIdRequest) (*pb.UpdatePocketByIdResponse, error) {
	id, err := uuid.Parse(req.GetId())
	if err != nil {
		return nil, err
	}

	p := &models.Pocket{
		ID:       id,
		Name:     req.GetName(),
		Category: models.PocketCategory(req.GetCategory()),
		Amount:   int64(req.GetMaxAmount()),
	}
	if err := s.PocketRepo.UpdatePocket(p); err != nil {
		return nil, err
	}
	return &pb.UpdatePocketByIdResponse{
		Success:   true,
		Message:   "Pocket updated",
		Name:      p.Name,
		Category:  string(p.Category),
		MaxAmount: int32(p.Amount)}, nil
}

func (s *UserProductService) DeletePocketById(ctx context.Context, req *pb.DeletePocketByIdRequest) (*pb.DeletePocketByIdResponse, error) {
	id, err := uuid.Parse(req.GetId())
	if err != nil {
		return nil, err
	}

	if err := s.PocketRepo.DeletePocketByID(id); err != nil {
		return nil, err
	}
	return &pb.DeletePocketByIdResponse{Success: true, Message: "Pocket deleted"}, nil
}

// Helper functions
func stringToInt64(s string) int64 {
	var i int64
	fmt.Sscanf(s, "%d", &i)
	return i
}

func parseDate(d string) time.Time {
	t, _ := time.Parse("2006-01-02", d)
	return t
}
