package graph

import (
	"context"
	"errors"

	"github.com/99designs/gqlgen/graphql"
	"github.com/xzzpig/headscale-manager/graph/model"
)

//go:generate go run github.com/99designs/gqlgen generate

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct{}

type NeedAdmind interface {
	CheckIsAdmin(ctx context.Context) (bool, error)
}

var ErrNotAdmin = errors.New("you are not admin")

func NewConfig() *Config {
	c := Config{
		Resolvers: &Resolver{},
		Directives: DirectiveRoot{
			NeedAdmin: func(ctx context.Context, obj interface{}, next graphql.Resolver, quiet bool) (res interface{}, err error) {
				isAdmin, err := model.CheckIsAdmin(ctx)
				if err != nil {
					return nil, err
				}
				if !isAdmin {
					if quiet {
						return nil, nil
					} else {
						return nil, ErrNotAdmin
					}
				}
				return next(ctx)
			},
		},
	}

	return &c
}

func NewSchema() graphql.ExecutableSchema {
	return NewExecutableSchema(*NewConfig())
}
