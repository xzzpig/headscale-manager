package service

import (
	"context"
	"errors"

	"github.com/graph-gophers/dataloader"
	"github.com/xzzpig/headscale-manager/db"
	"github.com/xzzpig/headscale-manager/graph/model"
	mycontext "github.com/xzzpig/headscale-manager/server/context"
	"github.com/xzzpig/headscale-manager/service/loader"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type serviceable interface {
	model.HasID
}

type CommonService[T serviceable] struct {
	ctx       context.Context
	tableName string
}

type SaveService[T db.Saveable] struct {
	tableName string
}

func NewCommonService[T serviceable](ctx context.Context, tableName string) *CommonService[T] {
	return &CommonService[T]{ctx: ctx, tableName: tableName}
}

func NewSaveService[T db.Saveable](ctx context.Context, tableName string) *SaveService[T] {
	return &SaveService[T]{tableName: tableName}
}

func (s *CommonService[T]) All() ([]*T, error) {
	return db.Find[T](db.Get(), s.tableName, bson.M{})
}

func (s *CommonService[T]) ByID(id *string) (*T, error) {
	if id == nil {
		return nil, nil
	}
	objId, _ := primitive.ObjectIDFromHex(*id)
	return db.FindOne[T](db.Get(), s.tableName, bson.M{"_id": objId})
}

func (s *CommonService[T]) ByIDs(ids []*string) ([]*T, error) {
	if ids == nil {
		return nil, nil
	}
	objIds := make([]primitive.ObjectID, len(ids))
	for i, v := range ids {
		objIds[i], _ = primitive.ObjectIDFromHex(*v)
	}
	return db.Find[T](db.Get(), s.tableName, bson.M{"_id": bson.M{"$in": objIds}})
}

func (s *SaveService[T]) Save(t T) (string, error) {
	res, err := db.Save(db.Get(), s.tableName, t)
	if err != nil {
		return "", err
	}
	if res.UpsertedID == nil {
		return *t.GetID(), err
	}
	return res.UpsertedID.(primitive.ObjectID).Hex(), err
}

func (s *SaveService[T]) Delete(id string) (int64, error) {
	res, err := db.Delete(db.Get(), s.tableName, id)
	if err != nil {
		return 0, err
	}
	return res.DeletedCount, err
}

func (s *CommonService[T]) ByIDWithLoader(id *string) (*T, error) {
	if id == nil {
		return nil, nil
	}
	loaders, err := mycontext.GetPtrFromContext[loader.Loaders](s.ctx, mycontext.LOADERS_KEY)
	if err != nil {
		return nil, err
	}
	thunk := loader.GetLoader[T](loaders, s.tableName).Load(s.ctx, dataloader.StringKey(*id))
	result, err := thunk()
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return result.(*T), nil
}

func (s *CommonService[T]) ByIDsWithLoader(ids []*string) ([]*T, error) {
	objs := make([]*T, len(ids))
	for i, id := range ids {
		obj, err := s.ByIDWithLoader(id)
		if err != nil {
			return nil, err
		}
		objs[i] = obj
	}
	return objs, nil
}
