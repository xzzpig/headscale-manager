package service

import (
	"context"

	"github.com/xzzpig/headscale-manager/api/headscale"
	"github.com/xzzpig/headscale-manager/graph/model"
	"github.com/xzzpig/headscale-manager/util"
)

type ProjectService struct {
	CommonService[model.Project]
	SaveService[*model.ProjectInput]
}

func NewProjectService(ctx context.Context) *ProjectService {
	return &ProjectService{
		*NewCommonService[model.Project](ctx, "project"),
		*NewSaveService[*model.ProjectInput](ctx, "project"),
	}
}

func (svc *ProjectService) SyncProjectRoute(projectID *string) ([]*model.SyncResult, error) {
	var projects []*model.Project
	if projectID == nil {
		p, err := svc.All()
		if err != nil {
			return nil, err
		}
		projects = p
	} else {
		project, err := svc.ByIDWithLoader(projectID)
		if err != nil {
			return nil, err
		}
		projects = []*model.Project{project}
	}

	machineSvc := NewMachineService(svc.ctx)
	routeSvc := NewRouteService(svc.ctx)

	projectMap := make(map[string]*model.Project)
	machineMap := make(map[string]*model.Machine)
	machineNameMap := make(map[string]*model.Machine)
	routeNameMap := make(map[string]*model.Route)

	for _, project := range projects {
		projectMap[*project.ID] = project

		for _, machineID := range project.MachineIDs {
			if machineID == nil {
				continue
			}
			if _, ok := machineMap[*machineID]; !ok {
				machine, err := machineSvc.ByIDWithLoader(machineID)
				if err != nil {
					return nil, err
				}
				machineMap[*machineID] = machine
				machineNameMap[*machine.Name] = machine
			}
		}

		routes, err := routeSvc.ProjectRoutes(project.ID)
		if err != nil {
			return nil, err
		}
		project.Routes = routes
		for _, route := range routes {
			routeNameMap[*route.Name] = route
		}
	}
	result := make([]*model.SyncResult, 0)
	machineResult, err := headscale.Client.ListMachines()
	if err != nil {
		return nil, err
	}
	for _, hMachine := range machineResult.Machines {
		machine, ok := machineNameMap[hMachine.Name]
		if !ok {
			continue
		}
		hRoutes, err := headscale.Client.ListMachineRoutes(hMachine.Id)
		if err != nil {
			return nil, err
		}
		for _, hRoute := range hRoutes.Routes {
			route, ok := routeNameMap[hRoute.Prefix]
			if !ok {
				continue
			}
			project, ok := projectMap[*route.ProjectID]
			var enable bool
			if !ok {
				enable = false
			} else {
				currentMachineID := project.MachineID
				enable = util.UnPtrString(currentMachineID) == util.UnPtrString(machine.ID)
			}

			if hRoute.Enabled != enable {
				err := headscale.Client.EnableRoute(hRoute.Id, enable)
				if err != nil {
					return nil, err
				}
				result = append(result, &model.SyncResult{
					ProjectID:   *project.ID,
					MachineID:   *machine.ID,
					RouteID:     *route.ID,
					RouteEnable: enable,
				})
			}
		}
	}

	return result, nil
}
