package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/software-architecture-proj/nova-backend-api-gateway/internal/clients"
	"github.com/software-architecture-proj/nova-backend-api-gateway/internal/common"
	"github.com/software-architecture-proj/nova-backend-api-gateway/internal/transformers"

	// Import from common-protos
	pb "github.com/software-architecture-proj/nova-backend-common-protos/gen/go/auth_service"
)

type AuthHandler struct {
	AuthClient *clients.AuthServiceClient
}

func NewAuthHandler(AuthClient *clients.AuthServiceClient) *AuthHandler {
	return &AuthHandler{AuthClient: AuthClient}
}

// Login
func (h *AuthHandler) PostLogin(w http.ResponseWriter, r *http.Request) {
	var reqBody struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := json.NewDecoder(r.Body).Decode(&reqBody); err != nil {
		common.RespondWithError(w, http.StatusBadRequest, "Invalid request payload")
		return
	}

	if reqBody.Email == "" {
		common.RespondWithError(w, http.StatusBadRequest, "Missing email")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)

	grpcResp, err := h.AuthClient.Client.LoginUser(ctx, &pb.LoginRequest{Email: reqBody.Email, Password: reqBody.Password})
	if err != nil {
		defer cancel()
		common.RespondGrpcError(w, err)
		return
	}

	httpResp := transformers.LoginRespJSON(grpcResp)

	token := httpResp["data"].(string)

	// Enable Secure cookies only in production (ENV=prod)
	prod := os.Getenv("ENV") == "prod"
	sameSite := http.SameSiteNoneMode
	if !prod {
		sameSite = http.SameSiteLaxMode
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "accessToken",
		Value:    token,
		HttpOnly: true,
		Secure:   prod,
		Path:     "/",
		SameSite: sameSite,
		MaxAge:   900, // 15 minutes
	})

	common.RespondWithJSON(w, http.StatusOK, httpResp)
	defer cancel()
}

// Logout
func (h *AuthHandler) PostLogout(w http.ResponseWriter, r *http.Request) {
	httpResp := transformers.LogOutRespJSON()

	prod := os.Getenv("ENV") == "prod"
	sameSite := http.SameSiteNoneMode
	if !prod {
		sameSite = http.SameSiteLaxMode
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "accessToken",
		Value:    "",
		HttpOnly: true,
		Secure:   prod,
		Path:     "/",
		SameSite: sameSite,
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
	})

	common.RespondWithJSON(w, http.StatusOK, httpResp)
}
