package loader

import (
	"context"
	"errors"
	"fmt"
	"sync"

	"github.com/graph-gophers/dataloader"
	"github.com/xzzpig/headscale-manager/db"
	"github.com/xzzpig/headscale-manager/graph/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Loaders struct {
	MachineByID *dataloader.Loader
	ProjectByID *dataloader.Loader
	RouteByID   *dataloader.Loader

	loaderMap map[string]*dataloader.Loader
	lock      sync.Mutex
}

type ErrorObjNotFound struct {
	ID string
}

func (e *ErrorObjNotFound) Error() string {
	return fmt.Sprintf("obj %s not found by Loader", e.ID)
}

func NewObjNotFoundErr(id string) error {
	err := &ErrorObjNotFound{
		ID: id,
	}
	return errors.Join(err, mongo.ErrNoDocuments)
}

func GetLoader[T model.HasID](l *Loaders, tableName string) *dataloader.Loader {
	l.lock.Lock()
	defer l.lock.Unlock()
	loader, ok := l.loaderMap[tableName]
	if !ok {
		loader = dataloader.NewBatchedLoader(func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
			return GetByIDsLoader(ctx, keys, func(id []string) ([]*T, error) {
				objIds := make([]primitive.ObjectID, len(id))
				for i, v := range id {
					objIds[i], _ = primitive.ObjectIDFromHex(v)
				}
				return db.Find[T](db.Get(), tableName, bson.M{"_id": bson.M{"$in": objIds}})
			})
		})
		l.loaderMap[tableName] = loader
	}
	return loader
}

// NewLoaders instantiates data loaders for the middleware
func NewLoaders() *Loaders {
	loaders := &Loaders{
		// MachineByID: dataloader.NewBatchedLoader(MachineByIDsLoader),
		// ProjectByID: dataloader.NewBatchedLoader(ProjectByIDsLoader),
		// RouteByID:   dataloader.NewBatchedLoader(RouteByIDsLoader),
		loaderMap: map[string]*dataloader.Loader{},
	}
	return loaders
}

func GetByIDsLoader[T model.HasID](
	ctx context.Context,
	keys dataloader.Keys,
	getByIDs func([]string) ([]*T, error)) []*dataloader.Result {

	ids := make([]string, len(keys))
	for index, key := range keys {
		ids[index] = key.String()
	}
	objs, err := getByIDs(ids)
	if err != nil {
		panic(err)
	}
	// return User records into a map by ID
	objById := map[string]*T{}
	for _, obj := range objs {
		objById[*(*obj).GetID()] = obj
	}
	// return users in the same order requested
	output := make([]*dataloader.Result, len(keys))
	for index, key := range keys {
		obj, ok := objById[key.String()]
		if ok {
			output[index] = &dataloader.Result{Data: obj, Error: nil}
		} else {
			err := NewObjNotFoundErr(key.String())
			output[index] = &dataloader.Result{Data: nil, Error: err}
		}
	}
	return output
}

// func MachineByIDsLoader(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
// 	return GetByIDsLoader(ctx, keys, db.Get().MachineByIDs)
// }

// func ProjectByIDsLoader(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
// 	return GetByIDsLoader(ctx, keys, db.Get().ProjectByIDs)
// }

// func RouteByIDsLoader(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
// 	return GetByIDsLoader(ctx, keys, db.Get().RouteByIDs)
// }
