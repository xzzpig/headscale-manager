package headscale

import (
	"context"
	"crypto/tls"
	"time"

	headscale "github.com/juanfont/headscale/gen/go/headscale/v1"
	"github.com/xzzpig/headscale-manager/config"
	"go.uber.org/zap"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"
)

type HeadscaleClient struct {
	Client  headscale.HeadscaleServiceClient
	conn    *grpc.ClientConn
	cancel  context.CancelFunc
	timeout int64
}

var Client *HeadscaleClient
var logger *zap.Logger

func (c *HeadscaleClient) Close() {
	c.cancel()
	c.conn.Close()
}

func (c *HeadscaleClient) NewContext() (context.Context, context.CancelFunc) {
	return context.WithTimeout(context.Background(), time.Duration(c.timeout)*time.Second)
}

func SetupHeadscaleClient() {
	if Client != nil {
		return
	}

	logger = zap.L().Named("grpc").Named("headscale")

	_client, _conn, _cancel, err := NewHeadscaleServiceClient()
	if err != nil {
		logger.Panic("Failed to create headscale client", zap.Error(err))
	}
	timeout := config.GetConfig().Headscale.Timeout
	Client = &HeadscaleClient{
		Client:  _client,
		conn:    _conn,
		cancel:  _cancel,
		timeout: timeout,
	}
}

func NewHeadscaleServiceClient() (headscale.HeadscaleServiceClient, *grpc.ClientConn, context.CancelFunc, error) {
	timeout := config.GetConfig().Headscale.Timeout

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(timeout)*time.Second)

	grpcOptions := []grpc.DialOption{
		grpc.WithBlock(),
	}

	apiKey := config.GetConfig().Headscale.Key
	grpcOptions = append(grpcOptions,
		grpc.WithPerRPCCredentials(tokenAuth{
			token: apiKey,
		}),
	)

	tlsConfig := &tls.Config{
		InsecureSkipVerify: true,
	}

	grpcOptions = append(grpcOptions,
		grpc.WithTransportCredentials(credentials.NewTLS(tlsConfig)),
	)

	conn, err := grpc.DialContext(ctx, config.GetConfig().Headscale.Url, grpcOptions...)
	if err != nil {
		return nil, nil, cancel, err
	}

	return headscale.NewHeadscaleServiceClient(conn), conn, cancel, nil
}

type tokenAuth struct {
	token string
}

// Return value is mapped to request headers.
func (t tokenAuth) GetRequestMetadata(
	ctx context.Context,
	in ...string,
) (map[string]string, error) {
	return map[string]string{
		"authorization": "Bearer " + t.token,
	}, nil
}

func (tokenAuth) RequireTransportSecurity() bool {
	return true
}
