package service

import (
	"context"

	"github.com/xzzpig/headscale-manager/graph/model"
)

type MachineService struct {
	CommonService[model.Machine]
	SaveService[*model.MachineInput]
}

func NewMachineService(ctx context.Context) *MachineService {
	return &MachineService{
		*NewCommonService[model.Machine](ctx, "machine"),
		*NewSaveService[*model.MachineInput](ctx, "machine")}
}
