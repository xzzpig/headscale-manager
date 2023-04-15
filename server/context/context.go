package server

import (
	"context"
	"fmt"
)

type ctxKey string

const (
	GIN_CONTEXT_KEY ctxKey = "GinContextKey"
	LOADERS_KEY     ctxKey = "DataLoaders"
)

func GetPtrFromContext[T any](ctx context.Context, key ctxKey) (*T, error) {
	value := ctx.Value(key)
	if value == nil {
		err := fmt.Errorf("could not retrieve Context")
		return nil, err
	}

	gc, ok := value.(*T)
	if !ok {
		err := fmt.Errorf("context has wrong type")
		return nil, err
	}
	return gc, nil
}
