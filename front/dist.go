package front

import (
	"embed"
	"io/fs"
	"net/http"
	"strings"
)

//go:embed headscale-manager-ui/dist/*
var staticFS embed.FS

type staticFileSystem struct {
	http.FileSystem
}

func NewStaticFileSystem() *staticFileSystem {
	sub, err := fs.Sub(staticFS, "headscale-manager-ui/dist")

	if err != nil {
		panic(err)
	}

	return &staticFileSystem{
		FileSystem: http.FS(sub),
	}
}

func (s *staticFileSystem) Exists(prefix string, path string) bool {
	path = strings.TrimPrefix(path, prefix)
	file, err := s.Open("/" + path)
	if err != nil {
		return false
	}
	_ = file.Close()
	return true
}
