package front_test

import (
	"testing"

	"github.com/xzzpig/headscale-manager/front"
)

func TestDisk(t *testing.T) {
	fs := front.NewStaticFileSystem()
	file, err := fs.Open("/index.html")
	if err != nil {
		t.Fatal(err)
	}
	defer file.Close()
	t.Log(file)
}
