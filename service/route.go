package service

import (
	"context"

	"github.com/xzzpig/headscale-manager/db"
	"github.com/xzzpig/headscale-manager/graph/model"
)

type RouteService struct {
	CommonService[model.Route]
	SaveService[*model.RouteInput]
}

func NewRouteService(ctx context.Context) *RouteService {
	return &RouteService{
		*NewCommonService[model.Route](ctx, "route"),
		*NewSaveService[*model.RouteInput](ctx, "route"),
	}
}

func (svc *RouteService) ProjectRoutes(projectId *string) ([]*model.Route, error) {
	return db.Get().ProjectRoutes(*projectId)
}
