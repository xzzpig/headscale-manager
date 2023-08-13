package db

import (
	"context"
	"time"

	"github.com/xzzpig/headscale-manager/config"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.uber.org/zap"
)

type DB struct {
	client  *mongo.Client
	timeout time.Duration
}

type Bsonable interface {
	ToBson() *bson.M
}

type Saveable interface {
	Bsonable
	GetID() *string
}

var db *DB
var logger *zap.Logger

func Connect() {
	logger = zap.L().Named("db")
	timeout := config.GetConfig().Mongo.Timout
	client, err := mongo.NewClient(options.Client().ApplyURI(config.GetConfig().Mongo.Uri))
	if err != nil {
		logger.Panic("Failed to create mongo client", zap.Error(err))
	}

	ctx, cancel := context.WithTimeout(context.Background(), time.Duration(timeout)*time.Second)
	defer cancel()
	err = client.Connect(ctx)
	if err != nil {
		logger.Panic("Failed to connect to mongo", zap.Error(err))
	}

	//ping the database
	err = client.Ping(ctx, nil)
	if err != nil {
		logger.Panic("Failed to ping mongo", zap.Error(err))
	}

	logger.Info("Connected to mongo")

	db = &DB{
		client:  client,
		timeout: time.Duration(timeout) * time.Second,
	}
}

func Get() *DB {
	return db
}

func (db *DB) Collection(collectionName string) *mongo.Collection {
	return db.client.Database("headscale").Collection(collectionName)
}

func Find[Type any](db *DB, collectionName string, filter interface{}, opts ...*options.FindOptions) ([]*Type, error) {
	collection := db.Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), db.timeout)
	defer cancel()

	var objs []*Type

	res, err := collection.Find(ctx, filter)
	if err != nil {
		logger.Error("Failed to find", zap.String("collection", collectionName), zap.Any("filter", filter), zap.Error(err))
		return nil, err
	}
	defer res.Close(ctx)
	for res.Next(ctx) {
		var singleObj *Type
		if err = res.Decode(&singleObj); err != nil {
			logger.Error("Failed to decode", zap.String("collection", collectionName), zap.Any("filter", filter), zap.Error(err))
			return nil, err
		}
		objs = append(objs, singleObj)
	}
	logger.Debug("Find", zap.String("collection", collectionName), zap.Any("filter", filter), zap.Any("result", objs))

	return objs, err
}

func FindOne[Type any](db *DB, collectionName string, filter interface{}, opts ...*options.FindOneOptions) (*Type, error) {
	collection := db.Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), db.timeout)
	defer cancel()

	var obj *Type
	err := collection.FindOne(ctx, filter, opts...).Decode(&obj)
	logger.Debug("FindOne", zap.String("collection", collectionName), zap.Any("filter", filter), zap.Any("result", obj), zap.Error(err))
	return obj, err
}

func Save[Type Saveable](db *DB, collectionName string, obj Type) (*mongo.UpdateResult, error) {
	collection := db.Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), db.timeout)
	defer cancel()
	id := obj.GetID()
	if id != nil {
		objId, err := primitive.ObjectIDFromHex(*id)
		if err != nil {
			logger.Error("Failed to parse id", zap.String("collection", collectionName), zap.String("id", *id), zap.Error(err))
			return nil, err
		}
		b := obj.ToBson()
		res, err := collection.UpdateByID(ctx, objId, bson.M{"$set": b}, options.Update().SetUpsert(true))
		if err != nil {
			logger.Error("Failed to update", zap.String("collection", collectionName), zap.Any("obj", b), zap.Error(err))
			return nil, err
		}
		logger.Debug("Update", zap.String("collection", collectionName), zap.Any("obj", b), zap.Any("result", res))
		return res, err
	} else {
		b := obj.ToBson()
		res, err := collection.InsertOne(ctx, b)
		if err != nil {
			logger.Error("Failed to insert", zap.String("collection", collectionName), zap.Any("obj", b), zap.Error(err))
			return nil, err
		}
		logger.Debug("Insert", zap.String("collection", collectionName), zap.Any("obj", b), zap.Any("result", res))
		return &mongo.UpdateResult{UpsertedID: res.InsertedID}, nil
	}
}

func Delete(db *DB, collectionName string, id string) (*mongo.DeleteResult, error) {
	collection := db.Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), db.timeout)
	defer cancel()
	objId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		logger.Error("Failed to parse id", zap.String("collection", collectionName), zap.String("id", id), zap.Error(err))
		return nil, err
	}
	res, err := collection.DeleteOne(ctx, bson.M{"_id": objId})
	if err != nil {
		logger.Error("Failed to delete", zap.String("collection", collectionName), zap.String("id", id), zap.Error(err))
		return nil, err
	}
	logger.Debug("Delete", zap.String("collection", collectionName), zap.String("id", id), zap.Any("result", res))
	return res, err
}
