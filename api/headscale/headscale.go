package headscale

import (
	v1 "github.com/juanfont/headscale/gen/go/headscale/v1"
	"go.uber.org/zap"
)

func (c *HeadscaleClient) ListMachines() (*v1.ListMachinesResponse, error) {
	ctx, cancel := c.NewContext()
	defer cancel()
	logger.Debug("ListMachines")
	return c.Client.ListMachines(ctx, &v1.ListMachinesRequest{})
}

func (c *HeadscaleClient) ListMachineRoutes(machineId uint64) (*v1.GetMachineRoutesResponse, error) {
	ctx, cancel := c.NewContext()
	defer cancel()
	logger.Debug("ListMachineRoutes", zap.Uint64("machineId", machineId))
	return c.Client.GetMachineRoutes(ctx, &v1.GetMachineRoutesRequest{
		MachineId: machineId,
	})
}

func (c *HeadscaleClient) EnableRoute(routeId uint64, enable bool) error {
	ctx, cancel := c.NewContext()
	defer cancel()
	logger.Debug("EnableRoute", zap.Uint64("routeId", routeId), zap.Bool("enable", enable))
	if enable {
		_, err := c.Client.EnableRoute(ctx, &v1.EnableRouteRequest{
			RouteId: routeId,
		})
		return err
	} else {
		_, err := c.Client.DisableRoute(ctx, &v1.DisableRouteRequest{
			RouteId: routeId,
		})
		return err
	}
}
