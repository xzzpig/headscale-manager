package whitelist

import "github.com/xzzpig/headscale-manager/util"

var whitelist = []string{}

func GetWhitelist() []string {
	return whitelist
}

func AddWhitelist(path string) {
	whitelist = append(whitelist, path)
}

func IsInWhitelist(path string) bool {
	return util.ArrContains(whitelist, path)
}
